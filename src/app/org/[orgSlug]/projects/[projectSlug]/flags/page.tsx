"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription, 
  CardHeader,
  CardTitle,
  CardAction
} from "@/components/ui/card"
import { Trash2, Pencil, PlusIcon } from 'lucide-react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type EnvironmentType = "development" | "staging" | "production"

type FlagEnvironment = {
    id: string
    name: string
    type: EnvironmentType
    enabled: boolean
}

type FeatureFlag = {
    id: string
    name: string
    key: string
    description?: string
    environments: FlagEnvironment[]
}


export default function FlagList({ params }: { params: Promise<{ projectSlug: string, orgSlug: string }> }) {

    const router = useRouter()
    const { projectSlug, orgSlug } = React.use(params)

    // const mockFlags: FeatureFlag[] = [] 

    const mockFlags = [{   
    "id": 123,
    "name": "lesson-demo",
    "description": "This flag toggles the Lessons card on home page",
    "environments": [
        {   "id": "1", 
            "name": "Development", 
            "type": "development",
            "enabled": true,
        },
        {   "id": "2", 
            "name": "Staging", 
            "type": "staging",
            "enabled": false,
        },
         {  "id": "3",  
            "name": "Production", 
            "type": "production",
            "enabled": false,
        },
    ]
}
, {
    "id": 124,
    "name": "lesson-plan-demo",
    "description": "This flag toggles the Lesson Plan card on home page",
    "environments": [
        {   "id": "4",
            "name": "Development", 
            "type": "development",
            "enabled": true,
        },
        {   "id": "5",
            "name": "Staging", 
            "type": "staging",
            "enabled": true ,
        },
         {  "id": "6",
            "name": "Production", 
            "type": "production",
            "enabled": true,
        },
        
    ]
},
]

return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex flex-col gap-5 m-10"> 
            <div className="flex justify-between">
            <h2 className="flex text-3xl font-semibold"> 
             {orgSlug} / { projectSlug }  /  flags 
            </h2>
            <Button 
                variant="outline"
                size="lg"
                onClick={(()=> router.push("/org/flatiron-school/projects/fis-demo/flags/new"))}>
                Create flag <PlusIcon/> 
            </Button>
        </div>
        <div className="flex flex-wrap gap-10"> 
        {   mockFlags.length > 0 ?  
            mockFlags?.map((flag) => 
            <Card className=" min-w-md py-5" key={flag.id}>
            <CardHeader className="px-4 py-1">
                <CardTitle className="bg-gray-100 rounded-sm px-2 inline-block w-fit"> 
                    {flag.name}
                </CardTitle>
                <CardDescription className="px-2 py-1">
                      {flag.description}
                </CardDescription>
                <CardAction>
                <Button
                variant="ghost"
                size="icon"
                // onClick={() => onEdit(flag.id)}
                className="text-neutral-400 hover:text-[#00B3E6]"
                >
                <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                //   onClick={() => onDelete(flag.id)}
                  className="text-neutral-400 hover:text-red-500"
                >
                  <Trash2 />
                </Button>
        </CardAction>
                </CardHeader>
            <CardContent className="bg-gray-200 rounded-md p-2 mx-4 outline-1">
                <h2 className="mb-2 mx-1"> Environments </h2>
                <div className="flex gap-2">
                    {flag.environments.map((type) => 
                    <Badge
                        key={type.id}
                        className={`p-2.5 rounded-full ${type.enabled ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-zinc-500'}`}>
                        {type.name}
                    </Badge>
                    )}
                </div>
            </CardContent>
        </Card> )
        :
        <>
            <h2> No flags yet. </h2>
        </>
        }
            </div>
        </div>
    </div>
    )
}