"use client";
import Cookie from 'js-cookie';
import {createClient} from '@supabase/supabase-js'
import {useEffect, useRef, useState} from "react";
import Article from "@/app/components/Article";
import ArticleRegistrationModal from "@/app/components/ArticleRegistrationModal";
import Header from "@/app/components/Header";

const supabaseUrl = 'https://xeievnbavrdofrfvbgxq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjMxNjUxOTU5LCJleHAiOjE5NDcyMjc5NTl9.n-CiuFJiUe2pdUczwDO1wYZCazIz3gVHY_CQYYH5GHI'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Home() {
    let sessionId = Cookie.get('sessionId');
    const titleRef = useRef();
    const descriptionRef = useRef();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleRegisterArticle = async (event) => {
        event.preventDefault();

        const title = titleRef.current.value;
        const description = descriptionRef.current.value;

        const {error} = await supabase
            .from('articles')
            .insert([{title, description}]);

        if (error) {
            console.error('Erro ao inserir o artigo:', error);
        } else {
            console.log('Artigo inserido com sucesso');
            toggleModal();
            fetchArticles();
            // Você pode querer atualizar a lista de artigos aqui também
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleRateArticle = async (articleId, rating) => {

        let {data: existingRatings} = await supabase
            .from('rating')
            .select("*")
            .eq('article_id', articleId)
            .eq('session_id', sessionId);

        if (existingRatings.length > 0) {
            const {error} = await supabase
                .from('rating')
                .update({star: rating})
                .eq('article_id', articleId)
                .eq('session_id', sessionId);
            if (error) {
                console.error('Erro ao atualizar a avaliação:', error);
            } else {
                fetchArticles();
            }
        } else {
            const {error} = await supabase
                .from('rating')
                .insert({article_id: articleId, session_id: sessionId, star: rating});
            if (error) {
                console.error('Erro ao inserir a avaliação:', error);
            } else {
                fetchArticles();
            }
        }
    }

    const fetchArticles = async () => {
        let { data, error } = await supabase.from('articles').select('*');

        if (error) setError(error);
        else {
            const filteredArticles = data.filter(article =>
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.description.toLowerCase().includes(searchQuery.toLowerCase())
            );

            const { data: ratingsData, error: ratingsError } = await supabase.from('rating').select("*");

            if (ratingsError) setError(ratingsError);
            else {
                const updatedArticles = filteredArticles.map(article => {
                    const relatedRatings = ratingsData.filter(r => r.article_id === article.id);
                    const userRating = relatedRatings.find(r => r.session_id === sessionId);
                    const total = relatedRatings.reduce((acc, r) => acc + r.star, 0);
                    const averageRating = relatedRatings.length > 0 ? total / relatedRatings.length : null;
                    return {
                        ...article,
                        userRating: userRating ? userRating.star : null,
                        averageRating,
                    };
                });
                setArticles(updatedArticles);
            }
        }
    };

    useEffect(() => {

        function generateUUID() { // Public Domain/MIT
            var d = new Date().getTime();
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        }

        if (!sessionId) {
            sessionId = generateUUID();
            Cookie.set('sessionId', sessionId);  // set cookie
        }


        fetchArticles();
    }, [searchQuery]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            <div className="bg-gray-100 min-h-screen">
                <Header />
                <main className="container mx-auto py-10">
                    <div className="mb-6 flex justify-between">
                        <input
                            type="text"
                            className="w-3/4 h-12 px-4 border-2 border-gray-300 rounded-md"
                            placeholder="Type the article name or author..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-md"
                            onClick={toggleModal}
                        >
                            Register New Article
                        </button>
                    </div>
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map(article => (
                            <Article key={article.id} article={article} handleRateArticle={handleRateArticle} searchQuery={searchQuery} />
                        ))}
                    </section>
                </main>
            </div>
            <ArticleRegistrationModal isModalOpen={isModalOpen} toggleModal={toggleModal} handleRegisterArticle={handleRegisterArticle} titleRef={titleRef} descriptionRef={descriptionRef} />
        </>
    )
}