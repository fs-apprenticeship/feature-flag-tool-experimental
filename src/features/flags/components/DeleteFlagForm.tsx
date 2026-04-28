"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDeleteFlag } from "../hooks/useDeleteFlag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/shared/Loader";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DeleteFlagFormProps {
  orgSlug: string;
  projectSlug: string;
  flagId: string;
  flagName: string;
}

export default function DeleteFlagForm({
  orgSlug,
  projectSlug,
  flagId,
  flagName,
}: DeleteFlagFormProps) {
  const router = useRouter();
  const [confirmName, setConfirmName] = useState("");

  const { mutate, isPending, error } = useDeleteFlag(orgSlug, projectSlug);

  const canDelete = confirmName === flagName;
  const errorMessage = (error as Error)?.message;

  const handleDelete = () => {
    if (!canDelete) return;

    mutate({
      orgSlug,
      projectSlug,
      flagId,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Card className="w-full sm:max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl text-red-700">
            Delete Feature Flag
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p>
            You are about to delete <strong>{flagName}</strong>. This action
            cannot be undone.
          </p>

          <p className="text-sm text-gray-600">
            Type <strong>{flagName}</strong> to confirm deletion.
          </p>

          <Input
            value={confirmName}
            onChange={(event) => setConfirmName(event.target.value)}
            placeholder={flagName}
            disabled={isPending}
          />

          {errorMessage && <p className="text-red-700">{errorMessage}</p>}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push(`/org/${orgSlug}/projects/${projectSlug}/flags`)
            }
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={!canDelete || isPending}
          >
            {isPending ? <Loader /> : "Delete Flag"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}