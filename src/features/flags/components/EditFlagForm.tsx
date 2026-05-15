"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useEditFlags } from "../hooks/useEditFlag";
import { FeatureFlag } from "../models/FeatureFlag";

import { Button } from "@/components/ui/button";
import Loader from "@/components/shared/Loader";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  environments: z.array(
    z.object({
      environmentId: z.string(),
      name: z.string(),
      enabled: z.boolean(),
    })
  ),
});

interface EditFlagFormProps {
  orgSlug: string;
  projectSlug: string;
  flag: FeatureFlag;
}

export default function EditFlagForm({
  orgSlug,
  projectSlug,
  flag,
}: EditFlagFormProps) {
  const router = useRouter();
  const { mutate, isPending, error } = useEditFlags(orgSlug, projectSlug);
  const errorMessage = (error as Error)?.message;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: flag.name,
      description: flag.description ?? "",
      environments: flag.environments.map((env) => ({
        environmentId: env.id,
        name: env.name,
        enabled: env.enabled,
      })),
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutate({
      orgSlug,
      projectSlug,
      flagId: flag.id,
      data: {
        name: data.name,
        description: data.description,
        environments: data.environments.map((env) => ({
          environmentId: env.environmentId,
          enabled: env.enabled,
        })),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-semibold mb-5">
        {orgSlug} / {projectSlug}
      </h2>

      <Card className="w-full sm:max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl">Edit Flag</CardTitle>
        </CardHeader>

        <CardContent>
          <form id="edit-flag-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-lg">
                      Flag Name <span className="text-gray-500">*</span>
                    </FieldLabel>

                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                      required
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}

                    {errorMessage && (
                      <p className="text-red-700">{errorMessage}</p>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-lg">Description</FieldLabel>

                    <InputGroup>
                      <InputGroupTextarea
                        {...field}
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

            <FieldGroup>
              <FieldLabel className="text-lg mt-4">
                Environments
              </FieldLabel>

              <Field className="flex flex-row gap-4">
                {form.watch("environments").map((env, index) => (
                  <Controller
                    key={env.environmentId}
                    name={`environments.${index}.enabled`}
                    control={form.control}
                    render={({ field }) => (
                      <Field orientation="vertical" className="min-h-16">
                        <FieldLabel className="text-md my-0">
                          {env.name}
                        </FieldLabel>

                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
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
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(`/org/${orgSlug}/projects/${projectSlug}/flags`)
              }
            >
              Back
            </Button>

            <Button type="submit" form="edit-flag-form">
              {isPending ? <Loader /> : <p>Save Changes</p>}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}