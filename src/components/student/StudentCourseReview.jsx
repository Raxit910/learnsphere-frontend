import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function StudentCourseReview({ courseId, token }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [showReviewSection, setShowReviewSection] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [otherReviews, setOtherReviews] = useState([]);

  // Decode JWT to extract user ID
  const getUserIdFromToken = () => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.id;
    } catch {
      return null;
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/${courseId}`);
      
      // Get current user ID
      const userId = getUserIdFromToken();
      
      // Separate current user's review from other reviews
      const currentUserReview = res.data.find((r) => r.studentId === userId);
      const reviewsFromOthers = res.data.filter((r) => r.studentId !== userId);
      
      // Update state
      setReviews(res.data);
      setUserReview(currentUserReview || null);
      setOtherReviews(reviewsFromOthers);
      
      // Pre-fill form if user has already submitted a review
      if (currentUserReview) {
        setComment(currentUserReview.comment);
      }
    } catch (err) {
      toast.error('Failed to load reviews');
    }
  };

  const submitReview = async () => {
    if (!rating || !comment) {
      return toast.warn('Please fill both fields');
    }

    try {
      await axios.post(
        `http://localhost:5000/api/reviews/${courseId}`,
        { rating: parseInt(rating), comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Review submitted!');
      setShowReviewSection(false);
      fetchReviews(); // refresh to update the reviews list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="mt-3">
      <h4 className="font-semibold text-sm mb-1">Student Reviews</h4>

      <div className="flex flex-col gap-2 mb-3">
        {/* Display current user's review first if it exists */}
        {userReview && (
          <div className="text-xs border-b pb-2 bg-blue-50 p-2 rounded">
            <strong className="text-blue-700">Your Review:</strong> 
            <span className="ml-1">{userReview.rating} ⭐ - {userReview.comment}</span>
          </div>
        )}
        
        {/* Display other students' reviews */}
        {otherReviews.length === 0 ? (
          !userReview && <p className="text-xs text-gray-500">No reviews yet.</p>
        ) : (
          otherReviews.map((review, idx) => (
            <div key={idx} className="text-xs text-gray-800 border-b pb-1">
              <strong>Review {idx + 1}:</strong> {review.rating} ⭐ - {review.comment}
            </div>
          ))
        )}
      </div>

      {/* Review button or form */}
      {userReview ? (
        // Show non-clickable "Reviewed" button if already reviewed
        <button
          disabled
          className="text-xs flex items-center gap-1 text-green-600 cursor-not-allowed"
        >
          Reviewed
        </button>
      ) : !showReviewSection ? (
        // Show "Review Course" button if not yet reviewed
        <button
          onClick={() => setShowReviewSection(true)}
          className="text-xs flex items-center gap-1 text-indigo-600 hover:underline cursor-pointer"
        >
          Review it!!
        </button>
      ) : (
        // Review submission form
        <div className="text-xs mt-2">
          <div className='mb-1'>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="border rounded mr-1 mb-1"
            >
              <option value="">Rating</option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Add a comment here"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border pl-1 rounded w-full"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={submitReview}
              className="bg-green-600 text-white px-1 py-0.5 rounded hover:bg-green-700 cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}