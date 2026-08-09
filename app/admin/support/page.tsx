import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";
import AdminSidebar from "../../../components/AdminSidebar";
import AdminSupportClient from "../../../components/AdminSupportClient";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/");
  }

  const tickets = await prisma.supportTicket.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="adminLayout">
      <AdminSidebar />

      <main className="adminContent">
        <div className="adminPageHeader">
          <div>
            <span>CUSTOMER CARE</span>
            <h1>Support</h1>
            <p>
              Reply directly to customers from their support
              conversations.
            </p>
          </div>
        </div>

        <AdminSupportClient
          tickets={tickets.map((ticket) => ({
            id: ticket.id,
            subject: ticket.subject,
            status: ticket.status,
            user: ticket.user,
            messages: ticket.messages.map((message) => ({
              id: message.id,
              message: message.message,
              createdAt: message.createdAt.toISOString(),
              sender: message.sender,
            })),
          }))}
        />
      </main>
    </div>
  );
}
