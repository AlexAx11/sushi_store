import  {UserData} from "../services/AuthService";
import {SET_CUSTOMERS, SET_DISHES, SET_ORDERS, SET_USER_DATA, SET_WINDOW_WIDTH} from "./actions";
import Order from "../models/Order";
import Customer from "../models/Customer";
import Dish from "../models/Dish";
export const ordersReducer =
    (orders: Order[] = [], action: {type: string, payload: any}): Order[] =>
        action.type === SET_ORDERS ? action.payload.slice(0) : orders;
export const customersReducer =
    (customers: Customer[] = [], action: {type: string, payload: any}): Customer[] =>
        action.type === SET_CUSTOMERS ? action.payload.slice(0) : customers;
export const dishesReducer =
    (dishes: Dish[] = [], action: {type: string, payload: any}): Dish[] =>
        action.type === SET_DISHES ? action.payload.slice(0) : dishes;
export const userDataReducer =
    (userData: UserData = {isAdmin: false, username: '', email: ''}, action: {type: string, payload: any} ): UserData =>
        action.type === SET_USER_DATA ? {...action.payload as UserData} : userData;
export const windowWidthReducer =
    (width: number, action: {type: string, payload: any}): number =>
        action.type === SET_WINDOW_WIDTH ? +{...action.payload} : 100;