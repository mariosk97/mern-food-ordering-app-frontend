import type { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyUser = ()=> {
    const { getAccessTokenSilently } = useAuth0();

    const getMyUserRequest = async (): Promise<User> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            }
        })
        if(!response.ok){
            throw new Error("failed to fetch user");
        }
        return response.json();
    }

    const { data: currentUser, isPending, error } = useQuery({
        queryKey: ["fetchCurrentUser"],  
        queryFn: getMyUserRequest,
    });

    if(error) {
        toast.error(error.toString());
    }

    return {currentUser, isPending};
}

type CreateUserRequest = {
    auth0Id: string;
    email: string;
};

export const useCreateMyUser = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createMyUserRequest = async (user: CreateUserRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });

        if(!response.ok){
            throw new Error("failed to create user");
        }
    };

    const mutation = useMutation({
        mutationFn: createMyUserRequest,
    });

    return {
        createUser: mutation.mutateAsync,
        isPending: mutation.isPending,
        isError: mutation.isError,
        isSuccess: mutation.isSuccess,
    };
};

type updateMyUserRequest = {
    name: string;
    addressLine1: string;
    city: string;
    country: string;
}

export const useUpdateMyUser = () => {
    const { getAccessTokenSilently } = useAuth0();

    const updateMyUserRequest = async (formData: updateMyUserRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${API_BASE_URL}/api/my/user`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
        });

        if(!response.ok){
            throw new Error("failed to update user");   
        }

        return response.json();
    };

    const mutation = useMutation({
        mutationFn: updateMyUserRequest,
    });

    if(mutation.isSuccess) {
        toast.success("User profile updated")
    }

        if(mutation.error) {
        toast.error(mutation.error.toString());
        mutation.reset();
    }

    return {
        updateUser: mutation.mutateAsync,
        isPending: mutation.isPending,
        isSuccess: mutation.isSuccess,
        error: mutation.error,
        reset: mutation.reset,
    };
};