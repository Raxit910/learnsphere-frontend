import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function InstructorCourseReview({ courseId, token }) {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    fetchInstructorReviews();
  }, []);

  const fetchInstructorReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reviews/instructor/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(res.data.reviews);
      setAverage(res.data.averageRating);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load course reviews');
    }
  };

  return (
    <div className="p-4 border rounded-md shadow">
      <h2 className="text-xl font-semibold mb-2">Course Reviews</h2>
      <p className="text-gray-700 mb-4">Average Rating: {average?.toFixed(1)} ⭐</p>

      {reviews.length === 0 ? (
        <p>No reviews yet for this course.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => (
            <li key={review.id} className="border p-3 rounded">
              <p className="font-medium">{review.student?.name || 'Anonymous'}</p>
              <p className="text-sm text-yellow-600">Rating: {review.rating} ⭐</p>
              <p className="text-gray-700">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
