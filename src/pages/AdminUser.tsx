import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid, Typography, Card, CardContent, CardActions, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { fetchUsers, createUser, updateUser, deleteUser, User, NewUser, UpdateUser } from '../slices/userSlice';
import AdminLayout from '../components/AdminLayout';

const AdminUser: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentUser, setCurrentUser] = useState<Partial<NewUser & { id?: number }> | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const fetchedUsers = await fetchUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Error loading users:', error);
            }
        };

        loadUsers();
    }, []);

    const handleCreateOrUpdateUser = async () => {
        if (isEditing && currentUser?.id) {
            const updatedUser: UpdateUser = {
                email: currentUser.email!,
                password: currentUser.password!,
                name: currentUser.name!,
            };
            try {
                await updateUser(currentUser.id, updatedUser);
                setUsers((prevUsers) => prevUsers.map((user) => (user.id === currentUser.id ? { ...user, ...updatedUser } : user)));
            } catch (error) {
                console.error('Error updating user:', error);
            }
        } else {
            const newUser: NewUser = {
                email: currentUser?.email!,
                password: currentUser?.password!,
                name: currentUser?.name!,
                isAdmin: currentUser?.isAdmin || false,
            };
            try {
                const createdUser = await createUser(newUser);
                setUsers((prevUsers) => [...prevUsers, createdUser]);
            } catch (error) {
                console.error('Error creating user:', error);
            }
        }
        setOpenDialog(false);
        setCurrentUser(null);
        setIsEditing(false);
    };

    const handleDeleteUser = async (id: number) => {
        try {
            await deleteUser(id);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleOpenDialog = (user?: User) => {
        if (user) {
            setCurrentUser(user);
            setIsEditing(true);
        } else {
            setCurrentUser(null);
            setIsEditing(false);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentUser(null);
        setIsEditing(false);
    };

    return (
        <AdminLayout>
            <div style={{ marginTop: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Users Management
                </Typography>
                <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                    Add New User
                </Button>
                <Grid container spacing={3} style={{ marginTop: '20px' }}>
                    {users.map((user) => (
                        <Grid item xs={12} sm={6} md={4} key={user.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {user.name}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {user.email}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        {user.isAdmin ? 'Admin' : 'User'}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => handleOpenDialog(user)}>Edit</Button>
                                    <Button size="small" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        type="text"
                        fullWidth
                        value={currentUser?.name || ''}
                        onChange={(e) => setCurrentUser((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        value={currentUser?.email || ''}
                        onChange={(e) => setCurrentUser((prev) => ({ ...prev, email: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        label="Password"
                        type="password"
                        fullWidth
                        value={currentUser?.password || ''}
                        onChange={(e) => setCurrentUser((prev) => ({ ...prev, password: e.target.value }))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateOrUpdateUser} color="primary">
                        {isEditing ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminUser;
