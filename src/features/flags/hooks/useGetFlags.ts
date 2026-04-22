import { useQuery } from '@tanstack/react-query';
import { getFlagList } from '../services/getFlagList';
import { FeatureFlag } from '../models/FeatureFlag';
import { flagKeys } from './keys';

export const useGetFlags = (projectSlug: string, orgSlug: string, ) => {
  return useQuery<FeatureFlag[], Error>({
    queryKey: [...flagKeys.list(), orgSlug, projectSlug], 
    queryFn: () => getFlagList(projectSlug, orgSlug)
  });
};