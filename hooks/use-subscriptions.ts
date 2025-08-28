import fetcher from "@/lib/fitcher";
import useSwr from "swr";

const useSubscription = (email: string) => {
  const { data, isLoading, mutate } = useSwr(
    `/api/stripe/subscription?email=${email}`,
    fetcher
  );

  return {
    plan: data,
    isLoading,
    mutate,
  };
};

export default useSubscription;
