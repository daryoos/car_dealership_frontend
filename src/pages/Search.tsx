import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Typography, Card, CardMedia, CardContent } from '@mui/material';
import Layout from '../components/Layout';
import { fetchVehiclesByMake } from '../slices/vehicleSlice';
import { useNavigate } from 'react-router-dom';

interface Vehicle {
    id: number;
    make: string;
    model: string;
}

const Search: React.FC = () => {
    const { make } = useParams<{ make: string }>();
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        const loadVehicles = async () => {
            try {
                if (make) {
                    const fetchedVehicles = await fetchVehiclesByMake(make);
                    setVehicles(fetchedVehicles);
                }
            } catch (error) {
                console.error('Error loading vehicles:', error);
            }
        };

        loadVehicles();
    }, [make]);

    const handleVehicleClick = (vehicleId: number) => {
        navigate(`/search/${make}/${vehicleId}`);
    };

    return (
        <Layout>
            <Typography variant="h4" gutterBottom>
                Vehicles for {make}
            </Typography>
            <Grid container spacing={3}>
                {vehicles.map((vehicle) => (
                    <Grid item xs={12} sm={6} md={4} key={vehicle.id} onClick={() => handleVehicleClick(vehicle.id)}>
                        <Card style={{ cursor: 'pointer' }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={`path_to_images/${vehicle.id}.jpg`} // Update the image path as necessary
                                alt={vehicle.model}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {vehicle.make} {vehicle.model}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Layout>
    );
};

export default Search;
