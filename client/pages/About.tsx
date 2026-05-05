import { Link } from "react-router-dom";
import { HeartHandshake, QrCode, CreditCard, Landmark, Camera, IndianRupee, PackagePlus } from "lucide-react";

export default function About() {
  return (
    <section className="space-y-10">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary text-xs font-semibold">
          <HeartHandshake size={14} /> About Helping Hands
        </div>
        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">Inclusive support for disability communities</h1>
        <p className="mt-3 text-muted-foreground">
          Helping Hands spreads awareness and provides inclusive services across Maharashtra. We connect communities,
          supporters, and essential services through therapy sponsorships, education aid, assistive devices, and more.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-6 bg-card">
          <h3 className="font-semibold text-lg">Our Mission</h3>
          <p className="mt-2 text-sm text-muted-foreground">Enable access, dignity, and opportunity for people with disabilities by uniting volunteers, donors, and partners.</p>
        </div>
        <div className="rounded-xl border p-6 bg-card">
          <h3 className="font-semibold text-lg">What We Do</h3>
          <p className="mt-2 text-sm text-muted-foreground">Therapy sponsorships, education kits, assistive aids, transport support, skill training, and community outreach.</p>
        </div>
        <div className="rounded-xl border p-6 bg-card">
          <h3 className="font-semibold text-lg">How You Can Help</h3>
          <p className="mt-2 text-sm text-muted-foreground">Donate financially, contribute items in‑kind, or volunteer your time and skills to drive long‑term impact.</p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold">Support Us — Payment Options</h2>
        <p className="text-sm text-muted-foreground">Choose any method below to contribute. All options are clickable and will take you to the relevant payment flow.</p>
        <div className="grid gap-4 md:grid-cols-3">
          <Link to="/donate?tab=upi" className="rounded-xl border p-4 bg-card hover:shadow-md hover:border-primary/50 transition block">
            <div className="flex items-center gap-2 font-semibold"><QrCode className="h-5 w-5"/>Pay via UPI</div>
            <p className="mt-1 text-sm text-muted-foreground">UPI ID or QR code. Fast and easy.</p>
            <span className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm"><IndianRupee className="h-4 w-4"/>Pay Now</span>
          </Link>
          <Link to="/donate?tab=card" className="rounded-xl border p-4 bg-card hover:shadow-md hover:border-primary/50 transition block">
            <div className="flex items-center gap-2 font-semibold"><CreditCard className="h-5 w-5"/>Pay by Card</div>
            <p className="mt-1 text-sm text-muted-foreground">Debit/Credit cards supported.</p>
            <span className="mt-3 inline-block rounded-md border px-3 py-2 text-sm hover:bg-muted">Proceed</span>
          </Link>
          <Link to="/donate?tab=net" className="rounded-xl border p-4 bg-card hover:shadow-md hover:border-primary/50 transition block">
            <div className="flex items-center gap-2 font-semibold"><Landmark className="h-5 w-5"/>NetBanking</div>
            <p className="mt-1 text-sm text-muted-foreground">Pay directly from your bank.</p>
            <span className="mt-3 inline-block rounded-md border px-3 py-2 text-sm hover:bg-muted">Choose Bank</span>
          </Link>
          <Link to="/donate?tab=scan" className="rounded-xl border p-4 bg-card hover:shadow-md hover:border-primary/50 transition block">
            <div className="flex items-center gap-2 font-semibold"><Camera className="h-5 w-5"/>Scan QR</div>
            <p className="mt-1 text-sm text-muted-foreground">Scan code with your camera.</p>
            <span className="mt-3 inline-block rounded-md border px-3 py-2 text-sm hover:bg-muted">Open Scanner</span>
          </Link>
          <Link to="/donate?tab=offline" className="rounded-xl border p-4 bg-card hover:shadow-md hover:border-primary/50 transition block">
            <div className="flex items-center gap-2 font-semibold"><IndianRupee className="h-5 w-5"/>Cash / Offline</div>
            <p className="mt-1 text-sm text-muted-foreground">Record a pledge or cash payment.</p>
            <span className="mt-3 inline-block rounded-md border px-3 py-2 text-sm hover:bg-muted">Mark as Paid</span>
          </Link>
          <Link to="/donate-items" className="rounded-xl border p-4 bg-card hover:shadow-md hover:border-primary/50 transition block">
            <div className="flex items-center gap-2 font-semibold"><PackagePlus className="h-5 w-5"/>Donate Items (In‑Kind)</div>
            <p className="mt-1 text-sm text-muted-foreground">Clothes, food, books, and more.</p>
            <span className="mt-3 inline-block rounded-md border px-3 py-2 text-sm hover:bg-muted">Contribute Items</span>
          </Link>
        </div>
      </section>
    </section>
  );
}
