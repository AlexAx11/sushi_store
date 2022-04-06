import React, {useEffect, useRef, useState} from "react";
import {
    Button,
    Collapse,
    Paper,
    Typography
} from "@material-ui/core";
import useStyles from "../config/styles";
import Dish from "../models/Dish";
import {useSelector} from "react-redux";
import {ReducersType} from "../redux/store";

type Props = {
    onSubmit: (dish: Dish) => Promise<string>;
    dish?: Dish;
    onCancel?: () => void;
}

/**
 * Gets empty dish record
 */
export function getEmptyDish(): Dish {
    return {
        id: NaN,
        name: '',
        image: '',
        composition: '',
        price: NaN,
        archive: false,
        fieldMenu: ''
    };
}

const DishForm: React.FC<Props> = (props: Props) => {
    const dishes: Dish[] = useSelector((state: ReducersType) => state.dishes);
    const classes = useStyles();
    const [dish, setDish] = useState<Dish>(
        props.dish ? {...props.dish} : getEmptyDish());
    const [isValid, setValid] = useState<boolean>(false);
    const [open, setOpen] = useState(false)
    const timeId = useRef<any>();

    async function onSubmit(event: any) {
        event.preventDefault();
        const errorMessage: string = await props.onSubmit(dish);
        if (errorMessage) {
            alert(errorMessage);
        } else {
            onReset();
            setOpen(true);
            timeId.current = setTimeout(() => setOpen(false), 3000)
        }
    }
    function onReset() {
        setDish(getEmptyDish());
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
            return dish.composition !== '';
        }

        setValid(validate());
        return ()=>clearTimeout(timeId.current);
    }, [dish]);

    return <React.Fragment>
        <br/>
        <Paper style={dishes && {width: '40%', marginLeft: '30vw'}}>
            <form onSubmit={onSubmit} onReset={onReset} className={classes.FormStyle}>
                <Typography component="h1" variant="h4" align="center" color="textPrimary">
                    Dish № {dish.id}
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
                    }} color="textPrimary">
                        the dish is changed
                    </Typography>
                </Collapse>

            </form>
        </Paper>


    </React.Fragment>
}
export default DishForm;

