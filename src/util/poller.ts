import {useState, useEffect} from 'react';
import {Observable, Subscription} from "rxjs";
export default function usePoller<T>(service:any, dataFn: (param: any)=>Observable<T>, initialValue:T,
                                     interval:number, param?: any): T {
    const [data, setData] = useState<T>(initialValue);
    useEffect(()=> {
        let subscription: Subscription = dataFn.call(service, param)
            .subscribe(dataService => setData(dataService));
        function poller() {
            if(subscription.closed) {
                subscription = dataFn.call(service, param)
                    .subscribe(dataService => setData(dataService));
            }

        }
        const intervalId  = setInterval(poller, interval);
        return () => {
            clearInterval(intervalId);
            subscription.unsubscribe();
        }
},[dataFn, interval, service, param])
    return data;
}
