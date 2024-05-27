import axiosInstance from "../api/axiosInstance";

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

interface NewVehicleSpecific {
    vehicleId: number;
    year: number;
    color: string;
    engineId: number;
    trim: string;
    price: number;
    sold: boolean;
}

export const fetchVehiclesSpecific = async (vehicleId: number): Promise<VehicleSpecific[]> => {
    try {
        const response = await axiosInstance.get<VehicleSpecific[]>(`/vehicleSpecific/getByVehicleId/${vehicleId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching vehicle specifics:', error);
        throw error;
    }
};

export const fetchVehicleDetails = async (vehicleSpecificId: number): Promise<VehicleSpecific> => {
    try {
        const response = await axiosInstance.get<VehicleSpecific>(`/vehicleSpecific/getById/${vehicleSpecificId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching vehicle specifics:', error);
        throw error;
    }
};

export const createVehicleSpecific = async (newVehicleSpecific: NewVehicleSpecific): Promise<VehicleSpecific> => {
    try {
        const response = await axiosInstance.post<VehicleSpecific>('/vehicleSpecific/add', newVehicleSpecific);
        return response.data;
    } catch (error) {
        console.error('Error creating vehicleSpecific:', error);
        throw error;
    }
};

export const updateVehicleSpecific = async (id: number, updatedVehicleSpecific: NewVehicleSpecific): Promise<VehicleSpecific> => {
    try {
        const response = await axiosInstance.put<VehicleSpecific>(`/vehicleSpecific/update/${id}`, updatedVehicleSpecific);
        return response.data;
    } catch (error) {
        console.error('Error updating vehicleSpecific:', error);
        throw error;
    }
};

export const deleteVehicleSpecific = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/vehicleSpecific/deleteById/${id}`);
    } catch (error) {
        console.error('Error deleting vehicleSpecific:', error);
        throw error;
    }
};