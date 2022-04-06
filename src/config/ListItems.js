import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';

export const listItems = (
    <div>
        <ListItem button>
            <ListItemText primary="First dishes" />
        </ListItem>
        <ListItem button>
            <ListItemText primary="Main dishes" />
        </ListItem>
        <ListItem button>
            <ListItemText primary="Maki" />
        </ListItem>
        <ListItem button>
            <ListItemText primary="Maki I/O" />
        </ListItem>
        <ListItem button>
            <ListItemText primary="Self-build rolls" />
        </ListItem>
        <ListItem button>
            <ListItemText primary="Futomaki" />
        </ListItem>
        <ListItem button>
            <ListItemText primary="Sandwich" />
        </ListItem>
        <ListItem button>
            <ListItemText primary="Nigiri" />
        </ListItem>
        <ListItem button>
            <ListItemText primary="Sets" />
        </ListItem>
        <ListItem button>
            <ListItemText primary="Catering" />
        </ListItem>
        <ListItem button>
            <ListItemText primary="Sashimi" />
        </ListItem>
        <ListItem button>
            <ListItemText primary="Beverages" />
        </ListItem>
    </div>
);

export const secondaryListItems = (
    <div>
        <ListSubheader inset>Saved reports</ListSubheader>
        <ListItem button>
            <ListItemText primary="Current month"  color="textPrimary"/>
        </ListItem>
        <ListItem button>
            {/*<ListItemIcon>*/}
            {/*    <AssignmentIcon />*/}
            {/*</ListItemIcon>*/}
            <ListItemText primary="Last quarter"  color="textPrimary"/>
        </ListItem>
        <ListItem button>
            <ListItemText primary="Year-end sale"  color="textPrimary"/>
        </ListItem>
    </div>
);