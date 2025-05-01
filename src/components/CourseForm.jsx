import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { z } from 'zod';

const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(3, 'Category must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

export default function CourseForm({ initialData = null, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
    },
  });

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, reset))}
      className="bg-white p-4 rounded shadow mb-6"
    >
      <input
        {...register('title')}
        placeholder="Title"
        className="w-full border p-2 rounded mb-2"
      />
      {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}

      <input
        {...register('category')}
        placeholder="Category"
        className="w-full border p-2 rounded mb-2"
      />
      {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}

      <textarea
        {...register('description')}
        placeholder="Description"
        className="w-full border p-2 rounded mb-2"
      />
      {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}

      <div className="flex justify-between mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {initialData ? 'Update Course' : 'Create Course'}
        </button>

        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm underline text-gray-600 hover:text-red-600"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
}
