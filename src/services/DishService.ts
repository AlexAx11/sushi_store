import {Observable} from "rxjs";
import Dish from "../models/Dish";

export default interface DishService {
    addDish(dish: Dish):Promise<any>;
    removeDish(id: number): Promise<any>;
    getAllDishes(): Observable<Dish[]>;
    updateDish(id: number, order: Dish): Promise<any>;
    addImage(img: any): Promise<any>;
}
