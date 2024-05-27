import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { fetchVehiclesSpecific, createVehicleSpecific, updateVehicleSpecific, deleteVehicleSpecific } from '../slices/vehicleSpecificSlice';
import AdminLayout from '../components/AdminLayout';

interface VehicleSpecific {
    id: number;
    vehicleId: number;
    year: number;
    color: string;
    engineId: number;
    trim: string;
    price: number;
    sold: boolean;
}

const AdminVehicleSpecific: React.FC = () => {
    const { make, vehicleId } = useParams<{ make: string, vehicleId: string }>();
    const navigate = useNavigate();
    const [specifics, setSpecifics] = useState<VehicleSpecific[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [specificData, setSpecificData] = useState<Partial<VehicleSpecific>>({});

    useEffect(() => {
        const loadSpecifics = async () => {
            if (vehicleId) {
                const fetchedSpecifics = await fetchVehiclesSpecific(Number(vehicleId));
                setSpecifics(fetchedSpecifics);
            }
        };
        loadSpecifics();
    }, [vehicleId]);

    const handleDialogOpen = (specific?: VehicleSpecific) => {
        if (specific) {
            setSpecificData(specific);
        } else {
            setSpecificData({ vehicleId: Number(vehicleId), year: 0, color: '', engineId: 0, trim: '', price: 0, sold: false });
        }
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setSpecificData({});
    };

    const handleSaveSpecific = async () => {
        if (specificData.id) {
            await updateVehicleSpecific(specificData.id, specificData as VehicleSpecific);
        } else {
            await createVehicleSpecific(specificData as VehicleSpecific);
        }
        handleDialogClose();
    };

    const handleDeleteSpecific = async (specificId: number) => {
        await deleteVehicleSpecific(specificId);
        setSpecifics(specifics.filter(specific => specific.id !== specificId));
    };

    return (
        <AdminLayout>
            <h1>Vehicle Specifics for {make}</h1>
            <Button variant="contained" color="primary" onClick={() => handleDialogOpen()}>
                Create New Specific
            </Button>
            <List>
                {specifics.map((specific) => (
                    <ListItem key={specific.id} button>
                        <ListItemText primary={`Year: ${specific.year}, Color: ${specific.color}`} onClick={() => handleDialogOpen(specific)} />
                        <Button onClick={() => handleDeleteSpecific(specific.id)}>Delete</Button>
                    </ListItem>
                ))}
            </List>
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{specificData.id ? 'Edit Specific' : 'Create Specific'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Year"
                        type="number"
                        fullWidth
                        value={specificData.year}
                        onChange={(e) => setSpecificData({ ...specificData, year: Number(e.target.value) })}
                        InputProps={{ inputMode: 'numeric' }}
                    />
                    <TextField
                        margin="dense"
                        label="Color"
                        type="text"
                        fullWidth
                        value={specificData.color}
                        onChange={(e) => setSpecificData({ ...specificData, color: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Engine ID"
                        type="number"
                        fullWidth
                        value={specificData.engineId}
                        onChange={(e) => setSpecificData({ ...specificData, engineId: Number(e.target.value) })}
                        InputProps={{ inputMode: 'numeric' }}
                    />
                    <TextField
                        margin="dense"
                        label="Trim"
                        type="text"
                        fullWidth
                        value={specificData.trim}
                        onChange={(e) => setSpecificData({ ...specificData, trim: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        type="number"
                        fullWidth
                        value={specificData.price}
                        onChange={(e) => setSpecificData({ ...specificData, price: Number(e.target.value) })}
                        InputProps={{ inputMode: 'numeric' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveSpecific} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminVehicleSpecific;

