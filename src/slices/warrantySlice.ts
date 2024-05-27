import axiosInstance from "../api/axiosInstance";

interface Warranty {
    price: number;
    years: number;
    endDate: Date | null;
}

export const createWarranty = async (warranty: Warranty) => {
    try {
        const response = await axiosInstance.post("warranties/add", warranty);
        const resData = response.data;
        return resData;
    } catch (error) {
        console.error('Error creating warranty:', error);
        throw error;
    }
}