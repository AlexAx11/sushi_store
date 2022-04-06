import React, {useCallback, useEffect, useRef, useState} from "react";
import {Button, Collapse, FormControl, InputLabel, MenuItem, Paper, Select, TextField} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import useStyles from "../../config/styles";
import {MAX_ID, MENU_FORM, MIN_ID, MIN_NAME_LENGTH} from "../../config/constants";
import Dish from "../../models/Dish";
import {getRandomNumber} from "../../util/random"
import {getEmptyDish} from "../DishForm";
type  Props = {
    onSubmit: (dish: Dish) => Promise<string>;
    dish?: Dish;
    onCancel: () => void;
    imageUpload: (image: any) =>  Promise<string>;
}

export function printDish(dish: Dish): string {
    const res: string = ("image: " + dish.image.toString() + ", fieldMenu: " + dish.fieldMenu.toString() +
        ", name: " + dish.name.toString() + ", composition: " + dish.composition.toString() + ", id: " +
        + dish.id.toString() + ", price: " + dish.price.toString() + ", archive: " + dish.archive.toString());
    return res;
}

const AddDishForm: React.FC<Props> = (props: Props) => {
    const [image, setImage] = useState("");
    const timeId = useRef<any>();
    const [open, setOpen] = useState(false)
    const [isValid, setValid] = useState<boolean>(false);
    const [dish, setDish] = useState<Dish>(props.dish ? props.dish : getEmptyDish);

 function getRandomId() {
     console.log('randomID')
   return  getRandomNumber(MIN_ID,MAX_ID);
 }
    function onReset() {
        setDish(getEmptyDish());
        setImage('')
    }

    function handlerChange(event: any) {
        const name: string = event.target.name;
        dish[name] = getFieldValue(event.target);
        setDish({...dish});
    }
    function handlerChangeImage(event: any) {
         setImage(event.target.files[0])
    }

    function getFieldValue(field: any): any {
        return field.type === 'number' ? +field.value : field.value;
    }

    const validateNameFn = () => {
        const {name} = dish;
        let i;
        for (i = 0; i < name.length; i++) {
            const symbol = name.charAt(i);
            if (symbol.toLowerCase() === symbol.toUpperCase()) {
                return 'name may contain only letters';
            }
        }
        if (i < MIN_NAME_LENGTH) {
            return `name can't be less than ${MIN_NAME_LENGTH}`;
        }
        return '';

    }
    const validatePriceFn = () => {
        const {price} = dish;
        if (!price) return 'salary should be a number'
        return '';
    }
    const validationImgFn = () => {
        const image = dish.image
        if (!image) {
            return "please upload the picture"
        }
        return '';
    }

    const validateName = useCallback(validateNameFn, [dish]);
    const validateComposition = useCallback(validateNameFn, [dish]);
    const validateImg = useCallback(validationImgFn, [dish]);
    const validatePrice = useCallback(validatePriceFn, [dish]);

    async function onSubmit(event: any) {
        event.preventDefault();
        let errorMessage: string = '';
        if(image){
            dish.image = await props.imageUpload(image)
            console.log('image: ' + image)
        }
        if(props.dish?.id) {
            console.log('update')
            errorMessage = await props.onSubmit(dish);
        }else{
            console.log('add')
            dish.archive=true;
            dish.id=getRandomId();
            errorMessage = await props.onSubmit(dish);
        }
        if (errorMessage) {
            alert(errorMessage);
        } else {
            console.log('onReset')
            onReset();
            setOpen(true);
            timeId.current = setTimeout(() => setOpen(true), 3000)
        }
    }


    useEffect(() => {
        const validate = (): boolean => {
            return !validateName()
                && !validateComposition()
                && !validateImg()
                && !validatePrice();
        }
        setValid(validate());
        return () => clearTimeout(timeId.current);
    }, [dish, validatePrice, validateName, validateImg,validateComposition]);

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Add Dish
            </Typography>
            <form onSubmit={onSubmit} onReset={onReset}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="name"
                            name="name"
                            label="Name"
                            fullWidth
                            autoComplete="name"
                            error={!!validateName()} helperText={validateName()}
                            onChange={handlerChange}
                            value={dish.name.toString()}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="composition"
                            name="composition"
                            label="Composition"
                            fullWidth
                            autoComplete="composition"
                            error={!!validateComposition()} helperText={validateComposition()}
                            onChange={handlerChange}
                            value={dish.composition.toString()}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            id="price"
                            name="price"
                            label="Price"
                            fullWidth
                            autoComplete="price"
                            error={!!validatePrice()} helperText={validatePrice()}
                            onChange={handlerChange}
                            value={dish.price.toString() === "NaN" ? '' : dish.price.toString()}
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <FormControl>
                        <InputLabel style={{width: '10vw'}} required error={!dish.fieldMenu}>Field Menu</InputLabel>
                        <Select name={"fieldMenu"}
                                value={dish.fieldMenu}
                                fullWidth
                                onChange={handlerChange} style={{width: '10vw'}}
                        >
                            {MENU_FORM.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                        </Select>
                    </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3} alignItems="center">
                        <label htmlFor="contained-button-file">
                            <Typography style={{width: '10vw'}}>Choose file</Typography>
                            {/*<Fab component="span">*/}
                            {/*    <AddPhotoAlternateIcon/>*/}
                            {/*</Fab>*/}
                        </label>
                        <input
                            accept="image/*"
                            id="contained-button-file"
                            name="image"
                            type="file"
                            autoComplete="image"
                            onChange={handlerChangeImage}
                            required={true}
                        />
                    </Grid>
                </Grid>
                <br/>
                <div style={{display:"flex",
                    justifyContent:"space-end"
                }}>
                    <Button   variant="contained" color="primary"
                            type={'submit'}>Submit</Button> &nbsp;

                    {props.onCancel ? <Button variant="contained" color="primary"
                                              onClick={props.onCancel}>Cancel</Button> :
                        <Button variant="contained" color="primary"
                                type={'reset'}>Reset</Button>}
                </div>
                <Collapse in={open}>
                    <Typography component={Paper} align={"center"} style={{
                        backgroundColor: "lightgreen",
                        width: '40%', marginLeft: '30vw'
                    }}>
                        dish is accepted
                    </Typography>
                </Collapse>
            </form>
        </React.Fragment>
    );

}
export default AddDishForm;
