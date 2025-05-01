import ReactPlayer from 'react-player';

export default function SessionCard({ session, isDone, onComplete, isInstructor, onEdit, onDelete }) {
  return (
    <li
      className={`w-full bg-white rounded-md shadow-md overflow-hidden transition duration-300 ease-in-out hover:shadow-lg transform hover:-translate-y-1 ${
        isDone ? 'opacity-80' : ''
      }`}
    >
      <div>
        <div className="relative h-32 md:h-40 bg-gray-100">
          <ReactPlayer
            url={session.videoUrl}
            controls
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </div>

        <div className="p-4 flex flex-col justify-between h-[calc(100%-32px)] md:h-[calc(100%-40px)]">
          <div className="mb-auto">
            <h3 className="font-semibold text-lg text-gray-800 truncate mb-2">
              {session.title}
            </h3>
            <div
              className="line-clamp-2 text-sm text-gray-600 prose prose-sm"
              dangerouslySetInnerHTML={{ __html: session.content }}
            />
          </div>

          <div className="mt-3 flex justify-between items-center">
            {isInstructor ? (
              <div className="flex items-center">
                <button
                  onClick={() => onEdit(session.id)}
                  className="text-blue-600 hover:underline text-sm font-semibold mr-2 cursor-pointer"
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
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
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
