import "./global.css";
import 'leaflet/dist/leaflet.css';
import './styles/leaflet.css';
import './styles/leaflet-overrides.css';
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./pages/Layout";
import About from "./pages/About";
import Donate from "./pages/Donate";
import Reviews from "./pages/Reviews";
import Data from "./pages/Data";
import ThankYou from "./pages/ThankYou";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonateItems from "./pages/DonateItems";
import MapPage from "./pages/Map";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/data" element={<Data />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/donate-items" element={<DonateItems />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
