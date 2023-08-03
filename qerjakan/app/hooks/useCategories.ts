import useSWR from 'swr';

import fetcher from '@/app/libs/fetcher';


const useAllCategories = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/categories', fetcher);

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useAllCategories;
