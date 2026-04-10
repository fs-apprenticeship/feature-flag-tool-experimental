"use client"

import { Flag, ToggleLeft, CloudCog, Users} from 'lucide-react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {  SignUpButton } from '@clerk/nextjs'


import FlagList from '@/features/flags/components/FlagList';

export default function Home() {

  const features = [
  {
    icon: <ToggleLeft size={32} />,
    title: "Instant toggles",
    desc: "Turn features on and off in real time without redeploying or touching code.",
  },
  {
    icon: <CloudCog size={32} />,
    title: "Multi-environment",
    desc: "Separate flag states for development, staging, and production with a SDK key.",
  },
  {
    icon: <Users size={32} />,
    title: "Collaboration",
    desc: "Organize features by organizations and projects. ",
  },
]

  const router = useRouter()

  return (

    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 font-sans dark:bg-black gap-30">
      <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="flex items-center mb-2 text-4xl font-bold text-heading md:text-5xl lg:text-6xl gap-4">
            <div className="bg-[#00B3E6] flex h-16 w-16 items-center justify-center rounded-xl" > 
              <Flag size={42} strokeWidth={2} color="white"/>
            </div>  
            Feature Flags </h1>
          <h5 className="mb-4 text-lg font-normal text-body lg:text-xl">
            Toggle features across every environment without redeploying. 
          </h5>
          <SignUpButton> 
            <Button size="lg" className="rounded-4xl py-6 px-10"> Sign up </Button>
          </SignUpButton>
        </div>
      
        {/* <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
         <button onClick={()=> router.push("org/flatiron-school/projects/fis-demo/flags/new")} className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]">
           Create a flag
         </button>
         <button onClick={()=> router.push("org/flatiron-school/projects/fis-demo/flags")} className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]">
           See all flags
         </button> */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 w-full max-w-5xl">
        {features.map((f) => (
          <Card key={f.title} className="p-10">
            <CardContent className="p-0 flex flex-col gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e0f7fd] text-[#00B3E6]">
                {f.icon}
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{f.title}</p>
              <p className="text-md text-gray-500 leading-relaxed">{f.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
        
    </div>
  );
}
