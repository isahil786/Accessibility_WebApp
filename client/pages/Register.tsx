import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account created");
      navigate("/");
    } catch (err: any) {
      toast.error(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-md">
      <h1 className="text-3xl font-extrabold tracking-tight">Create account</h1>
      <p className="mt-2 text-muted-foreground">Register to access the interactive map and features.</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">Full name</label>
          <input id="name" value={name} onChange={(e)=>setName(e.target.value)} required className="w-full rounded-md border px-3 py-2 bg-background" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full rounded-md border px-3 py-2 bg-background" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full rounded-md border px-3 py-2 bg-background" />
        </div>
        <button disabled={loading} className="rounded-md bg-primary px-4 py-2 text-primary-foreground font-semibold shadow hover:bg-primary/90 disabled:opacity-60">
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="text-primary underline">Login</Link>
      </p>
    </section>
  );
}
