import {UserData} from "../services/AuthService";
import {combineReducers, createStore} from "redux";
import {customersReducer, dishesReducer, ordersReducer, userDataReducer, windowWidthReducer} from "./reducers";
import Order from "../models/Order";
import Customer from "../models/Customer";
import Dish from "../models/Dish";

export type ReducersType = {
    dishes: Dish[],
    orders: Order[],
    userData: UserData,
    customers: Customer[],
    //width: number | any
}
const allReducers = combineReducers<ReducersType>({
    dishes: dishesReducer,
    orders: ordersReducer,
    userData: userDataReducer,
    customers: customersReducer
    //width: windowWidthReducer,
})
export const store = createStore(allReducers);
