
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm} from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation";
import { useCreateFlags } from "../hooks/useCreateFlag";
import { useGetEnvironment } from "@/features/environments/hooks/useGetEnvironments";
import { Button } from "@/components/ui/button"
import Loader from "@/components/shared/Loader";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters."),
  description: z
    .string()
    .optional(),
  environments: z.record(z.string(), z.boolean().catch(false)) 
})

interface NewFlagFormProps {
    projectSlug: string
    orgSlug: string
}


export default function NewFlagForm({ projectSlug, orgSlug}: NewFlagFormProps) {
  const { 
    data: environments, 
    isLoading: isEnvsLoading, 
    error: envsError
} = useGetEnvironment(projectSlug, orgSlug)

  const { mutate, isPending, error: createError } = useCreateFlags(orgSlug, projectSlug);

  const errorMessage = (createError as Error)?.message;

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      environments: environments 
      ? Object.fromEntries(environments.map(e => [e.id, false])) 
      : {}
    }
  })


  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutate({
        orgSlug: orgSlug,       
        projectSlug: projectSlug, 
        data: data         
    });
    }

     if (isEnvsLoading) { 
            return <Loader />
        }
    
        if (envsError?.message === "ENV_NOT_FOUND") {
            return <h1> Env Not Found </h1>;
        }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-semibold mb-5">
        { orgSlug } / { projectSlug }
        </h2>
        <Card className="w-full sm:max-w-xl">
        <CardHeader>
            <CardTitle className="text-xl">Create New Flag</CardTitle>
        </CardHeader>
        <CardContent>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-flag-name" className="text-lg" >
                        Flag Name <span className="text-gray-500 mx-0">*</span>
                    </FieldLabel>
                    <Input
                        {...field}
                        id="form-rhf-flag-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g. lesson-demo"
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
                    <FieldLabel htmlFor="form-rhf-description" className="text-lg">
                        Description
                    </FieldLabel>
                    <InputGroup>
                        <InputGroupTextarea
                        {...field}
                        id="form-rhf-description"
                        placeholder="Optional"
                        rows={4}
                        className="min-h-24 resize-none"
                        aria-invalid={fieldState.invalid}
                        />
                    </InputGroup>
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                    </Field>
                )}
                />
            </FieldGroup>

            {/* Environments */}

            <FieldGroup>
                <FieldLabel htmlFor="form-rhf-environment" className="text-lg mt-4"> Environments </FieldLabel>
                <Field className="flex flex-row">
                    {environments?.map((env) => (
                <Controller
                    name={`environments.${env.id}`}
                    key={env.id}
                    control={form.control}
                    render={({ field }) => (
                        <Field orientation="vertical" className="min-h-16">
                            <FieldLabel htmlFor="form-rhf-dev" className="text-md my-0"> 
                                {env.name} 
                            </FieldLabel>
                            <Switch
                                checked={field.value ?? false}
                                onCheckedChange={(checked) => field.onChange(checked)}
                            />
                        </Field>
                    )}
                />
                ))}
                </Field>
            </FieldGroup>
        </form>
        </CardContent>
        <CardFooter>
            <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={() => (router.push(`/org/${orgSlug}/projects/${projectSlug}/flags`))}>
                Back
            </Button>
            <Button type="submit" form="form-rhf-demo">
              {isPending ? 
              <Loader/> : 
              <p> Create Flag</p>} 
            </Button>
            </Field>
        </CardFooter>
        </Card>
    </div>
  )
}

