import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Search,
  ShieldCheck,
  Sprout,
  Star,
  Tractor,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

import Footer from "../components/Footer.jsx";

const categories = [
  { title: "Tractors", icon: Tractor, tone: "bg-emerald-100 text-emerald-700" },
  { title: "Harvesters", icon: Sprout, tone: "bg-amber-100 text-amber-700" },
  { title: "Tillers", icon: Wrench, tone: "bg-sky-100 text-sky-700" },
  { title: "Sprayers", icon: Tractor, tone: "bg-lime-100 text-lime-700" },
];

const steps = [
  { number: "01", title: "Tell us where you farm", description: "Use your city, district, or current location to see nearby machines." },
  { number: "02", title: "Compare local options", description: "Review owners, pricing, ratings, pickup areas, and available dates." },
  { number: "03", title: "Book when you need it", description: "Reserve trusted equipment without buying machinery you use occasionally." },
];

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const submitSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (location.trim()) params.set("location", location.trim());

    navigate(`/equipment${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="overflow-hidden bg-[#f6faf7] text-slate-900">
      <main>
        <section className="relative px-6 pb-16 pt-12 sm:pt-20 lg:pb-24">
          <div className="pointer-events-none absolute right-[-12rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-emerald-100/60 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Equipment for the work ahead
              </div>
              <h1 className="mt-7 max-w-xl text-5xl font-black leading-[1.02] tracking-tight text-[#102a43] sm:text-6xl lg:text-7xl">
                The right machine is closer than you think.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                AgriNext helps farmers find and rent trusted tractors, harvesters,
                tillers, and more from owners in their area.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-emerald-600" /> Verified owners</span>
                <span className="inline-flex items-center gap-2"><MapPin size={17} className="text-emerald-600" /> Local pickup areas</span>
                <span className="inline-flex items-center gap-2"><Wallet size={17} className="text-emerald-600" /> Pay only when needed</span>
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/equipment" className="inline-flex items-center gap-3 rounded-xl bg-emerald-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:bg-emerald-700">
                  Browse nearby equipment <ArrowRight size={19} />
                </Link>
                <Link to="/login" className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700">
                  Owner sign in <ArrowRight size={19} />
                </Link>
              </div>
            </div>

            <div className="relative min-h-[30rem] overflow-hidden rounded-[2rem] bg-[#173957] shadow-2xl shadow-slate-300/50">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=85"
                alt="Green agricultural field at sunrise"
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102a43] via-[#102a43]/15 to-transparent" />
              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-3 text-sm font-bold text-[#102a43] shadow-xl backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Explore equipment listings
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-[#102a43]/90 p-5 text-white backdrop-blur-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Available near you</p>
                    <h2 className="mt-2 text-2xl font-bold">Lucknow and nearby districts</h2>
                    <p className="mt-2 text-sm text-slate-300">Tractors, tillers, and harvesters ready for the next job.</p>
                  </div>
                  <MapPin className="mt-1 shrink-0 text-emerald-300" size={23} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 px-6">
          <form onSubmit={submitSearch} className="mx-auto grid max-w-7xl gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 md:grid-cols-[1.15fr_1fr_auto] md:p-5">
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-50">
              <Search className="shrink-0 text-emerald-600" size={20} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} className="h-12 w-full bg-transparent text-sm outline-none" placeholder="What equipment do you need?" />
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-50">
              <MapPin className="shrink-0 text-emerald-600" size={20} />
              <input value={location} onChange={(event) => setLocation(event.target.value)} className="h-12 w-full bg-transparent text-sm outline-none" placeholder="City, district, or village" />
            </label>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#102a43] px-7 py-3 font-bold text-white transition hover:bg-[#173957]">
              Find equipment <Search size={18} />
            </button>
          </form>
        </section>

        <section id="about" className="px-6 py-20">
          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [Tractor, "Equipment", "Browse rental listings"],
              [Users, "Farmers", "Create an account to book"],
              [MapPin, "Local search", "Filter by equipment location"],
              [Star, "Transparent rates", "Compare daily prices"],
            ].map(([Icon, value, label]) => (
              <div key={label} className="border-l-2 border-emerald-500 bg-white px-6 py-5 shadow-sm">
                <Icon size={22} className="text-emerald-600" />
                <p className="mt-4 text-3xl font-black text-[#102a43]">{value}</p>
                <p className="mt-1 text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Start with the job</p>
                <h2 className="mt-3 max-w-2xl text-4xl font-black tracking-tight text-[#102a43] sm:text-5xl">Find the equipment your farm needs.</h2>
              </div>
              <Link to="/equipment" className="inline-flex items-center gap-2 font-bold text-emerald-700">View all equipment <ArrowRight size={18} /></Link>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map(({ title, icon: Icon, tone }) => (
                <Link key={title} to={`/equipment?search=${title}`} className="group border border-slate-200 bg-[#f8fbf9] p-6 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone}`}><Icon size={28} /></div>
                  <h3 className="mt-7 text-xl font-black text-[#102a43]">{title}</h3>
                  <p className="mt-2 text-sm text-slate-500">Browse available {title.toLowerCase()} listings</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">Explore <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Simple by design</p>
                <h2 className="mt-3 text-4xl font-black tracking-tight text-[#102a43] sm:text-5xl">From field need to booked machine.</h2>
                <p className="mt-5 max-w-md leading-7 text-slate-600">A local rental marketplace for farmers who need dependable equipment without the cost of owning every machine.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {steps.map((step) => (
                  <div key={step.number} className="border-t-2 border-emerald-500 bg-white p-6 shadow-sm">
                    <span className="text-sm font-black text-emerald-700">{step.number}</span>
                    <h3 className="mt-8 text-xl font-black text-[#102a43]">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto grid max-w-7xl gap-8 overflow-hidden rounded-[2rem] bg-[#102a43] p-8 text-white md:grid-cols-[1fr_auto] md:items-center md:p-12">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-300"><Tractor size={17} /> For equipment owners</div>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl">Put your idle equipment to work.</h2>
              <p className="mt-4 max-w-2xl leading-7 text-slate-300">Create an equipment owner account to list your machines and respond to rental requests from local farmers.</p>
            </div>
            <Link to="/login" className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-400 px-6 py-3.5 font-bold text-[#102a43] transition hover:bg-emerald-300">Owner sign in <ArrowRight size={19} /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;