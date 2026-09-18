"use client"

import { useEffect } from "react"; 
import { useRouter } from "next/navigation"; 
import { supabase } from "@/lib/supabase/client";
import Editor from "@/components/editor";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {data} = await supabase.auth.getUser();

      if(!data.user){
        router.push("/admin/login");
      }
    };
    checkUser();
  }, [router]);

  return ( 
  <main className="mx-auto max-w-4xl p-8"> 
  <h1 className="mb-6 text-3xl font-bold"> 
    Website Admin 
    </h1> 
    
    <Editor /> 
    </main> 
    ); 
  }