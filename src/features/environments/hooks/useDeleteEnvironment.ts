import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteEnvOptions, Environment } from "../models/Environment";
import { EnvironmentKeys } from "./keys";
import { deleteEnvironment } from "../services/deleteEnvironment";

export const useDeleteEnvironment = (orgSlug: string, projectSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: EnvironmentKeys.delete(),

    mutationFn: ({ envId }: DeleteEnvOptions) =>
      deleteEnvironment(orgSlug, projectSlug, envId),

    onSuccess: (_, variables) => {
      const key = EnvironmentKeys.list();

      queryClient.setQueryData(
        key,
        (old: Environment[] = []) =>
          old.filter((flag) => flag.id !== variables.envId)
      );
      queryClient.invalidateQueries({ queryKey: key });
    },

    onError: (error) => {
      console.error("Delete failed:", error);
    },
  });
};