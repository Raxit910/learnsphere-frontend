import ReactPlayer from 'react-player';

export default function SessionCard({ session, isDone, onComplete, isInstructor, onEdit, onDelete }) {
  return (
    <li
      className={`w-full bg-white rounded-md shadow-md overflow-hidden transition duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1 ${
        isDone ? 'opacity-80' : ''
      }`}
    >
      <div>
        {/* Responsive video container */}
        <div className="relative aspect-video bg-gray-100">
          <ReactPlayer
            url={session.videoUrl}
            controls
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
          />
        </div>

        <div className="p-4 flex flex-col justify-between">
          <div className="mb-3">
            <h3 className="font-semibold text-lg text-gray-800 truncate mb-1 sm:mb-2">
              {session.title}
            </h3>
            <div
              className="line-clamp-2 text-sm text-gray-600 prose prose-sm"
              dangerouslySetInnerHTML={{ __html: session.content }}
            />
          </div>

          <div className="mt-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            {isInstructor ? (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onEdit(session.id)}
                  className="text-blue-600 hover:underline text-sm font-semibold cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(session.id)}
                  className="text-red-600 hover:underline text-sm font-semibold cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ) : isDone ? (
              <p className="text-green-600 text-xs font-semibold">✅ Completed</p>
            ) : (
              <button
                onClick={onComplete}
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
  