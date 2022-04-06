import appFirebase from "../config/firebase-config";
import firebase from "firebase";
import {collectionData} from "rxfire/firestore";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import Order from "../models/Order";
import OrdersService from "./OrdersService";


function getOrderForFirestore(order: any) {
        return {...order,
            date:(order.date as Date).toISOString().substr(0,10)}

}

export default class OrdersServiceFirebase implements OrdersService {
    db: firebase.firestore.CollectionReference;
    constructor(collectionName: string) {
        this.db = appFirebase.firestore().collection(collectionName);
    }
    async exists(id: number): Promise<boolean> {
        const doc = await this.db.doc(id.toString()).get();
        return doc.exists;//returns Promise with true if the document exists
    }
    async addOrder(order:Order): Promise<any> {
        const res:boolean = await this.exists(order.id);
        if (res) {
            throw `order with id ${order.id} already exists`
        }
        return this.setOrder(order);

    }

    private setOrder(ord: Order) {
        const orderFirestore = getOrderForFirestore(ord)
        return this.db.doc(ord.id.toString()).set(orderFirestore);
    }

    getAllOrders(): Observable<Order[]> {
        return collectionData<Order>(this.db)
            .pipe(map(orders => {
                orders.forEach(o => o.date =
                    new Date(o.date as string))
                return orders;
            }));
    }

    async removeOrder(id: number): Promise<any> {
        if(!await this.exists(id)) {
            throw `order with id ${id} doesn't exists`;
        }

        return this.db.doc(id.toString()).delete();
    }

    async updateOrder(id: number, ord: Order): Promise<any> {
        if(!await this.exists(id)) {
            throw `order with id ${id} doesn't exists`;
        }
        return this.setOrder(ord);
    }

}
