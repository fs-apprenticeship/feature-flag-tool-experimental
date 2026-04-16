"use client";

import { Spinner } from "@/components/ui/spinner"

export default function Loader() {
    return ( 
        <div className="min-h-screen flex flex-item items-center justify-center"> 
            <Spinner className="size-8"/>
        </div>
    )
}
