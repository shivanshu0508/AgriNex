import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  LocateFixed,
  MapPin,
  Search,
  SlidersHorizontal,
  Tractor,
  X,
} from "lucide-react";
import EquipmentCard from "../components/EquipmentCard.jsx";
import LocationAutocomplete from "../components/LocationAutocomplete.jsx";
import { api } from "../lib/api";

const categories = [
  { label: "All", value: "" },
  { label: "Tractors", value: "tractor" },
  { label: "Ploughs", value: "plough" },
  { label: "Cultivators", value: "cultivator" },
  { label: "Seed drills", value: "seed_drill" },
  { label: "Harvesters", value: "harvester" },
  { label: "Sprayers", value: "sprayer" },
  { label: "Rotavators", value: "rotavator" },
  { label: "Irrigation", value: "irrigation" },
  { label: "Threshers", value: "thresher" },
  { label: "Other", value: "other" },
];

const categoryLabels = Object.fromEntries(
  categories.filter(({ value }) => value).map(({ label, value }) => [value, label])
);

const priceRanges = {
  any: {},
  under1000: { maxPrice: "999" },
  "1000to2000": { minPrice: "1000", maxPrice: "2000" },
  "2000to5000": { minPrice: "2000", maxPrice: "5000" },
  over5000: { minPrice: "5001" },
};

function Equipment() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState(() => searchParams.get("location") || "");
  const [priceRange, setPriceRange] = useState("any");
  const [showFilters, setShowFilters] = useState(false);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locationStatus, setLocationStatus] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;
    const timer = window.setTimeout(async () => {
      const params = new URLSearchParams({ limit: "50" });
      if (search.trim()) params.set("search", search.trim());
      if (location.trim()) params.set("location", location.trim());
      if (selectedCategory) params.set("category", selectedCategory);
      Object.entries(priceRanges[priceRange]).forEach(([key, value]) => params.set(key, value));

      setLoading(true);
      setError("");

      try {
        const result = await api.get(`/equipment?${params.toString()}`);
        if (isCurrentRequest) setEquipment(result.equipment);
      } catch (requestError) {
        if (isCurrentRequest) setError(requestError.message);
      } finally {
        if (isCurrentRequest) setLoading(false);
      }
    }, 250);

    return () => {
      isCurrentRequest = false;
      window.clearTimeout(timer);
    };
  }, [location, priceRange, search, selectedCategory]);

  const fetchUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Location detection is not supported by this browser.");
      return;
    }

    setLocationStatus("Detecting your location...");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`
          );
          if (!response.ok) throw new Error("Location lookup failed.");

          const result = await response.json();
          const city =
            result.address?.city ||
            result.address?.town ||
            result.address?.village ||
            result.address?.district;

          if (!city) throw new Error("No city could be determined.");
          setLocation(city);
          setLocationStatus(`Showing equipment near ${city}.`);
        } catch {
          setLocationStatus("Could not determine your city. Enter a location manually.");
        }
      },
      () => setLocationStatus("Location access denied. Enter a city manually."),
      { timeout: 10000 }
    );
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setSelectedCategory("");
    setPriceRange("any");
    setLocationStatus("");
  };

  const equipmentCards = equipment.map((item) => ({
    id: item._id,
    name: item.name,
    category: categoryLabels[item.category] || item.category,
    location: item.location,
    price: item.pricePerDay,
    available: item.isAvailable && item.status === "active",
    owner: item.owner?.fullName || "Equipment owner",
    image: item.images?.[0],
    icon: Tractor,
  }));

  return (
    <div className="min-h-screen bg-[#f7faf7]">
      <section className="bg-[#103d2b] px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-300">
            Agricultural Equipment Rental
          </p>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">
            Find the Right Equipment
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-green-100/70">
            Browse live listings from local equipment owners and find what your farm needs.
          </p>
        </div>
      </section>

      <section className="relative z-10 -mt-8 px-6">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-5 shadow-xl">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_auto]">
            {locationStatus && <p className="col-span-full text-sm text-slate-500">{locationStatus}</p>}
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4">
              <Search size={21} className="text-green-600" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tractors, harvesters, tillers..."
                className="h-14 w-full outline-none"
                aria-label="Search equipment"
              />
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4">
              <MapPin size={21} className="text-green-600" />
              <LocationAutocomplete
                value={location}
                onChange={setLocation}
                placeholder="Enter location"
                className="h-14 w-full outline-none"
                aria-label="Filter by location"
              />
              <button
                type="button"
                onClick={fetchUserLocation}
                className="flex items-center gap-1 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100"
                title="Use my current location"
              >
                <LocateFixed size={14} />
                Detect
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((visible) => !visible)}
              className="flex h-14 items-center justify-center gap-2 rounded-xl bg-green-600 px-7 font-bold text-white transition hover:bg-green-700"
            >
              <SlidersHorizontal size={20} />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-[#f8fbf8] p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-800">Filter Equipment</h2>
                <button type="button" onClick={() => setShowFilters(false)} aria-label="Close filters" className="text-slate-500 hover:text-red-500">
                  <X size={20} />
                </button>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <select
                  value={priceRange}
                  onChange={(event) => setPriceRange(event.target.value)}
                  aria-label="Filter by daily price"
                  className="rounded-xl border border-slate-200 px-4 py-3 outline-none"
                >
                  <option value="any">Any Price</option>
                  <option value="under1000">Below ₹1,000/day</option>
                  <option value="1000to2000">₹1,000 - ₹2,000/day</option>
                  <option value="2000to5000">₹2,000 - ₹5,000/day</option>
                  <option value="over5000">Above ₹5,000/day</option>
                </select>
                <button type="button" onClick={clearFilters} className="rounded-xl border border-green-600 px-5 py-3 font-bold text-green-600 hover:bg-green-50">
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Available Equipment</h2>
            <p className="mt-2 text-slate-500">
              {loading ? "Searching listings..." : `${equipment.length} equipment found`}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map(({ label, value }) => (
              <button
                key={value || "all"}
                type="button"
                onClick={() => setSelectedCategory(value)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  selectedCategory === value
                    ? "bg-green-600 text-white"
                    : "bg-white text-slate-600 shadow-sm hover:bg-green-50 hover:text-green-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {error && (
            <div role="alert" className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
              Could not load equipment: {error}
            </div>
          )}
          {loading && <p className="mt-8 text-slate-600">Loading equipment listings...</p>}
          {!loading && !error && equipmentCards.length > 0 && (
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {equipmentCards.map((item) => <EquipmentCard key={item.id} item={item} />)}
            </div>
          )}
          {!loading && !error && equipmentCards.length === 0 && (
            <div className="mt-10 rounded-3xl bg-white p-12 text-center">
              <Search size={35} className="mx-auto text-green-600" />
              <h3 className="mt-5 text-2xl font-black text-slate-900">No Equipment Found</h3>
              <p className="mt-3 text-slate-500">Try changing your search or filters.</p>
              <button type="button" onClick={clearFilters} className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-bold text-white">
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-[2rem] bg-[#103d2b] px-8 py-14 text-white lg:flex-row lg:items-center lg:justify-between md:px-14">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-green-300">Equipment Owner?</p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">Earn money from your equipment</h2>
            <p className="mt-4 max-w-2xl text-green-100/70">
              Contact an AgriNext administrator to request an owner account and list your equipment.
            </p>
          </div>
          <Link to="/login" className="inline-flex items-center justify-center rounded-xl bg-green-400 px-7 py-4 font-bold text-green-950 transition hover:bg-green-300">
            Sign in as an owner
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Equipment;
