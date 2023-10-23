import { useEffect } from 'react';
import { Observable, Subscription } from 'rxjs';

export function useSubscriptionUntilMounted<T>(subject$: Observable<T> | undefined, callback: (result: T) => any) {
  useEffect(() => {
    let subscription: Subscription | undefined;

    if (subject$) {
      subscription = subject$.subscribe(callback);
    }

    return () => {
      subscription && subscription.unsubscribe();
    };
  }, [subject$, callback]);
}
