import { LoaderFunction, ActionFunction, redirect } from "remix";
import { useLoaderData, Link } from "remix";
import { db } from "~/utils/db.server";
import { Post } from "./index";

export const loader: LoaderFunction = async ({ params }) => {
  const post = await db.post.findUnique({ where: { id: params.postId } });

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const post = await db.post.findUnique({ where: { id: params.postId } });

    if (!post) {
      throw new Error("Post not found");
    }

    await db.post.delete({ where: { id: params.postId } });

    return redirect('/posts');
  }
};

function Post() {
  const post = useLoaderData<Post>();

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

      <div className="page-footer">
        <form method="POST">
          <input type="hidden" name="_method" value="delete" />
          <button className="btn btn-delete">Delete</button>
        </form>
      </div>
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
