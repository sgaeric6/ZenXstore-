"use client";

import { FormEvent, useState } from "react";

type Message = {
  id: string;
  message: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    role: string;
  };
};

type Ticket = {
  id: string;
  subject: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  messages: Message[];
};

export default function AdminSupportClient({
  tickets,
}: {
  tickets: Ticket[];
}) {
  const [activeId, setActiveId] = useState(
    tickets[0]?.id ?? ""
  );

  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeTicket = tickets.find(
    (ticket) => ticket.id === activeId
  );

  async function sendReply(event: FormEvent) {
    event.preventDefault();

    if (!activeTicket || !reply.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/support/${activeTicket.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: reply.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Unable to send reply."
        );
        return;
      }

      setReply("");
      window.location.reload();
    } catch {
      setError("Unable to send reply.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="adminSupport">
      <aside className="adminTicketList">
        {tickets.length === 0 ? (
          <div className="adminEmpty">
            <p>No support conversations.</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => setActiveId(ticket.id)}
              className={
                ticket.id === activeId
                  ? "adminTicket active"
                  : "adminTicket"
              }
            >
              <strong>{ticket.subject}</strong>

              <span>{ticket.user.name}</span>

              <small>{ticket.status}</small>
            </button>
          ))
        )}
      </aside>

      <section className="adminChat">
        {!activeTicket ? (
          <div className="adminEmpty">
            <h2>Select a conversation</h2>
          </div>
        ) : (
          <>
            <header className="adminChatHeader">
              <div>
                <span>CUSTOMER</span>
                <h2>{activeTicket.user.name}</h2>
                <p>{activeTicket.user.email}</p>
              </div>

              <span className="ticketStatus">
                {activeTicket.status}
              </span>
            </header>

            <div className="adminMessageList">
              {activeTicket.messages.map((message) => {
                const isAdmin =
                  message.sender.role === "ADMIN" ||
                  message.sender.role === "SUPPORT";

                return (
                  <div
                    key={message.id}
                    className={
                      isAdmin
                        ? "message adminMessage"
                        : "message userMessage"
                    }
                  >
                    <strong>
                      {isAdmin
                        ? "ZenX Support"
                        : message.sender.name}
                    </strong>

                    <p>{message.message}</p>
                  </div>
                );
              })}
            </div>

            <form
              className="adminReplyForm"
              onSubmit={sendReply}
            >
              <textarea
                value={reply}
                onChange={(event) =>
                  setReply(event.target.value)
                }
                placeholder="Reply to customer..."
                rows={4}
              />

              {error && (
                <div className="formError">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="primaryButton"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send reply"}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
