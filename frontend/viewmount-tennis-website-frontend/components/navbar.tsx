"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Pricing", href: "/pricing" },
    { label: "Instructors", href: "/instructors" },
    { label: "Events", href: "/events" },
    { label: "Lessons", href: "/lessons" },
  ];

  return (
    <nav className="bg-green-200 text-green-900">
      {/* Mobile navigation header */}
      <div className="flex items-center justify-between p-4 md:hidden">
        <Link href="/" className="text-lg font-bold">
          Viewmount Tennis
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="rounded p-2 text-2xl hover:bg-green-300 focus:outline-none focus:ring-2 focus:ring-green-700"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </div>

      {/* Desktop navigation */}
      <ul className="hidden flex-wrap justify-center gap-6 p-4 md:flex">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              className="transition-colors hover:text-green-600"
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <ul
          id="mobile-navigation"
          className="flex flex-col gap-1 px-4 pb-4 md:hidden"
        >
          {links.map((link) => (
            <li key={link.href}>
              <Link
                className="block rounded px-3 py-3 transition-colors hover:bg-green-300 hover:text-green-700"
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
