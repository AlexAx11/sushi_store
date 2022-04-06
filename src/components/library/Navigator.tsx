import React, {useState} from "react";
import {Link} from "react-router-dom";
import {Tab, Tabs} from "@material-ui/core";
import {getBasketIcon} from "../pages/Basket";
import Customer from "../../models/Customer";

const Navigator: React.FC<{items: { path: string, label: string}[], customer: Customer}> =
    (props) => {
        const [value, setValue] = useState(0);
        function handleChange(event:any, newValue:number) {
            setValue(newValue)
        }
        function getIcon(label: string): JSX.Element { //<ShoppingBasketIcon />
             return label === 'Basket' ? getBasketIcon(props.customer) : <div/>
         }

        return <Tabs onChange={handleChange} value={value} >
                    {props.items.map((item, index) =>
                        <Tab color="textPrimary" component={Link} to={item.path} label={item.label==='Basket'? '' : item.label}
                             icon={getIcon(item.label)} key={index}/>)}
                </Tabs>
    }
export default Navigator