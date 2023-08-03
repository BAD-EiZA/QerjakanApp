import useSWR from 'swr';

import fetcher from '@/app/libs/fetcher';


const useGetNotifications = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/notification', fetcher);

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useGetNotifications;
