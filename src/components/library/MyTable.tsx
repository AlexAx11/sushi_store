import React, {useState} from "react";
import {
    Paper, Table, TableContainer,makeStyles,
    TableHead, TableRow, TableBody, TableCell, IconButton, TableFooter, TablePagination
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
    actions?: {icon: JSX.Element, actionFn: (obj: object)=>void}[]
    objectFn?: (url: string[]) => JSX.Element;
    objectName?: string;
    rows?: number;
}
const marginTable = '8vw'
const useStyles = makeStyles(
    {
       table: (propsCSS: any) => ({
           width: propsCSS.width || '80%',
           marginLeft:marginTable,
           marginTop:'5vh'
       }) ,
        header: {
           fontSize: '1.2em',
            fontStyle: 'italic',
            fontWeight: 'bold'
        }
    }
)
const MyTable: React.FC<Props> = (props) => {

const {headers, data, actions, width} = props;
const propsCSS = {width};
    const classes = useStyles(propsCSS);
const [rowsPerPage, setRowsPerPage] = useState(props.rows ? props.rows : 5);
const [page, setPage] = useState(0);
function getHeaders(): JSX.Element[] {
    const columnHeaders =  Array.from(headers.values()).map(h =>
        <TableCell className={classes.header} align={(h.align ? h.align as any : 'left')}
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
    const dataPerPage = rowsPerPage === -1 ? data : data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    return dataPerPage.map((obj, index) => getRow(obj, index));
}
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
function getRow(obj: object, index: number): JSX.Element {
    return <TableRow key={index} >
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
    }else{
        return obj[key];
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
                cells.push(<TableCell align={'right'} key={index} style={{width: '2%'}}>
                    <IconButton size={'small'}
                                onClick={() => a.actionFn(obj)}
                                key={index}>{a.icon}</IconButton>
                </TableCell>))
        }
        return cells;
    }
        return (
            <TableContainer component={Paper} className={classes.table}
                            style={{width: props.width ? props.width : "100%"}}>
                <Table  size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            {getHeaders()}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {getRows()}

                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={props.rows ? [props.rows, 10, 25, { label: 'All', value: -1 }] :
                                    [5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={3}
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: { 'aria-label': 'rows per page' },
                                    native: true,
                                }}
                                onChangePage={handleChangePage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                                color="textPrimary"
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        );
    }
    export default MyTable;

