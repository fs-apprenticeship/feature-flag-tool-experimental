import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DeleteFlagOptions, FeatureFlag } from "../models/FeatureFlag";
import { flagKeys } from "./keys";
import { deleteFlag } from "../services/deleteFlag";

export const useDeleteFlag = (orgSlug: string, projectSlug: string) => {
  const queryClient = useQueryClient();
    const router = useRouter();

  return useMutation({
    mutationKey: flagKeys.delete(),

    mutationFn: ({ flagId }: DeleteFlagOptions) =>
      deleteFlag(orgSlug, projectSlug, flagId),

    onSuccess: (_, variables) => {
      const key = flagKeys.list();

      queryClient.setQueryData(
        key,
        (old: FeatureFlag[] = []) =>
          old.filter((flag) => flag.id !== variables.flagId)
      );

      router.push(`/org/${orgSlug}/projects/${projectSlug}/flags`);
    },

    onError: (error) => {
      console.error("Delete failed:", error);
    },
  });
};