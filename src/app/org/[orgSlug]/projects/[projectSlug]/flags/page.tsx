"use client"

import * as React from "react"
import FlagList from "@/features/flags/components/FlagList"


export default function FlagListPage({ params }: { params: Promise<{ projectSlug: string, orgSlug: string }> }) {

    const { projectSlug, orgSlug } = React.use(params)
    
return (
    <div> 
        <FlagList projectSlug={projectSlug} orgSlug={orgSlug} />
    </div>
    )
}