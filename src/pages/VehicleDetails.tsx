import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Typography, Grid } from '@mui/material';
import Layout from '../components/Layout';
import { fetchVehicle } from '../slices/vehicleSlice';
import { fetchVehicleDetails } from '../slices/vehicleSpecificSlice';
import { fetchEngine } from '../slices/engineSlice';
import { createBill } from '../slices/billSlice';
import { useAppSelector } from '../hooks/redux-hooks';

interface Vehicle {
    id: number;
    make: string;
    model: string;
    // Add other properties as needed
}

interface VehicleSpecific {
    id: number;
    vehicleId: number;
    year: number;
    color: string;
    engineId: number;
    trim: string;
    price: number;
}

interface Engine {
    id: number;
    capacity: number;
    combustion: string;
    horsePower: number;
    price: number;
}

interface NewBill {
    date: Date;
    userId: number;
    vehicleSpecificId: number;
}

const VehicleDetails: React.FC = () => {
    const { vehicleSpecificId } = useParams<{ vehicleSpecificId: string }>();
    const [vehicleSpecific, setVehicleSpecific] = useState<VehicleSpecific | null>(null);
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [engine, setEngine] = useState<Engine | null>(null);
    const userProfileInfo = useAppSelector((state) => state.auth.userProfileData);
    const navigate = useNavigate();

    useEffect(() => {
        const loadVehicleSpecificDetails = async () => {
            try {
                const data = await fetchVehicleDetails(Number(vehicleSpecificId));
                setVehicleSpecific(data);
            } catch (error) {
                console.error('Error loading vehicle specific details:', error);
            }
        };

        if (vehicleSpecificId) {
            loadVehicleSpecificDetails();
        }
    }, [vehicleSpecificId]);

    useEffect(() => {
        const loadVehicleDetails = async () => {
            try {
                if (vehicleSpecific) {
                    const data = await fetchVehicle(vehicleSpecific.vehicleId);
                    setVehicle(data);
                }
            } catch (error) {
                console.error('Error loading vehicle details:', error);
            }
        };

        if (vehicleSpecific) {
            loadVehicleDetails();
        }
    }, [vehicleSpecific]);

    useEffect(() => {
        const loadEngineDetails = async () => {
            try {
                if (vehicleSpecific) {
                    const data = await fetchEngine(vehicleSpecific.engineId);
                    setEngine(data);
                }
            } catch (error) {
                console.error('Error loading engine details:', error);
            }
        };

        if (vehicleSpecific) {
            loadEngineDetails();
        }
    }, [vehicleSpecific]);

    if (!vehicleSpecific || !vehicle || !engine) {
        return <div>Loading...</div>;
    }

    const handleBuyClick = async () => {
        try {
            const newBill = {
                date: new Date(),
                userId: Number(userProfileInfo?.id),
                vehicleSpecificId: vehicleSpecific.id,
            };

            await createBill(newBill);
            navigate('/cart');
        } catch (error) {
            console.error('Error creating bill:', error);
        }
    };

    return (
        <Layout>
            <Typography variant="h4" gutterBottom>
                Vehicle Details
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Vehicle Information
                            </Typography>
                            <Typography variant="body1">
                                Make: {vehicle.make}
                            </Typography>
                            <Typography variant="body1">
                                Model: {vehicle.model}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Vehicle Specific Information
                            </Typography>
                            <Typography variant="body1">
                                Year: {vehicleSpecific.year}
                            </Typography>
                            <Typography variant="body1">
                                Color: {vehicleSpecific.color}
                            </Typography>
                            <Typography variant="body1">
                                Trim: {vehicleSpecific.trim}
                            </Typography>
                            <Typography variant="body1">
                                Price: ${vehicleSpecific.price}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                                Engine Information
                            </Typography>
                            <Typography variant="body1">
                                Capacity: {engine.capacity} cc
                            </Typography>
                            <Typography variant="body1">
                                Combustion: {engine.combustion}
                            </Typography>
                            <Typography variant="body1">
                                Horse Power: {engine.horsePower} HP
                            </Typography>
                            <Typography variant="body1">
                                Engine Price: ${engine.price}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleBuyClick}
                        style={{ marginTop: '20px' }}
                    >
                        Buy
                    </Button>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default VehicleDetails;
