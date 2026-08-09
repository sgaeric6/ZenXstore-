"use client";

import { FormEvent, useState } from "react";

export default function SellForm() {
  const [form, setForm] = useState({
    game: "",
    title: "",
    platform: "",
    region: "",
    level: "",
    rank: "",
    description: "",
    price: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function update(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/sell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to submit account.");
        return;
      }

      setMessage(
        "Account submitted successfully. An admin will review it."
      );

      setForm({
        game: "",
        title: "",
        platform: "",
        region: "",
        level: "",
        rank: "",
        description: "",
        price: "",
        image: "",
      });
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="sellForm" onSubmit={submit}>
      <div className="formGrid">
        <label>
          Game
          <input
            value={form.game}
            onChange={(e) => update("game", e.target.value)}
            placeholder="Call of Duty Mobile"
            required
          />
        </label>

        <label>
          Listing title
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Mythic CODM Account"
            required
          />
        </label>

        <label>
          Platform
          <input
            value={form.platform}
            onChange={(e) =>
              update("platform", e.target.value)
            }
            placeholder="Android / iOS / PC"
            required
          />
        </label>

        <label>
          Region
          <input
            value={form.region}
            onChange={(e) => update("region", e.target.value)}
            placeholder="Global"
            required
          />
        </label>

        <label>
          Level
          <input
            value={form.level}
            onChange={(e) => update("level", e.target.value)}
            placeholder="300"
          />
        </label>

        <label>
          Rank
          <input
            value={form.rank}
            onChange={(e) => update("rank", e.target.value)}
            placeholder="Legendary"
          />
        </label>

        <label>
          Price (₦)
          <input
            type="number"
            min="1"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="50000"
            required
          />
        </label>

        <label>
          Image URL
          <input
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
            placeholder="https://..."
          />
        </label>
      </div>

      <label>
        Account details
        <textarea
          value={form.description}
          onChange={(e) =>
            update("description", e.target.value)
          }
          placeholder="Describe the account, skins, weapons, items, etc."
          rows={7}
          required
        />
      </label>

      {message && (
        <div className="formNotice">
          {message}
        </div>
      )}

      <button
        type="submit"
        className="primaryButton"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit account for review"}
      </button>
    </form>
  );
}
