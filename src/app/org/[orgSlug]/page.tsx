"use client";

import { useParams } from "next/navigation";

export default function ProtectedPage() {
  const params = useParams();
  const orgSlug = params.orgSlug as string;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center gap-6 px-16 py-20 bg-white dark:bg-black sm:items-start">
        
        <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">
          This is the Organization's {orgSlug} page!
        </h1>

        <p className="text-lg text-muted-foreground">
          Welcome to your organization dashboard where all your projects will eventually be displayed.
        </p>

      </main>
    </div>
  );
}