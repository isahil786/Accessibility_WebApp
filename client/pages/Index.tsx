import { MapSection } from "@/components/MapSection";
import { clusters } from "@/data/clusters";
import { Download, HeartHandshake, MessageSquareHeart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function toCSV() {
  const headers = [
    "id",
    "name",
    "district",
    "lat",
    "lng",
    "type",
    "capacity",
    "description",
  ];
  const rows = clusters.map((c) => [
    c.id,
    c.name,
    c.district,
    c.lat,
    c.lng,
    c.type,
    c.capacity,
    c.description,
  ]);
  const csv = [headers, ...rows]
    .map((r) => r.map((v) => (typeof v === "string" ? `"${v.replaceAll("\"", "\"\"")}"` : v)).join(","))
    .join("\n");
  return new Blob([csv], { type: "text/csv;charset=utf-8;" });
}

export default function Index() {
  const navigate = useNavigate();

  const handleDownload = () => {
    const blob = toCSV();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "helping-hands-maharashtra-clusters.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Your Excel-compatible CSV is downloading");
    navigate("/thank-you");
  };

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-3xl border bg-card p-6 md:p-10">
        <div className="absolute -inset-10 -z-10 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-2xl" />
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary text-xs font-semibold">
            <HeartHandshake size={14} /> Disability Support & Awareness
          </div>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
            Helping Hands – Empowering Disability Communities in Maharashtra
          </h1>
          <p className="mt-4 text-muted-foreground">
            Register, learn about our mission, donate, share reviews, and download detailed data. All in one accessible, responsive platform.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground font-semibold shadow hover:bg-primary/90"
            >
              <Download size={18} /> Download Excel Data
            </button>
            <a
              href="/donate"
              className="inline-flex items-center gap-2 rounded-md border px-4 py-2 font-medium hover:bg-muted"
            >
              <MessageSquareHeart size={18} /> Donate & Support
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl border p-6 bg-card text-card-foreground shadow-sm">
          <h3 className="font-semibold text-lg">User Authentication</h3>
          <p className="mt-2 text-sm text-muted-foreground">Secure registration, login, and basic profiles. Ready to integrate with MongoDB Atlas-backed API.</p>
        </div>
        <div className="rounded-2xl border p-6 bg-card text-card-foreground shadow-sm">
          <h3 className="font-semibold text-lg">Helping Hands</h3>
          <p className="mt-2 text-sm text-muted-foreground">Donate via UPI/Card/NetBanking or volunteer, sponsor, and provide in-kind support.</p>
        </div>
        <div className="rounded-2xl border p-6 bg-card text-card-foreground shadow-sm">
          <h3 className="font-semibold text-lg">Reviews & Feedback</h3>
          <p className="mt-2 text-sm text-muted-foreground">Share experiences and testimonials. Public feed with moderation coming next.</p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">About Us</h2>
          <p className="mt-3 text-muted-foreground">
            Helping Hands is an initiative to spread awareness and provide inclusive services for people with disabilities. Our mission is to connect communities, supporters, and services across Maharashtra.
          </p>
          <div className="mt-4 inline-flex gap-3">
            <a href="/about" className="rounded-md border px-4 py-2 hover:bg-muted">Learn More</a>
            <a href="/reviews" className="rounded-md border px-4 py-2 hover:bg-muted">Read Reviews</a>
          </div>
        </div>
        <ul className="grid gap-3">
          {clusters.slice(0, 6).map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-lg border p-3 bg-card">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.district} • {c.type}</p>
              </div>
              <span className="text-xs text-muted-foreground">Cap. {c.capacity}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-8 md:grid-cols-2 items-center">
        <div className="rounded-2xl overflow-hidden border aspect-video">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/q7MpzJQiJr8?autoplay=1&mute=1&loop=1&playlist=q7MpzJQiJr8"
            title="Taare Zameen Par - Inspirational Clip"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Inclusive communities in action</h2>
          <p className="mt-3 text-muted-foreground">A short, uplifting video to inspire support for accessibility, inclusion, and empowerment.</p>
          <a href="/donate" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-primary-foreground font-semibold hover:bg-primary/90">Support Now</a>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold">Impact so far</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-6 bg-card text-center">
            <p className="text-3xl font-extrabold">₹24L+</p>
            <p className="text-sm text-muted-foreground">Raised by supporters</p>
          </div>
          <div className="rounded-xl border p-6 bg-card text-center">
            <p className="text-3xl font-extrabold">1,200+</p>
            <p className="text-sm text-muted-foreground">Assistive kits delivered</p>
          </div>
          <div className="rounded-xl border p-6 bg-card text-center">
            <p className="text-3xl font-extrabold">50</p>
            <p className="text-sm text-muted-foreground">Clusters mapped in Maharashtra</p>
          </div>
        </div>
        <div className="rounded-xl border p-4 bg-card">
          <ul className="grid md:grid-cols-2 gap-3 text-sm">
            <li>• Wheelchairs and mobility aids distributed in Mumbai, Pune, Nagpur.</li>
            <li>• Therapy and rehab sessions funded for 300+ individuals.</li>
            <li>• Inclusive education support in 12 districts.</li>
            <li>• Skill training workshops for livelihoods.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
