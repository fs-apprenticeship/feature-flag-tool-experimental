import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
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
import { Plus, X } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters."),
  description: z
    .string()
    .optional(),
  developmentEnabled: z.boolean(),
  stagingExists: z.boolean(),
  stagingEnabled: z.boolean(),
  productionExists: z.boolean(),
  productionEnabled: z.boolean(),
})

interface NewFlagFormProps {
    projectSlug: string
    orgSlug: string
}


export default function NewFlagForm({ projectSlug, orgSlug}: NewFlagFormProps) {
  
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      developmentEnabled: false, 
      stagingExists: false, 
      stagingEnabled: false,
      productionExists: false, 
      productionEnabled: false
    },
  })

  const stagingExists = useWatch({
    control: form.control,
    name: "stagingExists"
  })
  
  const productionExists = useWatch({
    control: form.control,
    name: "productionExists"
  })


  function onSubmit(data: z.infer<typeof formSchema>) {
      console.log("Submitted",data)
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
            <FieldGroup >
                <FieldLabel htmlFor="form-rhf-environment" className="text-lg mt-4"> Environments </FieldLabel>
                <Field className="flex flex-row">
                <Controller
                    name="developmentEnabled"
                    control={form.control}
                    render={({ field }) => (
                        <Field orientation="vertical" className="min-h-16">
                            <FieldLabel htmlFor="form-rhf-dev" className="text-md my-0"> Development</FieldLabel>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </Field>
                    )}
                />

                {/* Staging */}
                {stagingExists ? ( 
                    <Controller
                        name="stagingEnabled"
                        control={form.control}
                        render={({ field }) => (
                            <Field orientation="vertical" className="min-h-16">
                                <FieldLabel htmlFor="form-rhf-stage" className="text-md my-0"> Staging 
                                    <Button size="xs" variant="ghost" className="w-fit"
                                            onClick={() => {
                                                form.setValue("stagingExists", false)
                                                form.setValue("stagingEnabled", false)
                                            }
                                        }> 
                                        <X /> 
                                    </Button> 
                                </FieldLabel>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </Field>
                        )}
                    />  
                ) : 
                <Field orientation="horizontal">
                    <Button type="button" size="sm" variant="outline" className="mt-2" onClick={() => form.setValue("stagingExists", true)}>
                        <Plus/> Staging
                    </Button>
                </Field>
                }
              
                {/* Production */}
                
                {productionExists ? 
                    <Controller
                    name="productionEnabled"
                    control={form.control}
                    render={({ field }) => (
                        <Field orientation="vertical">
                            <FieldLabel>Production
                                <Button size="xs" variant="ghost" className="w-fit"
                                            onClick={() => {
                                                form.setValue("productionExists", false)
                                                form.setValue("productionEnabled", false)
                                            }
                                        }> 
                                        <X /> 
                                    </Button> 
                            </FieldLabel>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </Field>
                    )}
                />
            :
             <Field orientation="horizontal"> 
                    <Button type="button" size="sm" variant="outline" className="mt-2" onClick={() => form.setValue("productionExists", true)}>
                        <Plus/> Production
                    </Button>
                </Field>   
            }
                </Field>
            </FieldGroup>
        </form>
        </CardContent>
        <CardFooter>
            <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={() => (router.push("/protected"))}>
                Back
            </Button>
            <Button type="submit" form="form-rhf-demo">
                Create Flag
            </Button>
            </Field>
        </CardFooter>
        </Card>
    </div>
  )
}

