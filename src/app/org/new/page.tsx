"use client"

import NewOrgForm from "@/features/orgs/components/NewOrgForm"


export default function NewOrgPage({ params }: { params: Promise<[]> }) {
  
  return (
   <div>
    <NewOrgForm />
   </div>
  )
}
