import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="flex min-h-screen flex-col items-center justify-center text-center">
        <h1>Viewmount Tennis</h1>
      <p>
        Professional tennis lessons for players of all levels.
      </p>

      <div className="mt-8 flex gap-4">

        <Link href="/about">
          <button className="mt-8 rounded-lg bg-green-700 px-6 py-3 text-white">
            About Us
          </button>
        </Link>
      </div>
      </section>
    </main>
  );
}