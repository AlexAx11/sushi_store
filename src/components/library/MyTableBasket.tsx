import React, {useState} from "react";
import {
    Paper, Table, TableContainer,makeStyles,
    TableHead, TableRow, TableBody, TableCell, IconButton
} from "@material-ui/core";

export type HeaderDefinition = {
    displayName: string;
    convertString?: (obj:any)=>string;
    align?: string
}
type Props = {
    headers: Map<string, HeaderDefinition>;
    data: object[];
    width?:string;
    actions?: {icon: JSX.Element, actionFn: (obj: object)=>void}[];
    objectFn?: (url: string[]) => JSX.Element;
    objectName?: string;
}
const useStyles = makeStyles(
    {
       table: (propsCSS: any) => ({
           width: propsCSS.width || '100%',
       }) ,
        header: {
            fontStyle: 'italic',
            fontWeight: 'bold'
        }
    }
)
const MyTableBasket: React.FC<Props> = (props) => {
const {headers, data, actions, width} = props;
const propsCSS = {width};
    const classes = useStyles(propsCSS);

function getHeaders(): JSX.Element[] {
    const columnHeaders =  Array.from(headers.values()).map(h =>
        <TableCell  color="textPrimary" className={classes.header} align={(h.align ? h.align as any : 'left')}
                   key={h.displayName}>{h.displayName}
        </TableCell>);
    if (actions) {
        for (let i = 0; i < actions.length; i++) {
            columnHeaders.push(<TableCell key={i}/>)
        }
    }
    return columnHeaders;
}
function getRows(): JSX.Element[] {
    return data.map((obj, index) => getRow(obj, index));
}

function getRow(obj: object, index: number): JSX.Element {
    return <TableRow key={index}>
        {getCells(obj)}
    </TableRow>
}
function getData(obj: Object, convertString: ((obj: any) => string) | undefined, key: string) {
        if (props.objectFn && props.objectName) {
            if (convertString) {
                return convertString(obj[key])
            }
            return obj[key] === obj[props.objectName] ? props.objectFn(obj[key]) : obj[key];
        }
        if (convertString) {
            return convertString(obj[key])
        }
    }
function getCells(obj: Object): JSX.Element[] {
   const cells: JSX.Element[] = [];
   headers.forEach((value, key) => {
const {align,convertString} = value;
       cells.push(<TableCell key={key} align={align ? align as any : 'left'}>
           {getData(obj, convertString, key)}
       </TableCell>)
   })
    if(actions) {
        actions.forEach((a, index) =>
            cells.push(<TableCell align={'left'} key={index} style={{width: '4%'}}>
                <IconButton size={'small'}
                            onClick={() => a.actionFn(obj)}
                            key={index}>{a.icon}</IconButton>
            </TableCell>))
        cells.copyWithin(headers.size-2, headers.size+1);
        cells.splice(headers.size+1)
    }
   return cells;
}
        return (
            <TableContainer style={{width: props.width ? props.width : "100%"}} component={Paper} className={classes.table}>
                <Table size="medium" aria-label="a dense table">
                    <TableHead style={{display: 'none'}}>
                        <TableRow >
                            {getHeaders()}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getRows()}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
    export default MyTableBasket;

