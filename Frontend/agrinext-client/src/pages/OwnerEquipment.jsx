import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Plus, Tractor } from "lucide-react";
import { api } from "../lib/api";

function OwnerEquipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEquipment = () => {
    api.get("/equipment/mine")
      .then(setEquipment)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadEquipment(); }, []);

  const updateEquipment = async (item, update) => {
    if (update.deactivate && !window.confirm("Deactivate this equipment listing?")) return;
    setError("");
    try {
      const result = update.deactivate
        ? await api.delete(`/equipment/${item._id}`)
        : await api.patch(`/equipment/${item._id}`, update);
      if (update.deactivate) {
        setEquipment((current) => current.map((entry) =>
          entry._id === item._id
            ? { ...entry, status: "inactive", isAvailable: false }
            : entry
        ));
      } else {
        setEquipment((current) => current.map((entry) => entry._id === item._id ? result : entry));
      }
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const activeCount = equipment.filter((item) => item.status === "active" && item.isAvailable).length;

  return (
    <div className="min-h-screen bg-[#f8faf8] text-slate-800">
      <section className="bg-[#103d2b]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link to="/owner/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-green-100 hover:text-white"><ArrowLeft size={16} />Back to Dashboard</Link>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-medium text-green-200">Owner Management</p>
              <h1 className="mt-2 text-3xl font-bold text-white">My Equipment</h1>
              <p className="mt-2 text-green-100">Manage your live AgriNext listings.</p>
            </div>
            <Link to="/owner/add-equipment" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#103d2b] hover:bg-green-50"><Plus size={18} />Add Equipment</Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Total Equipment</p><p className="mt-2 text-3xl font-bold text-slate-900">{equipment.length}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Available</p><p className="mt-2 text-3xl font-bold text-green-700">{activeCount}</p></div>
        </div>

        {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading && <p className="mt-6 text-slate-600">Loading your equipment...</p>}
        {!loading && equipment.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-semibold text-slate-800">No equipment listings yet.</p>
            <Link to="/owner/add-equipment" className="mt-4 inline-block font-semibold text-green-700">Add your first listing</Link>
          </div>
        )}

        <div className="mt-8 space-y-5">
          {equipment.map((item) => (
            <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-green-50 text-green-700 sm:w-40">
                  {item.images?.[0] ? <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" /> : <Tractor size={55} />}
                </div>
                <div className="flex-1">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${item.isAvailable && item.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{item.isAvailable && item.status === "active" ? "Available" : item.status}</span>
                  <h2 className="mt-3 text-xl font-bold capitalize text-slate-900">{item.name}</h2>
                  <p className="mt-2 flex items-center gap-1 text-sm text-slate-500"><MapPin size={15} />{item.location}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-800">₹{item.pricePerDay.toLocaleString()} / day · {item.category.replaceAll("_", " ")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={item.status !== "active"} onClick={() => updateEquipment(item, { isAvailable: !item.isAvailable })} className="rounded-lg border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50 disabled:opacity-50">{item.isAvailable ? "Mark unavailable" : "Make available"}</button>
                  {item.status === "active" && <button type="button" onClick={() => updateEquipment(item, { deactivate: true })} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50">Deactivate</button>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default OwnerEquipment;
