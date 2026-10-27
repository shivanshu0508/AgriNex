import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, IndianRupee, Package, Plus, XCircle } from "lucide-react";
import { api } from "../lib/api";

function OwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/dashboard/owner"), api.get("/bookings/owner")])
      .then(([dashboardResult, bookingResult]) => {
        setDashboard(dashboardResult);
        setRequests(bookingResult.filter((booking) => booking.status === "pending").slice(0, 5));
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const respondToRequest = async (id, status) => {
    setError("");
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      setRequests((current) => current.filter((request) => request._id !== id));
      setDashboard((current) => current ? {
        ...current,
        statistics: {
          ...current.statistics,
          pendingRequests: Math.max(0, current.statistics.pendingRequests - 1),
        },
      } : current);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const stats = dashboard ? [
    { label: "Total equipment", value: dashboard.statistics.totalEquipment, icon: Package },
    { label: "Active listings", value: dashboard.statistics.activeEquipment, icon: CheckCircle2 },
    { label: "Pending requests", value: dashboard.statistics.pendingRequests, icon: CalendarDays },
    { label: "Paid revenue", value: `₹${dashboard.statistics.paidRevenue.toLocaleString()}`, icon: IndianRupee },
  ] : [];

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <section className="bg-[#102a43] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">Equipment Owner</p>
            <h1 className="text-3xl font-bold sm:text-4xl">Owner Dashboard</h1>
            <p className="mt-3 max-w-xl text-slate-300">Manage your equipment, rental requests and earnings.</p>
          </div>
          <Link to="/owner/add-equipment" className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-[#102a43] hover:bg-emerald-300"><Plus size={19} />Add Equipment</Link>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error && <p role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
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
                <div><h2 className="text-2xl font-bold text-slate-900">Pending rental requests</h2><p className="mt-1 text-sm text-slate-500">Approve or reject a request to update its status.</p></div>
                <Link to="/owner/requests" className="font-semibold text-green-700">View all</Link>
              </div>
              {requests.length === 0
                ? <div className="mt-5 rounded-2xl bg-white p-8 text-center text-slate-600">No pending requests.</div>
                : <div className="mt-5 space-y-3">{requests.map((request) => (
                  <article key={request._id} className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 lg:flex-row lg:items-center">
                    <div>
                      <h3 className="font-bold text-slate-900">{request.equipment?.name || "Equipment booking"}</h3>
                      <p className="mt-1 text-sm text-slate-500">{request.farmer?.fullName || "Farmer"} · {new Date(request.startDate).toLocaleDateString()} – {new Date(request.endDate).toLocaleDateString()}</p>
                      <p className="mt-2 font-semibold text-slate-800">₹{request.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => respondToRequest(request._id, "approved")} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"><CheckCircle2 size={16} />Approve</button>
                      <button type="button" onClick={() => respondToRequest(request._id, "rejected")} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"><XCircle size={16} />Reject</button>
                    </div>
                  </article>
                ))}</div>}
            </section>

            <section className="mt-8 flex flex-wrap gap-3">
              <Link to="/owner/equipment" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50">Manage Equipment</Link>
              <Link to="/owner/earnings" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50">View Earnings</Link>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default OwnerDashboard;
