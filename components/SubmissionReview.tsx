"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Submission = {
  id: string;
  title: string;
  game: string;
  platform: string;
  region: string;
  level: string | null;
  rank: string | null;
  description: string;
  skins: string | null;
  image: string | null;
  price: number;
  status: string;
  seller: {
    id: string;
    name: string;
    email: string;
  };
};

export default function SubmissionReview({
  submission,
}: {
  submission: Submission;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState<
    "approve" | "reject" | null
  >(null);

  const [error, setError] = useState("");

  async function review(action: "approve" | "reject") {
    setLoading(action);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/submissions/${submission.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Unable to process submission."
        );
        return;
      }

      router.push("/admin/submissions");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="reviewLayout">
      <div className="reviewPreview">
        {submission.image ? (
          <img
            src={submission.image}
            alt={submission.title}
          />
        ) : (
          <div className="reviewPlaceholder">
            {submission.game}
          </div>
        )}

        <div className="reviewPrice">
          ₦{submission.price.toLocaleString()}
        </div>
      </div>

      <div className="reviewDetails">
        <span className="submissionGame">
          {submission.game}
        </span>

        <h2>{submission.title}</h2>

        <div className="reviewFacts">
          <div>
            <span>Platform</span>
            <strong>{submission.platform}</strong>
          </div>

          <div>
            <span>Region</span>
            <strong>{submission.region}</strong>
          </div>

          <div>
            <span>Level</span>
            <strong>{submission.level || "—"}</strong>
          </div>

          <div>
            <span>Rank</span>
            <strong>{submission.rank || "—"}</strong>
          </div>
        </div>

        <div className="reviewSection">
          <span>DESCRIPTION</span>
          <p>{submission.description}</p>
        </div>

        {submission.skins && (
          <div className="reviewSection">
            <span>ITEMS / SKINS</span>
            <p>{submission.skins}</p>
          </div>
        )}

        <div className="reviewSeller">
          <span>SELLER</span>
          <strong>{submission.seller.name}</strong>
          <p>{submission.seller.email}</p>
        </div>

        {error && (
          <div className="formError">
            {error}
          </div>
        )}

        {submission.status === "PENDING" && (
          <div className="reviewActions">
            <button
              type="button"
              className="approveButton"
              disabled={loading !== null}
              onClick={() => review("approve")}
            >
              {loading === "approve"
                ? "Approving..."
                : "Approve & publish"}
            </button>

            <button
              type="button"
              className="rejectButton"
              disabled={loading !== null}
              onClick={() => review("reject")}
            >
              {loading === "reject"
                ? "Rejecting..."
                : "Reject submission"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
