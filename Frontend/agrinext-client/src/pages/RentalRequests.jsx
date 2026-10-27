import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, CheckCircle2, XCircle } from "lucide-react";
import { api } from "../lib/api";

const filters = ["All", "pending", "approved", "rejected", "confirmed", "ongoing", "completed", "cancelled"];

function RentalRequests() {
  const [requests, setRequests] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/bookings/owner")
      .then(setRequests)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    setError("");
    try {
      const updated = await api.patch(`/bookings/${id}/status`, { status });
      setRequests((current) => current.map((request) => request._id === id
        ? { ...request, ...updated, equipment: request.equipment, farmer: request.farmer }
        : request
      ));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const visibleRequests = activeFilter === "All"
    ? requests
    : requests.filter((request) => request.status === activeFilter);

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <section className="bg-[#102a43] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link to="/owner/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-emerald-300 hover:text-white"><ArrowLeft size={16} />Back to Dashboard</Link>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">Owner Workspace</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Rental Requests</h1>
          <p className="mt-3 text-slate-300">Review and respond to booking requests for your equipment.</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button key={filter} type="button" onClick={() => setActiveFilter(filter)} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${activeFilter === filter ? "bg-green-600 text-white" : "bg-white text-slate-600 hover:bg-green-50"}`}>{filter}</button>
          ))}
        </div>
        {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading && <p className="mt-6 text-slate-600">Loading rental requests...</p>}
        {!loading && visibleRequests.length === 0 && <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">No requests in this view.</div>}

        <div className="mt-6 space-y-5">
          {visibleRequests.map((request) => (
            <article key={request._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-5 lg:flex-row">
                <div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">{request.status}</span>
                  <h2 className="mt-3 text-xl font-bold text-slate-900">{request.equipment?.name || "Equipment listing"}</h2>
                  <p className="mt-2 text-sm text-slate-600">Requested by {request.farmer?.fullName || "Farmer"}{request.farmer?.phone ? ` · ${request.farmer.phone}` : ""}</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-500"><CalendarDays size={16} />{new Date(request.startDate).toLocaleDateString()} – {new Date(request.endDate).toLocaleDateString()}</p>
                  {request.notes && <p className="mt-4 max-w-2xl rounded-xl bg-slate-50 p-4 text-sm text-slate-600">{request.notes}</p>}
                </div>
                <div className="flex flex-col items-start gap-4 lg:items-end">
                  <p className="text-2xl font-bold text-green-700">₹{request.totalAmount.toLocaleString()}</p>
                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <button type="button" onClick={() => updateStatus(request._id, "approved")} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"><CheckCircle2 size={16} />Approve</button>
                      <button type="button" onClick={() => updateStatus(request._id, "rejected")} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"><XCircle size={16} />Reject</button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default RentalRequests;
