"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function Home() {
  const { me, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    router.replace(me ? "/dashboard" : "/login");
  }, [me, ready, router]);

  return (
    <main className="grid min-h-screen place-items-center">
      <div className="animate-pulse text-slate-500">Loading…</div>
    </main>
  );
}
