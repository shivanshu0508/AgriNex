import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, IndianRupee } from "lucide-react";
import { api } from "../lib/api";

function OwnerEarnings() {
  const [bookings, setBookings] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/dashboard/owner"), api.get("/bookings/owner")])
      .then(([dashboard, result]) => {
        setRevenue(dashboard.statistics.paidRevenue);
        setBookings(result);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const paidBookings = bookings.filter((booking) => booking.paymentStatus === "paid");
  const pendingBookings = bookings.filter((booking) => booking.paymentStatus === "pending");
  const pendingAmount = pendingBookings.reduce((total, booking) => total + booking.totalAmount, 0);

  return (
    <div className="min-h-screen bg-[#f7faf7]">
      <section className="bg-[#103d2b] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link to="/owner/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-green-100 hover:text-white"><ArrowLeft size={18} />Back to Dashboard</Link>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-green-300">Equipment Owner</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Earnings</h1>
          <p className="mt-3 max-w-2xl text-green-100">Payment totals from your current booking records.</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error && <p role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading && <p className="text-slate-600">Loading earnings...</p>}
        {!loading && !error && (
          <>
            <section className="grid gap-5 sm:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100"><IndianRupee size={22} className="text-green-700" /></div>
                <p className="mt-5 text-sm text-slate-500">Paid revenue</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">₹{revenue.toLocaleString()}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Paid bookings</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{paidBookings.length}</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Unpaid booking value</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">₹{pendingAmount.toLocaleString()}</p>
              </article>
            </section>

            <section className="mt-10">
              <h2 className="text-2xl font-bold text-slate-900">Booking payment status</h2>
              <p className="mt-1 text-sm text-slate-500">The current API does not provide a dated earnings history or category breakdown.</p>
              {bookings.length === 0
                ? <div className="mt-5 rounded-2xl bg-white p-8 text-center text-slate-600">No booking records yet.</div>
                : <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50 text-slate-600"><tr><th className="px-5 py-4 font-semibold">Equipment</th><th className="px-5 py-4 font-semibold">Farmer</th><th className="px-5 py-4 font-semibold">Rental dates</th><th className="px-5 py-4 font-semibold">Amount</th><th className="px-5 py-4 font-semibold">Payment</th></tr></thead>
                    <tbody>{bookings.map((booking) => (
                      <tr key={booking._id} className="border-b border-slate-100 last:border-0">
                        <td className="px-5 py-4 font-semibold text-slate-900">{booking.equipment?.name || "Equipment listing"}</td>
                        <td className="px-5 py-4 text-slate-600">{booking.farmer?.fullName || "Farmer"}</td>
                        <td className="px-5 py-4 text-slate-600">{new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}</td>
                        <td className="px-5 py-4 font-semibold text-slate-900">₹{booking.totalAmount.toLocaleString()}</td>
                        <td className="px-5 py-4 capitalize text-slate-600">{booking.paymentStatus}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default OwnerEarnings;
