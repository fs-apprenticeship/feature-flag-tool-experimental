"use client"

import * as React from "react"
import EnvironmentList from "@/features/environments/components/EnvironmentList"


export default function EnvironmentListPage({ params }: { params: Promise<{ projectSlug: string, orgSlug: string }> }) {

    const { projectSlug, orgSlug } = React.use(params)
    
return (
    <div> 
        <EnvironmentList projectSlug={projectSlug} orgSlug={orgSlug} />
    </div>
    )
}