import useSWR from 'swr';

import fetcher from '@/app/libs/fetcher';


const useAllLanguages = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/languages', fetcher);

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useAllLanguages;
