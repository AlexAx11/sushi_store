import CustomersService from "./CustomersService";
import Customer from "../models/Customer";
import {Observable} from "rxjs";
import {map} from 'rxjs/operators'
import Axios from 'axios-observable'
export default class CustomersServiceRest implements CustomersService {
    constructor(private url:string) {
    }
    addCustomer(client: Customer): Promise<any> {
        return Axios.post<Customer>(this.url, client).toPromise()
    }

    getAllCustomers(param?: string): Observable<Customer[]> {
        if(param) {
            console.log('getAllClients. param='+param);
        } else {
            console.log('getAllClients. without params');
        }
        return Axios.get<Customer[]>(this.url).pipe(map(response => {
            return response.data
        }));
    }

    removeCustomer(id: number): Promise<any> {
        return Axios.delete(`${this.url}/${id}`).toPromise();
    }

    updateCustomer(id: number, client: Customer): Promise<any> {
        return Axios.put(`${this.url}/${id}`,client).toPromise();
    }
}
