import * as React from 'react';
import {styled} from '@mui/material/styles';
import MuiDrawer, {drawerClasses} from '@mui/material/Drawer';
import {Avatar, Box, Divider, Stack, Typography} from '@mui/material';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';
import storage from "../commons/storage";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    mt: 10,
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
});

const capitalizeFirstLetter = (string: string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default function SideMenu() {
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const user = storage.getTokenData();

    return (
        <Drawer
            variant="permanent"
            sx={{
                display: {xs: 'none', md: 'block'},
                [`& .${drawerClasses.paper}`]: {
                    backgroundColor: 'background.paper',
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    mt: 'calc(var(--template-frame-height, 0px) + 4px)',
                    p: 1.5,
                }}
            >
                <SelectContent/>
            </Box>
            <Divider/>
            <MenuContent/>
            {isAuthenticated && user ? (
                <Stack
                    direction="row"
                    sx={{
                        p: 2,
                        gap: 1,
                        alignItems: 'center',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Avatar
                        sizes="small"
                        alt={capitalizeFirstLetter(String(user.username)) || "User Avatar"}
                        src="/static/images/avatar/default.jpg"
                        sx={{width: 36, height: 36}}
                    />
                    <Box sx={{mr: 'auto'}}>
                        <Typography variant="body2" sx={{fontWeight: 500, lineHeight: '16px'}}>
                            {user?.username || 'Guest'}
                        </Typography>
                    </Box>
                    <OptionsMenu/>
                </Stack>
            ) : (
                <Stack
                    direction="row"
                    sx={{
                        p: 2,
                        gap: 1,
                        alignItems: 'center',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Button
                        fullWidth={true}
                        variant="contained"
                        color="primary"
                        onClick={() => { navigate("/login") }}
                        sx={{
                            flex: 1,
                            padding: '10px',
                            fontSize: '16px',
                            '&:hover': {backgroundColor: '#d1d1d1'},
                            borderRadius: '20px',
                        }}
                    >
                        Login
                    </Button>
                </Stack>
            )}
        </Drawer>
    );
}
