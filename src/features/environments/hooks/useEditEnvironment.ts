import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Environment, EditEnvironmentOptions } from '../models/Environment';
import { EnvironmentKeys } from './keys';
import { editEnvironment } from '../services/editEnvironment'

export const useEditEnvironment = (orgSlug: string, projectSlug: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: EnvironmentKeys.edit(),

    mutationFn: ({envId, data}: EditEnvironmentOptions) =>
      editEnvironment(orgSlug, projectSlug, envId, data),

    onSuccess: (updatedEnvironment) => {
      queryClient.setQueryData(
        EnvironmentKeys.list(),
        (old: Environment[] = []) =>
          old.map((env) =>
            env.id === updatedEnvironment.id ? updatedEnvironment : env
          )
      );

      queryClient.invalidateQueries({ queryKey: EnvironmentKeys.list() });

    },

    onError: (error) => {
      console.error("Edit failed:", error);
    },
  });
};