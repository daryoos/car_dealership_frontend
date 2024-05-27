import axiosInstance from "../api/axiosInstance";

interface Bill {
    id: number;
    price: number;
    date: Date;
    userId: number;
    vehicleSpecificId: number;
    warrantyId: number;
}

interface NewBill {
    date: Date;
    userId: number;
    vehicleSpecificId: number;
}

export const createBill = async (newBill: NewBill) => {
    try {
        const response = await axiosInstance.post("bills/add", newBill);
        const resData = response.data;
        return resData;
    } catch (error) {
        console.error('Error creating bill:', error);
        throw error;
    }
}

export const fetchBill = async (userId: number): Promise<Bill> => {
    try {
        const response = await axiosInstance.get<Bill>(`/bills/getCart/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching bill:', error);
        throw error;
    }
};

export const placeOrder = async (bill: Bill) => {
    try {
        const response = await axiosInstance.post(`bills/placeOrder`, bill);
        const resData = response.data;
        return resData;
    } catch (error) {
        console.error('Error placing order:', error);
        throw error;
    }
}

export const deleteBillById = async (bill: Bill) => {
    try {
        const response = await axiosInstance.delete(`bills/deleteById/${bill.id}`);
        const resData = response.data;
        return resData;
    } catch (error) {
        console.error('Error deleting bill:', error);
        throw error;
    }
}