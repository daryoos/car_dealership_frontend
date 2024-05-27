import React, { useEffect, useState } from 'react';
import { Grid, Typography, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { fetchVehicles } from '../slices/vehicleSlice';

interface Vehicle {
    id: number;
    make: string;
    model: string;
}

const Home: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadVehicles = async () => {
            try {
                const fetchedVehicles = await fetchVehicles();
                setVehicles(fetchedVehicles);
            } catch (error) {
                console.error('Error loading vehicles:', error);
            }
        };

        loadVehicles();
    }, []);

    const handleVehicleClick = ({ make, id }: { make: string, id: number }) => {
        navigate(`/search/${make}/${id}`);
    };

    return (
        <Layout>
            <div style={{ marginTop: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Featured Vehicles
                </Typography>
                <Grid container spacing={3}>
                    {vehicles.map((vehicle) => (
                        <Grid item xs={12} sm={6} md={4} key={vehicle.id}>
                            <Card>
                                <CardActionArea onClick={() => handleVehicleClick(vehicle)}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={`path_to_images/${vehicle.id}.jpg`}
                                        alt={vehicle.model}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {vehicle.make} {vehicle.model}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </Layout>
    );
};

export default Home;
