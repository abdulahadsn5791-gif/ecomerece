'use client';

import { useEffect, useRef } from 'react';

interface UseCursorLoadMoreParams {
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

/** Observes a sentinel element and triggers the next cursor page when it becomes visible. */
export function useCursorLoadMore<T extends HTMLElement = HTMLDivElement>({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseCursorLoadMoreParams) {
  const sentinelRef = useRef<T | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return sentinelRef;
}
