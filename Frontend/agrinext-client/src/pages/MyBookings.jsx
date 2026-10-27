import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, XCircle } from "lucide-react";
import { api } from "../lib/api";

const filters = ["All", "pending", "approved", "rejected", "confirmed", "ongoing", "completed", "cancelled"];

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/bookings/mine")
      .then(setBookings)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const cancelBooking = async (bookingId) => {
    setError("");
    try {
      const updated = await api.patch(`/bookings/${bookingId}/cancel`, {});
      setBookings((current) => current.map((booking) => booking._id === bookingId
        ? { ...booking, ...updated, equipment: booking.equipment, owner: booking.owner }
        : booking
      ));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const visibleBookings = activeFilter === "All"
    ? bookings
    : bookings.filter((booking) => booking.status === activeFilter);

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <section className="bg-[#102a43] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">Farmer Workspace</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">My Bookings</h1>
          <p className="mt-3 text-slate-300">Review and manage your equipment rental requests.</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${activeFilter === filter ? "bg-green-600 text-white" : "bg-white text-slate-600 hover:bg-green-50"}`}>{filter}</button>
          ))}
        </div>
        {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading && <p className="mt-6 text-slate-600">Loading your bookings...</p>}
        {!loading && visibleBookings.length === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="font-semibold text-slate-800">No bookings in this view.</p>
            <Link to="/equipment" className="mt-4 inline-block font-semibold text-green-700">Find equipment</Link>
          </div>
        )}
        <div className="mt-6 space-y-5">
          {visibleBookings.map((booking) => (
            <article key={booking._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                <div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">{booking.status}</span>
                  <h2 className="mt-3 text-xl font-bold text-slate-900">{booking.equipment?.name || "Equipment listing"}</h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-500"><MapPin size={16} />{booking.equipment?.location || "Location unavailable"}</p>
                  <p className="mt-2 text-sm text-slate-600">Owner: {booking.owner?.fullName || "Equipment owner"}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-2xl font-bold text-green-700">₹{booking.totalAmount.toLocaleString()}</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-500"><CalendarDays size={16} />{new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}</p>
                  {["pending", "approved"].includes(booking.status) && (
                    <button type="button" onClick={() => cancelBooking(booking._id)} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"><XCircle size={16} />Cancel booking</button>
                  )}
                </div>
              </div>
              {booking.notes && <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">{booking.notes}</p>}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default MyBookings;
