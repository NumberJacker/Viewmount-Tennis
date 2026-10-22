"use client";

import { createClient } from "@/lib/supabase/client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TipTapImage from "@tiptap/extension-image";
import { useEffect, useState } from "react";
import Image from "next/image";
import { TableKit } from "@tiptap/extension-table";
import Link from "@tiptap/extension-link";

export default function Editor() {
  const supabase = createClient();
  const [message, setMessage] = useState("");
  const [slug, setSlug] = useState("about");
  const [pages, setPages] = useState<
  { slug: string; title: string }[]
  >([]);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [images, setImages] = useState<
  { name: string; url: string }[]
  >([]);



  const editor = useEditor({
    extensions: [StarterKit.configure({
      link: false,
    }),
    TipTapImage, TableKit, Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    })
  ],
    content: "<p>Start editing your page...</p>",
    immediatelyRender: false,
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

  useEffect(() => {
  const loadImages = async () => {
    const { data, error } = await supabase.storage
      .from("images")
      .list();
    console.log("Images data:", data);
    console.log("Images error:", error);

    if (error) {
      console.error("Error loading images:", error);
      return;
    }

    const imageList = data
      .filter((file) => file.name !== ".emptyFolderPlaceholder")
      .map((file) => {
        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(file.name);

        return {
          name: file.name,
          url: publicUrlData.publicUrl,
        };
      });

    console.log("Image list:", imageList);

    setImages(imageList);
  };

  loadImages();
}, []);

  if (!editor) {
    return <p>Loading editor...</p>;
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
          className="rounded border px-3 py-1"
          >
            Insert Image
        </button>

        <button
        onClick={() =>
          editor
          ?.chain()
          .focus()
          .insertTable({
            rows: 3,
            cols: 3,
            withHeaderRow: true,
          })
          .run()
        }
        disabled={!editor}
        className="rounded border px-3 py-1"
        >
          Insert Table
        </button>

        
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (!editor) return;
        
            const success = editor
              .chain()
              .focus()
              .addRowBefore()
              .run();
        
            console.log("Add row before succeeded:", success);
          }}
          className="rounded border px-3 py-1"
        >
          Add Row Before
        </button>

        
        
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (!editor) return;
        
            const success = editor
              .chain()
              .focus()
              .addRowAfter()
              .run();
        
            console.log("Add row after succeeded:", success);
          }}
          className="rounded border px-3 py-1"
        >
          Add Row After
        </button>

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (!editor) return;
        
            const success = editor
              .chain()
              .focus()
              .deleteRow()
              .run();
        
            console.log("Delete row succeeded:", success);
          }}
          className="rounded border px-3 py-1"
        >
          Delete Row
        </button>

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (!editor) return;
        
            const success = editor
              .chain()
              .focus()
              .addColumnBefore()
              .run();
        
            console.log("Add column before succeeded:", success);
          }}
          className="rounded border px-3 py-1"
        >
          Add Column Before
        </button>

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (!editor) return;
        
            const success = editor
              .chain()
              .focus()
              .addColumnAfter()
              .run();
        
            console.log("Add column after succeeded:", success);
          }}
          className="rounded border px-3 py-1"
        >
          Add Column After
        </button>

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (!editor) return;
        
            const success = editor
              .chain()
              .focus()
              .deleteColumn()
              .run();
        
            console.log("Delete column succeeded:", success);
          }}
          className="rounded border px-3 py-1"
        >
          Delete Column
        </button>

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (!editor) return;
        
            const success = editor
              .chain()
              .focus()
              .deleteTable()
              .run();
        
            console.log("Delete table succeeded:", success);
          }}
          className="rounded border px-3 py-1"
        >
          Delete Table
        </button>

        <button
        onClick={() => setShowImagePicker(!showImagePicker)}
        className="rounded border px-3 py-1"
        >
          Select Image
        </button>
      </div>

      {showImagePicker && (
        <div className="border-b p-4">
          <h3 className="mb-3 font-semibold">Select an Image</h3>
          
          {images.length === 0 ? (
            <p>No images found.</p>
          ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image) => (
              <button
              key={image.name}
              onClick={() => {
                editor
                .chain()
                .focus()
                .setImage({
                  src: image.url,
                })
                .run();
                
                setShowImagePicker(false);
                setMessage("Image inserted successfully!");
              }}
              className="overflow-hidden rounded border hover:ring-2"
              >
                <Image
                src={image.url}
                alt={image.name}
                width={300}
                height={200}
                className="h-32 w-full object-cover"
                />
                
                <div className="truncate p-2 text-sm">
                  {image.name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    )}

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