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
import Loader from "@/components/shared/Loader";
import { useGetEnvironment } from "@/features/environments/hooks/useGetEnvironments";

interface EnvironmentListProps {
    projectSlug: string
    orgSlug: string
}

export default function EnvironmentList({projectSlug, orgSlug}: EnvironmentListProps) {

    const router = useRouter()
    const { 
    data: environments, 
    isLoading: isEnvsLoading, 
    error: envsError
} = useGetEnvironment(projectSlug, orgSlug)

    if (isEnvsLoading) { 
        return <Loader />
    }

    if (envsError?.message === "PROJECT_NOT_FOUND") {
        return <h1> Project Not Found </h1>;
    }

return ( 
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex flex-col gap-5 m-10"> 
            <div className="flex justify-between">
                <h2 className="flex text-3xl font-semibold"> 
                {orgSlug} / { projectSlug }  / environments
                </h2>
                <Button 
                    variant="outline"
                    size="lg"
                    onClick={(()=> router.push(`/org/${orgSlug}/projects/${projectSlug}/flags/new`))}>
                    Create Environment <PlusIcon/> 
                </Button>
            </div>
            <div className="flex flex-wrap gap-10"> 
            {   environments ?  
                environments.map((env) => 
                <Card className=" min-w-md py-5" key={env.id}>
                <CardHeader className="px-4 py-1">
                    <CardTitle className="bg-gray-100 rounded-sm px-2 inline-block w-fit"> 
                        {env.name}
                    </CardTitle>
                    <CardDescription className="px-2 py-1 min-h-12">
                        {env.description}
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
            </Card> )
            :
            <>
                <h2> No environments yet. </h2>
            </>
            }
                </div>
            </div>
        </div>
        )
}
  