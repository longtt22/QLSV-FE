import * as React from 'react';
import {useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import {BarChart} from '@mui/x-charts/BarChart';
import {StatusProp} from "../modules/application/type";
import {countStatus} from "../modules/application/service";

const statusColors: any = ['#2196f3',];

export default function RequestStatusBarChart() {
    const [dataChart, setDataChart] = useState<StatusProp[]>([]);

    const fetchData = async () => {
        try {
            const [dataChart] = await Promise.all([countStatus()]);
            setDataChart(dataChart || []);

        } catch (error) {
            console.error("Error fetching data", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const data = dataChart.map((item) => item.totalRequests);
    return (
        <Card variant="outlined" sx={{width: '100%'}}>
            <CardContent>
                <Typography component="h2" variant="subtitle2" gutterBottom>
                    Request Status Breakdown
                </Typography>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{justifyContent: 'space-between', alignItems: 'center', mb: 2}}
                >
                    <Typography variant="h4" component="p">
                        Total: {dataChart[0]?.totalAllRequests || 0}
                    </Typography>
                </Stack>
                <BarChart
                    xAxis={[
                        {
                            scaleType: 'band',
                            data: dataChart.map((item) => item.status),
                        },
                    ]}
                    series={[
                        {
                            id: 'status-requests',
                            label: 'Requests',
                            data: data,
                        },
                    ]}
                    colors={statusColors}
                    height={300}
                    margin={{left: 50, right: 0, top: 20, bottom: 20}}
                    grid={{horizontal: true}}
                />
            </CardContent>
        </Card>
    );
}
