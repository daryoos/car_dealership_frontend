import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../hooks/redux-hooks';
import { fetchBill, placeOrder, createBill, deleteBillById } from '../slices/billSlice';
import { createWarranty } from '../slices/warrantySlice';
import { Card, CardContent, Typography, Grid, MenuItem, Select, SelectChangeEvent, FormControl, InputLabel, Button } from '@mui/material';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { NumberLiteralType } from 'typescript';

interface Bill {
    id: number;
    price: number;
    date: Date;
    userId: number;
    vehicleSpecificId: number;
    warrantyId: number;
}

interface Warranty {
    price: number;
    years: number;
    endDate: Date | null;
}

const Cart: React.FC = () => {
    const userId = useAppSelector((state) => state.auth.basicUserInfo?.id);
    const [bill, setBill] = useState<Bill | null>(null);
    const [warranty, setWarranty] = useState<Warranty>({
        years: 0,
        price: 0,
        endDate: null,
    });
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        const loadBill = async () => {
            try {
                if (userId) {
                    const fetchedBill = await fetchBill(Number(userId));
                    setBill(fetchedBill);
                    setTotalPrice(fetchedBill.price); // Initial total price is the vehicle price
                }
            } catch (error) {
                console.error('Error loading bill:', error);
            }
        };

        loadBill();
    }, [userId]);

    const handleWarrantyChange = (event: SelectChangeEvent<number>) => {
        const years = Number(event.target.value);
        const price = years * 500;
        let endDate = null;

        if (bill) {
            endDate = new Date(bill.date);
            endDate.setFullYear(endDate.getFullYear() + years);
        }

        setWarranty({ years, price, endDate });

        if (bill) {
            setTotalPrice(bill.price + price);
        }
    };

    const handlePlaceOrder = async () => {
        try {
            if (bill) {
                await placeOrder(bill);
                await createWarranty(warranty);
                // Redirect to another page or show success message
                navigate('/');
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const handleCancelOrder = async () => {
        try {
            if (bill) {
                await placeOrder(bill);
                setBill(null); // Clear the bill from state
                setWarranty({ years: 0, price: 0, endDate: null });
                setTotalPrice(0);
                // Optionally, navigate to another page or show success message
            }
        } catch (error) {
            console.error('Error canceling order:', error);
        }
    };

    return (
        <Layout>
            <Typography variant="h4" gutterBottom>
                Cart
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Bill Details
                            </Typography>
                            {bill ? (
                                <>
                                    <Typography variant="body1">Bill ID: {bill.id}</Typography>
                                    <Typography variant="body1">Price: ${bill.price}</Typography>
                                    <Typography variant="body1">Date: {new Date(bill.date).toLocaleDateString()}</Typography>
                                    <Typography variant="body1">Vehicle Specific ID: {bill.vehicleSpecificId}</Typography>
                                </>
                            ) : (
                                <Typography variant="body1">No bill available</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Warranty Options
                            </Typography>
                            <FormControl fullWidth>
                                <InputLabel id="warranty-years-label">Warranty Years</InputLabel>
                                <Select
                                    labelId="warranty-years-label"
                                    value={warranty.years}
                                    onChange={handleWarrantyChange}
                                    label="Warranty Years"
                                    disabled={!bill}
                                >
                                    <MenuItem value={0}>0 Years</MenuItem>
                                    <MenuItem value={1}>1 Year</MenuItem>
                                    <MenuItem value={2}>2 Years</MenuItem>
                                    <MenuItem value={3}>3 Years</MenuItem>
                                    <MenuItem value={4}>4 Years</MenuItem>
                                    <MenuItem value={5}>5 Years</MenuItem>
                                </Select>
                            </FormControl>
                            {warranty.years > 0 && (
                                <Typography variant="body1" style={{ marginTop: '16px' }}>
                                    Warranty Price: ${warranty.price}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Total Price
                            </Typography>
                            {bill ? (
                                <>
                                    <Typography variant="body1">Total Price: ${totalPrice}</Typography>
                                    {warranty.endDate && (
                                        <Typography variant="body1">
                                            Warranty End Date: {warranty.endDate.toLocaleDateString()}
                                        </Typography>
                                    )}
                                </>
                            ) : (
                                <Typography variant="body1">No bill to calculate total price</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: '20px' }}
                        onClick={handlePlaceOrder}
                        disabled={!bill}
                    >
                        Place Order
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        style={{ marginTop: '20px' }}
                        onClick={handleCancelOrder}
                        disabled={!bill}
                    >
                        Cancel Order
                    </Button>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default Cart;