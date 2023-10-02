import {useState, useEffect} from "react";

export default function StarRating({articleId, onRate, initialRating = 0}) {
    const [rating, setRating] = useState(initialRating);
    const [hover, setHover] = useState(0);

    useEffect(() => {
        setRating(initialRating);
    }, [initialRating]);

    const handleRate = (rating) => {
        setRating(rating);
        onRate(articleId, rating);
    };

    return (
        <div className="flex">
            {[...Array(5)].map((_, i) => (
                <span
                    key={i}
                    className="cursor-pointer text-gray-600"
                    onMouseEnter={() => setHover(i + 1)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => handleRate(i + 1)}
                >
                  {i + 1 <= (hover || rating) ? "★" : "☆"}
                </span>
            ))}
        </div>
    );
}
