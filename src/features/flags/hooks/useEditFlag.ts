import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FeatureFlag, EditFlagOptions } from '../models/FeatureFlag';
import { flagKeys } from './keys';
import { editFlag } from '../services/editFlag';
import { useRouter } from "next/navigation";

export const useEditFlags = (orgSlug: string, projectSlug: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: flagKeys.edit(),

    mutationFn: ({ flagId, data }: EditFlagOptions) =>
      editFlag(orgSlug, projectSlug, flagId, data),

    onSuccess: (updatedFlag) => {
      queryClient.setQueryData(
        flagKeys.list(orgSlug, projectSlug),
        (old: FeatureFlag[] = []) =>
          old.map((flag) =>
            flag.id === updatedFlag.id ? updatedFlag : flag
          )
      );

      router.push(`/org/${orgSlug}/projects/${projectSlug}/flags`);
    },

    onError: (error) => {
      console.error("Edit failed:", error);
    },
  });
};
