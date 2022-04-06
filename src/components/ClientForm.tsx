import React, {useEffect, useRef, useState} from "react";
import {
    Button,
    Collapse,
    Paper,
    Typography
} from "@material-ui/core";
import useStyles from "../config/styles";
import Customer from "../models/Customer";
import {ReducersType} from "../redux/store";
import {useSelector} from "react-redux";


type Props = {
    onSubmit: (client: Customer) => Promise<string>;
    client?: Customer;
    onCancel?: () => void;

}

/**
 * Gets empty client record
 */
export function getEmptyClient(): Customer {
    return {
        id: NaN,
        name: '',
        phoneNumber: '',
        email: '',
        city: '',
        address: '',
        basket: [],
        password: '',
        role: ''
    };
}

const ClientForm: React.FC<Props> = (props: Props) => {
    const classes = useStyles();
    const [client, setClient] = useState<Customer>(
        props.client ? {...props.client} : getEmptyClient());
    const [isValid, setValid] = useState<boolean>(false);
    const [open, setOpen] = useState(false)
    const timeId = useRef<any>();

    async function onSubmit(event: any) {
        event.preventDefault();
        const errorMessage: string = await props.onSubmit(client);
        if (errorMessage) {
            alert(errorMessage);
        } else {
            onReset();
            setOpen(true);
            timeId.current = setTimeout(() => setOpen(false), 3000)
        }
    }
    function onReset() {
        setClient(getEmptyClient());
    }

    /**
     * converts field value to corresponding strict type
     * @param field
     */
    function getFieldValue(field: any): any {
        return field.type === 'number' ? +field.value : field.value;
    }

    /**
     *  Validates fields for enabling/disabling Submit button
     */
    useEffect(() => {
        const validate = (): boolean => {
            return client.address !== '';
        }

        setValid(validate());
        return ()=>clearTimeout(timeId.current);
    }, [client]);

    return <React.Fragment>
        <br/>
        {/*style={customers && {width: '40%', marginLeft: '30vw'}}*/}
        <Paper>
            <form onSubmit={onSubmit} onReset={onReset} className={classes.FormStyle}>
                <Typography component="h1" variant="h4" align="center" color="textPrimary">
                    Order № {client.id}
                </Typography>
            <br/>
                <div>
                    <Button disabled={!isValid} variant="contained" color="primary"
                            type={'submit'}>Submit</Button>

                    {props.onCancel ? <Button variant="contained" color="primary"
                                              onClick={props.onCancel}>Cancel</Button> :
                        <Button variant="contained" color="primary"
                                type={'reset'}>Reset</Button>}
                </div>

                <Collapse in={open}>
                    <Typography component={Paper} align={"center"} style={{
                        backgroundColor: "lightgreen",
                        width: '60%', marginLeft: '20vw'
                    }} color="textPrimary" >
                        the client is changed
                    </Typography>
                </Collapse>

            </form>
        </Paper>


    </React.Fragment>
}
export default ClientForm;

