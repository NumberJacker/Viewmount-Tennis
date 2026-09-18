import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <ul className="flex gap-6 p-4">
        <li>
          <Link href="/">Home</Link>
        </li>

        <li>
          <Link href="/about">About</Link>
        </li>

        <li>
          <Link href="/pricing">Pricing</Link>
        </li>

        <li>
          <Link href="/instructors">Instructors</Link>
        </li>

        <li>
          <Link href="/events">Events</Link>
        </li>

        <li>
          <Link href="/lessons">Lessons</Link>
        </li>

      </ul>
    </nav>
  );
}