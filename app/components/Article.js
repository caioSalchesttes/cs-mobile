import StarRating from "@/app/components/StarRating";
function highlightSearch(text, searchQuery) {
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.replace(regex, (match) => `<span class='text-red-400'>${match}</span>`);
}

export default function Article({ article, handleRateArticle, searchQuery }) {
    return (
        <div key={article.id} className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-2" dangerouslySetInnerHTML={{ __html: highlightSearch(article.title, searchQuery) }}></h2>
            <p className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: highlightSearch(article.description, searchQuery) }}></p>
            <p className="text-gray-600 mb-2">Rating:{article.averageRating}</p>
            Review: <StarRating articleId={article.id} initialRating={article.userRating} onRate={handleRateArticle} />
        </div>
    )
}

