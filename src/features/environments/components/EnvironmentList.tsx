import {
Table, 
TableBody, 
TableCell, 
TableHead,
TableHeader,
TableRow, 
} from "@/components/ui/table"
import { Trash2, Pencil, PlusIcon } from 'lucide-react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";

import { useGetEnvironment } from "@/features/environments/hooks/useGetEnvironments";
import { useCreateEnvironment } from "../hooks/useCreateEnvironments";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"


interface EnvironmentListProps {
    projectSlug: string
    orgSlug: string
}

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters."),
  description: z
    .string()
    .optional(),
})

export default function EnvironmentList({projectSlug, orgSlug}: EnvironmentListProps) {

    const router = useRouter()
    const { 
    data: environments, 
    isLoading: isEnvsLoading, 
    error: envsError
} = useGetEnvironment(projectSlug, orgSlug)

    const { mutate, isPending, error: createError } = useCreateEnvironment(orgSlug,projectSlug)
    const errorMessage = (createError as Error)?.message;

     const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          description: "",
        }
      })
    
      const onSubmit = (data: z.infer<typeof formSchema>) => {
        mutate({
            orgSlug: orgSlug,       
            projectSlug: projectSlug, 
            data: data, 
        });
        }

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
    <Dialog>
      <form id="env-form" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogTrigger>
                <Button variant="outline"> <PlusIcon/>Create Environment</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Create Environment</DialogTitle>
                    <DialogDescription>
                   Use environments to maintain separate rollout rules in different contexts, from local to production.
                    </DialogDescription>
                </DialogHeader>
                <FieldGroup>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="env-name">Environment Name  
                    </FieldLabel>
                    <Input
                    {...field} 
                    id="env-name"
                    aria-invalid={fieldState.invalid}
                        placeholder="Development"
                        autoComplete="off"
                        required
                    />
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                    {errorMessage && (
                        <p className="text-red-700"> {errorMessage} </p>
                    )}
                    </Field>
                    )}
                    />

                     <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="env-description">
                        Description
                    </FieldLabel>
                     <Input
                    {...field} 
                    id="env-description"
                    aria-invalid={fieldState.invalid}
                        placeholder="Development"
                        autoComplete="off"
                        required
                    />
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                    </Field>
                )}
                />
            </FieldGroup>
                <DialogFooter>
                    <DialogClose>
                    <Button variant="outline">Cancel</Button>
                    </DialogClose>
                     <DialogClose>

                    <Button type="submit" form="env-form">
                      {isPending ? 
                          <Loader/> : <p> Create </p> }
                      </Button>
                    </DialogClose>
                                    
                </DialogFooter>
                </DialogContent>
            </form>
            </Dialog>
            </div>
            <div> 
           <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50 ">
          <TableRow>
            <TableHead className="w-75 pl-5">Name</TableHead>
            <TableHead className="w-250">Description</TableHead>
             <TableHead className="w-75">Key</TableHead>
            {/* <TableHead className="w-[300px]">Type</TableHead> */}
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
                {/* <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {env.type || "Standard"}
                  </Badge>
                </TableCell> */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="hover:text-blue-600">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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