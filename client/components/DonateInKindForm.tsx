import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image as ImageIcon } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";

export default function DonateInKindForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("clothes");
  const [qty, setQty] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [params] = useSearchParams();

  useEffect(() => {
    const p = params.get("preset");
    const n = params.get("name");
    const q = parseInt(params.get("qty") || "");
    if (p) setCategory(p);
    if (n) setName(n);
    if (!Number.isNaN(q) && q > 0) setQty(q);
  }, [params]);

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    toast.success("Thank you! We will coordinate collection soon.");
    setName(""); setCategory("clothes"); setQty(1); setImages([]);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-lg border p-4 grid gap-3">
        <div className="text-sm font-medium flex items-center gap-2"><ImageIcon className="h-4 w-4"/>Donate Items</div>
        <Input placeholder="Item description (e.g., Winter jackets)" value={name} onChange={(e)=>setName(e.target.value)} />
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
          <Input type="number" value={qty} onChange={(e)=>setQty(parseInt(e.target.value||"1"))} className="w-24" />
        </div>
        <input type="file" accept="image/*" multiple onChange={onFiles} />
        <div className="flex gap-2">
          <button onClick={submit} className="rounded-md bg-primary px-4 py-2 text-primary-foreground font-semibold hover:bg-primary/90">Submit</button>
          <Link to="/donate" className="rounded-md border px-4 py-2 hover:bg-muted">Back to Donate</Link>
        </div>
      </div>
      <div className="rounded-lg border p-4 grid gap-3">
        <p className="text-sm text-muted-foreground">Previews</p>
        <div className="grid grid-cols-3 gap-2">
          {images.map((src,i)=>(<img key={i} src={src} alt="upload preview" className="aspect-square w-full object-cover rounded"/>))}
        </div>
      </div>
    </div>
  );
}
