import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, IndianRupee, QrCode, Landmark, Camera, PackagePlus, Image as ImageIcon, HeartHandshake, BookOpen, Bus, UserPlus, GraduationCap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Link, useSearchParams } from "react-router-dom";

type Tab = "upi" | "card" | "net" | "scan" | "offline";

function InKindForm({ amount }: { amount: number }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("clothes");
  const [qty, setQty] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [presetParams] = useSearchParams();

  useEffect(() => {
    const p = presetParams.get("preset");
    const n = presetParams.get("name");
    const q = parseInt(presetParams.get("qty") || "");
    if (p) setCategory(p);
    if (n) setName(n);
    if (!Number.isNaN(q) && q > 0) setQty(q);
  }, [presetParams]);

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files) return;
    const arr: string[] = [];
    for (const f of Array.from(files)) {
      const url = URL.createObjectURL(f);
      arr.push(url);
    }
    setImages((prev) => [...prev, ...arr]);
  };

  const submit = () => {
    const entry = { id: Date.now(), name, category, qty, images };
    const raw = localStorage.getItem("helping-hands:inkind") || "[]";
    const list = JSON.parse(raw) as any[];
    list.unshift(entry);
    localStorage.setItem("helping-hands:inkind", JSON.stringify(list));
    toast.success("Thank you! We'll contact you to collect the items.");
    setName(""); setCategory("clothes"); setQty(1); setImages([]);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border p-4 grid gap-3">
        <div className="text-sm font-medium flex items-center gap-2"><ImageIcon className="h-4 w-4" />In‑Kind Donation</div>
        <Input placeholder="Item description (e.g., Winter jackets)" value={name} onChange={(e) => setName(e.target.value)} />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="clothes">Clothes</SelectItem>
            <SelectItem value="blankets">Blankets</SelectItem>
            <SelectItem value="food">Dry Food</SelectItem>
            <SelectItem value="books">Books</SelectItem>
            <SelectItem value="toys">Toys</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Quantity</span>
          <Input type="number" value={qty} onChange={(e) => setQty(parseInt(e.target.value || "1"))} className="w-24" />
        </div>
        <input type="file" accept="image/*" multiple onChange={onFiles} />
        <button onClick={submit} className="rounded-md bg-primary px-4 py-2 text-primary-foreground font-semibold hover:bg-primary/90">Submit</button>
      </div>
      <div className="rounded-lg border p-4 grid gap-3">
        <p className="text-sm text-muted-foreground">Previews</p>
        <div className="grid grid-cols-3 gap-2">
          {images.map((src, i) => (<img key={i} src={src} alt="upload preview" className="aspect-square w-full object-cover rounded" />))}
        </div>
      </div>
    </div>
  );
}

