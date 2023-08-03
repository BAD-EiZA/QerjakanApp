import useSWR from 'swr';

import fetcher from '@/app/libs/fetcher';


const useAllCollegeTitle = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/collegestitle', fetcher);

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useAllCollegeTitle;
