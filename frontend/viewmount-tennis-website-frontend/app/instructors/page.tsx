import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { supabase } from "@/lib/supabase/client";
import { TableKit } from "@tiptap/extension-table";

export default async function Instructors() {
  const { data, error } = await supabase
    .from("pages")
    .select("content")
    .eq("slug", "instructors")
    .single();

  if (error) {
    console.error("Error loading Instructors page:", error);

    return (
      <main className="page-content">
        <h1>Instructors at Viewmount Tennis</h1>
        <p>Unable to load page content.</p>
      </main>
    );
  }

  const html = generateHTML(data.content, [StarterKit, Image, TableKit]);

  return (
    <main className="page-content">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}