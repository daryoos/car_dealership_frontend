import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { fetchVehiclesByMake, createVehicle, updateVehicle, deleteVehicle } from '../slices/vehicleSlice';
import AdminLayout from '../components/AdminLayout';

interface Vehicle {
    id: number;
    make: string;
    model: string;
}

const AdminVehicles: React.FC = () => {
    const { make } = useParams<{ make: string }>();
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [vehicleData, setVehicleData] = useState<Partial<Vehicle>>({});

    useEffect(() => {
        const loadVehicles = async () => {
            if (make) {
                const fetchedVehicles = await fetchVehiclesByMake(make);
                setVehicles(fetchedVehicles);
            }
        };
        loadVehicles();
    }, [make]);

    const handleDialogOpen = (vehicle?: Vehicle) => {
        if (vehicle) {
            setVehicleData(vehicle);
        } else {
            setVehicleData({ make: make || '', model: '' });
        }
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setVehicleData({});
    };

    const handleSaveVehicle = async () => {
        if (vehicleData.id) {
            await updateVehicle(vehicleData as Vehicle);
        } else {
            await createVehicle(vehicleData as Vehicle);
        }
        handleDialogClose();
    };

    const handleDeleteVehicle = async (vehicleId: number) => {
        await deleteVehicle(vehicleId);
        setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
    };

    return (
        <AdminLayout>
            <h1>Vehicles for {make}</h1>
            <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>
                Create New Vehicle
            </Button>
            <List>
                {vehicles.map((vehicle) => (
                    <ListItem key={vehicle.id} button>
                        <ListItemText primary={`${vehicle.make} ${vehicle.model}`} onClick={() => handleDialogOpen(vehicle)} />
                        <Button variant="contained" color="secondary" onClick={() => handleDeleteVehicle(vehicle.id)}>Delete</Button>
                        <Button variant="contained" color="primary" onClick={() => navigate(`/adminSearch/${make}/${vehicle.id}`)}>View Specifics</Button>
                    </ListItem>
                ))}
            </List>
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{vehicleData.id ? 'Edit Vehicle' : 'Create Vehicle'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Make"
                        type="text"
                        fullWidth
                        value={vehicleData.make}
                        onChange={(e) => setVehicleData({ ...vehicleData, make: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Model"
                        type="text"
                        fullWidth
                        value={vehicleData.model}
                        onChange={(e) => setVehicleData({ ...vehicleData, model: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveVehicle} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminVehicles;
