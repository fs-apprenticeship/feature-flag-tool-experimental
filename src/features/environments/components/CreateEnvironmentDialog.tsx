import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useCreateEnvironment } from "../hooks/useCreateEnvironments";
import Loader from "@/components/shared/Loader";
import { useState } from "react";
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
import { Pencil, PlusIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";


interface CreateEnvironmentProps {
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

export default function CreateEnvironmentDialog({projectSlug,orgSlug}: CreateEnvironmentProps) {
    const { mutate, isPending, error: createError } = useCreateEnvironment(orgSlug,projectSlug)
    const errorMessage = (createError as Error)?.message;
    const [open, setOpen] = useState(false);
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
            },{onSuccess: () => {
              setOpen(false);
              form.reset();
            },
            onError: (error) => {
              // The modal stays open here automatically!
              console.error("Submission failed:", error);
            }
        })
            }
    
            return (
                 <Dialog open={open} onOpenChange={setOpen}>
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
      
                    <Button type="submit" form="env-form" disabled={isPending}>
                      {isPending ? 
                          <Loader/> : <p> Create </p> }
                      </Button>

                                    
                </DialogFooter>
                </DialogContent>
            </form>
            </Dialog>
            )

}

