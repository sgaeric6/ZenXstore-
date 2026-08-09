import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import SellForm from "../../components/SellForm";

export default async function SellPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?next=/sell");
  }

  return (
    <section className="pageSection">
      <div className="pageHeader">
        <span className="sectionEyebrow">
          SELL YOUR ACCOUNT
        </span>

        <h1>List your gaming account</h1>

        <p>
          Submit your account for review. It will only appear on
          the marketplace after an admin approves it.
        </p>
      </div>

      <SellForm />
    </section>
  );
}
