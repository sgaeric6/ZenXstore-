"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminAccountForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    game: "",
    platform: "",
    region: "",
    level: "",
    rank: "",
    description: "",
    skins: "",
    price: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setError("");

    try {
      const response = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to create account.");
        return;
      }

      router.push("/admin/accounts");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="adminForm"
      onSubmit={submit}
    >
      <div className="formGrid">
        <label>
          Account title
          <input
            value={form.title}
            onChange={(e) =>
              update("title", e.target.value)
            }
            placeholder="CODM Mythic Account"
            required
          />
        </label>

        <label>
          Game
          <input
            value={form.game}
            onChange={(e) =>
              update("game", e.target.value)
            }
            placeholder="Call of Duty Mobile"
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
            placeholder="Android / iOS"
            required
          />
        </label>

        <label>
          Region
          <input
            value={form.region}
            onChange={(e) =>
              update("region", e.target.value)
            }
            placeholder="Global"
            required
          />
        </label>

        <label>
          Level
          <input
            value={form.level}
            onChange={(e) =>
              update("level", e.target.value)
            }
          />
        </label>

        <label>
          Rank
          <input
            value={form.rank}
            onChange={(e) =>
              update("rank", e.target.value)
            }
          />
        </label>

        <label>
          Price
          <input
            type="number"
            min="1"
            value={form.price}
            onChange={(e) =>
              update("price", e.target.value)
            }
            required
          />
        </label>

        <label>
          Image URL
          <input
            value={form.image}
            onChange={(e) =>
              update("image", e.target.value)
            }
            placeholder="https://..."
          />
        </label>
      </div>

      <label>
        Description
        <textarea
          rows={6}
          value={form.description}
          onChange={(e) =>
            update("description", e.target.value)
          }
          required
        />
      </label>

      <label>
        Skins / items / highlights
        <textarea
          rows={4}
          value={form.skins}
          onChange={(e) =>
            update("skins", e.target.value)
          }
          placeholder="Mythic weapons, legendary skins..."
        />
      </label>

      {error && (
        <div className="formError">
          {error}
        </div>
      )}

      <button
        className="primaryButton"
        disabled={loading}
      >
        {loading
          ? "Publishing..."
          : "Publish account"}
      </button>
    </form>
  );
}
