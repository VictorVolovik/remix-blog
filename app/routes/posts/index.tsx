import { Link, LoaderFunction } from "remix";
import { useLoaderData } from "remix";

type Post = {
  id: number;
  title: string;
  body: string;
};

export const loader: LoaderFunction = () => {
  const posts: Post[] = [
    {
      id: 1,
      title: "Post 1",
      body: "This is a test post",
    },
    {
      id: 2,
      title: "Post 2",
      body: "This is a test post",
    },
    {
      id: 3,
      title: "Post 3",
      body: "This is a test post",
    },
  ];

  return {
    posts,
  };
};

function PostItems() {
  const { posts } = useLoaderData<{ posts: Post[] }>();

  return (
    <>
      <div className="page-header">
        <h1>Posts</h1>
      </div>

      <Link to="/posts/new" className="btn">
        New Post
      </Link>

      <ul className="posts-list">
        {posts.map((post) => {
          return (
            <li key={post.id}>
              <h3>{post.title}</h3>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default PostItems;
