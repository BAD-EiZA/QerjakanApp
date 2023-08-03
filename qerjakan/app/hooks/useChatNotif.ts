import useSWR from 'swr';
import fetcher from '@/app/libs/fetcher';
const useChatNotif = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/getchatnotif', fetcher, {refreshInterval:3000});

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useChatNotif;
