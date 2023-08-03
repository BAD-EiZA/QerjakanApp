import useSWR from 'swr';

import fetcher from '@/app/libs/fetcher';


const useSubCat = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/getsubcat', fetcher);

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useSubCat;
