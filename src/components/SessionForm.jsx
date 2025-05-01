import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';

const sessionSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  videoUrl: z.string().url('Must be a valid URL'),
  courseId: z.string().min(1, 'Please select a course'),
});

export default function SessionForm({ onSubmit, courseOptions }) {
  const [editorContent, setEditorContent] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: '',
      videoUrl: '',
      courseId: '',
    },
  });

  const editor = useEditor({
    extensions: [StarterKit, Underline, BulletList],
    content: '',
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  const videoUrl = watch('videoUrl');

  const handleFormSubmit = (data) => {
    if (!editorContent || editorContent.trim() === '<p></p>') {
      alert('Content is required');
      return;
    }
    onSubmit({ ...data, content: editorContent }, reset, editor);
  };

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent('');
  }, [courseOptions]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white p-4 rounded shadow mb-6 space-y-4">
      <input
        {...register('title')}
        placeholder="Session Title"
        className="w-full p-2 border rounded"
      />
      {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}

      <input
        {...register('videoUrl')}
        placeholder="YouTube Video URL"
        className="w-full p-2 border rounded"
      />
      {errors.videoUrl && <p className="text-sm text-red-500">{errors.videoUrl.message}</p>}

      {ReactPlayer.canPlay(videoUrl) && (
        <ReactPlayer url={videoUrl} controls width="100%" className="my-2" />
      )}

      <select {...register('courseId')} className="w-full p-2 border rounded">
        <option value="">Select Course</option>
        {courseOptions.map((course) => (
          <option key={course.id} value={course.id}>
            {course.title}
          </option>
        ))}
      </select>
      {errors.courseId && <p className="text-sm text-red-500">{errors.courseId.message}</p>}

      <div className="border rounded min-h-[150px] p-2">
        <p>Explanation:</p>
        {editor && (
          <div className="flex gap-2 mb-2 text-sm">
            <button
              type="button"
              title="Bold"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              title="Italic"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              title="Underline"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`px-2 py-1 rounded ${editor.isActive('underline') ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              <u>U</u>
            </button>
            <button
              type="button"
              title="Bullet List"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              List
            </button>
          </div>
        )}


        <EditorContent editor={editor} />
      </div>

      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Add Session
      </button>
    </form>
  );
}
