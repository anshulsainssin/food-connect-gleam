import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Clock3, MapPin, Navigation, Utensils } from "lucide-react";
import { useState } from "react";

import { AppShell, PageIntro, StatusBadge } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/donations")({
  head: () => ({ meta: [
    { title: "Available Donations | Food Waste Connect" },
    { name: "description", content: "Browse nearby surplus food donations, filter by diet or urgency, and claim food for your community." },
    { property: "og:title", content: "Available Donations | Food Waste Connect" },
    { property: "og:description", content: "Find and claim nearby surplus food donations for your community." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: DonationsPage,
});

const filters = ["All", "Nearby", "Vegetarian", "Non-vegetarian", "Urgent"] as const;

const listings = [
  { id: 1, name: "Vegetable biryani & dal", type: "Cooked meals", diet: "Vegetarian", quantity: "Serves 40", deadline: "Today, 1:30 PM", distance: 1.2, area: "Uptown Market", urgent: true },
  { id: 2, name: "Chicken pulao", type: "Cooked meals", diet: "Non-vegetarian", quantity: "Serves 25", deadline: "Today, 4:00 PM", distance: 2.8, area: "Riverside", urgent: false },
  { id: 3, name: "Fresh bread & pastries", type: "Bakery items", diet: "Vegetarian", quantity: "60 pieces", deadline: "Today, 8:00 PM", distance: 3.9, area: "Midtown", urgent: false },
  { id: 4, name: "Mixed salad bowls", type: "Fresh produce", diet: "Vegetarian", quantity: "Serves 15", deadline: "Today, 12:00 PM", distance: 0.8, area: "Central District", urgent: true },
  { id: 5, name: "Egg curry & rice", type: "Cooked meals", diet: "Non-vegetarian", quantity: "Serves 30", deadline: "Tomorrow, 10:00 AM", distance: 5.4, area: "Lakeview", urgent: false },
  { id: 6, name: "Packaged snack boxes", type: "Packaged food", diet: "Vegetarian", quantity: "120 boxes", deadline: "Tomorrow, 6:00 PM", distance: 1.9, area: "Garden Avenue", urgent: false },
];

function DonationsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [claimed, setClaimed] = useState<number[]>([]);

  const visible = listings.filter((item) =>
    filter === "All" ? true
    : filter === "Nearby" ? item.distance <= 2
    : filter === "Urgent" ? item.urgent
    : item.diet === filter);

  return <AppShell>
    <PageIntro eyebrow="Receiver / Available food" title={<>Food ready for <span className="italic">collection.</span></>} description="Surplus donations shared by nearby kitchens and stores. Claim what your community can collect before the pickup deadline." />

    <section className="flex flex-wrap gap-2 border-b border-border px-5 py-5 sm:px-8 lg:px-12">
      {filters.map((option) => <Button key={option} variant={filter === option ? "primary" : "outline"} onClick={() => setFilter(option)}>{option}</Button>)}
      <span className="ml-auto self-center text-xs text-muted-foreground">{visible.length} donations</span>
    </section>

    <section className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-3">
      {visible.map((item) => {
        const isClaimed = claimed.includes(item.id);
        return <article key={item.id} className="flex flex-col bg-background p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <StatusBadge value={isClaimed ? "Claimed" : item.urgent ? "Urgent" : "Available"} />
            {item.urgent && !isClaimed && <span className="flex items-center gap-1 text-xs text-accent"><AlertTriangle className="size-3.5" />Closing soon</span>}
          </div>
          <h2 className="mt-5 font-display text-3xl leading-tight">{item.name}</h2>
          <p className="mt-2 text-xs text-muted-foreground">{item.type} · {item.diet}</p>
          <div className="mt-6 space-y-3 text-sm">
            <p className="flex items-center gap-2"><Utensils className="size-4 text-accent" />{item.quantity}</p>
            <p className="flex items-center gap-2"><Clock3 className="size-4 text-accent" />Pickup by {item.deadline}</p>
            <p className="flex items-center gap-2"><Navigation className="size-4 text-accent" />{item.distance} km away</p>
            <p className="flex items-center gap-2"><MapPin className="size-4 text-accent" />{item.area}</p>
          </div>
          <Button className="mt-7 w-full" variant={isClaimed ? "outline" : "primary"} disabled={isClaimed} onClick={() => setClaimed((prev) => [...prev, item.id])}>{isClaimed ? "Claimed by you" : "Claim food"}</Button>
        </article>;
      })}
      {visible.length === 0 && <p className="bg-background p-10 text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">No donations match this filter right now.</p>}
    </section>
  </AppShell>;
}
