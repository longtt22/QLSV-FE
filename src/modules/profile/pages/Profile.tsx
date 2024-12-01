import React, {useEffect, useState} from 'react';
import {Avatar, Box, Button, Container, Grid, Paper, TextField, Typography} from '@mui/material';
import {ProfileType} from "../type";
import {editProfile, getProfile} from "../service";
import {toast} from "react-toastify";

const initialProfile: ProfileType = {
    userId: null,
    username: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    status: true,
    roles: [],
};

const Profile: React.FC = () => {
    const [user, setUser] = useState<ProfileType>(initialProfile);
    const [isEditing, setIsEditing] = useState(false);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const getDataProfile = async () => {
        try {
            const data = await getProfile(); // Fetch user profile data from API
            setUser(data);
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        getDataProfile(); // Load profile data on component mount
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            console.log(user);
            await editProfile(user);
            toast.success("Edit profile successfully!");
            await getDataProfile();
            setIsEditing(false);
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast.error("Save Student Error: " + errorMessage);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4}}>
                <Paper
                    elevation={3}
                    sx={{
                        padding: 3,
                        borderRadius: 2,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Avatar
                        alt={user.fullName}
                        src="/static/images/avatar/default.jpg"
                        sx={{width: 120, height: 120, mb: 2, border: '4px solid #fff'}}
                    />
                    <Typography variant="h5" sx={{fontWeight: 600, color: '#333'}}>
                        {user.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user.email}
                    </Typography>
                </Paper>

                <Box component="form" sx={{mt: 3}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="fullName"
                                value={user.fullName}
                                onChange={handleChange}
                                disabled={!isEditing}
                                variant="outlined"
                                sx={{borderRadius: '8px'}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                variant="outlined"
                                sx={{borderRadius: '8px'}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone number"
                                name="phoneNumber"
                                value={user.phoneNumber}
                                onChange={handleChange}
                                disabled={!isEditing}
                                variant="outlined"
                                sx={{borderRadius: '8px'}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={user.address}
                                onChange={handleChange}
                                disabled={!isEditing}
                                variant="outlined"
                                sx={{borderRadius: '8px'}}
                            />
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            mt: 3,
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 2,
                            width: '100%',
                        }}
                    >
                        {isEditing ? (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSave}
                                    sx={{
                                        flex: 1,
                                        padding: '10px',
                                        fontSize: '16px',
                                        '&:hover': {backgroundColor: '#3b75a0'},
                                        borderRadius: '20px',
                                    }}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleEditToggle}
                                    sx={{
                                        flex: 1,
                                        padding: '10px',
                                        fontSize: '16px',
                                        '&:hover': {backgroundColor: '#d1d1d1'},
                                        borderRadius: '20px',
                                    }}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleEditToggle}
                                sx={{
                                    width: '100%',
                                    padding: '10px',
                                    fontSize: '16px',
                                    '&:hover': {backgroundColor: '#3b75a0'},
                                    borderRadius: '20px',
                                }}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Profile;
