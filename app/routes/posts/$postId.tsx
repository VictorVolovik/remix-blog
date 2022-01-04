import { LoaderFunction, ActionFunction, redirect } from "remix";
import { useLoaderData, Link } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { User, Post } from "@prisma/client";

export const loader: LoaderFunction = async ({ params, request }) => {
  const post = await db.post.findUnique({ where: { id: params.postId } });
  const user = await getUser(request);

  if (!post) {
    throw new Error("Post not found");
  }

  return { post, user };
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  if (form.get("_method") === "delete") {
    const user = await getUser(request);
    const post = await db.post.findUnique({ where: { id: params.postId } });

    if (!post) {
      throw new Error("Post not found");
    }

    if(user && post.userId === user.id) {
      await db.post.delete({ where: { id: params.postId } });
    }

    return redirect('/posts');
  }
};

function Post() {
  const { post, user } = useLoaderData<{ post: Post, user: User}>();

  return (
    <div>
      <div className="page-header">
        <h1>{post.title}</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="page-content">
        <p>{post.body}</p>
      </div>

      {user.id === post.userId && <div className="page-footer">
        <form method="POST">
          <input type="hidden" name="_method" value="delete" />
          <button className="btn btn-delete">Delete</button>
        </form>
      </div>}
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.log(error);

  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
    </div>
  );
}

export default Post;
