"use client"
import { useRouter } from "next/navigation";
export default function ProtectedPage() {

  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          This is a protected page!
        </h1>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
         <button onClick={()=> router.push("/org/example-organization/projects/sample-project/flags/new")} className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]">
           Create a flag
         </button>
         <button onClick={()=> router.push("/org/example-organization/projects/sample-project/flags")} className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]">
           See all flags
         </button>
         </div>
      </main>
    </div> 
  );
}