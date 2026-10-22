
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Editor from "@/components/editor";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login");
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Website Admin
      </h1>

      <Editor />
    </main>
  );
}
