import Customer from '../models/Customer'
import {Observable} from "rxjs";

export default interface CustomersService {
    addCustomer(customer: Customer):Promise<any>;
    removeCustomer(id: number): Promise<any>;
    getAllCustomers(): Observable<Customer[]>;
    updateCustomer(id: number, customer: Customer): Promise<any>;
}
