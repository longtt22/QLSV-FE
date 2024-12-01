import * as React from 'react';
import {useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {BarChart} from '@mui/x-charts/BarChart';
import {handlerUserProp} from "../modules/application/type";
import {countHandlerUser} from "../modules/application/service";

export default function TopHandlersBarChart() {
    const [dataChart, setDataChart] = useState<handlerUserProp[]>([]);

    const fetchData = async () => {
        try {
            const [dataChart] = await Promise.all([countHandlerUser()]);
            setDataChart(dataChart || []);

        } catch (error) {
            console.error("Error fetching data", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <Card variant="outlined" sx={{width: '100%'}}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    Top Handlers by Total Requests
                </Typography>
                <BarChart
                    xAxis={[
                        {
                            scaleType: 'band',
                            data: dataChart.map((item) => item.handlerUser),
                        },
                    ]}
                    series={[
                        {
                            id: 'total-requests',
                            label: 'Total Requests',
                            data: dataChart.map((item) => item.totalRequests),
                            color: '#4caf50', // Áp dụng màu xanh lá cây cho cột
                        },
                    ]}
                    height={350}
                    margin={{left: 50, right: 0, top: 20, bottom: 20}}
                    grid={{horizontal: true}}
                />
            </CardContent>
        </Card>
    );
}
