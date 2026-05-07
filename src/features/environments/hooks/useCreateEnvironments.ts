import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Environment, CreateEnvironmentOptions } from "../models/Environment";
import { createEnvironment } from "../services/createEnvironments";
import { useRouter } from "next/navigation";
import { EnvironmentKeys } from './keys';

export const useCreateEnvironment = (orgSlug: string ,projectSlug: string) => {
    const queryClient = useQueryClient()
    const router = useRouter(); 

    return useMutation({
        mutationKey: EnvironmentKeys.create(),
        mutationFn: ({ orgSlug, projectSlug, data } : CreateEnvironmentOptions ) => 
        createEnvironment(orgSlug,projectSlug,data),
        onSuccess: (environment: Environment) => {
            const existingEnv = queryClient.getQueryData(EnvironmentKeys.list());
        if (existingEnv) {
            queryClient.setQueryData(
                EnvironmentKeys.list(),
                (old: Environment[]) => [environment,...old]
            )
        }
        else {
            queryClient.invalidateQueries({queryKey: EnvironmentKeys.list()})
         }
         router.push(`/org/${orgSlug}/projects/${projectSlug}/environments`);
        }
    })
}