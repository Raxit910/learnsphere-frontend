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

export default function SessionForm({ onSubmit, courseOptions, editingSession, setEditingSession }) {
  const [editorContent, setEditorContent] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
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

  useEffect(() => {
    if (editingSession && editor) {
      setValue('title', editingSession.title);
      setValue('videoUrl', editingSession.videoUrl);
      setValue('courseId', editingSession.courseId.toString());
      editor.commands.setContent(editingSession.content);
      setEditorContent(editingSession.content);
    } else {
      reset({
        title: '',
        videoUrl: '',
        courseId: '',
      });
      if (editor) {
        editor.commands.clearContent();
        setEditorContent('');
      }
    }
  }, [editingSession, editor, setValue, reset]);

  const handleFormSubmit = (data) => {
    if (!editorContent || editorContent.trim() === '<p></p>') {
      alert('Content is required');
      return;
    }

    const finalData = { ...data, content: editorContent };
    if (editingSession) finalData.id = editingSession.id;

    onSubmit(finalData);
    reset({ title: '', videoUrl: '', courseId: '' });
    if (editor) {
      editor.commands.clearContent();
      setEditorContent('');
    }
    if (setEditingSession) setEditingSession(null);
  };

  const handleCancel = () => {
    reset({ title: '', videoUrl: '', courseId: '' });
    if (editor) {
      editor.commands.clearContent();
      setEditorContent('');
    }
    setEditingSession(null);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="bg-white p-4 sm:p-6 md:p-8 rounded shadow mb-6 space-y-5 w-full max-w-3xl mx-auto"
    >
      {/* Title */}
      <div className="flex flex-col">
        <input
          {...register('title')}
          placeholder="Session Title"
          className="w-full p-2 border rounded text-sm"
        />
        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
      </div>

      {/* Video URL */}
      <div className="flex flex-col">
        <input
          {...register('videoUrl')}
          placeholder="YouTube Video URL"
          className="w-full p-2 border rounded text-sm"
        />
        {errors.videoUrl && <p className="text-sm text-red-500 mt-1">{errors.videoUrl.message}</p>}
      </div>

      {/* Video Preview */}
      {ReactPlayer.canPlay(videoUrl) && (
        <div className="w-full aspect-video mt-2">
          <ReactPlayer url={videoUrl} controls width="100%" height="100%" />
        </div>
      )}

      {/* Course Selector */}
      <div className="flex flex-col">
        <select {...register('courseId')} className="w-full p-2 border rounded text-sm">
          <option value="">Select Course</option>
          {courseOptions.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        {errors.courseId && <p className="text-sm text-red-500 mt-1">{errors.courseId.message}</p>}
      </div>

      {/* Rich Text Editor */}
      <div className="border rounded min-h-[150px] p-2">
        <p className="text-sm font-medium mb-2">Explanation:</p>

        {editor && (
          <div className="flex flex-wrap gap-2 mb-2 text-sm">
            <button
              type="button"
              title="Bold"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-2 py-1 rounded ${
                editor.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              title="Italic"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-2 py-1 rounded ${
                editor.isActive('italic') ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              title="Underline"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`px-2 py-1 rounded ${
                editor.isActive('underline') ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              <u>U</u>
            </button>
          </div>
        )}

        <EditorContent editor={editor} className="prose max-w-none" />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-start">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
        >
          {editingSession ? 'Update Session' : 'Add Session'}
        </button>

        {editingSession && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}
