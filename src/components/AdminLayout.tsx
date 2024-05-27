import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Box, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleIcon from '@mui/icons-material/People';
import { fetchMakes } from '../slices/vehicleSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { getUser, logout } from '../slices/authSlice';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);

    useEffect(() => {
        if (basicUserInfo) {
            dispatch(getUser(basicUserInfo.id));
        }
    }, [basicUserInfo, dispatch]);

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
                // Filter out duplicates
                const uniqueMakes = Array.from(new Set(fetchedMakes));
                setMakes(uniqueMakes);
            } catch (error) {
                console.error('Error loading makes:', error);
            }
        };

        loadMakes();
    }, []);

    return (
        <>
            <Box bgcolor="primary.main" color="white" p={2}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Button onClick={() => setOpenSidebar(true)} startIcon={<MenuIcon />} color="inherit" />
                    </Grid>
                    <Grid item>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Button color="inherit" startIcon={<AccountCircleIcon />} onClick={() => navigate('/profile')} />
                            </Grid>
                            <Grid item>
                                <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Drawer anchor="left" open={openSidebar} onClose={() => setOpenSidebar(false)}>
                <div style={{ width: 200 }}>
                    <List>
                        <ListItem button onClick={() => navigate('/adminHome')}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                        <ListItem button onClick={() => navigate('/adminUsers')}>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItem>
                        {makes.map((make, index) => (
                            <ListItem button key={index} onClick={() => navigate(`/adminSearch/${make}`)}>
                                <ListItemIcon>
                                    <DirectionsCarIcon />
                                </ListItemIcon>
                                <ListItemText primary={make} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
            <div>
                {children}
            </div>
        </>
    );
};

export default AdminLayout;
