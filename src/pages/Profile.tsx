import React, { useEffect, useState } from 'react';
import { Button, Grid, Typography, Card, CardContent, TextField, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { updateUser, logout } from '../slices/authSlice';
import { fetchMakes } from '../slices/vehicleSlice';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Profile: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const userProfileInfo = useAppSelector((state) => state.auth.userProfileData);

    const [name, setName] = useState(userProfileInfo?.name || '');
    const [email, setEmail] = useState(userProfileInfo?.email || '');
    const [password, setPassword] = useState('');

    const handleUpdateProfile = () => {
        const userData = { name, email, password };
        const userId = userProfileInfo?.id || '';
        dispatch(updateUser({ userId, userData }));
    };

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login');
    };

    const [openSidebar, setOpenSidebar] = useState(false);
    const [makes, setMakes] = useState<String[]>([]);

    useEffect(() => {
        const loadMakes = async () => {
            try {
                const fetchedMakes = await fetchMakes();
                setMakes(fetchedMakes);
            } catch (error) {
                console.error('Error loading makes:', error);
            }
        };

        loadMakes();
    }, []);

    return (
        <div>
            {/* Top bar */}
            <div style={{ backgroundColor: '#1976d2', color: 'white', padding: '10px' }}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Button onClick={() => setOpenSidebar(true)} startIcon={<MenuIcon />} color="inherit" sx={{ text: 'false' }}>
                        </Button>
                    </Grid>
                    <Grid item>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Button color="inherit" startIcon={<AccountCircleIcon />} onClick={() => navigate('/profile')}>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button color="inherit" startIcon={<ShoppingCartIcon />} onClick={() => navigate('/cart')}>
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>

            {/* Sidebar */}
            <Drawer anchor="left" open={openSidebar} onClose={() => setOpenSidebar(false)}>
                <div style={{ width: 200 }}>
                    <List>
                        {/* Home Button */}
                        <ListItem button onClick={() => navigate('/')}>
                            <ListItemText primary="Home" />
                        </ListItem>
                        {makes.map((make, index) => (
                            <ListItem button key={index} onClick={() => navigate(`/search/${make}`)}>
                                <ListItemText primary={make} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>

            {/* Profile content */}
            <div style={{ padding: '20px' }}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="h6">Welcome, {userProfileInfo?.name}!</Typography>
                    </Grid>
                    <Grid item>
                        <Button color="primary" onClick={handleUpdateProfile}>Update Profile</Button>
                    </Grid>
                </Grid>
                <div style={{ marginTop: '20px' }}>
                    <Card>
                        <CardContent>
                            <TextField
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
