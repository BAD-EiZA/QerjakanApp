import useSWR from 'swr';
import fetcher from '@/app/libs/fetcher';
const useNotif = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/notification/getNotification', fetcher, {refreshInterval:1000});

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useNotif;
