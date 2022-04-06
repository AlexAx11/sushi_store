import {Observable} from "rxjs";
import {map} from 'rxjs/operators'
import Axios from 'axios-observable'
import DishService from "./DishService";
import Dish from "../models/Dish";
export default class DishServiceRest implements DishService {
    constructor(private url:string) {
    }

    addDish(dish:Dish): Promise<any> {
        return Axios.post<Object>(this.url, dish).toPromise()
    }

    getAllDishes(param?: string): Observable<Dish[]> {
       return Axios.get<Dish[]>(this.url).pipe(map(response => {
            return response.data
        }));
    }

    removeDish(id: number): Promise<any> {
        return Axios.delete(`${this.url}/${id}`).toPromise();
    }

    updateDish(id: number, obj: Dish): Promise<any> {
        return Axios.put(`${this.url}/${id}`,obj).toPromise();
    }

    addImage(img: any): Promise<any> {
        return Axios.post<Object>(this.url, img).toPromise()
    }
}
