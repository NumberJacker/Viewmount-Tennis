import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-green-200">
      <ul className="flex flex-wrap justify-center gap-6 p-4 text-green-900">
        <li>
          <Link className="transition-colors hover:text-green-600" href="/">Home</Link>
        </li>

        <li>
          <Link className="transition-colors hover:text-green-600" href="/about">About</Link>
        </li>

        <li>
          <Link className="transition-colors hover:text-green-600" href="/pricing">Pricing</Link>
        </li>

        <li>
          <Link className="transition-colors hover:text-green-600" href="/instructors">Instructors</Link>
        </li>

        <li>
          <Link className="transition-colors hover:text-green-600" href="/events">Events</Link>
        </li>

        <li>
          <Link className="transition-colors hover:text-green-600" href="/lessons">Lessons</Link>
        </li>

      </ul>
    </nav>
  );
}