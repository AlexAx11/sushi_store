import React, {useEffect, useState} from "react";
import {HashRouter, Switch, Route, Redirect} from "react-router-dom";
import './App.css'
import Navigator from "./components/library/Navigator";
import {
    ordersMenu,
    PATH_LOGIN, PATH_CLIENTS,
    PATH_LOGOUT, PATH_ORDERS, PATH_DISHES,
    PATH_BASKET, PATH_INFO_FORM,
    PATH_HOME,
    PATH_PROFILE
} from "./config/menu";
import Login from "./components/pages/Login";
import Logout from "./components/pages/Logout";
import HomePage from "./components/pages/HomePage";
import Orders from "./components/pages/Orders";
import {authService, customersService, dishesService, service} from "./config/services-config";
import {POLLER_INTERVAL} from "./config/constants";
import Order from "./models/Order";
import Customers from "./components/pages/Customers";
import Customer from "./models/Customer";
import useStyles from "./config/styles";
import Dish from "./models/Dish";
import {UserData} from "./services/AuthService";
import usePollerRedux from "./util/poller_redux";
import {ReducersType, store} from "./redux/store";
import {SET_CUSTOMERS, SET_DISHES, SET_ORDERS, SET_USER_DATA} from "./redux/actions";
import Dishes from "./components/pages/Dishes";
import Basket from "./components/pages/Basket";
import AppBar from "@material-ui/core/AppBar";
import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import InfoPage from "./components/pages/InfoPage";
import ProfilePage from "./components/pages/ProfilePage";
import {getCustomerOnUserData} from "./components/MenuForm";
import {useSelector} from "react-redux";
import {createMuiTheme, IconButton, ThemeProvider} from "@material-ui/core";
import { useMediaQuery } from 'react-responsive';
import MenuIcon from '@material-ui/icons/Menu';

const App: React.FC = () => {
    const classes = useStyles();
    usePollerRedux<Order[]>(service, service.getAllOrders, SET_ORDERS, POLLER_INTERVAL, store);
    usePollerRedux<Customer[]>(customersService, customersService.getAllCustomers, SET_CUSTOMERS, POLLER_INTERVAL, store);
    usePollerRedux<Dish[]>(dishesService, dishesService.getAllDishes, SET_DISHES, POLLER_INTERVAL, store);
    usePollerRedux<UserData>(authService, authService.getUserData, SET_USER_DATA, POLLER_INTERVAL, store);

    const [userData, setUserData] = useState<UserData>(store.getState().userData);
    const customers: Customer[] = useSelector((state: ReducersType) => state.customers);
    const customer = getCustomerOnUserData(userData, customers);

    const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})
    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    useEffect(() => {
        store.subscribe(() => setUserData(store.getState().userData));
    }, [])

    function getItems() {
        if (userData.isAdmin) {
            return ordersMenu.filter(item => !(item.label === "About Us") && !(item.label === 'Basket'))
        } else {
            if (customer.role === 'manager') {
                return ordersMenu.filter(item => !item.admin)
            } else if (customer.role === 'courier') {
                return ordersMenu.filter(item => item.delivery)
            } else if (customer.role === 'owner') {
                return ordersMenu.filter(item => item.owner)
            } else if (customer.role === 'cook') {
                return ordersMenu.filter(item => ((item.label === "Orders") ||
                    (item.label === "Profile")))
            } else {
                return ordersMenu.filter(item => !item.admin);
            }
        }
    }

    const theme = createMuiTheme({
        typography: {
            "fontFamily": 'Cursive',
            "fontSize": 15,
            "fontWeightLight": 300,
            "fontWeightRegular": 400,
            "fontWeightMedium": 500
        },
        palette: {
            secondary: {
                main: '#db3497',
                light: '#db3497'
            },
            primary: {
                light: '#879c00',
                main: '#879c00',

            },
            text: {
                primary: '#8a0f24',
            },
            error: {
                main: '#8a0f24',
                contrastText: '#8a0f24',
            },
            background: {
                paper: 'white',
                default: "#fafaed"
            },
        }
    })
    return <ThemeProvider theme={theme}>
        <HashRouter>
            {isDesktopOrLaptop ? <AppBar position="absolute" className={clsx(classes.appBar)}>
                <Toolbar>
                    <Typography variant="h4" noWrap aria-valuetext={'3.2em'}
                                className={classes.layout} style={{fontWeight: "bold", margin: '0', padding: '0'}}
                                color="textPrimary">
                        Roll `N` Roll
                    </Typography>
                    <div style={{display: 'block', marginLeft: '30%'}}>
                        <Navigator items={getItems()} customer={customer}/>
                        <Redirect to={customer.role === 'manager' || customer.role === 'customer' ||
                        customer.role === ''
                            ? PATH_HOME : PATH_ORDERS}/>
                    </div>
                </Toolbar>
            </AppBar> :
                <AppBar position="static" className={clsx(classes.appBarMobile)}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <MenuIcon >
                                <Navigator items={getItems()} customer={customer}/>
                            <Redirect to={customer.role === 'manager' || customer.role === 'customer' ||
                            customer.role === ''
                            ? PATH_HOME : PATH_ORDERS}/>
                            </MenuIcon>
                        </IconButton>
                        <Typography variant="h5" noWrap aria-valuetext={'3.2em'}
                            className={classes.layout} style={{fontWeight: "bold", margin: '0',
                            padding: '0', marginLeft: '10vw'}}
                            color="textPrimary">
                            Roll `N` Roll
                    </Typography>
                    </Toolbar>
                </AppBar>}
            <Switch>
                <Route path={PATH_HOME} exact render={() => <HomePage/>}/>
                <Route path={PATH_LOGOUT} exact render={() => <Logout/>}/>
                <Route path={PATH_LOGIN} exact render={() => <Login/>}/>
                <Route path={PATH_BASKET} exact render={() => <Basket/>}/>
                <Route path={PATH_DISHES} exact render={() => <Dishes/>}/>
                <Route path={PATH_ORDERS} exact render={() => <Orders/>}/>
                <Route path={PATH_CLIENTS} exact render={() => <Customers/>}/>
                <Route path={PATH_INFO_FORM} exact render={() => <InfoPage/>}/>
                <Route path={PATH_PROFILE} exact render={() => <ProfilePage/>}/>
            </Switch>

        </HashRouter>
    </ThemeProvider>


}
export default App;
