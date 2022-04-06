import {UserData} from "../services/AuthService";
import Order from "../models/Order";
import Customer from "../models/Customer";
import Dish from "../models/Dish";
export const SET_ORDERS = 'set-orders';
export const SET_USER_DATA = 'set-user-data';
export const SET_WINDOW_WIDTH = 'set-window-width';
export const SET_CUSTOMERS = 'set-customers';
export const SET_DISHES = 'set-dishes'

export const dishesAction = (dishes: Dish[]): {type: string, payload: any} =>
    ({type: SET_DISHES, payload: dishes});
export const customersAction = (customers: Customer[]): {type: string, payload: any} =>
    ({type: SET_CUSTOMERS, payload: customers});
export const employeesAction = (orders: Order[]): {type: string, payload: any} =>
    ({type: SET_ORDERS, payload: orders});
export const userDataAction = (userData: UserData): {type: string, payload: any} =>
    ({type: SET_USER_DATA, payload: userData});
export const windowWidthAction = (width: number): {type: string, payload: any} =>
    ({type: SET_WINDOW_WIDTH, payload: width});


