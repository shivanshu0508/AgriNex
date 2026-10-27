import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, Clock3, MapPin, Search } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import { api } from "../lib/api";

function FarmerDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/dashboard/farmer"),
      api.get("/bookings/mine"),
      api.get("/equipment?limit=4"),
    ])
      .then(([dashboardResult, bookingResult, equipmentResult]) => {
        setDashboard(dashboardResult);
        setBookings(bookingResult);
        setEquipment(equipmentResult.equipment);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const stats = dashboard ? [
    { label: "Total bookings", value: dashboard.statistics.totalBookings, icon: CalendarDays },
    { label: "Pending requests", value: dashboard.statistics.pendingBookings, icon: Clock3 },
    { label: "Completed rentals", value: dashboard.statistics.completedBookings, icon: CheckCircle2 },
    { label: "Paid rentals", value: `₹${bookings.filter((booking) => booking.paymentStatus === "paid").reduce((total, booking) => total + booking.totalAmount, 0).toLocaleString()}`, icon: CheckCircle2 },
  ] : [];

  return (
    <div className="min-h-screen bg-[#f4f7f5] text-slate-800">
      <section className="bg-[#102a43]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">Farmer Dashboard</p>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Welcome back, {user?.fullName}</h1>
            <p className="mt-2 max-w-2xl text-slate-300">Manage your rentals and find equipment available near you.</p>
          </div>
          <Link to="/equipment" className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-[#102a43] hover:bg-emerald-300"><Search size={18} />Find Equipment</Link>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && <p role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">Could not load dashboard data: {error}</p>}
        {loading && <p className="text-slate-600">Loading your dashboard...</p>}
        {dashboard && (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map(({ label, value, icon: Icon }) => (
                <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p></div>
                    <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><Icon size={21} /></span>
                  </div>
                </article>
              ))}
            </section>

            <section className="mt-10">
              <div className="flex items-center justify-between">
                <div><h2 className="text-2xl font-bold text-slate-900">Recent bookings</h2><p className="mt-1 text-sm text-slate-500">Latest requests from your account</p></div>
                <Link to="/my-bookings" className="font-semibold text-green-700">View all</Link>
              </div>
              {dashboard.recentBookings.length === 0
                ? <div className="mt-5 rounded-2xl bg-white p-8 text-center text-slate-600">No bookings yet. Find equipment to get started.</div>
                : <div className="mt-5 space-y-3">{dashboard.recentBookings.map((booking) => (
                  <article key={booking._id} className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
                    <div><h3 className="font-bold text-slate-900">{booking.equipment?.name || "Equipment booking"}</h3><p className="mt-1 text-sm text-slate-500">{new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}</p></div>
                    <div className="flex items-center gap-4"><span className="font-semibold text-slate-800">₹{booking.totalAmount.toLocaleString()}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize">{booking.status}</span></div>
                  </article>
                ))}</div>}
            </section>

            <section className="mt-10">
              <div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold text-slate-900">Equipment near you</h2><p className="mt-1 text-sm text-slate-500">Live available listings from AgriNext</p></div><Link to="/equipment" className="font-semibold text-green-700">Browse all</Link></div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {equipment.map((item) => (
                  <Link key={item._id} to={`/equipment/${item._id}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1">
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="mt-2 flex items-center gap-1 text-sm text-slate-500"><MapPin size={15} />{item.location}</p>
                    <p className="mt-4 font-bold text-green-700">₹{item.pricePerDay.toLocaleString()} / day</p>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default FarmerDashboard;
