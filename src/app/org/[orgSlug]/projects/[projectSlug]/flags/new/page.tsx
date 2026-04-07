"use client"

import * as React from "react"
import NewFlagForm from "@/features/flags/components/NewFlagForm"

export default function NewFlagPage({ params }: { params: Promise<{ projectSlug: string, orgSlug: string }> }) {
  
   const { projectSlug, orgSlug } = React.use(params)
   
  return (
   <div>
    <NewFlagForm projectSlug={projectSlug} orgSlug={orgSlug} />
   </div>
  )
}
