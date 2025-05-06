import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X, Star } from 'lucide-react';

export default function ReviewModal({ courseId, courseName, token, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/instructor/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
      
      setReviews(res.data.reviews);
      setAverage(res.data.averageRating);
      setLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load course reviews');
      setLoading(false);
    }
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          className={i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}
        />
      );
    }
    return stars;
  };

  return (
    <div className="fixed inset-0 backdrop-brightness-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold"><b>Reviews:</b> {courseName}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6 bg-gray-100 p-3 rounded-lg">
                <div className="text-md font-bold">Average Rating: {average ? average.toFixed(1) : '0.0'}</div>
                <div className="flex items-center">
                  {renderStars(Math.round(average))}
                </div>
                <div className="text-sm text-gray-500 ml-2">
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No reviews yet for this course.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{review.student?.name || 'Student'}</h3>
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-700">Comment: <em>{review.comment}</em></p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}