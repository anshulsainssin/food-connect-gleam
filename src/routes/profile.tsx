import { createFileRoute } from "@tanstack/react-router";
import { Building2, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";

import { AppShell, PageIntro } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/profile")({ head: () => ({ meta: [{ title: "Community Profile | Food Waste Connect" }, { name: "description", content: "View and edit your Food Waste Connect community profile." }, { property: "og:title", content: "Community Profile | Food Waste Connect" }, { property: "og:description", content: "Community member and organization profile details." }, { property: "og:type", content: "profile" }, { name: "twitter:card", content: "summary_large_image" }] }), component: ProfilePage });

const details = [{ label: "Name", value: "Ananya Rao", icon: UserRound }, { label: "Role", value: "Food Distribution Coordinator", icon: UserRound }, { label: "Organization", value: "Seva Community Trust", icon: Building2 }, { label: "Phone", value: "+91 98220 45810", icon: Phone }, { label: "Email", value: "ananya@sevatrust.org", icon: Mail }, { label: "Location", value: "Central District, Bengaluru", icon: MapPin }];

function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setEditing(false); setSaved(true); }
  return <AppShell><PageIntro eyebrow="Profile / Community member" title={<>Ananya <span className="italic">Rao.</span></>} description="Manage the contact and organization information shown during donation coordination." action={!editing ? <Button size="wide" onClick={() => { setEditing(true); setSaved(false); }}>Edit profile</Button> : undefined} />
    <section className="grid lg:grid-cols-[0.7fr_1.3fr]"><div className="border-b border-border p-5 sm:p-8 lg:border-b-0 lg:border-r lg:p-10"><div className="flex size-24 items-center justify-center rounded-full bg-primary font-display text-4xl text-primary-foreground">AR</div><h2 className="mt-6 font-display text-3xl">Seva Community Trust</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Community food distribution and neighborhood support.</p>{saved && <p className="mt-6 border border-border-strong bg-card p-4 text-sm">Profile details saved in this preview.</p>}</div><div className="bg-muted/25 p-5 sm:p-8 lg:p-10">{editing ? <form className="grid gap-6 sm:grid-cols-2" onSubmit={submit}>{details.map(({label,value})=><label key={label} className="block"><span className="label-caps text-muted-foreground">{label}</span><input defaultValue={value} className="mt-2 h-12 w-full border-b border-input bg-transparent text-sm outline-none focus:border-foreground" /></label>)}<div className="flex gap-2 sm:col-span-2"><Button type="submit" className="flex-1">Save profile</Button><Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button></div></form> : <div className="grid gap-px bg-border sm:grid-cols-2">{details.map(({label,value,icon:Icon})=><article key={label} className="bg-background p-5"><Icon className="size-4 text-accent" /><p className="label-caps mt-5 text-muted-foreground">{label}</p><p className="mt-2 text-sm font-medium break-words">{value}</p></article>)}</div>}</div></section>
  </AppShell>;
}