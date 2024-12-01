import * as React from 'react';
import {useEffect, useState} from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Copyright from './Copyright';
import PageViewsBarChart from './PageViewsBarChart';
import HandlerPerformanceBarChart from './SessionsChart';
import StatCard, {StatCardProps} from './StatCard';
import {countUser} from "../modules/employee/service";


export default function MainGrid() {
    const [userCards, setUserCards] = useState<StatCardProps[]>([]);

    const fetchData = async () => {
        try {
            const [userCards] = await Promise.all([countUser()]);
            setUserCards(userCards || []);

        } catch (error) {
            console.error("Error fetching data", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Box sx={{width: '100%', maxWidth: {sm: '100%', md: '1700px'}}}>
            {/* cards */}
            <Typography component="h2" variant="h6" sx={{mb: 2}}>
                Overview User
            </Typography>
            <Grid
                container
                spacing={2}
                columns={12}
                sx={{mb: (theme) => theme.spacing(2)}}
            >
                {userCards.map((card, index) => (
                    <Grid key={index} size={{xs: 12, sm: 6, lg: 3}}>
                        <StatCard {...card} />
                    </Grid>
                ))}
                <Grid size={{xs: 12, md: 6, sm: 6}}>
                    <HandlerPerformanceBarChart/>
                </Grid>
                <Grid size={{xs: 12, md: 6, sm: 6}}>
                    <PageViewsBarChart/>
                </Grid>
            </Grid>
            <Copyright sx={{my: 4}}/>
        </Box>
    );
}
