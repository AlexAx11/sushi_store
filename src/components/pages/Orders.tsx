import React, {useRef, useState} from "react";
import Order from "../../models/Order";
import MyTable, {HeaderDefinition} from "../library/MyTable";
import {service} from "../../config/services-config";
import {Delete, Edit} from "@material-ui/icons";
import ConfirmationDialog from "../library/ConfirmationDialog";
import {Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import OrderForm from "../OrderForm";
import Dish from "../../models/Dish";
import {useSelector} from "react-redux";
import {ReducersType} from "../../redux/store";
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import Customer from "../../models/Customer";
import {getCustomerOnUserData} from "../MenuForm";
import OutdoorGrillIcon from '@material-ui/icons/OutdoorGrill';
import useStyles from "../../config/styles";
import {TABLE_ORDER_STATUSES} from "../../config/constants";
import Grid from "@material-ui/core/Grid";
export function getHeaders(): Map<string, HeaderDefinition> {

    return new Map<string, HeaderDefinition>([
        ['id',{displayName: 'Number', convertString: (obj) =>
                (obj).toString()}],
        ['sum',{displayName: 'Order Amount', convertString: (obj) =>
                (obj).toString()}],
        ['menu',{displayName: 'Order Detail'}],
        ['date',{displayName: 'Date', convertString: (obj) =>
                (obj as Date).toLocaleDateString()}],
        ['status', {displayName: 'Status', convertString: (obj) =>
                (obj).toString()}]
    ])
}

const Orders: React.FC = () =>{
    const classes = useStyles();
    const customers: Customer[] = useSelector((state: ReducersType) => state.customers);
    const orders: Order[] = useSelector((state: ReducersType) => state.orders);
    const userData = useSelector((state: ReducersType) => state.userData) ;
    const dishes: Dish[] = useSelector((state: ReducersType) => state.dishes) ;
    const [customer, setCustomer] = useState<Customer>(getCustomerOnUserData(userData, customers));
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [order, setOrder] = useState<Order|null>(null);
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [ordersStatus, setOrdersStatus] = useState<string>('All')

    const ord = useRef<Order>();
    function removeOrder(obj: object) {
       ord.current = obj as Order;
        setTitle("You are going to delete !");
        setText("Order with number " + ord.current?.id);
        setOpenConfirm(true);
    }
    function updateOrder(obj: object) {
        setTitle("You are going to update !");
        setText("Order with number " + (obj as Order).id);
        setOpenUpdate(true);
        setOrder(obj as Order);
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

    function onCancel() {
        setOrder(null);
        setOpenUpdate(false);
    }

    async function handleCloseConfirm(res: boolean) {
        if (res && (customer.role === 'manager') ) {
            if (order) {
                setOpenUpdate(true);
            } else if (ord.current) {
                await service.removeOrder(ord.current.id);
            }
        }
        if(order && (customer.role === 'courier')) {
            order.customerID.push(customer.id); //change
            await service.updateOrder(order.id, order);
        }
        if(order && (customer.role === 'cook')) {
            order.customerID.push(customer.id);
            await service.updateOrder(order.id, order);
        }
        setOpenConfirm(false);
    }

    function getData(): Order[] {
        const res = orders.filter(o => (ordersStatus === 'All' ? o : o.status === ordersStatus))
        switch (customer.role) {
            case 'manager': return res;
                break;
            case 'courier': return orders.filter(o => (o.status === "delivery" && !o.customerID[2]));
                break;
            case 'cook': return orders.filter(o => (o.status === "order" && !o.customerID[1]));
                break;
            default: return orders.filter(o => (o.status === "order"));
        }
    }
    function getToShipping(obj: object){
        setOrder(obj as Order);
        setTitle("");
        setText("Order " + (obj as Order).id + ' was added');
        setOpenConfirm(true);
    }
    function getToCook(obj: object){
        setOrder(obj as Order);
        setTitle("");
        setText("Order " + (obj as Order).id + ' was added');
        setOpenConfirm(true);
    }
    async function onUpdate(ord: Order):Promise<string> {
        await service.updateOrder(ord.id, ord);
        onCancel();
        return '';
    }

    function handlerChange(event: any) {
        const name: string = event.target.value;
        setOrdersStatus(name)
    }

    function getActions() {
        switch (customer.role) {
            case 'manager': return [{icon: <Delete/>, actionFn: removeOrder},
                {icon: <Edit/>, actionFn: updateOrder}];
                break;
            case 'courier': return [{icon: <LocalShippingIcon/>, actionFn: getToShipping}];
                break;
            case 'cook': return [{icon: <OutdoorGrillIcon/>, actionFn: getToCook}];
                break;
            default: return [];
        }
    }

    return  <React.Fragment>
        <div style={{marginTop:'7vw'}}/>
        <div className={classes.centerPositionOrders}>
            {customer.role === 'manager' ? <Grid item xs={12} direction="row" style={{marginLeft: '51vw'}}>
                <FormControl>
                    <InputLabel style={{width: '10vw'}}>Select status</InputLabel>
                    <Select name={"Status"}
                            value={ordersStatus}
                            fullWidth
                            onChange={handlerChange} style={{width: '10vw'}}
                    >
                        {TABLE_ORDER_STATUSES.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid> : <div/>}
            <MyTable headers={getHeaders()} width={'70%'} rows={7}
                     data={getData()} objectFn={getDishes} objectName="menu" actions={getActions()}/>
            <ConfirmationDialog open={openConfirm} handleClose={handleCloseConfirm}
                                title={title} text={text}/>
            <Dialog open={openUpdate} >
                <DialogContent >
                    <OrderForm order={order as Order} onSubmit={onUpdate} onCancel={onCancel}/>
                </DialogContent>
            </Dialog>
        </div>
       </React.Fragment>
}
export default Orders;
