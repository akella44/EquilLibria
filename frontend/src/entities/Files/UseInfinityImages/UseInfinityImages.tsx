import { useInfiniteQuery } from "@tanstack/react-query";

export const UseInfinityImages = () => {
  const { data, isError, isLoading, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["images"],
      queryFn: ({ pageParam = 0 }) =>
        getAllStacks({
          page: pageParam,
          size: 15,
          sort: "title",
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.data.content.length === 15
          ? allPages.length
          : undefined;
      },
      select: (result) => result.pages.flatMap((page) => page.data.content),
    });

  return {
    stackData: data,
    isStackError: isError,
    isStackLoading: isLoading,
    fetchStackNextPage: fetchNextPage,
    hasStackNextPage: hasNextPage,
  };
};
