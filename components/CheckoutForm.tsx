"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutForm({
  accountId,
  price,
}: {
  accountId: string;
  price: number;
}) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submitOrder(event: FormEvent) {
    event.preventDefault();

    setError("");

    if (!email) {
      setError("Enter the email where your order information should be sent.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountId,
          deliveryEmail: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to create order.");
        return;
      }

      router.push(`/orders/${data.order.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="checkoutForm" onSubmit={submitOrder}>
      <label>
        Delivery email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>

      <div className="checkoutAmount">
        <span>Amount</span>
        <strong>
          ₦{price.toLocaleString("en-NG")}
        </strong>
      </div>

      {error && (
        <div className="formError">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="primaryButton fullWidth"
        disabled={loading}
      >
        {loading ? "Creating order..." : "Create order"}
      </button>

      <p className="checkoutNote">
        Your payment instructions will be displayed after the order
        is created.
      </p>
    </form>
  );
}
