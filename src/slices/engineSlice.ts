import axiosInstance from "../api/axiosInstance";

interface Engine {
    id: number;
    capacity: number;
    combustion: string;
    horsePower: number;
    price: number;
}

export const fetchEngine = async (id: number): Promise<Engine> => {
    try {
        const response = await axiosInstance.get<Engine>(`/engines/getById/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching engine:', error);
        throw error;
    }
};