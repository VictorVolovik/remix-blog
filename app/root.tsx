import React from "react";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  useLoaderData,
  LoaderFunction,
} from "remix";
import { getUser } from "./utils/session.server";
import { User } from "@prisma/client";

import globalStylesUrl from "~/styles/global.css";

export const meta = () => {
  const description = "A cool blog build with Remix";
  const keywords = "remix, react, javascript";

  return {
    description,
    keywords,
  };
};

export const links = () => [
  {
    rel: "stylesheet",
    href: globalStylesUrl,
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  return user;
};

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

export function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>{title ? title : "My Remix Blog"}</title>
      </head>

      <body>{children}</body>

      {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
    </html>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const user = useLoaderData<User>();

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Remix
        </Link>
        <ul className="nav">
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          {user ? (
            <li>
              <form action="/auth/logout" method="POST">
                <button className="btn" type="submit">
                  Logout {user.username}
                </button>
              </form>
            </li>
          ) : (
            <li>
              <Link to="/auth/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="container">{children}</div>
    </>
  );
}
