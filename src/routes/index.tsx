import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { ArrowDown, ArrowRight, CalendarDays, Check, Clock3, Instagram, MapPin, Menu, Phone, Sparkles, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import heroImage from "@/assets/germinnaa-hero.jpg";
import ambienceImage from "@/assets/germinnaa-ambience.jpg";
import foodImage from "@/assets/germinnaa-food-table.jpg";
import dessertImage from "@/assets/germinnaa-dessert-drinks.jpg";
import logoAsset from "@/assets/germinnaa-logo.png.asset.json";

const mapKey = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
const mapAddress = "Germinnaa, P-557 Hemanta Mukhopadhyay Sarani, Kolkata, West Bengal 700029";
const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapAddress)}`;

const reservationSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().regex(/^[+\d][\d\s-]{8,17}$/, "Please enter a valid phone number"),
  date: z.string().min(1, "Please choose a date"),
  time: z.string().min(1, "Please choose a time"),
  guests: z.string().min(1, "Please choose your party size"),
});

const navItems = [
  ["Home", "home"], ["Our Story", "story"], ["Experience", "experience"],
  ["Signature Picks", "menu"], ["Gallery", "gallery"], ["Visit Us", "visit"],
] as const;

const dishes = [
  ["Classic Hummus with Laffa Pita", "Silky, rich and layered with quiet depth."],
  ["Charred Prawns", "Hot honey glaze, gentle smoke, and a bright finish."],
  ["Fire Kissed Bhetki", "Delicately charred, tender, and full of character."],
  ["Signature Pizza Romana", "A crisp, airy base with considered seasonal toppings."],
  ["Cheesecake", "Soft, balanced, and made for lingering over."],
  ["Spiced Mango Slush", "Tropical brightness with a subtle warming finish."],
] as const;

function Logo({ light = false }: { light?: boolean }) {
  return <a href="#home" className="flex shrink-0 items-center gap-3" aria-label="Germinnaa home"><img src={logoAsset.url} alt="" className="size-9 rounded-full" width="36" height="36"/><span className={`text-[13px] font-semibold uppercase tracking-[.26em] ${light ? "text-primary-foreground" : "text-primary"}`}>Germinnaa</span></a>;
}

function ReservationDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [guests, setGuests] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = reservationSchema.safeParse({ name: form.get("name"), phone: form.get("phone"), date: form.get("date"), time: form.get("time"), guests });
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message])));
      return;
    }
    setErrors({}); setSubmitted(true);
  }
  return <Dialog open={open} onOpenChange={(next) => { onOpenChange(next); if (!next) setTimeout(() => setSubmitted(false), 200); }}>
    <DialogContent className="max-h-[92vh] overflow-y-auto border-accent/40 bg-background p-6 sm:p-9">
      {submitted ? <div className="py-10 text-center animate-rise"><span className="mx-auto mb-6 grid size-14 place-items-center rounded-full border border-accent text-accent"><Check/></span><DialogTitle className="text-4xl text-primary">Your table request is ready.</DialogTitle><DialogDescription className="mx-auto mt-4 max-w-sm leading-7">Thank you. This preview does not send bookings yet; Germinnaa can connect it to WhatsApp, email, or a reservation service.</DialogDescription><Button className="mt-8 h-12 bg-primary px-7" onClick={() => onOpenChange(false)}>Done</Button></div> : <>
        <DialogHeader><p className="mb-2 text-xs font-semibold uppercase tracking-[.22em] text-accent">Reserve a moment</p><DialogTitle className="text-4xl text-primary">Your table awaits.</DialogTitle><DialogDescription className="pt-2 leading-6">Share your preferred details and we’ll prepare your reservation request.</DialogDescription></DialogHeader>
        <form className="mt-3 grid gap-5" onSubmit={submit} noValidate>
          <div><Label htmlFor="name">Name</Label><Input id="name" name="name" autoComplete="name" maxLength={80} className="mt-2 h-12" placeholder="Your name"/><p className="mt-1 text-xs text-destructive">{errors.name}</p></div>
          <div><Label htmlFor="phone">Phone number</Label><Input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={18} className="mt-2 h-12" placeholder="+91 98765 43210"/><p className="mt-1 text-xs text-destructive">{errors.phone}</p></div>
          <div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="date">Date</Label><Input id="date" name="date" type="date" min={new Date().toISOString().split("T")[0]} className="mt-2 h-12"/><p className="mt-1 text-xs text-destructive">{errors.date}</p></div><div><Label htmlFor="time">Time</Label><Input id="time" name="time" type="time" min="11:00" max="23:00" className="mt-2 h-12"/><p className="mt-1 text-xs text-destructive">{errors.time}</p></div></div>
          <div><Label>Number of guests</Label><Select value={guests} onValueChange={setGuests}><SelectTrigger className="mt-2 h-12"><SelectValue placeholder="Select party size"/></SelectTrigger><SelectContent>{["1","2","3","4","5","6","7","8+"].map((n) => <SelectItem key={n} value={n}>{n} {n === "1" ? "guest" : "guests"}</SelectItem>)}</SelectContent></Select><p className="mt-1 text-xs text-destructive">{errors.guests}</p></div>
          <Button type="submit" className="mt-2 h-13 bg-primary text-primary-foreground">Request a Table <ArrowRight/></Button>
        </form>
      </>}
    </DialogContent>
  </Dialog>;
}

function Index() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reserve = () => setReserveOpen(true);
  return <main className="bg-background text-foreground">
    <header className="fixed inset-x-0 top-0 z-40 border-b border-primary-foreground/15 bg-primary/90 text-primary-foreground backdrop-blur-lg">
      <div className="mx-auto grid h-18 max-w-[1500px] grid-cols-[minmax(0,1fr)_auto] items-center px-5 sm:px-8 lg:grid-cols-[auto_1fr_auto] lg:px-12"><Logo light/><nav className="hidden justify-center gap-7 lg:flex" aria-label="Main navigation">{navItems.map(([label,id]) => <a key={id} href={`#${id}`} className="text-[11px] uppercase tracking-[.14em] text-primary-foreground/75 transition-colors hover:text-accent">{label}</a>)}</nav><Button onClick={reserve} variant="outline" className="hidden h-10 border-accent bg-transparent px-5 text-xs uppercase tracking-[.12em] text-primary-foreground hover:bg-accent hover:text-accent-foreground lg:inline-flex">Reserve a Table</Button><Button variant="ghost" size="icon" aria-label={mobileOpen ? "Close menu" : "Open menu"} onClick={() => setMobileOpen(!mobileOpen)} className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-accent lg:hidden">{mobileOpen ? <X/> : <Menu/>}</Button></div>
      {mobileOpen && <nav className="border-t border-primary-foreground/15 bg-primary px-6 py-7 lg:hidden" aria-label="Mobile navigation">{navItems.map(([label,id]) => <a key={id} href={`#${id}`} onClick={() => setMobileOpen(false)} className="block border-b border-primary-foreground/10 py-3 font-serif text-2xl">{label}</a>)}<Button onClick={() => { setMobileOpen(false); reserve(); }} className="mt-6 h-12 w-full bg-accent text-accent-foreground">Reserve a Table</Button></nav>}
    </header>

    <section id="home" className="grain relative flex min-h-[92svh] items-center overflow-hidden bg-primary text-primary-foreground">
      <img src={heroImage} alt="An intimate, warmly lit dining room with emerald walls at Germinnaa" width="1920" height="1280" className="absolute inset-0 h-full w-full object-cover object-center" fetchPriority="high"/>
      <div className="absolute inset-0 bg-primary/55"/><div className="absolute inset-0 bg-linear-to-t from-primary via-transparent to-primary/35"/>
      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 py-20 sm:px-8 lg:px-12 lg:py-24"><p className="mb-5 text-xs font-semibold uppercase tracking-[.28em] text-accent animate-rise">Southern Avenue · Kolkata</p><h1 className="max-w-4xl text-5xl font-medium leading-[.94] sm:text-7xl lg:text-[96px]">More Than a Meal.<br/><em className="font-normal">A Moment to Stay In.</em></h1><p className="mt-7 max-w-xl text-sm leading-7 text-primary-foreground/78 sm:text-base">Thoughtfully crafted flavours, beautiful surroundings, and the kind of warmth that makes you want to stay a little longer.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button onClick={reserve} className="h-13 bg-accent px-7 text-accent-foreground hover:bg-accent/90">Reserve Your Table <ArrowRight/></Button><Button asChild variant="outline" className="h-13 border-primary-foreground/40 bg-transparent px-7 text-primary-foreground hover:bg-primary-foreground hover:text-primary"><a href="#experience">Explore the Experience</a></Button></div></div>
      <a href="#story" aria-label="Scroll to our story" className="absolute bottom-7 right-7 z-10 grid size-12 place-items-center rounded-full border border-primary-foreground/35 text-primary-foreground animate-drift sm:right-10"><ArrowDown className="size-4"/></a>
    </section>

    <section id="story" className="grid min-h-[760px] lg:grid-cols-2"><div className="min-h-[560px] overflow-hidden"><img src={ambienceImage} alt="A warm corner table at Germinnaa" width="1200" height="1600" loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.02]"/></div><div className="flex items-center bg-secondary px-6 py-20 sm:px-12 lg:px-20"><div className="max-w-xl"><p className="text-xs font-semibold uppercase tracking-[.24em] text-accent">The Germinnaa Experience</p><div className="my-7 h-px w-20 bg-accent"/><h2 className="text-5xl font-medium leading-none text-primary sm:text-7xl">Soft Warmth.<br/><em className="font-normal">Slow Indulgence.</em></h2><p className="mt-8 max-w-lg leading-8 text-muted-foreground">Germinnaa is a place where flavours are explored slowly and moments are meant to linger. From comforting classics to globally inspired creations, every visit is designed to feel a little special.</p></div></div></section>

    <section id="experience" className="bg-primary px-5 py-24 text-primary-foreground sm:px-8 lg:px-12 lg:py-32"><div className="mx-auto max-w-[1500px]"><p className="text-xs uppercase tracking-[.24em] text-accent">What brings you here?</p><h2 className="mt-4 max-w-3xl text-5xl leading-none sm:text-7xl">Every Visit Has<br/><em>Its Own Story.</em></h2><div className="mt-14 grid gap-5 md:grid-cols-3">
      {[["For the Date Night","Intimate tables, warm conversations and memorable flavours.",ambienceImage,"object-center"],["For the Slow Afternoon","Coffee, desserts and nowhere else to be.",dessertImage,"object-center"],["For the Food Lovers","Unexpected flavours and dishes worth talking about.",foodImage,"object-center"]].map(([title,text,img,pos],i) => <article key={title} className={`group relative overflow-hidden ${i===1 ? "md:mt-16" : ""}`}><div className="aspect-[4/5] overflow-hidden"><img src={img} alt={title} width={i===0?1200:1600} height={i===0?1600:1200} loading="lazy" className={`h-full w-full object-cover ${pos} transition-transform duration-700 group-hover:scale-105`}/></div><div className="absolute inset-0 bg-linear-to-t from-primary via-transparent to-transparent"/><div className="absolute inset-x-0 bottom-0 p-7"><span className="mb-4 block h-px w-10 bg-accent transition-all duration-500 group-hover:w-20"/><h3 className="text-3xl">{title}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-primary-foreground/70">{text}</p></div></article>)}</div></div></section>

    <section id="menu" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32"><div className="mx-auto max-w-[1500px]"><div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]"><div><p className="text-xs uppercase tracking-[.24em] text-accent">Worth Trying</p><h2 className="mt-4 max-w-3xl text-5xl leading-none text-primary sm:text-7xl">A Few Things<br/><em>We’d Start With.</em></h2></div><Button variant="ghost" onClick={() => setMenuOpen(true)} className="w-fit px-0 text-primary hover:bg-transparent hover:text-accent">Explore the Full Menu <ArrowRight/></Button></div><div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_.8fr]"><div className="overflow-hidden"><img src={foodImage} alt="Germinnaa signature dishes including hummus, charred prawns, fish and pizza" width="1600" height="1200" loading="lazy" className="aspect-[4/3] h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.02]"/></div><div className="flex flex-col justify-center">{dishes.map(([name,desc],i) => <button key={name} onClick={() => setMenuOpen(true)} className="group grid grid-cols-[auto_1fr] gap-5 border-b border-border py-5 text-left"><span className="font-serif text-lg text-accent">0{i+1}</span><span><strong className="block font-serif text-2xl font-medium text-primary transition-colors group-hover:text-accent">{name}</strong><small className="mt-1 block leading-5 text-muted-foreground">{desc}</small></span></button>)}</div></div></div></section>

    <section className="relative min-h-[70svh] overflow-hidden"><img src={heroImage} alt="Germinnaa dining room glowing in the evening" width="1920" height="1280" loading="lazy" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-primary/55"/><div className="relative z-10 flex min-h-[70svh] items-center justify-center px-5 text-center text-primary-foreground"><h2 className="text-5xl leading-none sm:text-8xl">Come Hungry.<br/><em>Leave With a Memory.</em></h2></div></section>

    <section className="bg-secondary px-5 py-24 sm:px-8 lg:px-12 lg:py-32"><div className="mx-auto max-w-[1500px]"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><div><p className="text-xs uppercase tracking-[.24em] text-accent">Why people come back</p><h2 className="mt-4 text-5xl leading-none text-primary sm:text-6xl">Made for<br/><em>many moods.</em></h2></div><div>{[[Sparkles,"Thoughtful Flavours","Globally inspired dishes crafted with personality."],[CalendarDays,"Beautiful Atmosphere","A cozy, elegant space designed for conversations and moments."],[Users,"Warm Hospitality","Friendly service that makes every visit feel personal."],[Clock3,"Something for Every Mood","From slow coffees to long dinners and everything in between."]].map(([Icon,title,text],i) => <div key={String(title)} className="grid grid-cols-[auto_1fr] gap-5 border-t border-accent/35 py-7 sm:grid-cols-[70px_1fr_1fr] sm:items-center"><span className="font-serif text-xl text-accent">0{i+1}</span><span className="flex items-center gap-4 font-serif text-2xl text-primary"><Icon className="size-5 stroke-1 text-accent"/>{title}</span><p className="col-start-2 text-sm leading-6 text-muted-foreground sm:col-start-3">{text}</p></div>)}</div></div></div></section>

    <section className="bg-primary px-5 py-24 text-primary-foreground sm:px-8 lg:px-12 lg:py-32"><div className="mx-auto max-w-5xl text-center"><p className="text-xs uppercase tracking-[.24em] text-accent">What guests remember</p><h2 className="mt-4 text-5xl sm:text-7xl">Loved Beyond the Table.</h2><blockquote className="mx-auto mt-12 max-w-4xl font-serif text-3xl leading-snug text-primary-foreground/90 sm:text-5xl">“A beautiful balance of cozy ambience, thoughtful food, warm service, and interiors made for lingering.”</blockquote><p className="mt-8 text-xs uppercase tracking-[.18em] text-primary-foreground/50">A reflection of recurring guest sentiment</p></div></section>

    <section id="gallery" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-32"><div className="mx-auto max-w-[1500px]"><div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs uppercase tracking-[.24em] text-accent">Visual diary</p><h2 className="mt-4 text-5xl text-primary sm:text-7xl">A Little Look Inside.</h2></div><a href="https://www.instagram.com/germinnaa/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:text-accent"><Instagram className="size-4"/> Follow Our Journey <ArrowRight className="size-4"/></a></div><div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">{[[ambienceImage,"An intimate table by the window","row-span-2 aspect-[3/5] md:aspect-auto"],[foodImage,"A table of signature plates","aspect-square md:col-span-2"],[dessertImage,"Coffee, cheesecake and mango slush","aspect-square"],[heroImage,"The warmly lit dining room","aspect-square"],[foodImage,"Fire-kissed seafood and pizza","aspect-square md:col-span-2"]].map(([src,alt,classes],i) => <div key={i} className={`group overflow-hidden ${classes}`}><img src={src} alt={alt} loading="lazy" width="1000" height="1000" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"/></div>)}</div></div></section>

    <section id="visit" className="grid bg-secondary lg:grid-cols-2"><div className="px-6 py-24 sm:px-12 lg:px-20 lg:py-28"><p className="text-xs uppercase tracking-[.24em] text-accent">Visit Germinnaa</p><h2 className="mt-4 text-5xl text-primary sm:text-7xl">Your Table Awaits.</h2><div className="mt-10 grid gap-8 text-sm leading-7 sm:grid-cols-2"><div><h3 className="font-sans text-xs font-semibold uppercase tracking-[.16em] text-accent">Germinnaa</h3><address className="mt-3 not-italic text-muted-foreground">Ground Floor, P-557, Hemanta Mukhopadhyay Sarani,<br/>Lake Road, CIT Scheme 47,<br/>Kolkata, West Bengal – 700029</address></div><div><h3 className="font-sans text-xs font-semibold uppercase tracking-[.16em] text-accent">Opening Hours</h3><p className="mt-3 text-muted-foreground">Every Day<br/>11:00 AM – 11:00 PM</p><h3 className="mt-6 font-sans text-xs font-semibold uppercase tracking-[.16em] text-accent">Contact</h3><a href="tel:+919147711641" className="mt-3 block text-primary">+91 91477 11641</a></div></div><div className="mt-10 flex flex-wrap gap-3"><Button asChild className="h-12 bg-primary"><a href={directionsUrl} target="_blank" rel="noreferrer"><MapPin/> Get Directions</a></Button><Button asChild variant="outline" className="h-12 border-accent bg-transparent text-primary"><a href="tel:+919147711641"><Phone/> Call Us</a></Button><Button onClick={reserve} variant="outline" className="h-12 border-accent bg-transparent text-primary"><CalendarDays/> Reserve</Button></div></div><div className="min-h-[520px] bg-muted">{mapKey ? <iframe title="Map showing Germinnaa in Southern Avenue, Kolkata" className="h-full min-h-[520px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps/embed/v1/place?key=${mapKey}&q=${encodeURIComponent(mapAddress)}`}/> : <a href={directionsUrl} target="_blank" rel="noreferrer" className="flex h-full min-h-[520px] items-center justify-center text-primary"><MapPin className="mr-2"/> Open Germinnaa in Google Maps</a>}</div></section>

    <section className="grain bg-primary px-5 py-24 text-center text-primary-foreground sm:px-8 lg:py-32"><div className="mx-auto max-w-4xl"><span className="mx-auto mb-8 block h-16 w-px bg-accent"/><h2 className="text-5xl leading-none sm:text-7xl">Some Places Feed You.<br/><em>Some Places Stay With You.</em></h2><p className="mt-6 text-primary-foreground/65">Come experience Germinnaa.</p><Button onClick={reserve} className="mt-9 h-14 bg-accent px-9 text-accent-foreground">Reserve Your Table <ArrowRight/></Button></div></section>

    <footer className="border-t border-primary-foreground/15 bg-primary px-5 py-12 text-primary-foreground sm:px-8 lg:px-12"><div className="mx-auto grid max-w-[1500px] gap-10 md:grid-cols-[1fr_auto] md:items-end"><div><Logo light/><p className="mt-5 max-w-sm text-sm leading-6 text-primary-foreground/55">Soft warmth, thoughtful flavours, and beautiful moments in the heart of Southern Avenue.</p></div><div className="flex flex-col gap-3 text-sm text-primary-foreground/65 md:items-end"><div className="flex flex-wrap gap-5">{navItems.slice(1).map(([label,id]) => <a key={id} href={`#${id}`} className="hover:text-accent">{label}</a>)}<a href="https://www.instagram.com/germinnaa/" target="_blank" rel="noreferrer" className="hover:text-accent">Instagram</a></div><p>© 2026 Germinnaa. All rights reserved.</p></div></div></footer>

    <ReservationDialog open={reserveOpen} onOpenChange={setReserveOpen}/>
    <Dialog open={menuOpen} onOpenChange={setMenuOpen}><DialogContent className="max-h-[90vh] overflow-y-auto border-accent/40 bg-background p-7 sm:p-10"><DialogHeader><p className="text-xs uppercase tracking-[.22em] text-accent">Worth Trying</p><DialogTitle className="text-4xl text-primary">The Germinnaa edit.</DialogTitle><DialogDescription>A considered glimpse of our favourites. No prices are shown until the official menu is connected.</DialogDescription></DialogHeader><div className="mt-4">{dishes.map(([name,desc]) => <div key={name} className="border-t border-border py-5"><h3 className="text-2xl text-primary">{name}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{desc}</p></div>)}</div><p className="text-xs text-muted-foreground">The official full menu link can be added here when available.</p></DialogContent></Dialog>
  </main>;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Germinnaa | Fine Dining & Contemporary Café in Kolkata" },
      { name: "description", content: "Discover Germinnaa in Southern Avenue, Kolkata — a warm and elegant dining destination for globally inspired flavours, beautiful ambience, coffee, desserts and unforgettable moments." },
      { property: "og:title", content: "Germinnaa | Fine Dining & Contemporary Café in Kolkata" },
      { property: "og:description", content: "Thoughtful flavours, beautiful surroundings, and warm hospitality in Southern Avenue, Kolkata." },
      { property: "og:type", content: "restaurant" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": ["Restaurant", "LocalBusiness"], name: "Germinnaa", telephone: "+91 91477 11641", servesCuisine: ["European", "Continental", "Italian", "Global"], address: { "@type": "PostalAddress", streetAddress: "Ground Floor, P-557, Hemanta Mukhopadhyay Sarani, Lake Road, CIT Scheme 47", addressLocality: "Kolkata", addressRegion: "West Bengal", postalCode: "700029", addressCountry: "IN" }, openingHours: "Mo-Su 11:00-23:00" }) }],
  }),
  component: Index,
});
