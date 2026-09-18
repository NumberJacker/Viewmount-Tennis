"use client";

import { supabase } from "@/lib/supabase/client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useEffect, useState } from "react";

export default function Editor() {
  const [message, setMessage] = useState("");
  const [slug, setSlug] = useState("about");
  const [pages, setPages] = useState<
  { slug: string; title: string }[]
>([]);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: "<p>Start editing your page...</p>",
  });

  useEffect(() => {
    if (!editor) return;

    const loadPage = async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("content")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error loading page:", error);
        return;
      }

      editor.commands.setContent(data.content);
    };

    loadPage();
  }, [editor, slug]);

  useEffect(() => {
  const loadPages = async () => {
    const { data, error } = await supabase
      .from("pages")
      .select("slug, title")
      .order("title");

    if (error) {
      console.error("Error loading pages:", error);
      return;
    }

    setPages(data);
  };

  loadPages();
}, []);

  if (!editor) {
    return null;
  }

  const handleSave = async () => {
   console.log("Current slug:", slug);
   const content = editor.getJSON();

   console.log("Saving content:", content);

   const { data } = await supabase.auth.getUser();

   console.log("Current user:", data.user);

   const { data: pageCheck, error: pageCheckError } = await supabase
   .from("pages")
   .select("id, slug, title")
   .eq("slug", slug);

   console.log("Page check:", pageCheck);
   console.log("Page check error:", pageCheckError);

  const { data: updatedData, error } = await supabase
    .from("pages")
    .update({
      content: content,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug)
    .select();

  console.log("Updated row:", updatedData);
  console.log("Save error:", error);

  if (error) {
    setMessage("Failed to save changes.");
  } else {
    setMessage("Changes saved successfully!");
  }
};

  return (
    <div className="rounded-lg border">

      <div className="border-b p-3">
        <label htmlFor="page-select" className="mr-2 font-semibold">
          Page:
        </label>

        <select
        id="page-select"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="rounded border px-3 py-2"
        >
          {pages.map((page) => (
            <option key={page.slug} value={page.slug}>
              {page.title}
              </option>
            ))}
        </select>
      </div>

      {message && (
        <div className="fixed right-5 top-5 z-50 rounded-lg border bg-white px-4 py-3 shadow-lg">
          {message}
          </div>
      )}

      <div className="flex flex-wrap gap-2 border-b p-3">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="rounded border px-3 py-1"
        >
          Bold
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="rounded border px-3 py-1"
        >
          Italic
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className="rounded border px-3 py-1"
        >
          H1
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="rounded border px-3 py-1"
        >
          H2
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          className="rounded border px-3 py-1"
        >
          Bullet List
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          className="rounded border px-3 py-1"
        >
          Numbered List
        </button>

        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="rounded border px-3 py-1"
        >
          Undo
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="rounded border px-3 py-1"
        >
          Redo
        </button>

        <button
         onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/png,image/jpeg";
          
          input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            
            const fileName = `${Date.now()}-${file.name}`;

            const { data, error } = await supabase.storage
            .from("images")
            .upload(fileName, file);
            
            console.log("Upload data:", data);
            console.log("Upload error:", error);

            if (error) {
              console.error("Image upload failed:", error);
              setMessage("Image upload failed.");
              return;
            }

            const { data: publicUrlData } = supabase.storage
            .from("images")
            .getPublicUrl(data.path);
            
            console.log("Image URL:", publicUrlData.publicUrl);

            editor
            .chain()
            .focus()
            .setImage({
              src: publicUrlData.publicUrl,
            })
            .run();

            setMessage("Image uploaded successfully!");
          };

          input.click();
          }}
          >
            Insert Image
        </button>
      </div>

      <div className="p-4">
        <EditorContent editor={editor} />
      </div>

      <div className="border-t p-3">
        <button
          onClick={handleSave}
          className="rounded-lg bg-green-700 px-5 py-2 text-white"
        >
          Save Changes
        </button>
      </div>

    </div>
  );
}