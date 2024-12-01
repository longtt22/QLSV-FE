import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';

const LoadingIndicator: React.FC = () => {
    const isLoading = useSelector((state: RootState) => state.loading.isLoading);

    return (
        <>
            {isLoading && (
                <Box
                    sx={{
                        display: 'flex',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        zIndex: 9999,
                    }}
                >
                    <CircularProgress/>
                </Box>
            )}
        </>
    );
};

export default LoadingIndicator;
