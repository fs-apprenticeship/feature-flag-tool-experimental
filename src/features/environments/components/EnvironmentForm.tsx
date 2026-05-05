import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useCreateEnvironment } from "../hooks/useCreateEnvironments";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { EnvironmentInput } from "../models/Environment";


const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters."),
  description: z
    .string()
    .optional(),
  type: z.enum(["development", "staging", "production"]).optional(),
})

interface EnvironmentFormProps {
    initialData?: EnvironmentInput;
    formId: string; 
    onSubmit: (data: EnvironmentInput) => void;
    errorMessage?: string;
}

export default function EnvironmentForm({ 
  initialData, 
  formId = "env-form",
  onSubmit, 
  errorMessage 
}: 
  EnvironmentFormProps
) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || 
        { name: "", description: "", type: "development" }
    })
    
    return (            
         <form id={formId} onSubmit={form.handleSubmit((data: EnvironmentInput) => onSubmit(data))}>
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
                    />
                    </Field>
                )}
                />

                <Controller
                    name="type"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="env-type">Environment Type</FieldLabel>
                        <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                        >
                            <SelectTrigger id="env-type" className="w-full">
                            <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="staging">Staging</SelectItem>
                            <SelectItem value="production">Production</SelectItem>
                            </SelectContent>
                        </Select>
                        </Field>
                    )}
                    />
            </FieldGroup>
           
        </form>
    )

}

