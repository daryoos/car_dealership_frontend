// SearchModel.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardMedia, Typography } from '@mui/material';
import Layout from '../components/Layout';
import { fetchVehiclesSpecific } from '../slices/vehicleSpecificSlice';

interface VehicleSpecific {
    id: number;
    vehicleId: number;
    year: number;
    color: string;
    engineId: number;
    trim: string;
    price: number;
}

const SearchModel: React.FC = () => {
    const { make, vehicleId } = useParams<{ make: string, vehicleId: string }>();
    const navigate = useNavigate();
    const [vehicleSpecifics, setVehicleSpecifics] = useState<VehicleSpecific[]>([]);

    useEffect(() => {
        const loadVehicles = async () => {
            try {
                if (make) {
                    const fetchedVehicles = await fetchVehiclesSpecific(Number(vehicleId));
                    setVehicleSpecifics(fetchedVehicles);
                }
            } catch (error) {
                console.error('Error loading vehicles:', error);
            }
        };

        loadVehicles();
    }, [make]);

    const handleVehicleSpecificClick = (vehicleSpecificId: number) => {
        navigate(`/vehicle/${vehicleSpecificId}`);
    };

    return (
        <Layout>
            <h1>Vehicles for {make}</h1>
            <div>
                {vehicleSpecifics.map((vehicleSpecific) => (
                    <Card key={vehicleSpecific.id}>
                        <CardActionArea onClick={() => handleVehicleSpecificClick(vehicleSpecific.id)}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={`path_to_images/${vehicleSpecific.id}.jpg`} // Replace with actual image path
                                alt={`${vehicleSpecific.year} ${vehicleSpecific.color}`}
                            />
                            <Typography gutterBottom variant="h5" component="div">
                                {vehicleSpecific.year} {vehicleSpecific.color}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Trim: {vehicleSpecific.trim}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Price: ${vehicleSpecific.price}
                            </Typography>
                        </CardActionArea>
                    </Card>
                ))}
            </div>
        </Layout>
    );
};

export default SearchModel;
