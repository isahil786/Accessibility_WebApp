import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { HeartHandshake, MapPin, Menu, X, LogOut, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/donate", label: "Helping Hands" },
  { to: "/reviews", label: "Reviews" },
  { to: "/data", label: "View Data" },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 text-foreground">
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-extrabold text-xl">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <HeartHandshake size={20} />
              </span>
              Helping Hands
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    classNames(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/map"
                className="ml-2 inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
              >
                <MapPin size={16} /> Map
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="ml-2 inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-muted">
                  <CreditCard size={16} /> Payment
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/donate?tab=upi">UPI</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/donate?tab=card">Card</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/donate?tab=net">NetBanking</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/donate?tab=scan">Scan QR</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/donate?tab=offline">Cash/Offline</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {user ? (
                <button onClick={logout} className="ml-2 inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-muted">
                  <LogOut size={16} /> Logout
                </button>
              ) : (
                <div className="ml-2 inline-flex gap-2">
                  <Link to="/login" className="rounded-md border px-3 py-2 text-sm hover:bg-muted">Login</Link>
                  <Link to="/register" className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:bg-primary/90">Register</Link>
                </div>
              )}
            </nav>
            <button
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-muted"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t">
            <div className="container mx-auto px-4 py-2 grid gap-1">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    classNames(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link to="/map" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted">Map</Link>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/donate?tab=upi" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted">UPI</Link>
                <Link to="/donate?tab=card" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted">Card</Link>
                <Link to="/donate?tab=net" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted">NetBanking</Link>
                <Link to="/donate?tab=scan" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted">Scan QR</Link>
                <Link to="/donate?tab=offline" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted">Cash/Offline</Link>
              </div>
              {user ? (
                <button onClick={logout} className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted text-left">Logout</button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-muted">Login</Link>
                  <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground">Register</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="mt-20 border-t">
        <div className="container mx-auto px-4 py-10 grid gap-6 md:grid-cols-3 items-center text-sm">
          <div className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartHandshake size={18} />
            </span>
            Helping Hands
          </div>
          <p className="text-muted-foreground">Empowering disability communities across Maharashtra with support, awareness, and inclusive services.</p>
          <div className="justify-self-start md:justify-self-end">
            <Link to="/donate" className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground shadow hover:bg-primary/90">
              Donate & Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
