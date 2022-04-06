import Order from "../models/Order";
import OrdersService from "./OrdersService";
import {Observable, of} from "rxjs";

export default class OrdersServiceArrayImpl implements OrdersService {
    orders: Order[] = [];
    removeOrder(id: number): Promise<any> {
        //removes order with id equaled to the given one and returns true. If no order with the given id
        //the method return false
        const index = this.orders.findIndex(o => o.id === id);
        if (index < 0) {
            return Promise.reject();
        }
        this.orders.splice(index, 1);
        return Promise.resolve();
    }
    getAllOrders(): Observable<Order[]> {
        return of([...this.orders]);
    }
    updateOrder(id: number, order: Order): Promise<any> {
        //replaces order with id equaled the given one with the given order and returns true.
        // If no order with the given id
        //the method return false
        if (order.id !== id) {
            return Promise.reject();
        }
        const index = this.orders.findIndex(o => o.id === id);
        if (index < 0) {
            return Promise.reject();
        }
        this.orders[index] = order;
        return Promise.resolve();
    }
    addOrder(order: Order): Promise<any> {
        //adds order into array and returns true just if there is no employee with id === order.id
        //otherwise returns false
        if (this.orders.find(o => o.id === order.id)) {
            return Promise.reject();
        }
        this.orders.push(order);
        return Promise.resolve();
    }
}

