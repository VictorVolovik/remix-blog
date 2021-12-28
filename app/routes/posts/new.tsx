import { ActionFunction } from "remix";
import { Link, redirect, useActionData, json } from "remix";
import { db } from "~/utils/db.server";

type FieldErrors = {
  title?: string;
  body?: string;
};

type Fields = {
  title: FormDataEntryValue | null;
  body: FormDataEntryValue | null;
};

function validateTitle(title: FormDataEntryValue | null) {
  if (typeof title !== "string" || title.length < 3) {
    return "Title should be at least 3 characters long";
  }
}

function validateBody(body: FormDataEntryValue | null) {
  if (typeof body !== "string" || body.length < 10) {
    return "Post should be at least 10 characters long";
  }
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");

  const fields: Fields = { title, body };

  const fieldErrors: FieldErrors = {
    title: validateTitle(title),
    body: validateBody(body),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);

    return json({ fieldErrors, fields }, { status: 400 });
  }

  const post = await db.post.create({
    data: {
      title: String(fields.title),
      body: String(fields.body),
    },
  });

  return redirect(`/posts/${post.id}`);
};

function NewPost() {
  const actionData =
    useActionData<{ fieldErrors: FieldErrors; fields: Fields }>();

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
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={
                actionData?.fields.title
                  ? String(actionData?.fields.title)
                  : undefined
              }
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors.title
                  ? actionData.fieldErrors.title
                  : null}
              </p>
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="body">Post</label>
            <textarea
              name="body"
              id="body"
              defaultValue={
                actionData?.fields.body
                  ? String(actionData?.fields.body)
                  : undefined
              }
              cols={30}
              rows={10}
            ></textarea>
            <div className="error">
              <p>
                {actionData?.fieldErrors.body
                  ? actionData.fieldErrors.body
                  : null}
              </p>
            </div>
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
