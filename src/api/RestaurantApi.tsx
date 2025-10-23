import type { SearchState } from "@/pages/SearchPage";
import type { Restaurant, RestaurantSearchResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetRestaurant = (restaurantId?: string) => {
    const getRestaurantByIdRequest = async(): Promise<Restaurant> => {
        const response = await fetch(`${API_BASE_URL}/api/restaurant/${restaurantId}`);

        if(!response.ok) {
            throw new Error("Failed to get restaurant")
        }

        return response.json();
    }

    const { data: restaurant, isLoading } = useQuery({
        queryKey: ["fetchRestaurant"],  
        queryFn: getRestaurantByIdRequest, 
        enabled: !!restaurantId, 
    });

    return {restaurant, isLoading};
}

export const useSearchRestaurant = (SearchState: SearchState, city?: string) => {
    const createSearchRequest = async (): Promise<RestaurantSearchResponse> => {
        const params = new URLSearchParams();
        params.set("searchQuery", SearchState.searchQuery);
        params.set("page", SearchState.page.toString());
        params.set("selectedCuisines", SearchState.selectedCuisines.join(","));
        params.set("sortOption", SearchState.sortOption);
        
        const response = await fetch(
            `${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`
        );

        if(!response.ok) {
            throw new Error("Failed to get restaurant");
        }

        return response.json();
    }

    const { data: results, isLoading } = useQuery({
        queryKey: ["searchRestaurants", SearchState],  
        queryFn: createSearchRequest,
        enabled: !!city, 
    });

    return { results, isLoading }
}