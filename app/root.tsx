import React from "react";
import { Link, Links, LiveReload, Meta, Outlet } from "remix";

import globalStylesUrl from "~/styles/global.css";

export const meta = () => {
  const description = 'A cool blog build with Remix';
  const keywords  = 'remix, react, javascript';

  return {
    description,
    keywords
  }
}

export const links = () => [
  {
    rel: "stylesheet",
    href: globalStylesUrl,
  },
];

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({
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

function Layout({ children }: { children: React.ReactNode }) {
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
        </ul>
      </nav>
      <div className="container">{children}</div>
    </>
  );
}
