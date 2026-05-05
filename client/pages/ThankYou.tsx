import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ThankYou() {
  return (
    <section className="mx-auto max-w-2xl text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 animate-in fade-in zoom-in duration-700">
        <CheckCircle2 size={40} />
      </div>
      <h1 className="mt-6 text-3xl md:text-4xl font-extrabold tracking-tight">Thank you for supporting!</h1>
      <p className="mt-3 text-muted-foreground">Your action makes a real difference for disability communities across Maharashtra.</p>
      <div className="mt-6 inline-flex gap-3">
        <Link to="/" className="rounded-md bg-primary px-4 py-2 text-primary-foreground font-medium shadow hover:bg-primary/90">Back Home</Link>
        <Link to="/donate" className="rounded-md border px-4 py-2 hover:bg-muted">More Ways to Help</Link>
      </div>
    </section>
  );
}
