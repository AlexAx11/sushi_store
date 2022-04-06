import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import useStyles from "../../config/styles";
import {UserData} from "../../services/AuthService";
import {useSelector} from "react-redux";
import {ReducersType} from "../../redux/store";
import Customer from "../../models/Customer";
import {getCustomerOnUserData} from "../MenuForm";
import Order from "../../models/Order";
import MyTable from "../library/MyTable";
import {getHeaders} from "./Orders";
import Dish from "../../models/Dish";
import {Button, Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import {authService, service} from "../../config/services-config";
import Login from "./Login";
import OrderForm from "../OrderForm";
import {Edit} from "@material-ui/icons";
import Grid from "@material-ui/core/Grid";
import {
    TABLE_ORDER_STATUSES, TABLE_ORDER_STATUSES_COOK,
    TABLE_ORDER_STATUSES_DELIVERY
} from "../../config/constants";

const ProfilePage:React.FC = () =>{
    const classes = useStyles();
    const dishes: Dish[] = useSelector((state: ReducersType) => state.dishes) ;
    const orders: Order[] = useSelector((state: ReducersType) => state.orders);
    const userData: UserData = useSelector((state: ReducersType) => state.userData);
    const customers: Customer[] = useSelector((state: ReducersType) => state.customers);
    const customer: Customer = getCustomerOnUserData(userData, customers);
    const [ordersStatus, setOrdersStatus] = useState<string>('All')
    const customerOrders: Order[] = getCustomerOrders();
    const [order, setOrder] = useState<Order|null>(null);
    const [openLoginConfirm, setOpenLoginConfirm] = useState<boolean>(false);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);

    function getCustomerOrders(): Order[] {
        const res = orders.filter(o => (ordersStatus === 'All' ? o : o.status === ordersStatus))
        if (customer.role === 'customer') {
            return res.filter(o => (o.customerID[0] === customer.id))
        } else if (customer.role === 'cook') {
            return orders.filter(o => {
                if (o.customerID[1] && o.status === 'order') {
                    return o.customerID[1] === customer.id
                }
            })
        } else if (customer.role === 'courier') {
            return orders.filter(o => {
                if (o.customerID[2] && o.status === 'delivery') {
                    return o.customerID[2] === customer.id
                }
            })
        } else {
            return res.filter(o => (o.customerID[0] === customer.id))
        }
    }

    function getDishes(objects: Object[]): JSX.Element {
        const res: string[] = [];
        const menu: string[] = objects as string[];
        dishes.forEach(d => {
            menu.forEach(name => {
                if(d.name === name){
                    const nameForArray = d.name + " ";
                    res.push(nameForArray)
                }
            })
        })
        res.join()
        return <text>{res}</text>
    }

    function logout() {
        authService.logout();
    }
    function updateOrder(obj: object) {
        setOpenConfirm(true);
        setOrder(obj as Order);
    }
    function onCancel() {
        setOrder(null);
        setOpenConfirm(false);
    }
    async function onUpdate(ord: Order):Promise<string> {
        await service.updateOrder(ord.id, ord);
        onCancel();
        return '';
    }

    function getActions() {
        return (customer.role === 'courier') || (customer.role === 'cook') ? [{icon: <Edit/>, actionFn: updateOrder}]                          //change
            : [];
    }

    function getmaxWidth(): string {
        const number = customer.name.length + 11;
        return number.toString() + 'vw';
    }
    function handlerChange(event: any) {
        const name: string = event.target.value;
        setOrdersStatus(name)
    }

    function getMenuItem() {
        switch (customer.role) {
            case 'customer': return TABLE_ORDER_STATUSES.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)
            break;
            case 'courier': return TABLE_ORDER_STATUSES_DELIVERY.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)
                break;
            case 'cook': return TABLE_ORDER_STATUSES_COOK.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)
                break;
            default: return TABLE_ORDER_STATUSES.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)
                break;
        }
    }

    function getProfileData(){
        return <div style={{marginLeft: '6.5vw'}}>
            <div className={classes.row}>
                {customer.role === "manager" ? <div/> :
                <div className={classes.column} style={{marginLeft: '7.7vw'}}>
                    <Typography variant="h5" gutterBottom color="textPrimary" >
                        Name:&nbsp;{customer.name}
                    </Typography>
                    <Typography variant="h5" gutterBottom color="textPrimary" >
                        Role:&nbsp;{customer.role}
                    </Typography>
                </div>}
                {customer.role === 'customer' ? <Grid item xs={12} direction="row" style={{marginLeft: '46.5vw'}}>
                    <FormControl style={{justifyContent: "flex-end"}}>
                        <InputLabel style={{width: '10vw'}}>order status</InputLabel>
                        <Select name={"Status"}
                                value={ordersStatus}
                                fullWidth
                                onChange={handlerChange} style={{width: '10vw'}}
                        >
                            {getMenuItem()}
                        </Select>
                    </FormControl>
                </Grid> : <div/>}
            </div>

            {customer.role === "manager" ? <div/> : <MyTable headers={getHeaders()}
                                                           objectFn={getDishes} objectName="menu" actions={getActions()}
                                                           data={customerOrders} width={'70vw'}/>}
            <br/>
            <div  style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign:"justify"
            }
            } className={classes.column}>
                <Button  variant="contained" size='small'
                         color="primary"
                         onClick={() => logout()}>
                    Logout
                </Button>
            </div>
        </div>
    }
    return <React.Fragment>
        <div style={{marginTop:'7vw'}}/>
        {userData.email ? getProfileData() :
            <div style={{display:'block',textAlign:'center'}}>
                <Button  variant="contained"
                         color="primary" style={{marginTop:"20px" }}
                         onClick={() => setOpenLoginConfirm(true)}>
                    Login
                </Button>
            </div>
        }
            <Dialog open={openLoginConfirm} scroll='body'>
                <DialogContent>
                    <Login onCancel={() => setOpenLoginConfirm(false)}/>
                </DialogContent>
            </Dialog>
            <Dialog open={openConfirm} > {/*change*/}
                <DialogContent >
                    <OrderForm order={order as Order} customer={customer}
                               onSubmit={onUpdate} onCancel={onCancel}/>
                </DialogContent>
            </Dialog>
    </React.Fragment>

}
export default ProfilePage