import OrdersService from "../services/OrdersService";
import CustomersService from "../services/CustomersService";
import DishService from "../services/DishService";
import AuthService from "../services/AuthService";
import OrdersServiceFirebase from "../services/OrdersServiceFirebase";
import AuthServiceFirebase from "../services/AuthServiceFireBase";
import CustomersServiceFirebase from "../services/CustomersServiceFirebase";
import DishesServiceFirebase from "../services/DishesServiceFirebase";
import RegServiceFireBase from "../services/RegServiceFireBase";
import RegService from "../services/RegService";

export const COLLECTION_NAME_ORDERS = "orders";
export const COLLECTION_NAME_CUSTOMERS = "customers";
export const COLLECTION_NAME_DISHES = "dishes";

export const service: OrdersService =
    new OrdersServiceFirebase(COLLECTION_NAME_ORDERS);
export const customersService: CustomersService =
    new CustomersServiceFirebase(COLLECTION_NAME_CUSTOMERS);
export const dishesService: DishService =
    new DishesServiceFirebase(COLLECTION_NAME_DISHES);
export const authService: AuthService = new AuthServiceFirebase();
export const regService: RegService = new RegServiceFireBase();




