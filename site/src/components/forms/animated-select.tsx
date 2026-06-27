"use client";

import { useEffect, useRef, useState } from "react";

type SelectOption = {
  label: string;
  value: string;
};

export function AnimatedSelect({
  className,
  name,
  options,
  placeholder,
  required = false,
}: {
  className?: string;
  name: string;
  options: readonly SelectOption[];
  placeholder: string;
  required?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <select
        aria-hidden="true"
        className="sr-only"
        name={name}
        onChange={(event) => setValue(event.target.value)}
        required={required}
        tabIndex={-1}
        value={value}
      >
        <option disabled value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`${className ?? ""} flex items-center justify-between gap-4 text-left`}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
        }}
        type="button"
      >
        <span className={selected ? "" : "text-[#8d909a]"}>{selected?.label ?? placeholder}</span>
        <svg
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#18bdb1]" : "text-[#68717a]"}`}
          fill="none"
          viewBox="0 0 16 16"
        >
          <path d="m3.5 6 4.5 4 4.5-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
        </svg>
      </button>

      <div
        className={`absolute inset-x-0 top-[calc(100%+0.45rem)] z-30 overflow-hidden rounded-xl border border-[#d8d6e1] bg-white p-1.5 shadow-[0_18px_48px_rgba(27,42,74,0.16)] transition duration-200 ease-out ${
          isOpen ? "visible translate-y-0 scale-100 opacity-100" : "invisible pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
        }`}
        role="listbox"
      >
        {options.map((option) => (
          <button
            aria-selected={option.value === value}
            className={`block w-full rounded-lg px-4 py-3 text-left text-base font-medium transition duration-150 ${
              option.value === value
                ? "bg-[#18bdb1] text-white"
                : "text-brand-navy hover:translate-x-1 hover:bg-[#18bdb1]/10 hover:text-[#0f9f96]"
            }`}
            key={option.value}
            onClick={() => {
              setValue(option.value);
              setIsOpen(false);
            }}
            role="option"
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
