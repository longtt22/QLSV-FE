import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import { Link, useLocation } from 'react-router-dom';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.ol}`]: {
        alignItems: 'center',
    },
}));

const NavbarBreadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <StyledBreadcrumbs aria-label="breadcrumb">
            <Link to="/" style={{ textDecoration: 'none' }}>
                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>Home</Typography>
            </Link>
            {pathnames.map((pathname, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                return (
                    <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                        <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
                            {pathname}
                        </Typography>
                    </Link>
                );
            })}
        </StyledBreadcrumbs>
    );
};

export default NavbarBreadcrumbs;
