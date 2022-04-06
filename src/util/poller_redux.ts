import { useEffect} from 'react';
import {Observable, Subscription} from "rxjs";

import {useDispatch} from 'react-redux'
export default function usePollerRedux<T>(service:any, dataFn: (param: any)=>Observable<T>,
                                          actionType: string,
                                     interval:number, param?: any): void{

const dispatch = useDispatch()

    useEffect(()=> {
        function dispatchData() {
            return dataFn.call(service, param)
                .subscribe(dataService => dispatch({type: actionType, payload:dataService}));
        }
        let subscription: Subscription = dispatchData();
        function poller() {
            if(subscription.closed) {
                subscription = dispatchData();
            }
        }
        const intervalId  = setInterval(poller, interval);
        return () => {
            clearInterval(intervalId);
            subscription.unsubscribe();
        }


    },[dataFn, interval, service, param])
   
}
