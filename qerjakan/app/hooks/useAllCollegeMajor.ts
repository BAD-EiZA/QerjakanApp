import useSWR from 'swr';

import fetcher from '@/app/libs/fetcher';


const useAllCollegeMajor = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/collegesmajor', fetcher);

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useAllCollegeMajor;
