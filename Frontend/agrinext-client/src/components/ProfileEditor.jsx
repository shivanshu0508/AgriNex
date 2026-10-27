import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import LocationAutocomplete from "./LocationAutocomplete.jsx";

function ProfileEditor() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    location: user?.location || "",
  });

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
    });
    setError("");
    setEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const updatedUser = await updateProfile(formData);
      setFormData({
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone || "",
        location: updatedUser.location || "",
      });
      setEditing(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: "fullName", label: "Full name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "tel" },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
          <p className="mt-1 text-sm text-slate-500">Update your contact details and location.</p>
        </div>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-green-200 px-3 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
          >
            <Pencil size={16} /> Edit profile
          </button>
        )}
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {fields.map(({ name, label, type, required }) => (
          <label key={name} className="block text-sm font-medium text-slate-700">
            {label}
            <input
              type={type}
              value={formData[name]}
              onChange={(event) =>
                setFormData((current) => ({ ...current, [name]: event.target.value }))
              }
              required={required}
              readOnly={!editing}
              autoComplete={name === "fullName" ? "name" : name === "email" ? "email" : "tel"}
              className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 ${
                editing ? "border-slate-300 bg-white" : "border-slate-200 bg-slate-50"
              }`}
            />
          </label>
        ))}
        <label className="block text-sm font-medium text-slate-700">
          Location
          <LocationAutocomplete
            value={formData.location}
            onChange={(location) =>
              setFormData((current) => ({ ...current, location }))
            }
            placeholder="City, State"
            readOnly={!editing}
            className={`mt-1.5 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 ${
              editing ? "border-slate-300 bg-white" : "border-slate-200 bg-slate-50"
            }`}
          />
        </label>

        {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {editing && (
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={16} /> {saving ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        )}
      </form>
    </section>
  );
}

export default ProfileEditor;
