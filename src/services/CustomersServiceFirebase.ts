import appFirebase from "../config/firebase-config";
import firebase from "firebase";
import {collectionData} from "rxfire/firestore";
import {Observable} from "rxjs";
import CustomersService from "./CustomersService";
import Customer from "../models/Customer";

export default class CustomersServiceFirebase implements CustomersService {
    db: firebase.firestore.CollectionReference;
    constructor(collectionName: string) {
        this.db = appFirebase.firestore().collection(collectionName);
    }
    async exists(id: number): Promise<boolean> {
        const doc = await this.db.doc(id.toString()).get();
        return doc.exists;//returns Promise with true if the document exists
    }
    async existsEmail(email: string): Promise<boolean> {
        const doc = await this.db.doc(email.toString()).get();
        return doc.exists;//returns Promise with true if the document exists
    }
    async addCustomer(cust:Customer): Promise<any> {
        const res:boolean = await this.existsEmail(cust.email);
        if (res) {
            throw `customer with email ${cust.email} already exists`
        }
        return this.setCustomer(cust);
    }

    private setCustomer(cust: Customer) {
        return this.db.doc(cust.id.toString()).set(cust);
    }

    getAllCustomers(): Observable<Customer[]> {
        return collectionData<Customer>(this.db);
    }

    async removeCustomer(id: number): Promise<any> {
        if(!await this.exists(id)) {
            throw `customer with id ${id} doesn't exists`;
        }

        return this.db.doc(id.toString()).delete();
    }

    async updateCustomer(id: number, cst: Customer): Promise<any> {
        if(!await this.exists(id)) {
            throw `customer with id ${id} doesn't exists`;
        }
        return this.setCustomer(cst);
    }

}
