import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Clock3, MapPin, Navigation, Utensils } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AppShell, PageIntro, StatusBadge } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

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

type Donation = Tables<"donations">;

function formatDeadline(iso: string | null) {
  if (!iso) return "No deadline";
  const date = new Date(iso);
  return date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function isUrgent(iso: string | null) {
  if (!iso) return false;
  const deadline = new Date(iso).getTime();
  const now = Date.now();
  return deadline > now && deadline - now <= 4 * 60 * 60 * 1000;
}

function DonationsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [claimed, setClaimed] = useState<string[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error(error);
      setDonations((data as Donation[] | null) ?? []);
      setLoading(false);
    }
    void load();
  }, []);

  const visible = useMemo(
    () =>
      donations.filter((item) =>
        filter === "All"
          ? true
          : filter === "Nearby"
            ? true
            : filter === "Urgent"
              ? isUrgent(item.pickup_deadline)
              : item.diet === filter,
      ),
    [donations, filter],
  );

  return (
    <AppShell>
      <PageIntro
        eyebrow="Receiver / Available food"
        title={
          <>
            Food ready for <span className="italic">collection.</span>
          </>
        }
        description="Surplus donations shared by nearby kitchens and stores. Claim what your community can collect before the pickup deadline."
      />

      <section className="flex flex-wrap gap-2 border-b border-border px-5 py-5 sm:px-8 lg:px-12">
        {filters.map((option) => (
          <Button key={option} variant={filter === option ? "primary" : "outline"} onClick={() => setFilter(option)}>
            {option}
          </Button>
        ))}
        <span className="ml-auto self-center text-xs text-muted-foreground">{visible.length} donations</span>
      </section>

      <section className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <p className="bg-background p-10 text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">Loading donations…</p>
        ) : (
          visible.map((item) => {
            const isClaimed = claimed.includes(item.id);
            const urgent = isUrgent(item.pickup_deadline);
            return (
              <article key={item.id} className="flex flex-col bg-background p-5 sm:p-7">
                <div className="flex items-start justify-between gap-3">
                  <StatusBadge value={isClaimed ? "Claimed" : urgent ? "Urgent" : item.status} />
                  {urgent && !isClaimed && (
                    <span className="flex items-center gap-1 text-xs text-accent">
                      <AlertTriangle className="size-3.5" />
                      Closing soon
                    </span>
                  )}
                </div>
                <h2 className="mt-5 font-display text-3xl leading-tight">{item.food_type}</h2>
                <p className="mt-2 text-xs text-muted-foreground">{item.diet}</p>
                <div className="mt-6 space-y-3 text-sm">
                  <p className="flex items-center gap-2">
                    <Utensils className="size-4 text-accent" />
                    {item.quantity}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock3 className="size-4 text-accent" />
                    Pickup by {formatDeadline(item.pickup_deadline)}
                  </p>
                  <p className="flex items-center gap-2">
                    <Navigation className="size-4 text-accent" />
                    Distance not calculated
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="size-4 text-accent" />
                    {item.pickup_address || "Location not available"}
                  </p>
                </div>
                <Button
                  className="mt-7 w-full"
                  variant={isClaimed ? "outline" : "primary"}
                  disabled={isClaimed}
                  onClick={() => setClaimed((prev) => [...prev, item.id])}
                >
                  {isClaimed ? "Claimed by you" : "Claim food"}
                </Button>
              </article>
            );
          })
        )}
        {!loading && visible.length === 0 && (
          <p className="bg-background p-10 text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">
            No donations match this filter right now.
          </p>
        )}
      </section>
    </AppShell>
  );
}
