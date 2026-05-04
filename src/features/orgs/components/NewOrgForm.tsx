"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { redirect, useRouter } from "next/navigation";
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
import { useCreateOrg } from "../hooks/useCreateOrg";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});

export default function NewOrgForm() {
  const router = useRouter();
  const { mutate, isPending, error } = useCreateOrg();
  const errorMessage = (error as Error)?.message;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutate(
      { data },
      {
        onSuccess: (org) => {
          router.push(`/org/${org.slug}`);
        },
      },
    );
  };

  const onBack = () => {
    router.push("/auth-sync");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <Card className="w-full sm:max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl">Create New Organization</CardTitle>
        </CardHeader>

        <CardContent>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-org-name" className="text-lg">
                      Org Name <span className="text-gray-500">*</span>
                    </FieldLabel>

                    <Input
                      {...field}
                      id="form-rhf-org-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Acme"
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
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => onBack()}
            >
              Back
            </Button>

            <Button type="submit" form="form-rhf-demo" disabled={isPending}>
              {isPending ? <Loader /> : <p>Create Organization</p>}
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}