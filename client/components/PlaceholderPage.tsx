import { Link } from "react-router-dom";

export default function PlaceholderPage({ title, description }: { title: string; description?: string }) {
  return (
    <section className="mx-auto max-w-2xl text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-3 text-muted-foreground">
        {description || "This page is a placeholder. Tell Fusion what you want here and I'll build it next."}
      </p>
      <div className="mt-6 inline-flex gap-3">
        <Link to="/" className="rounded-md bg-primary px-4 py-2 text-primary-foreground font-medium shadow hover:bg-primary/90">Go Home</Link>
        <Link to="/map" className="rounded-md border px-4 py-2 hover:bg-muted">View Map</Link>
      </div>
    </section>
  );
}
