"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="errorPage">
      <div className="errorCard">
        <span>ZENXSTORE</span>

        <h1>Something went wrong</h1>

        <p>
          We couldn't load this page. Try again or return to
          the marketplace.
        </p>

        <div className="errorActions">
          <button
            type="button"
            className="primaryButton"
            onClick={() => reset()}
          >
            Try again
          </button>

          <a href="/" className="secondaryButton">
            Back to marketplace
          </a>
        </div>
      </div>
    </main>
  );
}
