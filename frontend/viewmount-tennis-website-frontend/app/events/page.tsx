import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { createClient } from "@/lib/supabase/client";
import { TableKit } from "@tiptap/extension-table";

export default async function Events() {
  const supabase = createClient();
  const { data, error } = await supabase
  .from("pages")
  .select("content")
  .eq("slug", "events")
  .single();

if (error) {
console.error("Error loading Events page:", error);

return (
  <main className="page-content">
    <h1>Events at Viewmount Tennis</h1>
    <p>Unable to load page content.</p>
  </main>
);

}

const html = generateHTML(data.content, [StarterKit, Image, TableKit]);

return ( <main className="page-content">
<div dangerouslySetInnerHTML={{ __html: html }} /> </main>
);
}
