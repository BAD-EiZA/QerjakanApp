import useSWR from 'swr';
import fetcher from '@/app/libs/fetcher';
const useTransactionNotif = (shouldFetch: boolean) => {
  const { data, error, isLoading, mutate } = useSWR(shouldFetch ? '/api/notification/getTransaction': '', fetcher, {refreshInterval:3000, dedupingInterval: 5000});
  
  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useTransactionNotif;
