import { useEffect, useId, useState } from "react";

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

function LocationAutocomplete({
  value,
  onChange,
  className,
  name = "location",
  placeholder = "Start typing a location",
  required = false,
  readOnly = false,
  "aria-label": ariaLabel = "Location",
}) {
  const listboxId = useId();
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [error, setError] = useState("");

  useEffect(() => {
    if (readOnly || !GEOAPIFY_API_KEY || value.trim().length < 2) {
      return undefined;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setError("");

      try {
        const params = new URLSearchParams({
          text: value.trim(),
          limit: "5",
          lang: "en",
          apiKey: GEOAPIFY_API_KEY,
        });
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Location suggestions request failed (${response.status}).`);
        }

        const result = await response.json();
        const locations = (result.features || [])
          .map((feature) => feature.properties?.formatted)
          .filter((location) => typeof location === "string" && location.length > 0);

        setSuggestions([...new Set(locations)]);
        setActiveIndex(-1);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setSuggestions([]);
          setError("Location suggestions could not be loaded. Check your connection or API key.");
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [readOnly, value]);

  const handleChange = (nextValue) => {
    setSuggestions([]);
    setActiveIndex(-1);
    setError("");
    onChange(nextValue);
  };

  const selectSuggestion = (location) => {
    onChange(location);
    setSuggestions([]);
    setActiveIndex(-1);
    setError("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown" && suggestions.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp" && suggestions.length > 0) {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        name={name}
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        placeholder={placeholder}
        required={required}
        className={className}
        aria-label={ariaLabel}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={suggestions.length > 0}
        aria-controls={listboxId}
        aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
        autoComplete="off"
      />
      {!readOnly && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {suggestions.map((location, index) => (
            <li
              key={location}
              id={`${listboxId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={`cursor-pointer px-4 py-2.5 text-sm text-slate-700 ${
                index === activeIndex ? "bg-green-50" : "hover:bg-slate-50"
              }`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectSuggestion(location)}
            >
              {location}
            </li>
          ))}
        </ul>
      )}
      {!readOnly && !GEOAPIFY_API_KEY && value.trim().length >= 2 && (
        <p className="mt-1 text-xs text-slate-500">
          Set VITE_GEOAPIFY_API_KEY to enable location suggestions.
        </p>
      )}
      {!readOnly && error && <p role="status" className="mt-1 text-xs text-amber-700">{error}</p>}
    </div>
  );
}

export default LocationAutocomplete;
