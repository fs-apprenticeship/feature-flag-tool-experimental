import { useQuery } from '@tanstack/react-query';
import { getEnvironment } from '../services/getEnvironments';
import { Environment } from "../models/Environment";
import { EnvironmentKeys } from "./keys";

export const useGetEnvironment = (projectSlug: string, orgSlug: string) => {
    return useQuery<Environment[], Error>({
        queryKey: [...EnvironmentKeys.list(), orgSlug, projectSlug],
        queryFn: () => getEnvironment(projectSlug, orgSlug)
    })
}