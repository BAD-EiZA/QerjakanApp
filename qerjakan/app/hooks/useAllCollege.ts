import useSWR from 'swr';

import fetcher from '@/app/libs/fetcher';


const useAllCollege = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/colleges', fetcher);

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useAllCollege;
