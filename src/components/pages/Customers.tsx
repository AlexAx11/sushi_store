import React, {useRef, useState} from "react";
import MyTable, {HeaderDefinition} from "../library/MyTable";
import {customersService, service} from "../../config/services-config";
import {Delete, Edit} from "@material-ui/icons";
import ConfirmationDialog from "../library/ConfirmationDialog";
import {Dialog, DialogContent, FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import ClientForm from "../ClientForm";
import Customer from "../../models/Customer";
import Order from "../../models/Order";
import {useSelector} from "react-redux";
import {ReducersType} from "../../redux/store";
import Dish from "../../models/Dish";
import AddressForm from "../library/AddressForm";
import Grid from "@material-ui/core/Grid";
import {ROLES, TABLE_ORDER_STATUSES, TABLE_ROLES} from "../../config/constants";
export function getHeaders(): Map<string, HeaderDefinition> {

    return new Map<string, HeaderDefinition>([
        ['id',{displayName: 'ID'}],
        ['name',{displayName: 'Name'}],
        ['phoneNumber',{displayName: 'Phone Number'}],
        ['email',{displayName: 'Email'}],
        ['city',{displayName: 'City'}],
        ['address',{displayName: 'Address'}],
        ['role',{displayName: 'Role'}],
    ])
}

export function customerToString(cust: Customer): string {
    return ["cust.id: " + cust.id, 'email: ' + cust.email,
    "password: " + cust.password, "basket: " + cust.basket, "name: "+ cust.name, 'role: ' + cust.role].join()
}
const Customers: React.FC = () => {
    const customers: Customer[] = useSelector((state: ReducersType) => state.customers);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [client, setClient] = useState<Customer|null>(null);
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);
    const [role, setRole] = useState<string>('All');
    const clnt = useRef<Customer>();
    function removeClient(obj: object) {
        clnt.current = obj as Customer;
        setTitle("You are going to delete !");
        setText("Customer with id " + clnt.current?.id);
        setOpenConfirm(true);
    }

    function updateClient(obj: object) {
        setTitle("You are going to update !");
        setText("Customer with id " + (obj as Customer).id);
        setOpenConfirm(true);
        setClient(obj as Customer);
    }
    async function onUpdate(clnt: Customer):Promise<string> {
        onCancel();
        await customersService.updateCustomer(clnt.id, clnt);
        return '';
    }
    function onCancel() {
        setClient(null);
        setOpenUpdate(false);
    }

    function getData() {
     return customers.filter(c => (role === 'All' ? c : c.role === role))
    }
    async function handleCloseConfirm(res: boolean) {
        if (res) {
            if (client) {
                setOpenUpdate(true);
            } else if (clnt.current) {
                await customersService.removeCustomer(clnt.current.id);
            }
        }
        setOpenConfirm(false);
    }
    function handlerChange(event: any) {
        const name: string = event.target.value;
        setRole(name)
    }

    function getOrders(object: Object[]): string {
        const orders: Order[] = object as Order[];
        let res: string[] = [];
        orders.forEach(o => {
            if(o.id){
                res.push(o.id.toString())
            }
        })
        return res.join()
    }
    return  <React.Fragment>
        <div style={{marginTop:'7vw', marginLeft: '4vw'}}>
           <Grid item xs={12} direction="row" style={{marginLeft: '51vw'}}>
                <FormControl>
                    <InputLabel style={{width: '10vw'}}>Select role</InputLabel>
                    <Select name={"Status"}
                            value={role}
                            fullWidth
                            onChange={handlerChange} style={{width: '10vw'}}
                    >
                        {TABLE_ROLES.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
        <MyTable headers={getHeaders()} rows={7} width='75vw'
                 data={getData()} actions={[{icon: <Delete/>, actionFn: removeClient},
            {icon: <Edit/>, actionFn: updateClient}]}/>
        <ConfirmationDialog open={openConfirm} handleClose={handleCloseConfirm}
                            title={title} text={text}/>
        <Dialog open={openUpdate} >
            <DialogContent >
                <AddressForm customer={client as Customer}
                            onSubmit={onUpdate} onCancel={onCancel}/>
            </DialogContent>
        </Dialog>
        </div>
    </React.Fragment>
}
export default Customers;
