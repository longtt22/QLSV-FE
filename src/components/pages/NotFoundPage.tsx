import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import {Link} from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
                textAlign: 'center',
                p: 3,
            }}
        >
            <Typography variant="h4" gutterBottom>
                404 - Page Not Found
            </Typography>
            <Typography variant="body1" gutterBottom>
                Xin lỗi, trang bạn tìm kiếm không tồn tại.
            </Typography>
            <Button
                component={Link}
                to="/"
                variant="contained"
                color="primary"
                sx={{mt: 2}}
            >
                Quay lại Trang Chính
            </Button>
        </Box>
    );
};

export default NotFoundPage;
