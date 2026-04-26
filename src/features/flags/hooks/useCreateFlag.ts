import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FeatureFlag, CreateFlagOptions } from '../models/FeatureFlag';
import { flagKeys } from './keys';
import { createFlag } from '../services/createFlag';
import { useRouter } from "next/navigation";

export const useCreateFlags = (orgSlug: string, projectSlug: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: flagKeys.create(),
    mutationFn: ({ orgSlug, projectSlug, data }: CreateFlagOptions ) => 
    createFlag(orgSlug, projectSlug, data),
    onSuccess: (flag: FeatureFlag) => {
      const existingFlag = queryClient.getQueryData(flagKeys.list());
    if (existingFlag) {
      queryClient.setQueryData(
        flagKeys.list(),
        (old: FeatureFlag[]) => [flag, ...old],
      );
    } else {
      queryClient.invalidateQueries({ queryKey: flagKeys.list() });
    }
    router.push(`/org/${orgSlug}/projects/${projectSlug}/flags`);
      },
    });
};
