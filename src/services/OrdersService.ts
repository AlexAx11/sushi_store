import Order from '../models/Order'
import {Observable} from "rxjs";

export default interface OrdersService {
    addOrder(order: Order):Promise<any>;
    removeOrder(id: number): Promise<any>;
    getAllOrders(): Observable<Order[]>;
    updateOrder(id: number, order: Order): Promise<any>;
}
