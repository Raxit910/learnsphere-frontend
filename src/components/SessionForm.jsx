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

  // Reset form when editingSession changes
  useEffect(() => {
    if (editingSession && editor) {
      // Prefill when editing
      setValue('title', editingSession.title);
      setValue('videoUrl', editingSession.videoUrl);
      setValue('courseId', editingSession.courseId.toString());
      editor.commands.setContent(editingSession.content);
      setEditorContent(editingSession.content);
    } else {
      // Clear form when not editing
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

    if (editingSession) {
      finalData.id = editingSession.id; // Include ID on edit
    }

    onSubmit(finalData, () => {
      // Explicitly reset form after submission
      reset({
        title: '',
        videoUrl: '',
        courseId: '',
      });
      if (editor) {
        editor.commands.clearContent();
        setEditorContent('');
      }
      setEditingSession(null);
    }, editor);
  };

  const handleCancel = () => {
    // Explicitly reset all form fields
    reset({
      title: '',
      videoUrl: '',
      courseId: '',
    });
    if (editor) {
      editor.commands.clearContent();
      setEditorContent('');
    }
    setEditingSession(null);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white p-4 rounded shadow mb-6 space-y-4">
      <input {...register('title')} placeholder="Session Title" className="w-full p-2 border rounded" />
      {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}

      <input {...register('videoUrl')} placeholder="YouTube Video URL" className="w-full p-2 border rounded" />
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
        <EditorContent editor={editor} />
      </div>

      <div className="flex gap-3">
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer">
          {editingSession ? 'Update Session' : 'Add Session'}
        </button>
        {editingSession && (
          <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer">
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}
