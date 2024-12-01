import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

import {Link, useLocation} from 'react-router-dom';
import storage from "../commons/storage";
import {ADMIN, STAFF, STUDENT} from "../commons/constants";

const mainListItems = [
    {text: 'Application', icon: <AssignmentRoundedIcon/>, path: '/prescription', roles: [ADMIN, STAFF, STUDENT]},
    {text: 'Type Application', icon: <AssignmentRoundedIcon/>, path: '/application-type', roles: [ADMIN, STAFF]},
    {text: 'Employee', icon: <PeopleRoundedIcon/>, path: '/employee', roles: [ADMIN]},
    {text: 'Student', icon: <PeopleRoundedIcon/>, path: '/student', roles: [ADMIN, STAFF]},
    {text: 'Statistics', icon: <AnalyticsRoundedIcon/>, path: '/statistics', roles: [ADMIN]},
];

const secondaryListItems = [
    {text: 'Settings', icon: <SettingsRoundedIcon/>, path: '/settings', roles: [ADMIN]},
    {text: 'About', icon: <InfoRoundedIcon/>, path: '/about', roles: [ADMIN, STAFF, STUDENT]},
    {text: 'Feedback', icon: <HelpRoundedIcon/>, path: '/feedback', roles: [ADMIN, STAFF, STUDENT]},
];

export default function MenuContent() {
    // Lấy Role của người dùng từ Redux store
    const userRoles: string[] = storage.getTokenData()?.authorities ?? [];
    const location = useLocation();
    const currentPath = location.pathname;
    // Hàm kiểm tra xem user có role phù hợp để hiển thị mục menu hay không
    const hasAccess = (itemRoles: string[]) => {
        return itemRoles.some(role => userRoles.includes(role));
    };

    return (
        <Stack sx={{flexGrow: 1, p: 1, justifyContent: 'space-between'}}>
            <List dense>
                <ListItem disablePadding sx={{display: 'block'}}>
                    <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                        <ListItemButton selected={currentPath === "/"}>
                            <ListItemIcon><HomeRoundedIcon/></ListItemIcon>
                            <ListItemText primary="Home"/>
                        </ListItemButton>
                    </Link>
                </ListItem>
                {mainListItems
                    .filter(item => hasAccess(item.roles))
                    .map((item, index) => (
                        <ListItem key={index} disablePadding sx={{display: 'block'}}>
                            <Link to={item.path} style={{textDecoration: 'none', color: 'inherit'}}>
                                <ListItemButton selected={currentPath === item.path}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text}/>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
            </List>

            <List dense>
                {secondaryListItems
                    .filter(item => hasAccess(item.roles))
                    .map((item, index) => (
                        <ListItem key={index} disablePadding sx={{display: 'block'}}>
                            <Link to={item.path} style={{textDecoration: 'none', color: 'inherit'}}>
                                <ListItemButton>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text}/>
                                </ListItemButton>
                            </Link>
                        </ListItem>
                    ))}
            </List>
        </Stack>
    );
}
