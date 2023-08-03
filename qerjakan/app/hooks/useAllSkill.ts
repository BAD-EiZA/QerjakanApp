import useSWR from 'swr';

import fetcher from '@/app/libs/fetcher';


const useAllSkill = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/skills', fetcher);

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useAllSkill;
