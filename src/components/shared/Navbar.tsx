"use client";

import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

import Link from "next/link";
import { useRouter } from "next/navigation";





export default function Navbar() {
    const router = useRouter()
    return ( 
    <header className="flex justify-between items-center p-4 gap-4 h-16 mx-12">
        <div className="flex items-center gap-4 text-2xl font-bold">
            <h1> Feature Flags </h1>
            <Show when="signed-out">
            <button onClick={()=> router.push("/auth-sync")} className="bg-[#00B3E6] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer"
      >
                TRY ME
            </button>
            </Show>
            <Show when="signed-in">
            <button onClick={()=> router.push("/auth-sync")} className="bg-[#00B3E6] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer"
      >
                Organization
            </button>
            </Show>
        </div>
        
        <div className="flex gap-4 items-center"> 
        <Show when="signed-out">
            <SignInButton forceRedirectUrl={"/auth-sync"}/>
            <SignUpButton forceRedirectUrl={"/auth-sync"}>
            <button className="bg-[#00B3E6] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign Up
            </button>
            </SignUpButton>
            {/* <Link
            href="/org/flatiron-school/projects/fis-demo/flags"
            className="bg-blue-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 inline-flex items-center"
            >
            </Link> */}
            <button onClick={()=> router.push("/")} className="bg-[#00B3E6] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Home
            </button>
        </Show>
        
            
        <Show when="signed-in">  
            <UserButton />
            <Link
            href="/protected"
            className="bg-red-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 inline-flex items-center"
            >
            Protected Page
            </Link>
            <button onClick={()=> router.push("/")} className="bg-[#00B3E6] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Home
            </button>
        </Show> 
        </div>
    </header>
    )
}
