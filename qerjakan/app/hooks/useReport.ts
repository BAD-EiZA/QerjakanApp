import useSWR from 'swr';

import fetcher from '@/app/libs/fetcher';


const useReports = (orderid:string) => {
  const { data, error, isLoading, mutate } = useSWR(orderid ? `/api/getReport/${orderid}` : null, fetcher);

  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useReports;
