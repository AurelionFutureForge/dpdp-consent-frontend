"use client";

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const { data: session } = useSession();
  return (
    <div>
      <h1>Welcome, {session?.user?.name}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}