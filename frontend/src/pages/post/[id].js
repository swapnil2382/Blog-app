import { useQuery, useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';

const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      _id
      title
      content
      author
      createdAt
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

export default function Post() {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_POST, {
    variables: { id },
    skip: !id,
  });

  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: () => router.push('/'),
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

  const handleDelete = async () => {
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
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-gray-300 hover:text-gray-100">
            ← Back to Home
          </Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-6">
        {loading && <p className="text-center text-gray-400">Loading...</p>}
        {error && <p className="text-center text-red-500">Error: {error.message}</p>}
        {data?.post && (
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h1 className="text-3xl font-semibold mb-2">{data.post.title}</h1>
            <p className="text-gray-400 mb-2">By {data.post.author}</p>
            <p className="text-gray-500 text-sm mb-4">
              Posted on {new Date(data.post.createdAt).toLocaleDateString()}
            </p>
            <div className="text-lg leading-relaxed text-gray-200">{data.post.content}</div>
            <button
              onClick={handleDelete}
              className="mt-4 text-red-500 hover:text-red-400 text-sm font-medium"
            >
              Delete Post
            </button>
          </div>
        )}
      </main>
    </div>
  );
}