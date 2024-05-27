import axiosInstance from "../api/axiosInstance";

export interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    isAdmin: boolean;
}

export interface NewUser {
    email: string;
    password: string;
    name: string;
    isAdmin: boolean;
}

export interface UpdateUser {
    email: string;
    password: string;
    name: string;
}

export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await axiosInstance.get<User[]>('/users/getAllDto');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const createUser = async (newUser: NewUser): Promise<User> => {
    try {
        const response = await axiosInstance.post<User>('/users/add', newUser);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const updateUser = async (id: number, updatedUser: UpdateUser): Promise<User> => {
    try {
        const response = await axiosInstance.put<User>(`/users/update/${id}`, updatedUser);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/users/deleteById/${id}`);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
