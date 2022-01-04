import { Link, LoaderFunction } from "remix";
import { useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { User, Post } from "@prisma/client";

export const loader: LoaderFunction = async ({ request }) => {
  const posts = await db.post.findMany({
    take: 20,
    select: { id: true, title: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const user = await getUser(request);

  return { posts, user };
};

function PostItems() {
  const { posts, user } = useLoaderData<{
    posts: Pick<Post, "id" | "title" | "createdAt">[];
    user: User;
  }>();

  return (
    <>
      <div className="page-header">
        <h1>Posts</h1>
      </div>

      {user && (
        <Link to="/posts/new" className="btn">
          New Post
        </Link>
      )}

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
