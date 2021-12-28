import type { ActionFunction } from "remix";
import { Link, redirect } from "remix";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");

  if(typeof title !== "string" || typeof body !== "string") {
    throw new Error("Incorrect form values")
  }

  const fields = { title, body };

  const post = await db.post.create({ data: fields })

  return redirect(`/posts/${post.id}`);
};

function NewPost() {
  return (
    <div>
      <div className="page-header">
        <h1>New Post</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" />
          </div>

          <div className="form-control">
            <label htmlFor="body">Post Body</label>
            <textarea name="body" id="body" cols={30} rows={10}></textarea>
          </div>

          <button type="submit" className="btn btn-block">
            Add Post
          </button>
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

export default NewPost;
