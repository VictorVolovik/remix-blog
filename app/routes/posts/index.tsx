import { Link, LoaderFunction } from "remix";
import { useLoaderData } from "remix";
import { db } from "~/utils/db.server";

export type Post = {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
};

export const loader: LoaderFunction = async () => {
  const posts = await db.post.findMany({
    take: 20,
    select: { id: true, title: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return posts;
};

function PostItems() {
  const posts = useLoaderData<Pick<Post, "id" | "title" | "createdAt">[]>();

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
              <Link to={`${post.id}`}>
                <h3>{post.title}</h3>
                <p>{new Date(post.createdAt).toLocaleString()}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default PostItems;
