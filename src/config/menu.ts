import {Home} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import Badge from "@material-ui/core/Badge";
import {CURRENCY} from "./constants";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";
import {getOrderSum} from "../components/pages/HomePage";

export const PATH_LOGOUT='/logout'
export const PATH_LOGIN ='/login';
export const PATH_BASKET = '/basket'
export const PATH_HOME = '/home'
export const PATH_ORDER_ACCEPTED = '/orderAccepted'
export const PATH_ORDERS = '/orders'
export const PATH_CLIENTS = '/clients'
export const PATH_DISHES = '/dishes'
export const PATH_MENU_FORM = '/menuForm'
export const PATH_INFO_FORM = '/infoForm'
export const PATH_PROFILE = '/profilePage'


export const ordersMenu: {path: string, label: string,
    admin?: boolean, owner?: boolean, delivery?: boolean}[] = [
    {path: PATH_HOME, label: 'Menu'},
    // {path: PATH_DISHES, label: 'Dishes'},
    {path: PATH_ORDERS, label: 'Orders', admin: true, delivery: true},
    {path: PATH_CLIENTS, label: 'Customers', admin: true},
    {path: PATH_PROFILE, label: 'Profile', delivery: true},
    {path: PATH_INFO_FORM, label: 'About Us', admin: false},
    {path: PATH_BASKET, label: 'Basket', admin: false},

]