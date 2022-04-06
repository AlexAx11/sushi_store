import React, {useRef, useState} from "react";
import MyTable, {HeaderDefinition} from "../library/MyTable";
import {dishesService} from "../../config/services-config";
import {Delete, Edit} from "@material-ui/icons";
import ConfirmationDialog from "../library/ConfirmationDialog";
import {Button, Dialog, DialogContent} from "@material-ui/core";
import Dish from "../../models/Dish";
import {getEmptyDish} from "../DishForm";
import {useSelector} from "react-redux";
import {ReducersType} from "../../redux/store";
import AddDishForm from "../library/AddDishForm";
import useStyles from "../../config/styles";
export function getDishHeaders(): Map<string, HeaderDefinition> {
    return new Map<string, HeaderDefinition>([
        ['id',{displayName: 'ID'}],
        ['name',{displayName: 'Name'}],
        ['composition',{displayName: 'Composition'}],
        ['price',{displayName: 'Price'}],
        ['image',{displayName: 'Image'}],
    ])
}
export function getDishImage(string: string[], width?: string, height?: string) {
    const url = string.toString()
    return <img width={!!width ? width : '100'} height={!!height ? height : '100'} src={url}/>
}
const Dishes: React.FC = () => {
    const dishes: Dish[] = useSelector((state: ReducersType) => state.dishes);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [text, setText] = useState<string>('');
    const [dish, setDish] = useState<Dish|null>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const dish_ = useRef<Dish>();
    function removeDish(obj: object) {
        dish_.current = obj as Dish;
        setTitle("You are going to delete !");
        setText("Dish with id " + dish_.current?.id);
        setOpenConfirm(true);
    }

    function openUpdateDish(obj: object) {
        setTitle("You are going to update !");
        setText("Dish with id " + (obj as Dish).id);
        setOpenConfirm(true);
        setDish(obj as Dish);
    }

    function onCancel() {
        setDish(null);
        setOpenForm(false);
    }

    async function handleCloseConfirm(res: boolean) {
        if (res) {
            if (dish) {
                setOpenForm(true);
            } else if (dish_.current) {
                await dishesService.removeDish(dish_.current.id);
            }
        }
        setOpenConfirm(false);
    }
    const classes = useStyles()

    async function updateDish(dish_: Dish):Promise<string> {
        await dishesService.updateDish(dish_.id, dish_);
        onCancel();
        return '';
    }
    async function addDish(dish: Dish): Promise<string> {
        await dishesService.addDish(dish);
        onCancel();
        return '';
    }
    async function imageUpload(img: any): Promise<string> {
        return await dishesService.addImage(img);
    }
    return  <React.Fragment>
        <div style={{marginTop:'7vw', marginLeft: '6.5vw'}}>
        <MyTable headers={getDishHeaders()} objectName="image" objectFn={getDishImage}
                 data={dishes} actions={[{icon: <Delete/>, actionFn: removeDish},
            {icon: <Edit/>, actionFn: openUpdateDish}]} width='70vw' rows={3}/>
            <br/>
            <div>
                <Button className={classes.centerPosition} variant="contained" color="primary"
                        onClick={() => setOpenForm(true)}
                        style={{
                            margin: '0',
                            position: 'absolute',
                            left: '50%',
                            // -ms-transform: 'translate(-50%, -50%)',
                            transform: 'translate(-39%, -3%)'
                        }}
                >Add Dish</Button>
            </div>


        <ConfirmationDialog open={openConfirm} handleClose={handleCloseConfirm}
                            title={title} text={text}/>
        <Dialog open={openForm} maxWidth='xs'>
            <DialogContent >
                    <AddDishForm imageUpload={imageUpload}
    onSubmit={dish ? updateDish : addDish} onCancel={onCancel}
    dish={dish ? dish : getEmptyDish()}/>
            </DialogContent>
        </Dialog>
        </div>
    </React.Fragment>
}
export default Dishes;
