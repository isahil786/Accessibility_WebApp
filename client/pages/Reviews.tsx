import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Review { id: number; name: string; rating: number; comment: string; createdAt: number; }

const KEY = "helping-hands:reviews";

export default function Reviews() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(KEY) || "[]";
    setReviews(JSON.parse(raw));
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r: Review = { id: Date.now(), name: name || "Anonymous", rating, comment, createdAt: Date.now() };
    const list = [r, ...reviews];
    setReviews(list);
    localStorage.setItem(KEY, JSON.stringify(list));
    setName(""); setRating(5); setComment("");
  };

  const avg = useMemo(() => reviews.length ? (reviews.reduce((s,r)=>s+r.rating,0)/reviews.length) : 0, [reviews]);

  return (
    <section className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Reviews & Feedback</h1>
          <p className="mt-2 text-muted-foreground">Rate your experience and share a personal comment. Your feedback helps us improve.</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map((i)=> (
                <button key={i} onClick={()=>setRating(i)} aria-label={`Rate ${i}`} className="p-1">
                  <Star className={i<=rating?"text-yellow-500 fill-yellow-500":"text-muted-foreground"} />
                </button>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{rating} / 5</span>
          </div>
          <form onSubmit={submit} className="mt-4 grid gap-3">
            <Input placeholder="Your name (optional)" value={name} onChange={(e)=>setName(e.target.value)} />
            <textarea placeholder="Write your comment" value={comment} onChange={(e)=>setComment(e.target.value)} className="min-h-[120px] rounded-md border bg-background p-3" required />
            <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground font-semibold hover:bg-primary/90">Submit Review</button>
          </form>
        </div>
        <div className="rounded-2xl border p-6 bg-card h-full">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-extrabold">{avg.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Average rating • {reviews.length} reviews</p>
            </div>
            <div className="flex">
              {[1,2,3,4,5].map((i)=> <Star key={i} className={i<=Math.round(avg)?"text-yellow-500 fill-yellow-500":"text-muted-foreground"} />)}
            </div>
          </div>
          <ul className="mt-4 grid gap-3 max-h-[420px] overflow-auto pr-2">
            {reviews.map((r)=> (
              <li key={r.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{r.name}</p>
                  <div className="flex">
                    {[1,2,3,4,5].map((i)=> <Star key={i} className={i<=r.rating?"text-yellow-500 fill-yellow-500":"text-muted-foreground"} />)}
                  </div>
                </div>
                <p className="mt-2 text-sm">{r.comment}</p>
                <p className="mt-1 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</p>
              </li>
            ))}
            {!reviews.length && <p className="text-sm text-muted-foreground">No reviews yet. Be the first to share your thoughts.</p>}
          </ul>
        </div>
      </div>
    </section>
  );
}
