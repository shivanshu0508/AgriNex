import { Link, useLocation } from "react-router-dom";
import { CalendarDays, CheckCircle2, Clock3, MapPin, Tractor } from "lucide-react";

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function BookingConfirmation() {
  const { state } = useLocation();
  const booking = state?.booking;

  if (!booking) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">No booking confirmation to display</h1>
        <p className="mt-3 text-slate-600">Submit a booking request to see its confirmation here.</p>
        <Link to="/equipment" className="mt-6 inline-block rounded-xl bg-green-600 px-5 py-3 font-semibold text-white">Browse equipment</Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <section className="bg-[#102a43] text-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500"><CheckCircle2 size={44} className="text-white" /></div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-emerald-300">Booking Request Submitted</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Your request has been submitted!</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">The owner will review your request. Track the booking status from your bookings.</p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-green-200 bg-green-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Booking Reference</p>
            <p className="mt-1 text-xl font-bold text-green-900">#{booking._id}</p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold capitalize text-yellow-700"><Clock3 size={16} />{booking.status}</div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="flex h-28 w-full shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-200 sm:w-36"><Tractor size={55} className="text-green-700" /></div>
            <div className="flex-1">
              <p className="text-sm font-medium capitalize text-green-600">{booking.category}</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">{booking.equipment}</h2>
              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500"><MapPin size={16} />{booking.location}</p>
              <p className="mt-2 text-sm text-slate-600">Owner: {booking.owner}</p>
            </div>
          </div>

          <div className="mt-7 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"><CalendarDays className="text-green-600" /><div><p className="text-xs text-slate-500">Start date</p><p className="mt-1 font-semibold text-slate-900">{formatDate(booking.startDate)}</p></div></div>
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"><CalendarDays className="text-green-600" /><div><p className="text-xs text-slate-500">End date</p><p className="mt-1 font-semibold text-slate-900">{formatDate(booking.endDate)}</p></div></div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
            <span className="font-semibold text-slate-700">Estimated rental total</span>
            <span className="text-2xl font-bold text-green-700">₹{booking.totalAmount.toLocaleString()}</span>
          </div>
          {booking.notes && <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Note: {booking.notes}</p>}
        </section>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/my-bookings" className="rounded-xl bg-green-600 px-6 py-3 text-center font-semibold text-white hover:bg-green-700">View My Bookings</Link>
          <Link to="/equipment" className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50">Continue Browsing</Link>
        </div>
      </main>
    </div>
  );
}

export default BookingConfirmation;
