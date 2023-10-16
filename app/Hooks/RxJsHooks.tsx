import { useEffect } from 'react';
import { Observable, Subscription } from 'rxjs';

export function useSubscriptionUntilMounted<T>(subject$: Observable<T> | undefined, callback: (result: T) => any) {
  useEffect(() => {
    let subscription: Subscription | undefined;

    if (subject$) {
      console.log('subscribe');
      subscription = subject$.subscribe(callback);
    }

    return () => {
      console.log('unsub');
      subscription && subscription.unsubscribe();
    };
  }, [subject$, callback]);
}
