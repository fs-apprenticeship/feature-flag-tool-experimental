import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orgKeys } from '../../orgs/hooks/keys';
import { createOrg } from '../services/createOrg';
import { useRouter } from "next/navigation";
import {CreateOrgOptions, Organization } from '../models/Organization';

export const useCreateOrg = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationKey: orgKeys.create(),
    mutationFn: ({ data }: CreateOrgOptions ) => 
    createOrg(data),
    onSuccess: (org: Organization) => {
      router.push(`/org/${org.slug}`);
    },  
    });
};
