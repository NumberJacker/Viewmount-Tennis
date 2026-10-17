import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { supabase } from "@/lib/supabase/client";
import { TableKit } from "@tiptap/extension-table";

export default async function Home() {
  const { data, error } = await supabase
    .from("pages")
    .select("content")
    .eq("slug", "home")
    .single();

  if (error) {
    console.error("Error loading Home page:", error);

    return (
      <main className="page-content">
        <h1>Home Page for Viewmount Tennis</h1>
        <p>Unable to load page content.</p>
      </main>
    );
  }

  const html = generateHTML(data.content, [StarterKit, Image, TableKit]);

  return (
    <main className="page-content">
      <div className="page-content" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}