import {
Table, 
TableBody, 
TableCell, 
TableHead,
TableHeader,
TableRow, 
} from "@/components/ui/table"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import { useGetEnvironment } from "@/features/environments/hooks/useGetEnvironments";
import { DeleteEnvironmentDialog } from "./DeleteEnvironmentDialog";
import CreateEnvDialog from "./CreateEnvDialog"
import EditEnvDialog from "./EditEnvDialog";

interface EnvironmentListProps {
  // initialData: Environment[]; 
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
              <CreateEnvDialog orgSlug={orgSlug} projectSlug={projectSlug}/>
            </div>
            <div> 
           <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50 ">
          <TableRow>
            <TableHead className="w-75 pl-5">Name</TableHead>
            <TableHead className="w-250">Description</TableHead>
             <TableHead className="w-75">Key</TableHead>
             <TableHead className="w-75">Type</TableHead>
            <TableHead className="text-right pr-5">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {environments && environments.length > 0 ? (
            environments.map((env) => (
              <TableRow key={env.id}>
                <TableCell className="font-semibold text-zinc-900 pl-5">
                  {env.name}
                </TableCell>
                <TableCell>
                    {env.description}
                </TableCell>
                 <TableCell>
                    {env.key}
                </TableCell>
                  <TableCell>
                    {env.type}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditEnvDialog orgSlug={orgSlug} projectSlug={projectSlug} envId={env.id} 
                    initialData={{name: env.name, description: env.description, type: env.type as "development"}}/> 
                    <DeleteEnvironmentDialog orgSlug={orgSlug} projectSlug={projectSlug} envId={env.id} /> 
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                No environments found for this project.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
    </div>

  </div>
      <Button 
        variant="ghost"
        size="lg"
        onClick={()=> router.push("/org/example-organization/projects/sample-project/flags")}
        >
        See all flags 
     </Button>
</div>
</div> )}