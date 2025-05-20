import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $author: String!) {
    createPost(title: $title, content: $content, author: $author) {
      _id
      title
      author
    }
  }
`;

export default function CreatePost() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [createPost, { error }] = useMutation(CREATE_POST);
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      await createPost({
        variables: data,
        update: (cache, { data: { createPost } }) => {
          cache.modify({
            fields: {
              posts(existingPosts = []) {
                const newPostRef = cache.writeFragment({
                  data: createPost,
                  fragment: gql`
                    fragment NewPost on BlogPost {
                      _id
                      title
                      author
                    }
                  `,
                });
                return [...existingPosts, newPostRef];
              },
            },
          });
        },
      });
      router.push('/');
    } catch (err) {
      console.error('Create post error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-gray-300 hover:text-gray-100">
            ← Back to Home
          </Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Create New Post</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-gray-800 p-6 rounded-lg shadow">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Title
            </label>
            <input
              id="title"
              {...register('title', { required: 'Title is required' })}
              className="mt-1 block w-full border border-gray-600 rounded-md p-3 bg-gray-700 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300">
              Content
            </label>
            <textarea
              id="content"
              {...register('content', { required: 'Content is required' })}
              className="mt-1 block w-full border border-gray-600 rounded-md p-3 bg-gray-700 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
              rows="5"
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-300">
              Author
            </label>
            <input
              id="author"
              {...register('author', { required: 'Author is required' })}
              className="mt-1 block w-full border border-gray-600 rounded-md p-3 bg-gray-700 text-gray-100 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
          </div>
          {error && <p className="text-red-500">Error: {error.message}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 disabled:bg-gray-600 transition"
          >
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </main>
    </div>
  );
}