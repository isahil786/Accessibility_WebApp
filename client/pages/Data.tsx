import { useMemo, useState } from "react";
import { clusters } from "@/data/clusters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function toCSV() {
  const headers = ["id","name","district","type","capacity","lat","lng","description"];
  const rows = clusters.map((c)=>[c.id,c.name,c.district,c.type,c.capacity,c.lat,c.lng,c.description]);
  const csv = [headers, ...rows]
    .map((r) => r.map((v) => (typeof v === "string" ? `"${v.replaceAll("\"", "\"\"")}"` : v)).join(","))
    .join("\n");
  return new Blob([csv], { type: "text/csv;charset=utf-8;" });
}

type SortKey = "name" | "district" | "type" | "capacity";

export default function Data() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("name");
  const [dir, setDir] = useState<1 | -1>(1);

  const filtered = useMemo(() => {
    const text = q.toLowerCase();
    const out = clusters.filter((c) =>
      [c.name, c.district, c.type].some((f) => String(f).toLowerCase().includes(text)),
    );
    return out.sort((a, b) => {
      const av = a[sort] as any;
      const bv = b[sort] as any;
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [q, sort, dir]);

  const onDownload = () => {
    const blob = toCSV();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "helping-hands-maharashtra-clusters.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSort = (key: SortKey) => {
    if (key === sort) setDir((d) => (d === 1 ? -1 : 1));
    else {
      setSort(key);
      setDir(1);
    }
  };

  const sortArrow = (key: SortKey) => (sort === key ? (dir === 1 ? " ↑" : " ↓") : "");

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Disability Clusters – Data</h1>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <Input
            placeholder="Search by name, district, or type..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="md:max-w-sm"
          />
          <div className="md:ml-auto">
            <Button variant="outline" onClick={onDownload}>
              <Download />
              Download CSV
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => toggleSort("name")} className="cursor-pointer select-none">
                  Name{sortArrow("name")}
                </TableHead>
                <TableHead onClick={() => toggleSort("district")} className="cursor-pointer select-none">
                  District{sortArrow("district")}
                </TableHead>
                <TableHead onClick={() => toggleSort("type")} className="cursor-pointer select-none">
                  Type{sortArrow("type")}
                </TableHead>
                <TableHead onClick={() => toggleSort("capacity")} className="cursor-pointer select-none">
                  Capacity{sortArrow("capacity")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.district}</TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell>{c.capacity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>{filtered.length} clusters</TableCaption>
          </Table>
        </div>
      </div>
    </section>
  );
}
