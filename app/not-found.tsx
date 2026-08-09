import Link from "next/link";

export default function NotFound() {
  return (
    <main className="notFoundPage">
      <div className="notFoundCard">
        <span className="notFoundCode">
          404
        </span>

        <h1>Page not found</h1>

        <p>
          The page you're looking for doesn't exist or has
          been moved.
        </p>

        <Link
          href="/"
          className="primaryButton"
        >
          Return to marketplace
        </Link>
      </div>
    </main>
  );
}
