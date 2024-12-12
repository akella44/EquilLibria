import { getCurrentUser } from "@/shared/api/userService/userControllerApi";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const { data } = useQuery({
    queryFn: () => getCurrentUser(),
    queryKey: ["currentUser"],
  });
  return {
    data: data?.data,
  };
};
