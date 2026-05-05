import DonateInKindForm from "@/components/DonateInKindForm";

export default function DonateItems() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Donate Items (In‑Kind Support)</h1>
      <p className="text-muted-foreground">Upload photos of clothes, books, or other items and tell us the quantity. We’ll review and coordinate pickup/drop‑off.</p>
      <DonateInKindForm />
    </section>
  );
}