export default function Donate() {
  const [amount, setAmount] = useState(500);
  const [tab, setTab] = useState<Tab>("upi");
  const [params, setParams] = useSearchParams();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // ✅ Added missing state for name and email
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const t = params.get("tab") as Tab | null;
    if (t && ["upi", "card", "net", "scan", "offline", "inkind"].includes(t)) setTab(t);
    const a = parseInt(params.get("amount") || "");
    if (!Number.isNaN(a) && a > 0) setAmount(a);
  }, [params]);

  const onTabChange = (v: string) => {
    const value = v as Tab;
    setTab(value);
    params.set("tab", value);
    setParams(params, { replace: true });
  };

  const thank = async () => {
    try {
      const donation = {
        name: name || "Anonymous Donor",
        email: email || "anonymous@example.com",
        amount,
        method: tab,
      };

      const res = await fetch("http://localhost:5000/api/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(donation),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const saved = await res.json();
      console.log("✅ Donation saved:", saved);

      toast.success(`Thank you! Donation of ₹${amount} recorded successfully.`);
      // optional: clear inputs after success
      setName("");
      setEmail("");
    } catch (err) {
      console.error("Donation error:", err);
      toast.error("Failed to record donation. Please try again.");
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      toast.error("Camera permission denied");
    }
  };
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Helping Hands – Donate & Support</h1>
        <p className="mt-2 text-muted-foreground">Special children ko help karne ke kai tareeke: therapy/education sponsorship, assistive devices, transport support, volunteer time, ya in‑kind items donate karein.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Link to="/donate?tab=upi&amount=1500&purpose=therapy" className="rounded-xl border p-4 bg-card hover:shadow-md hover:border-primary/50 transition block">
          <div className="flex items-center gap-2 font-semibold"><HeartHandshake className="h-5 w-5" />Sponsor Therapy</div>
          <p className="mt-1 text-sm text-muted-foreground">Physio/OT sessions ke liye sahayata.</p>
          <span className="mt-3 inline-block rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm">Pay ₹1500</span>
        </Link>
        <Link to="/donate-items?preset=books&name=Education%20Kit&qty=1" className="rounded-xl border p-4 bg-card hover:shadow-md hover:border-primary/50 transition block">
          <div className="flex items-center gap-2 font-semibold"><GraduationCap className="h-5 w-5" />Education Support</div>
          <p className="mt-1 text-sm text-muted-foreground">Books, stationery, learning aids.</p>
          <span className="mt-3 inline-block rounded-md border px-3 py-2 text-sm hover:bg-muted">Donate Items</span>
        </Link>
        <Link to="/donate-items?preset=other&name=Wheelchair&qty=1" className="rounded-xl border p-4 bg-card hover:shadow-md hover:border-primary/50 transition block">
          <div className="flex items-center gap-2 font-semibold"><PackagePlus className="h-5 w-5" />Assistive Devices</div>
          <p className="mt-1 text-sm text-muted-foreground">Wheelchairs, walkers, hearing aids.</p>
          <span className="mt-3 inline-block rounded-md border px-3 py-2 text-sm hover:bg-muted">Donate Device</span>
        </Link>
        <Link to="/donate?tab=upi&amount=2500&purpose=training" className="rounded-xl border p-4 bg-card hover:shadow-md hover:border-primary/50 transition block">
          <div className="flex items-center gap-2 font-semibold"><BookOpen className="h-5 w-5" />Skill Training</div>
          <p className="mt-1 text-sm text-muted-foreground">Vocational workshops ke liye.</p>
          <span className="mt-3 inline-block rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm">Pay ₹2500</span>
        </Link>
        <Link to="/donate?tab=upi&amount=1000&purpose=transport" className="rounded-xl border p-4 bg-card hover:shadow-md hover:border-primary/50 transition block">
          <div className="flex items-center gap-2 font-semibold"><Bus className="h-5 w-5" />Transport Support</div>
          <p className="mt-1 text-sm text-muted-foreground">School/therapy commute aid.</p>
          <span className="mt-3 inline-block rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm">Pay ₹1000</span>
        </Link>
        <Link to="/register" className="rounded-xl border p-4 bg-card hover:shadow-md hover:border-primary/50 transition block">
          <div className="flex items-center gap-2 font-semibold"><UserPlus className="h-5 w-5" />Volunteer</div>
          <p className="mt-1 text-sm text-muted-foreground">Time, mentoring, drives mein shamil ho.</p>
          <span className="mt-3 inline-block rounded-md border px-3 py-2 text-sm hover:bg-muted">Register to Volunteer</span>
        </Link>
      </section>

      <div className="rounded-2xl border p-6 bg-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <IndianRupee size={16} /> Enter amount (INR)
        </div>
        <div className="mt-2 flex gap-3">
          <Input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value || "0"))} className="w-40" />
          <div className="flex gap-2">
            {[200, 500, 1000, 2500].map(v => (
              <button key={v} onClick={() => setAmount(v)} className="rounded-md border px-3 py-2 text-sm hover:bg-muted">₹{v}</button>
            ))}
          </div>
        </div>

        <Tabs value={tab} onValueChange={onTabChange} className="mt-6">
          <TabsList>
            <TabsTrigger value="upi"><QrCode className="mr-1 h-4 w-4" />UPI</TabsTrigger>
            <TabsTrigger value="card"><CreditCard className="mr-1 h-4 w-4" />Card</TabsTrigger>
            <TabsTrigger value="net"><Landmark className="mr-1 h-4 w-4" />NetBanking</TabsTrigger>
            <TabsTrigger value="scan"><Camera className="mr-1 h-4 w-4" />Scan QR</TabsTrigger>
            <TabsTrigger value="offline">Cash/Offline</TabsTrigger>
          </TabsList>

          <TabsContent value="upi" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">UPI ID</p>
                <Input
  placeholder="Your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="mt-2"
