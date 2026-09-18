import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { ArrowDown, ArrowRight, CalendarDays, Check, Instagram, MapPin, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import logoAsset from "@/assets/germinnaa-logo.png.asset.json";
import skewersAsset from "@/assets/germinnaa-skewers.png.asset.json";
import greenInteriorAsset from "@/assets/germinnaa-green-interior.png.asset.json";
import coffeeAsset from "@/assets/germinnaa-coffee.png.asset.json";
import exteriorAsset from "@/assets/germinnaa-exterior.webp.asset.json";
import archedInteriorAsset from "@/assets/germinnaa-arched-interior.png.asset.json";
import pizzaAsset from "@/assets/germinnaa-pizza.png.asset.json";
import berrySlushAsset from "@/assets/germinnaa-berry-slush.png.asset.json";
import croissantAsset from "@/assets/germinnaa-croissant.png.asset.json";
import snackPlatterAsset from "@/assets/germinnaa-snack-platter.png.asset.json";
import nightExteriorAsset from "@/assets/germinnaa-night-exterior.png.asset.json";
import stuffedDishAsset from "@/assets/germinnaa-stuffed-dish.webp.asset.json";

const heroImage = pizzaAsset.url;
const ambienceImage = greenInteriorAsset.url;
const foodImage = skewersAsset.url;
const dessertImage = coffeeAsset.url;
const exteriorImage = exteriorAsset.url;
const archedInteriorImage = archedInteriorAsset.url;
const berrySlushImage = berrySlushAsset.url;
const croissantImage = croissantAsset.url;
const snackPlatterImage = snackPlatterAsset.url;
const nightExteriorImage = nightExteriorAsset.url;
const stuffedDishImage = stuffedDishAsset.url;

const mapKey = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
const mapAddress = "Germinnaa, P-557 Hemanta Mukhopadhyay Sarani, Kolkata, West Bengal 700029";
const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapAddress)}`;
const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapAddress)}&output=embed`;

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
  "Classic Hummus with Laffa Pita",
  "Charred Prawns with Hot Honey Glaze",
  "Crusted Bhetki",
  "Romana Potato Cheese",
  "Napoletana",
  "Truffles & Mozzarella",
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
       {submitted ? <div className="py-10 text-center animate-rise"><span className="mx-auto mb-6 grid size-14 place-items-center rounded-full border border-accent text-accent"><Check/></span><DialogTitle className="text-4xl text-primary">Your request has been recorded.</DialogTitle><DialogDescription className="mx-auto mt-4 max-w-sm text-base leading-7">Please confirm your reservation directly with Germinnaa by phone.</DialogDescription><Button asChild className="mt-8 h-12 bg-primary px-7"><a href="tel:+919147711641"><Phone/> Call Germinnaa</a></Button></div> : <>
        <DialogHeader><p className="mb-2 text-xs font-semibold uppercase tracking-[.22em] text-accent">Reserve a moment</p><DialogTitle className="text-4xl text-primary">Your table awaits.</DialogTitle><DialogDescription className="pt-2 leading-6">Share your preferred details and we’ll prepare your reservation request.</DialogDescription></DialogHeader>
        <form className="mt-3 grid gap-5" onSubmit={submit} noValidate>
           <div><Label htmlFor="name">Name</Label><Input id="name" name="name" autoComplete="name" maxLength={80} className="mt-2 h-12" placeholder="Your name"/><p className="mt-1 text-xs text-destructive">{errors["name"]}</p></div>
           <div><Label htmlFor="phone">Phone number</Label><Input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={18} className="mt-2 h-12" placeholder="+91 98765 43210"/><p className="mt-1 text-xs text-destructive">{errors["phone"]}</p></div>
           <div className="grid gap-5 sm:grid-cols-2"><div><Label htmlFor="date">Date</Label><Input id="date" name="date" type="date" min={new Date().toISOString().split("T")[0]} className="mt-2 h-12"/><p className="mt-1 text-xs text-destructive">{errors["date"]}</p></div><div><Label htmlFor="time">Time</Label><Input id="time" name="time" type="time" min="11:00" max="23:00" className="mt-2 h-12"/><p className="mt-1 text-xs text-destructive">{errors["time"]}</p></div></div>
           <div><Label>Number of guests</Label><Select value={guests} onValueChange={setGuests}><SelectTrigger className="mt-2 h-12"><SelectValue placeholder="Select party size"/></SelectTrigger><SelectContent>{["1","2","3","4","5","6","7","8+"].map((n) => <SelectItem key={n} value={n}>{n} {n === "1" ? "guest" : "guests"}</SelectItem>)}</SelectContent></Select><p className="mt-1 text-xs text-destructive">{errors["guests"]}</p></div>
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
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 32);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);
  const reserve = () => setReserveOpen(true);
  return <main className="bg-background text-foreground">
    <header className={`fixed inset-x-0 top-0 z-40 text-primary-foreground transition-all duration-500 ${scrolled || mobileOpen ? "border-b border-primary-foreground/15 bg-primary/94 shadow-sm backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto grid h-17 max-w-[1500px] grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 px-5 sm:px-8 lg:grid-cols-[auto_1fr_auto] lg:px-12"><Logo light/><nav className="hidden justify-center gap-8 lg:flex" aria-label="Main navigation">{navItems.map(([label,id]) => <a key={id} href={`#${id}`} className="nav-link text-[11px] font-medium uppercase tracking-[.14em] text-primary-foreground/78 transition-colors hover:text-primary-foreground">{label}</a>)}</nav><Button onClick={reserve} variant="outline" className="h-9 border-accent bg-transparent px-3 text-[11px] uppercase tracking-[.1em] text-primary-foreground hover:bg-accent hover:text-accent-foreground sm:px-5 lg:h-10">Reserve<span className="hidden sm:inline"> a Table</span></Button><Button variant="ghost" size="icon" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-accent lg:hidden">{mobileOpen ? <X/> : <Menu/>}</Button></div>
      <nav className={`overflow-hidden border-primary-foreground/15 bg-primary transition-[max-height,opacity] duration-500 lg:hidden ${mobileOpen ? "max-h-[520px] border-t opacity-100" : "max-h-0 opacity-0"}`} aria-label="Mobile navigation"> <div className="px-6 py-7">{navItems.map(([label,id]) => <a key={id} href={`#${id}`} onClick={() => setMobileOpen(false)} className="block border-b border-primary-foreground/10 py-3 font-serif text-2xl">{label}</a>)}<Button onClick={() => { setMobileOpen(false); reserve(); }} className="mt-6 h-12 w-full bg-accent text-accent-foreground">Reserve a Table</Button></div></nav>
    </header>

    <section id="home" className="grain relative flex min-h-[92svh] items-center overflow-hidden bg-primary text-primary-foreground lg:min-h-[94svh]">
      <img src={heroImage} alt="Germinnaa signature pizza with parmesan, rocket, herbs and chilli" width="1152" height="768" className="absolute inset-0 h-full w-full object-cover object-[58%_center] sm:object-center" fetchPriority="high"/>
      <div className="absolute inset-0 bg-primary/38 sm:bg-primary/30"/><div className="absolute inset-0 bg-linear-to-r from-primary/88 via-primary/35 to-transparent"/>
      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 pb-16 pt-28 sm:px-8 lg:px-12 lg:pb-20 lg:pt-28"><p className="mb-6 text-xs font-semibold uppercase tracking-[.26em] text-accent animate-rise">Southern Avenue · Kolkata</p><h1 className="max-w-5xl text-[52px] font-medium leading-[.91] sm:text-7xl lg:text-[88px] xl:text-[96px]">More Than a Meal.<br/><em className="font-normal">A Moment to Stay In.</em></h1><p className="mt-7 max-w-xl text-base leading-7 text-primary-foreground/82 sm:text-lg sm:leading-8">Thoughtfully crafted flavours, beautiful surroundings, and the kind of warmth that makes you want to stay a little longer.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Button onClick={reserve} className="h-13 bg-accent px-7 text-accent-foreground hover:bg-accent/90">Reserve Your Table <ArrowRight/></Button><Button asChild variant="outline" className="h-13 border-primary-foreground/45 bg-transparent px-7 text-primary-foreground hover:bg-primary-foreground hover:text-primary"><a href="#experience">Explore the Experience</a></Button></div></div>
      <a href="#story" aria-label="Scroll to our story" className="absolute bottom-7 right-7 z-10 grid size-12 place-items-center rounded-full border border-primary-foreground/35 text-primary-foreground animate-drift sm:right-10"><ArrowDown className="size-4"/></a>
    </section>

    <section id="story" className="grid bg-secondary lg:min-h-[760px] lg:grid-cols-[1.06fr_.94fr]"><div className="min-h-[520px] overflow-hidden sm:min-h-[620px]"><img src={archedInteriorImage} alt="Germinnaa's warmly lit dining room framed by a decorated arch" width="1200" height="1600" loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.025]"/></div><div className="flex items-center px-6 py-20 sm:px-12 lg:px-20"><div className="max-w-xl"><p className="text-xs font-semibold uppercase tracking-[.24em] text-accent">The Germinnaa Experience</p><div className="my-7 h-px w-20 bg-accent"/><h2 className="text-5xl font-medium leading-[.96] text-primary sm:text-7xl">Soft Warmth.<br/><em className="font-normal">Slow Indulgence.</em></h2><p className="mt-8 max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">Germinnaa is a place where flavours are explored slowly and moments are meant to linger. From comforting classics to globally inspired creations, every visit is designed to feel a little special.</p></div></div></section>

    <section id="experience" className="bg-primary px-5 py-24 text-primary-foreground sm:px-8 lg:px-12 lg:py-30"><div className="mx-auto max-w-[1500px]"><p className="text-xs uppercase tracking-[.24em] text-accent">What brings you here?</p><h2 className="mt-4 max-w-3xl text-5xl leading-[.96] sm:text-7xl">Every Visit Has<br/><em>Its Own Story.</em></h2><div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-5">
      {[["For the Date Night","Warm light, shared plates, unhurried conversation.",ambienceImage,"object-center"],["For the Slow Afternoon","Coffee, something sweet, and nowhere else to be.",croissantImage,"object-center"],["For the Food Lovers","A table filled with dishes worth discovering.",stuffedDishImage,"object-center"]].map(([title,text,img,pos],i) => <article key={title} className={`group ${i===1 ? "md:mt-16" : ""}`}><div className="aspect-[4/5] overflow-hidden"><img src={img} alt={title} width={i===0?1200:1600} height={i===0?1600:1200} loading="lazy" className={`h-full w-full object-cover ${pos} transition-transform duration-700 group-hover:scale-[1.03]`}/></div><div className="pt-6"><span className="text-xs font-semibold tracking-[.16em] text-accent">0{i+1}</span><h3 className="mt-3 text-3xl uppercase">{title}</h3><p className="mt-2 max-w-sm text-base leading-7 text-primary-foreground/68">{text}</p></div></article>)}</div></div></section>

    <section id="menu" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-30"><div className="mx-auto max-w-[1500px]"><div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]"><div><p className="text-xs uppercase tracking-[.24em] text-accent">The Kitchen Behind It</p><h2 className="mt-4 max-w-3xl text-5xl leading-[.96] text-primary sm:text-7xl">A Few Things<br/><em>We’d Start With.</em></h2></div><Button variant="ghost" onClick={() => setMenuOpen(true)} className="w-fit px-0 text-sm uppercase tracking-[.12em] text-primary hover:bg-transparent hover:text-accent">View Menu <ArrowRight/></Button></div><div className="mt-14 grid gap-10 lg:grid-cols-[1.15fr_.85fr]"><div className="overflow-hidden"><img src={foodImage} alt="Grilled skewers with vegetables and fresh salad at Germinnaa" width="1600" height="1200" loading="lazy" className="aspect-[4/3] h-full w-full object-cover transition-transform duration-1000 hover:scale-[1.025]"/></div><div className="flex flex-col justify-center">{dishes.map((name,i) => <button key={name} onClick={() => setMenuOpen(true)} className="group grid min-h-17 grid-cols-[36px_1fr] items-center gap-4 border-b border-border py-4 text-left"><span className="font-serif text-lg text-accent">0{i+1}</span><strong className="block font-serif text-[25px] font-medium leading-tight text-primary transition-colors group-hover:text-accent sm:text-[28px]">{name}</strong></button>)}</div></div></div></section>

    <section className="relative min-h-[62svh] overflow-hidden lg:min-h-[70svh]"><img src={nightExteriorImage} alt="Germinnaa's illuminated green entrance and striped awnings at night" width="768" height="1024" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center sm:object-[center_58%]"/><div className="absolute inset-0 bg-primary/38"/><div className="relative z-10 flex min-h-[62svh] items-center justify-center px-5 text-center text-primary-foreground lg:min-h-[70svh]"><h2 className="text-5xl leading-[.94] sm:text-8xl lg:text-[92px]">Come Hungry.<br/><em>Leave With a Memory.</em></h2></div></section>

    <section id="gallery" className="px-5 py-24 sm:px-8 lg:px-12 lg:py-30"><div className="mx-auto max-w-[1500px]"><div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end"><div><p className="text-xs uppercase tracking-[.24em] text-accent">A Little Look Inside</p><h2 className="mt-4 text-5xl leading-[.96] text-primary sm:text-7xl">Made for <em>Lingering.</em></h2></div><a href="https://www.instagram.com/germinnaa/" target="_blank" rel="noreferrer" className="nav-link flex w-fit items-center gap-2 text-sm font-medium uppercase tracking-[.1em] text-primary hover:text-accent"><Instagram className="size-4"/> @GERMINNAA <ArrowRight className="size-4"/></a></div><div className="mt-14 grid grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-12">{[[archedInteriorImage,"Germinnaa dining room framed by a decorated arch","col-span-2 aspect-[4/5] md:col-span-5 md:row-span-3 md:aspect-auto"],[berrySlushImage,"A berry slush garnished with mint and lime","col-span-1 aspect-square md:col-span-3 md:row-span-1 md:aspect-auto"],[snackPlatterImage,"A sharing platter with crisp bites and fries","col-span-1 aspect-square md:col-span-4 md:row-span-1 md:aspect-auto"],[foodImage,"Grilled skewers with vegetables and fresh salad","col-span-2 aspect-[4/3] md:col-span-7 md:row-span-2 md:aspect-auto"],[dessertImage,"Freshly made coffee with biscuits and roasted beans","col-span-1 aspect-[4/5] md:col-span-3 md:row-span-2 md:aspect-auto"],[stuffedDishImage,"Stuffed baked dishes with fresh ribbon salad","col-span-1 aspect-[4/5] md:col-span-4 md:row-span-2 md:aspect-auto"],[ambienceImage,"The emerald and ivory dining room at Germinnaa","col-span-2 aspect-[4/3] md:col-span-5 md:row-span-2 md:aspect-auto"],[croissantImage,"A berry-topped croissant at Germinnaa","col-span-2 aspect-[4/3] md:col-span-5 md:row-span-2 md:aspect-auto"],[exteriorImage,"The welcoming green exterior of Germinnaa","col-span-2 aspect-[16/10] md:col-span-7 md:row-span-2 md:aspect-auto"]].map(([src,alt,classes],i) => <figure key={i} className={`group relative overflow-hidden ${classes}`}><img src={src} alt={alt} loading="lazy" width="1000" height="1000" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"/><span className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/10"/></figure>)}</div></div></section>

    <section className="bg-primary px-5 py-24 text-primary-foreground sm:px-8 lg:px-12 lg:py-28"><div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.7fr_1.3fr] lg:items-end"><div><p className="text-xs uppercase tracking-[.24em] text-accent">Why People Come Back</p><h2 className="mt-5 text-5xl leading-[.96] sm:text-6xl">Good food.<br/>Warm spaces.<br/><em>Time well spent.</em></h2></div><p className="max-w-2xl border-t border-primary-foreground/20 pt-7 text-lg leading-8 text-primary-foreground/72 lg:justify-self-end lg:text-xl">An easygoing table in Southern Avenue for slow coffees, shared plates, long dinners, and the moments in between.</p></div></section>

    <section id="visit" className="grid bg-secondary lg:grid-cols-[.92fr_1.08fr]"><div className="px-6 py-24 sm:px-12 lg:px-16 lg:py-28 xl:px-20"><p className="text-xs uppercase tracking-[.24em] text-accent">Visit Germinnaa</p><h2 className="mt-4 text-5xl leading-[.96] text-primary sm:text-7xl">Your Table Awaits.</h2><div className="mt-10 grid gap-8 text-base leading-8 sm:grid-cols-2 sm:text-lg"><div><h3 className="font-sans text-xs font-semibold uppercase tracking-[.16em] text-accent">Germinnaa</h3><address className="mt-3 not-italic text-foreground/72">Ground Floor, P-557, Hemanta Mukhopadhyay Sarani,<br/>47, Lake Rd, CIT Scheme 47,<br/>Kolkata, West Bengal 700029</address></div><div><h3 className="font-sans text-xs font-semibold uppercase tracking-[.16em] text-accent">Opening Hours</h3><p className="mt-3 text-foreground/72">Daily · 11:00 AM – 11:00 PM</p><h3 className="mt-6 font-sans text-xs font-semibold uppercase tracking-[.16em] text-accent">Phone</h3><a href="tel:+919147711641" className="mt-3 block font-medium text-primary hover:text-accent">+91 91477 11641</a></div></div><div className="mt-10 grid gap-3 sm:grid-cols-3"><Button asChild className="h-12 bg-primary text-xs uppercase tracking-[.08em]"><a href={directionsUrl} target="_blank" rel="noreferrer"><MapPin/> Get Directions</a></Button><Button asChild variant="outline" className="h-12 border-accent bg-transparent text-xs uppercase tracking-[.08em] text-primary"><a href="tel:+919147711641"><Phone/> Call Us</a></Button><Button onClick={reserve} variant="outline" className="h-12 border-accent bg-transparent text-xs uppercase tracking-[.08em] text-primary"><CalendarDays/> Reserve</Button></div></div><div className="min-h-[440px] bg-muted lg:min-h-[620px]"><iframe title="Map showing Germinnaa in Southern Avenue, Kolkata" className="h-full min-h-[440px] w-full border-0 lg:min-h-[620px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={mapEmbedUrl}/></div></section>

    <section className="grain bg-primary px-5 py-28 text-center text-primary-foreground sm:px-8 lg:py-36"><div className="mx-auto max-w-5xl"><span className="mx-auto mb-9 block h-16 w-px bg-accent"/><h2 className="text-5xl leading-[.95] sm:text-7xl lg:text-[80px]">Some Places Feed You.<br/><em>Some Places Stay With You.</em></h2><p className="mt-7 text-lg text-primary-foreground/68">Come experience Germinnaa.</p><Button onClick={reserve} className="mt-10 h-14 bg-accent px-9 text-accent-foreground">Reserve Your Table <ArrowRight/></Button></div></section>

    <footer className="border-t border-primary-foreground/15 bg-foreground px-5 py-14 text-primary-foreground sm:px-8 lg:px-12 lg:py-18"><div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[1.1fr_.9fr_auto]"><div><Logo light/><p className="mt-5 max-w-sm text-base leading-7 text-primary-foreground/60">Soft warmth, thoughtful flavours, and beautiful moments in Southern Avenue.</p><Button onClick={reserve} variant="outline" className="mt-6 h-11 border-accent bg-transparent text-primary-foreground hover:bg-accent hover:text-accent-foreground">Reserve a Table</Button></div><div className="text-base leading-7 text-primary-foreground/65"><p>Ground Floor, P-557,<br/>Hemanta Mukhopadhyay Sarani,<br/>47, Lake Rd, Kolkata 700029</p><a href="tel:+919147711641" className="mt-4 block hover:text-accent">+91 91477 11641</a><p>Daily · 11:00 AM – 11:00 PM</p></div><nav className="grid content-start gap-3 text-sm text-primary-foreground/65" aria-label="Footer navigation">{navItems.slice(1).map(([label,id]) => <a key={id} href={`#${id}`} className="hover:text-accent">{label}</a>)}<a href="https://www.instagram.com/germinnaa/" target="_blank" rel="noreferrer" className="hover:text-accent">@GERMINNAA</a></nav></div><div className="mx-auto mt-12 max-w-[1500px] border-t border-primary-foreground/12 pt-6 text-sm text-primary-foreground/45">© 2026 Germinnaa. All rights reserved.</div></footer>

    <ReservationDialog open={reserveOpen} onOpenChange={setReserveOpen}/>
    <Dialog open={menuOpen} onOpenChange={setMenuOpen}><DialogContent className="max-h-[90vh] overflow-y-auto border-accent/40 bg-background p-7 sm:p-10"><DialogHeader><p className="text-xs uppercase tracking-[.22em] text-accent">The Kitchen Behind It</p><DialogTitle className="text-4xl text-primary">A few things we’d start with.</DialogTitle><DialogDescription>A restrained selection associated with Germinnaa. Please ask the restaurant for the current menu and availability.</DialogDescription></DialogHeader><div className="mt-4">{dishes.map((name) => <div key={name} className="border-t border-border py-5"><h3 className="text-2xl text-primary">{name}</h3></div>)}</div><Button asChild className="h-12 bg-primary"><a href="tel:+919147711641"><Phone/> Ask Germinnaa</a></Button></DialogContent></Dialog>
  </main>;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Germinnaa | Contemporary Dining in Kolkata" },
      { name: "description", content: "Discover Germinnaa on Southern Avenue, Kolkata—thoughtful food, coffee, warm interiors, and unhurried dining from 11 AM to 11 PM daily." },
      { property: "og:title", content: "Germinnaa | Contemporary Dining in Kolkata" },
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
