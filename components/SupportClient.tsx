"use client";

import { FormEvent, useState } from "react";

type Message = {
  id: string;
  message: string;
  sender: {
    name: string;
    role: string;
  };
};

type Ticket = {
  id: string;
  subject: string;
  status: string;
  messages: Message[];
};

export default function SupportClient({
  tickets,
}: {
  tickets: Ticket[];
}) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [activeTicket, setActiveTicket] = useState(
    tickets[0]?.id ?? ""
  );
  const [loading, setLoading] = useState(false);

  async function createTicket(event: FormEvent) {
    event.preventDefault();

    if (!subject.trim() || !message.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          message,
        }),
      });

      if (response.ok) {
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  }

  const currentTicket = tickets.find(
    (ticket) => ticket.id === activeTicket
  );

  return (
    <div className="supportLayout">
      <aside className="supportTickets">
        <h3>Your conversations</h3>

        {tickets.length === 0 ? (
          <p className="muted">
            You don't have any support conversations yet.
          </p>
        ) : (
          tickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setActiveTicket(ticket.id)}
              className={
                ticket.id === activeTicket
                  ? "ticketButton active"
                  : "ticketButton"
              }
            >
              <strong>{ticket.subject}</strong>
              <span>{ticket.status}</span>
            </button>
          ))
        )}
      </aside>

      <div className="supportConversation">
        {currentTicket ? (
          <>
            <div className="conversationHeader">
              <h2>{currentTicket.subject}</h2>
              <span>{currentTicket.status}</span>
            </div>

            <div className="messageList">
              {currentTicket.messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.sender.role === "ADMIN" ||
                    message.sender.role === "SUPPORT"
                      ? "message adminMessage"
                      : "message userMessage"
                  }
                >
                  <span>{message.sender.name}</span>
                  <p>{message.message}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="newConversation">
            <h2>Start a conversation</h2>

            <form onSubmit={createTicket}>
              <input
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value)
                }
                placeholder="Subject"
              />

              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Write your message..."
                rows={6}
              />

              <button
                className="primaryButton"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Contact support"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