/>
<Input
  placeholder="Your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="mt-2"
/>
                <Input placeholder="your-upi@bank" className="mt-2" />
                <button onClick={thank} className="mt-3 rounded-md bg-primary px-4 py-2 text-primary-foreground font-semibold hover:bg-primary/90">Pay ₹{amount}</button>
              </div>
              <div className="rounded-lg border p-4 grid place-items-center text-muted-foreground">
                {/* <div className="h-40 w-40 rounded bg-muted grid place-items-center">QR</div> */}
                <img
                  src="/sahilqr.jpeg"
                  alt="Donation QR Code"
                  className="w-48 h-48 mx-auto mt-3 rounded-lg border shadow-sm"
                />
                <p className="mt-2 text-xs">Scanner</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="card" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border p-4 grid gap-3">
                <Input placeholder="Cardholder name" />
                <Input placeholder="Card number" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="MM/YY" />
                  <Input placeholder="CVV" />
                </div>
                <button onClick={thank} className="rounded-md bg-primary px-4 py-2 text-primary-foreground font-semibold hover:bg-primary/90">Pay ₹{amount}</button>
              </div>
              <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                Your card data is not sent anywhere in this demo.
              </div>
            </div>
          </TabsContent>

          <TabsContent value="net" className="mt-4">
            <div className="rounded-lg border p-4 grid gap-3 max-w-md">
               <Input
  placeholder="Your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="mt-2"
/>
<Input
  placeholder="Your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="mt-2"
/>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select bank" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sbi">SBI</SelectItem>
                  <SelectItem value="Central Bank">Cent</SelectItem>
                  <SelectItem value="hdfc">HDFC</SelectItem>
                  <SelectItem value="icici">ICICI</SelectItem>
                  <SelectItem value="axis">Axis</SelectItem>
                </SelectContent>
              </Select>
              <button onClick={thank} className="rounded-md bg-primary px-4 py-2 text-primary-foreground font-semibold hover:bg-primary/90">Proceed to Bank</button>
            </div>
          </TabsContent>

          <TabsContent value="scan" className="mt-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border p-4 grid gap-3">
                <p className="text-sm">Dummy QR scanner using your camera preview.</p>
                <video ref={videoRef} className="w-full rounded border bg-black" muted playsInline />
                <div className="flex gap-2">
                  <button onClick={startCamera} className="rounded-md border px-3 py-2 hover:bg-muted">Start Camera</button>
                  <button onClick={thank} className="rounded-md bg-primary px-3 py-2 text-primary-foreground font-semibold hover:bg-primary/90">Mark as Scanned</button>
                </div>
              </div>
              <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                <p>Or scan this QR code to donate directly:</p>
                <img
                  src="/sahilqr.jpeg"
                  alt="Donation QR Code"
                  className="w-48 h-48 mx-auto mt-3 rounded-lg border shadow-sm"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="offline" className="mt-4">
            <div className="rounded-lg border p-4 grid gap-3 max-w-md">
              <p className="text-sm">Record an offline donation or pledge. We’ll display a success message only.</p>
              <Input placeholder="Donor name" />
              <Input placeholder="Contact number" />
              <button onClick={thank} className="rounded-md bg-primary px-4 py-2 text-primary-foreground font-semibold hover:bg-primary/90">Mark as Paid ₹{amount}</button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
