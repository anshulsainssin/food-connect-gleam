import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Bell, Check, ChevronRight, ClipboardList, HandHeart, Home, MapPin, Menu, PackageOpen, Plus, Truck, UserRound, Users, UtensilsCrossed, X } from "lucide-react";

import { Button } from "@/components/ui/button";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Donor Dashboard | Food Waste Connect" },
    { name: "description", content: "Manage food donations, pickups, and community impact with Food Waste Connect." },
    { property: "og:title", content: "Food Waste Connect Donor Dashboard" },
    { property: "og:description", content: "Manage donations and see the impact of rescued food." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const stats = [
  { label: "Food saved", value: "2,480", unit: "kg", icon: UtensilsCrossed },
  { label: "People fed", value: "1,860", unit: "people", icon: Users },
  { label: "Active donations", value: "07", unit: "in progress", icon: PackageOpen },
  { label: "Completed pickups", value: "128", unit: "all time", icon: Check },
];

const donations = [
  { name: "Vegetable biryani & dal", detail: "Serves 40 · Uptown District", time: "Pickup by 1:30 PM", status: "Available" },
  { name: "Chicken pulao", detail: "Serves 25 · Riverside", time: "Pickup by 12:00 PM", status: "Claimed" },
  { name: "Mixed salad bowls", detail: "Serves 15 · Midtown", time: "Picked up yesterday", status: "Picked Up" },
];

const navItems = [
  { label: "Overview", icon: Home },
  { label: "Donations", icon: HandHeart },
  { label: "Pickups", icon: Truck },
  { label: "Profile", icon: UserRound },
];

function Status({ value }: { value: string }) {
  const style = value === "Available" ? "bg-accent/15 text-accent" : value === "Claimed" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground";
  return <span className={`label-caps inline-flex rounded-sm px-2 py-1 ${style}`}>{value}</span>;
}

function Index() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [diet, setDiet] = useState("Vegetarian");
  const [submitted, setSubmitted] = useState(false);

  function submitDonation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:px-7">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" onClick={() => setMobileMenu(true)}><Menu className="size-5" /></Button>
          <div><p className="font-display text-2xl italic leading-none">Food Waste Connect</p><p className="label-caps mt-1 text-muted-foreground">Donor network</p></div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifications" className="relative"><Bell className="size-4" /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent" /></Button>
          <div className="hidden border-l border-border pl-4 sm:block"><p className="text-sm font-medium">Maya’s Kitchen</p><p className="text-xs text-muted-foreground">Donor</p></div>
        </div>
      </header>

      {mobileMenu && <div className="fixed inset-0 z-50 bg-background p-5 md:hidden"><div className="flex items-center justify-between"><p className="font-display text-2xl italic">Food Waste Connect</p><Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setMobileMenu(false)}><X className="size-5" /></Button></div><nav className="mt-10 space-y-2">{navItems.map(({ label, icon: Icon }, index) => <Button key={label} variant="nav" className="w-full justify-start" data-active={index === 0} onClick={() => setMobileMenu(false)}><Icon className="size-4" />{label}</Button>)}</nav></div>}

      <div className="mx-auto flex max-w-[1600px]">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-border bg-sidebar p-4 md:flex md:flex-col">
          <nav className="space-y-1">{navItems.map(({ label, icon: Icon }, index) => <Button key={label} variant="nav" className="w-full justify-start" data-active={index === 0}><Icon className="size-4" />{label}</Button>)}</nav>
          <div className="mt-auto border-t border-sidebar-border pt-5"><p className="label-caps text-muted-foreground">This month</p><p className="mt-2 font-display text-3xl">214 meals</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Redistributed to local community partners.</p></div>
        </aside>

        <main className="min-w-0 flex-1 pb-24 md:pb-10">
          <section className="reveal border-b border-border px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
            <p className="label-caps text-accent">Overview / September 04</p>
            <div className="mt-4 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
              <div><h1 className="font-display text-5xl leading-[0.95] sm:text-6xl">Welcome back, <span className="italic">Maya.</span></h1><p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">Your contributions have redistributed 214 meals this month. Three community partners are ready for new donations today.</p></div>
              <div className="flex flex-col gap-3 sm:flex-row"><Button size="wide" onClick={() => document.querySelector("#donate")?.scrollIntoView({ behavior: "smooth" })}><Plus className="size-4" />New donation</Button><Button variant="outline" size="wide" onClick={() => document.querySelector("#recent")?.scrollIntoView({ behavior: "smooth" })}>View donations</Button></div>
            </div>
          </section>

          <section className="grid grid-cols-2 border-b border-border xl:grid-cols-4">{stats.map(({ label, value, unit, icon: Icon }, index) => <article key={label} className={`p-5 sm:p-7 ${index % 2 === 0 ? "border-r border-border" : ""} ${index < 2 ? "border-b border-border xl:border-b-0" : ""} ${index === 1 ? "xl:border-r" : ""}`}><div className="flex items-center justify-between"><p className="label-caps text-muted-foreground">{label}</p><Icon className="size-4 text-accent" /></div><p className="mt-5 font-display text-4xl sm:text-5xl">{value}</p><p className="mt-1 text-xs text-muted-foreground">{unit}</p></article>)}</section>

          <div className="grid lg:grid-cols-[1fr_1.05fr]">
            <div className="border-b border-border lg:border-b-0 lg:border-r">
              <section className="border-b border-border px-5 py-8 sm:px-8 lg:px-10" id="recent"><div className="flex items-baseline justify-between"><h2 className="label-caps text-foreground">Recent donations</h2><span className="text-xs text-muted-foreground">3 entries</span></div><div className="mt-7 divide-y divide-border">{donations.map((item) => <article key={item.name} className="group py-5 first:pt-0"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><h3 className="font-display text-2xl">{item.name}</h3><p className="mt-2 text-xs text-muted-foreground">{item.detail}</p><p className="mt-1 text-xs text-muted-foreground">{item.time}</p></div><Status value={item.status} /></div></article>)}</div></section>
              <section className="px-5 py-8 sm:px-8 lg:px-10"><h2 className="label-caps">Quick actions</h2><div className="mt-5 grid gap-2 sm:grid-cols-2">{[{label:"Create donation",icon:Plus,target:"#donate"},{label:"Review pickups",icon:Truck,target:"#recent"},{label:"Donation history",icon:ClipboardList,target:"#recent"},{label:"Pickup locations",icon:MapPin,target:"#donate"}].map(({label,icon:Icon,target}) => <Button key={label} variant="outline" className="h-14 justify-between px-4" onClick={() => document.querySelector(target)?.scrollIntoView({behavior:"smooth"})}><span className="flex items-center gap-2"><Icon className="size-4" />{label}</span><ChevronRight className="size-4 text-muted-foreground" /></Button>)}</div></section>
            </div>

            <section id="donate" className="bg-muted/25 px-5 py-9 sm:px-8 lg:px-10 lg:py-10">
              <p className="label-caps text-accent">Donation registry</p><h2 className="mt-3 font-display text-4xl italic">Share surplus food</h2><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Add pickup details so a nearby community partner can collect the food safely and on time.</p>
              {submitted ? <div className="mt-8 border border-border-strong bg-card p-6"><div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="size-5" /></div><h3 className="mt-5 font-display text-3xl">Donation ready</h3><p className="mt-2 text-sm text-muted-foreground">Your sample donation has been added to this preview.</p><Button className="mt-6" variant="outline" onClick={() => setSubmitted(false)}>Add another</Button></div> : <form className="mt-8 space-y-6" onSubmit={submitDonation}>
                <label className="block"><span className="label-caps text-muted-foreground">Food type</span><select required className="mt-2 h-12 w-full border-b border-input bg-transparent text-sm outline-none focus:border-foreground"><option value="">Select food type</option><option>Cooked meals</option><option>Fresh produce</option><option>Bakery items</option><option>Packaged food</option></select></label>
                <fieldset><legend className="label-caps text-muted-foreground">Dietary type</legend><div className="mt-2 grid grid-cols-2 gap-2">{["Vegetarian","Non-vegetarian"].map((option) => <Button key={option} type="button" variant={diet === option ? "primary" : "outline"} onClick={() => setDiet(option)}>{option}</Button>)}</div></fieldset>
                <div className="grid gap-6 sm:grid-cols-2"><Field label="Quantity / people served" type="number" placeholder="40" /><Field label="Food prepared time" type="datetime-local" /></div>
                <div className="grid gap-6 sm:grid-cols-2"><Field label="Pickup deadline" type="datetime-local" /><Field label="Contact information" type="tel" placeholder="+91 98765 43210" /></div>
                <Field label="Pickup location" placeholder="12 Garden Avenue, Central Market" />
                <label className="block"><span className="label-caps text-muted-foreground">Additional notes</span><textarea rows={3} placeholder="Packaging details, allergens, or pickup instructions" className="mt-2 w-full resize-none border-b border-input bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-foreground" /></label>
                <Button type="submit" size="wide" className="w-full">Submit donation</Button>
              </form>}
            </section>
          </div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">{navItems.map(({label,icon:Icon},index) => <Button key={label} variant="ghost" className={`h-16 flex-col gap-1 px-1 text-[10px] ${index === 0 ? "text-foreground" : ""}`} onClick={() => index === 1 && document.querySelector("#donate")?.scrollIntoView({behavior:"smooth"})}><Icon className="size-4" />{label}</Button>)}</nav>
    </div>
  );
}

function Field({ label, type = "text", placeholder }: { label: string; type?: string; placeholder?: string }) {
  return <label className="block"><span className="label-caps text-muted-foreground">{label}</span><input required type={type} placeholder={placeholder} className="mt-2 h-12 w-full border-b border-input bg-transparent text-sm outline-none placeholder:text-muted-foreground/60 focus:border-foreground" /></label>;
}
