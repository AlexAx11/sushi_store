import React, {useCallback, useEffect, useRef, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Customer from "../../models/Customer";
import {
    MAX_ID,
    MIN_CITY_LENGTH,
    MIN_ID,
    MIN_NAME_LENGTH,
    MIN_PASSWORD_LENGTH,
    ROLES
} from "../../config/constants";
import {Button, Collapse, FormControl, InputLabel, MenuItem, Paper, Select} from "@material-ui/core";
import {getEmptyClient} from "../ClientForm";
import {getRandomNumber} from "../../util/random";
import {useSelector} from "react-redux";
import {ReducersType} from "../../redux/store";


type Props = {
    customer?: Customer;
    onCancel?: () => void;
    onSubmit: (cust: Customer) => Promise<string>;
}

function chekId(idNumber: number, customers: Customer[]) {
    if(customers.find(c =>(c.id === idNumber))){
        return false;
    }
    return true;
}

const AddressForm: React.FC<Props> = (props: Props) => {
    const customers: Customer[] = useSelector((state: ReducersType) => state.customers);
    const timeId = useRef<any>();
    const [open, setOpen] = useState(false)
    const [isValid, setValid] = useState<boolean>(false);
    const [customer, setCustomer] = useState<Customer>(
        props.customer ? {...props.customer} : getEmptyClient());

    function getRandomId():number {
        let idNumber = getRandomNumber(MIN_ID, MAX_ID);
        while(!chekId(idNumber, customers)) {
            idNumber = getRandomNumber(MIN_ID, MAX_ID);
        }
        return idNumber
    }

    async function onSubmit(event: any) {
        event.preventDefault()
        if(!props.customer){
            customer.id = getRandomId();
            customer.role = 'user'
            customer.basket = [];
        }
        const errorMessage: string = await props.onSubmit(customer);
        if (errorMessage) {
            alert(errorMessage);
        } else {
            onReset();
            setOpen(true);
            timeId.current = setTimeout(() => setOpen(false), 3000)
        }
    }

    function onReset() {
        setCustomer(getEmptyClient);
    }
    function handlerChange(event: any) {
        const name: string = event.target.name;
        customer[name] = getFieldValue(event.target);
        setCustomer({...customer});
    }
    function getFieldValue(field: any): any {
        return field.type === 'number' ? +field.value : field.value;
    }
    const validateNameFn = () => {
        const {name} = customer;
        const re =  /^[a-zA-Z ]+$/;
        if (name.toString().length < MIN_NAME_LENGTH) {
            return `name can't be less than ${MIN_NAME_LENGTH}`;
        }
        if(re.test(String(name).toLowerCase())){
            return '';
        }else{
            return 'wrong name'
        }
        return '';
    }
    const validatePhoneNumberFn = () => {
            const {phoneNumber} = customer;
            if (isNaN(+phoneNumber)) return 'phone number should be a number';
            if (phoneNumber.length < 9) return 'phone number should be a number not less than 9';
            if(!props.customer){
                if (customers.find((c) => c.phoneNumber === phoneNumber))
                    return 'client with this phone number already exists';
            }
        return '';
    }
    const validateAddressFn = () => {
        const {address} = customer;
        const re =  /[A-Za-z0-9'\.\-\s\,]/;
        if(!address) {
            return "please enter the address"
        }
        if(re.test(String(address).toLowerCase())){
            return '';
        }else{
            return 'wrong address'
        }
        return '';
    }

    const validateCityFn = () => {
        const {city} = customer;
        const re =  /^[a-zA-Z \-]+$/;
        if (city.toString().length < MIN_CITY_LENGTH) {
            return `city can't be less than ${MIN_CITY_LENGTH}`;
        }
        if(re.test(String(city).toLowerCase())){
            return '';
        }else{
            return 'wrong address'
        }
        return '';
    }

    const validatePasswordFn = () => {
        const {password} = customer;
        if (password.length < MIN_PASSWORD_LENGTH) {
            return `password can't be less than ${MIN_PASSWORD_LENGTH}`;
        }
        return '';
    }

    const validateEmailFn = () => {
        const {email} = customer;
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email.length < MIN_PASSWORD_LENGTH) {
            return `email can't be less than ${MIN_PASSWORD_LENGTH}`;
        }
        if(!props.customer){
            if (customers.find((c) => c.email === email)){
                return 'client with this email already exists';
            }
        }
        if(re.test(String(email).toLowerCase())){
            return '';
        }else{
            return 'wrong email'
        }
    }

    const validatePhoneNumber = useCallback(validatePhoneNumberFn, [customer])
    const validateCity = useCallback(validateCityFn, [customer])
    const validateName = useCallback(validateNameFn, [customer]);
    const validateAddress = useCallback(validateAddressFn, [customer]);
    const validatePassword = useCallback(validatePasswordFn, [customer]);
    const validateEmail = useCallback(validateEmailFn, [customer]);


    useEffect(() => {
        const validate = (): boolean => {
            return !validateCity()
                && !validateName()
                && !validatePhoneNumber()
                && !validatePassword()
                && !validateEmail()
                && !validateAddress();
        }

        setValid(validate());
        return ()=>clearTimeout(timeId.current);
    }, [customer, validateCity, validateName,
        validatePhoneNumber, validateAddress, validatePassword, validateEmail]);

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom color="textPrimary">
                Client's data
            </Typography>
            <form onSubmit={onSubmit} onReset={onReset} color="textPrimary">
            <Grid container spacing={3} color="textPrimary">
                <Grid item xs={12} sm={6} color="textPrimary">
                    <TextField
                        required
                        id="name"
                        name="name"
                        label="Name"
                        fullWidth
                        autoComplete="name"
                        error={!!validateName()} helperText={validateName()}
                        onChange={handlerChange}
                        value ={customer.name.toString()}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="email"
                        name="email"
                        label="E-mail"
                        fullWidth
                        autoComplete="email"
                        error={!!validateEmail()} helperText={validateEmail()}
                        onChange={handlerChange}
                        value ={customer.email.toString()}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Phone number"
                        fullWidth
                        autoComplete="phoneNumber"
                        error={!!validatePhoneNumber()} helperText={validatePhoneNumber()}
                        onChange={handlerChange}
                        value ={customer.phoneNumber.toString()}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="city"
                        name="city"
                        label="City"
                        fullWidth
                        autoComplete="City"
                        error={!!validateCity()} helperText={validateCity()}
                        onChange={handlerChange}
                        value ={customer.city.toString()}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="address"
                        name="address"
                        label="Address"
                        fullWidth
                        autoComplete="shipping address"
                        error={!!validateAddress()} helperText={validateAddress()}
                        onChange={handlerChange}
                        value ={customer.address.toString()}
                    />
                </Grid>
                <Grid item xs={12} sm={6} hidden={props.customer ? false : true}>
                <FormControl>
                    <InputLabel required error={!customer.role}>Role</InputLabel>
                    <Select name={"role"}
                            value={customer.role}
                            onChange={handlerChange}
                    >
                        {ROLES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} hidden={props.customer ? true : false}>
                    <TextField
                        required
                        id="password"
                        name="password"
                        label="Password"
                        fullWidth
                        autoComplete="Password"
                        error={!!validatePassword()} helperText={validatePassword()}
                        onChange={handlerChange}
                        value ={customer.password.toString()}
                    />
                </Grid>
            </Grid>
            <div>
                <Button disabled={!isValid} variant="contained" color="primary"
                        type={'submit'}>Submit</Button>&nbsp;

                {props.onCancel ? <Button variant="contained" color="primary"
                                          onClick={props.onCancel}>Cancel</Button> :
                    <Button variant="contained" color="primary"
                            type={'reset'}>Reset</Button>}
            </div>
            <Collapse in={open}>
                <Typography component={Paper} align={"center"} style={{
                    backgroundColor: "lightgreen",
                    width: '40%', marginLeft: '30vw'
                }} color="textPrimary">
                    client is accepted
                </Typography>
            </Collapse>
            </form>
        </React.Fragment>
    );
}
export default AddressForm