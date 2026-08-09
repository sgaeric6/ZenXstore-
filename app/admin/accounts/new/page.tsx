import { redirect } from "next/navigation";
import { getSession } from "../../../../lib/auth";
import AdminSidebar from "../../../../components/AdminSidebar";
import AdminAccountForm from "../../../../components/AdminAccountForm";

export default async function NewAccountPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="adminLayout">
      <AdminSidebar />

      <main className="adminContent">
        <div className="adminPageHeader">
          <div>
            <span>MARKETPLACE</span>
            <h1>Add gaming account</h1>
          </div>
        </div>

        <AdminAccountForm />
      </main>
    </div>
  );
}
