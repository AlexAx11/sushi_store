import OrdersService from "./OrdersService";
import Order from "../models/Order";
import {Observable} from "rxjs";
import {map} from 'rxjs/operators'
import Axios from 'axios-observable'
export default class OrdersServiceRest implements OrdersService {
    constructor(private url:string) {
    }
    addOrder(order: Order): Promise<any> {
        return Axios.post<Order>(this.url, order).toPromise()
    }

    getAllOrders(param?: string): Observable<Order[]> {
        if(param) {
            console.log('getAllOrders. param='+param);
        } else {
            console.log('getAllOrders. without params');
        }
        return Axios.get<Order[]>(this.url).pipe(map(response => {
            response.data.forEach(o => o.date = new Date(o.date as string))
            return response.data
        }));
    }

    removeOrder(id: number): Promise<any> {
        return Axios.delete(`${this.url}/${id}`).toPromise();
    }

    updateOrder(id: number, order: Order): Promise<any> {
        return Axios.put(`${this.url}/${id}`,order).toPromise();
    }

}
