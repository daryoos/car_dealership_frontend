import axiosInstance from "../api/axiosInstance";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Vehicle {
    id: number;
    make: string;
    model: string;
    // Add other properties as needed
}

export const fetchVehicle = async (id: number): Promise<Vehicle> => {
    try {
        const response = await axiosInstance.get<Vehicle>(`/vehicles/getById/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching vehicle:', error);
        throw error;
    }
};

export const fetchVehicles = async (): Promise<Vehicle[]> => {
    try {
        const response = await axiosInstance.get<Vehicle[]>(`/vehicles/getAllDto`);
        return response.data;
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
    }
};

export const fetchMakes = async (): Promise<String[]> => {
    try {
        const response = await axiosInstance.get<String[]>(`/vehicles/getAllMakes`);
        return response.data;
    } catch (error) {
        console.error('Error fetching makes:', error);
        throw error;
    }
};

export const fetchVehiclesByMake = async (make: string): Promise<Vehicle[]> => {
    try {
        const response = await axiosInstance.get<Vehicle[]>(`/vehicles/getByMake/${make}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching vehicles by make:', error);
        throw error;
    }
};

export const createVehicle = async (vehicle: Vehicle) => {
    try {
        const response = await axiosInstance.post(`/vehicles/add`, vehicle);
        return response.data;
    } catch (error) {
        console.error('Error add vehicle:', error);
        throw error;
    }
};

export const updateVehicle = async (vehicle: Vehicle) => {
    try {
        const response = await axiosInstance.put(`/vehicles/update`, vehicle);
        return response.data;
    } catch (error) {
        console.error('Error add vehicle:', error);
        throw error;
    }
};

export const deleteVehicle = async (vehicleId: Number) => {
    try {
        const response = await axiosInstance.delete(`/vehicles/deleteById/${vehicleId}`);
        return response.data;
    } catch (error) {
        console.error('Error add vehicle:', error);
        throw error;
    }
};
