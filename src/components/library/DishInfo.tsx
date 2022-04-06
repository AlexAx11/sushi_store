import React from "react";
import Dish from "../../models/Dish";
type  Props = {
    dish: Dish;
}
const DishInfo: React.FC<Props> = (props: Props) => {
    return <div>
        <img src={props.dish.image}/>
        <text></text>
    </div>
}
export default DishInfo