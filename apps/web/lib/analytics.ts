const VISITOR_KEY = 'ecom.stats.visitor';

function getVisitorId(): string {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return '';
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return '';
  }
}

function endpointFor(type: 'product' | 'category' | 'page', id: string): string {
  if (type === 'page') return `/api/stats/pages/${id}/view`;
  return `/api/stats/${type}s/${id}/view`;
}

/**
 * Records a page view fire-and-forget. Never throws and never blocks the
 * page: uses sendBeacon (fallback: keepalive fetch) and swallows failures.
 */
export function trackView(type: 'product' | 'category' | 'page', id: string): void {
  if (typeof navigator === 'undefined') return;
  try {
    const visitorId = getVisitorId();
    const source = typeof document !== 'undefined' ? document.referrer : '';

    const params = new URLSearchParams();
    if (visitorId) params.set('visitorId', visitorId);
    if (source) params.set('source', source);
    const query = params.size > 0 ? `?${params.toString()}` : '';
    const url = `${endpointFor(type, id)}${query}`;

    if (typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(url);
      return;
    }

    void fetch(url, { method: 'POST', keepalive: true }).catch(() => undefined);
  } catch {
    // analytics must never break the page
  }
}
