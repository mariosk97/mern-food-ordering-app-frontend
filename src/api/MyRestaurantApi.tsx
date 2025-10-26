import type { Order, Restaurant } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetMyRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getMyRestaurantRequest = async ():Promise<Restaurant> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if(!response.ok) {
            throw new Error ("Failed to get restaurant")
        }

        return response.json();
    }

    const { data: restaurant, isPending } = useQuery({
        queryKey: ["fetchMyRestaurant"],  
        queryFn: getMyRestaurantRequest,
    });

    return {restaurant, isPending};
}

export const useCreateMyRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createMyRestaurantRequest = async (restaurantFormData: FormData):Promise<Restaurant> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: restaurantFormData,
        })

        if(!response.ok) {
            throw new Error("Failed to create restaurant");
        }

        return response.json();
    }

    const mutation = useMutation({
        mutationFn: createMyRestaurantRequest,
        onSuccess: () => toast.success("Restaurant created successfully!"),
        onError: () => toast.error("Unable to create restaurant"),
    });

    return {
        createRestaurant: mutation.mutateAsync,
        isPending: mutation.isPending,
        isError: mutation.isError,
        isSuccess: mutation.isSuccess,
    };
}

export const useUpdateMyRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const updateMyRestaurantRequest = async (restaurantFormData: FormData):Promise<Restaurant> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/restaurant`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: restaurantFormData,
        })

        if(!response.ok) {
            throw new Error("Failed to update restaurant");
        }

        return response.json();
    }

    const mutation = useMutation({
        mutationFn: updateMyRestaurantRequest,
        onSuccess: () => toast.success("Restaurant updated successfully!"),
        onError: () => toast.error("Unable to update restaurant"),
    });

    return {
        updateRestaurant: mutation.mutateAsync,
        isPending: mutation.isPending,
        isError: mutation.isError,
        isSuccess: mutation.isSuccess,
    };
}

export const useGetMyRestaurantOrders = () => {
    const {getAccessTokenSilently} = useAuth0();

    const getMyRestaurantOrdersRequest = async (): Promise<Order[]> => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/restaurant/order`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        })

        if(!response.ok){
            throw new Error("Failed to fetch orders");
        }

        return response.json();
    }

    const {data: orders, isPending} = useQuery({
        queryKey: ["fetchMyRestaurantOrders"],  
        queryFn: getMyRestaurantOrdersRequest,
    });

    return {orders, isPending};
}

type UpdateStatusOrderRequest = {
    orderId: string;
    status: string;
}

export const useUpdateMyRestaurantOrder = () => {
    const { getAccessTokenSilently } = useAuth0();

    const updateMyRestaurantOrder = async (updateStatusOrderRequest: UpdateStatusOrderRequest) => {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch(`${API_BASE_URL}/api/my/restaurant/order/${updateStatusOrderRequest.orderId}/status`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({status: updateStatusOrderRequest.status})
        })
        if(!response.ok){
            throw new Error("Failed to update status");
        }

        return response.json();
    }

    const mutation = useMutation({
        mutationFn: updateMyRestaurantOrder,
        onSuccess: () => toast.success("Restaurant status updated successfully!"),
        onError: () => toast.error("Unable to update restaurant status"),
    });

    return {
        updateRestaurantStatus: mutation.mutateAsync,
        isPending: mutation.isPending,
        isError: mutation.isError,
        isSuccess: mutation.isSuccess,
        reset: mutation.reset,
    };
}