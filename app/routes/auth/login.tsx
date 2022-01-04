import { useActionData, json, redirect, ActionFunction } from "remix";
import { db } from "~/utils/db.server";

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
  if (typeof password !== "string" || password.length < 8) {
    return "Password should be at least 8 characters long";
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

  console.log(loginType)

  switch (loginType) {
    case "login": {
      // Find user
      // Check user
      // Create user session
      return { fields };
    }

    case "register": {
      // Check if user exists
      // Create user
      // Create user session
      return { fields };
    }

    default: {
      return badRequest({ fields, formError: "Login type is not valid" });
    }
  }
};

function Login() {
  const actionData =
    useActionData<{
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
        <form method="POST">
          <fieldset>
            <legend>Login or Register</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                // defaultChecked={
                //   !actionData?.fields.loginType ||
                //   actionData?.fields.loginType === "login"
                // }
              />
              Login
            </label>
            <label>
              <input type="radio" name="loginType" value="register" /> Register
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
        </form>
      </div>
    </div>
  );
}

export default Login;