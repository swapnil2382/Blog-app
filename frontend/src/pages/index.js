import { useQuery, useMutation, gql } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';

const GET_POSTS = gql`
  query GetPosts {
    posts {
      _id
      title
      author
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      _id
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTS);
  const [deletePost] = useMutation(DELETE_POST, {
    update(cache, { data: { deletePost } }) {
      cache.modify({
        fields: {
          posts(existingPosts = [], { readField }) {
            return existingPosts.filter(
              postRef => readField('_id', postRef) !== deletePost._id
            );
          },
        },
      });
    },
  });
  const router = useRouter();

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost({ variables: { id } });
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Blog Platform</h1>
          <Link href="/create" className="bg-gray-700 text-gray-100 px-4 py-2 rounded-md hover:bg-gray-600 transition">
            Create Post
          </Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-6">Blog Posts</h2>
        {loading && <p className="text-center text-gray-400">Loading...</p>}
        {error && <p className="text-center text-red-500">Error: {error.message}</p>}
        {data && (
          <ul className="space-y-4">
            {data.posts.map((post) => (
              <li key={post._id} className="p-6 bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
                <div className="flex justify-between items-center">
                  <div>
                    <Link href={`/post/${post._id}`} className="text-xl font-semibold text-blue-400 hover:underline">
                      {post.title}
                    </Link>
                     <span className="text-xs text-gray-500 ml-2">(click title to see)</span>
                    <p className="text-sm text-gray-400">by {post.author}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-red-500 hover:text-red-400 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}