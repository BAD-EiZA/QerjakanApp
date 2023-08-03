import useSWR from 'swr';
import fetcher from '@/app/libs/fetcher';
const useUpdateNotif = (shouldFetch:boolean) => {
  const { data, error, isLoading, isValidating,  mutate } = useSWR(shouldFetch ? '/api/notification/getUpdate': '', fetcher, {refreshInterval:3000,dedupingInterval: 5000});

  return {
    data,
    error,
    isValidating,
    isLoading,
    mutate
  }
};

export default useUpdateNotif;
