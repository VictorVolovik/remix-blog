import { useActionData, json, redirect, ActionFunction, Form } from "remix";
import { db } from "~/utils/db.server";
import { login, register, createUserSession } from "~/utils/session.server";

type Fields = {
  loginType: FormDataEntryValue | null;
  username: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
};

type FieldErrors = {
  username?: string;
  password?: string;
};

type FormError = string;

function validateUsername(username: FormDataEntryValue | null) {
  if (typeof username !== "string" || username.length < 3) {
    return "Username should be at least 3 characters long";
  }
}

function validatePassword(password: FormDataEntryValue | null) {
  if (typeof password !== "string" || password.length < 6) {
    return "Password should be at least 6 characters long";
  }
}

function badRequest(data: {
  fieldErrors?: FieldErrors;
  fields: Fields;
  formError?: FormError;
}) {
  return json(data, { status: 400 });
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const username = form.get("username");
  const password = form.get("password");

  const fields = { loginType, username, password };

  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);

    return badRequest({ fieldErrors, fields });
  }

  switch (loginType) {
    case "login": {
      const user = await login({
        username: String(username),
        password: String(password),
      });

      if (!user) {
        return badRequest({
          fields,
          formError: "Invalid credentials",
        });
      }

      return createUserSession(user.id, "/posts");
    }

    case "register": {
      const userExists = await db.user.findFirst({
        where: {
          username: String(username),
        },
      });

      if (userExists) {
        return badRequest({
          fields,
          fieldErrors: { username: `User ${username} already exists` },
        });
      }

      const user = await register({
        username: String(username),
        password: String(password),
      });

      if (!user) {
        return badRequest({
          fields,
          formError: "Error while registering user",
        });
      }

      return createUserSession(user.id, '/posts');
    }

    default: {
      return badRequest({ fields, formError: "Login type is not valid" });
    }
  }
};

function Login() {
  const actionData = useActionData<{
    fieldErrors: FieldErrors;
    fields: Fields;
    formError: FormError;
  }>();

  return (
    <div className="auth-container">
      <div className="page-header">
        <h1>Login</h1>
      </div>

      <div className="page-content">
        <Form method="POST">
          <fieldset>
            <legend>Login or Register</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields.loginType ||
                  actionData?.fields.loginType === "login"
                }
              />
              Login
            </label>
            <label>
              <input
                type="radio"
                name="loginType"
                value="register"
                defaultChecked={actionData?.fields.loginType === "register"}
              />{" "}
              Register
            </label>
          </fieldset>

          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              defaultValue={
                actionData?.fields.username
                  ? String(actionData.fields.username)
                  : undefined
              }
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.username
                  ? actionData.fieldErrors.username
                  : null}
              </p>
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              defaultValue={
                actionData?.fields.password
                  ? String(actionData.fields.password)
                  : undefined
              }
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.password
                  ? actionData.fieldErrors.password
                  : null}
              </p>
            </div>
          </div>

          <button type="submit" className="btn btn-block">
            Submit
          </button>

          <div className="error">
            <p>{actionData?.formError ? actionData.formError : null}</p>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
