import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin, Tractor } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../auth/useAuth";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const minimumDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [equipment, setEquipment] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isCurrentRequest = true;
    api.get(`/equipment/${id}`)
      .then((result) => {
        if (isCurrentRequest) setEquipment(result);
      })
      .catch((requestError) => {
        if (isCurrentRequest) setError(requestError.message);
      });
    return () => { isCurrentRequest = false; };
  }, [id]);

  const duration = useMemo(() => {
    if (!startDate || !endDate) return 0;
    return Math.ceil((new Date(endDate) - new Date(startDate)) / 86400000);
  }, [startDate, endDate]);

  const rentalAmount = duration > 0 && equipment
    ? duration * equipment.pricePerDay
    : 0;
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (duration < 1) {
      setError("Choose a valid rental end date after the start date.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const booking = await api.post("/bookings", {
        equipmentId: equipment._id,
        startDate,
        endDate,
        notes,
      });
      navigate("/booking-confirmation", {
        replace: true,
        state: {
          booking: {
            ...booking,
            equipment: equipment.name,
            category: equipment.category.replaceAll("_", " "),
            location: equipment.location,
            owner: equipment.owner?.fullName || "Equipment owner",
            pricePerDay: equipment.pricePerDay,
          },
        },
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!equipment && !error) {
    return <p className="px-6 py-16 text-center text-slate-600">Loading equipment...</p>;
  }

  if (error && !equipment) {
    return <div role="alert" className="mx-auto max-w-3xl px-6 py-16 text-center text-red-700">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <section className="bg-[#102a43] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link to={`/equipment/${id}`} className="mb-6 inline-flex items-center gap-2 text-sm text-emerald-300 hover:text-white">
            <ArrowLeft size={18} /> Back to Equipment Details
          </Link>
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-green-300">Equipment Booking</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Book Your Equipment</h1>
          <p className="mt-3 max-w-2xl text-slate-300">Select your rental dates and send a request to the equipment owner.</p>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <section className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="flex h-28 w-full items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 sm:w-36">
                {equipment.images?.[0]
                  ? <img src={equipment.images[0]} alt={equipment.name} className="h-full w-full rounded-xl object-cover" />
                  : <Tractor size={58} className="text-green-700" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium capitalize text-green-600">{equipment.category.replaceAll("_", " ")}</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">{equipment.name}</h2>
                <p className="mt-3 flex items-center gap-2 text-sm text-slate-500"><MapPin size={16} />{equipment.location}</p>
                <p className="mt-4 font-semibold text-slate-800">₹{equipment.pricePerDay.toLocaleString()} / day</p>
              </div>
            </div>
          </div>

          <form id="booking-form" onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Rental dates</h2>
              <p className="mt-1 text-sm text-slate-500">Signed in as {user?.fullName}. Dates must be in the future.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Start date
                <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-300 px-4">
                  <CalendarDays size={18} className="text-green-600" />
                  <input type="date" min={minimumDate} value={startDate} onChange={(event) => setStartDate(event.target.value)} required className="w-full py-3 outline-none" />
                </span>
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                End date
                <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-300 px-4">
                  <CalendarDays size={18} className="text-green-600" />
                  <input type="date" min={startDate || minimumDate} value={endDate} onChange={(event) => setEndDate(event.target.value)} required className="w-full py-3 outline-none" />
                </span>
              </label>
            </div>
            <label className="block text-sm font-semibold text-slate-700">
              Note for the owner (optional)
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={1000} rows={4} placeholder="Add your farm location or intended use" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100" />
            </label>
            {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          </form>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="bg-[#103d2b] p-6 text-white">
              <h2 className="text-xl font-bold">Booking Summary</h2>
              <p className="mt-1 text-sm text-green-100">Review your rental details</p>
            </div>
            <div className="p-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Daily rate</span>
                <span className="font-semibold text-slate-900">₹{equipment.pricePerDay.toLocaleString()}</span>
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-slate-500">Rental duration</span>
                <span className="font-semibold text-slate-900">{duration > 0 ? `${duration} day${duration === 1 ? "" : "s"}` : "Select dates"}</span>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-5">
                <span className="font-semibold text-slate-700">Estimated total</span>
                <span className="text-2xl font-bold text-green-700">₹{rentalAmount.toLocaleString()}</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">The backend calculates the final rental amount using the daily rate and selected dates.</p>
              <button type="submit" form="booking-form" disabled={submitting || !equipment.isAvailable || equipment.status !== "active"} className="mt-5 w-full rounded-xl bg-green-600 py-3.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400">
                {submitting ? "Sending request..." : "Send Booking Request"}
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Booking;
