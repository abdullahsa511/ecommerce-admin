/// <reference types="@types/google.maps" />

import { ref } from 'vue';
import { GoogleMapsService } from '@/services/GoogleMapsService';
import type { IAddress } from '@/models/Google';
import { Address } from '@/models/Google';

export interface PlaceSearchOptions {
    locationRestriction?: {
        west: number;
        north: number;
        east: number;
        south: number;
    };
    origin?: {
        lat: number;
        lng: number;
    };
    language?: string;
    region?: string;
}

export function useGooglePlaces() {
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const initializeGoogleMaps = async (apiKey: string) => {
        try {
            isLoading.value = true;
            error.value = null;
            await GoogleMapsService.initialize(apiKey);
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to initialize Google Maps';
        } finally {
            isLoading.value = false;
        }
    };

    const getPlacePredictions = async (
        input: string,
        options: PlaceSearchOptions = {}
    ): Promise<Address[]> => {
        try {
            if (!GoogleMapsService.isApiLoaded()) {
                throw new Error('Google Maps not initialized');
            }

            const predictions = await GoogleMapsService.getAutocompleteSuggestions({
                input,
                ...options
            });

            const addresses: Address[] = [];

            for (const prediction of predictions) {
                try {
                    const details = await GoogleMapsService.getPlaceDetails(prediction);
                    addresses.push(new Address({
                        description: details.formattedAddress,
                        place_id: prediction.placeId || '',
                        reference: prediction.placeId || '',
                        structured_formatting: {
                            main_text: details.displayName,
                            secondary_text: details.formattedAddress,
                            main_text_matched_substrings: []
                        },
                        matched_substrings: [],
                        terms: [],
                        types: prediction.types || []
                    }));
                } catch (detailsError) {
                    console.error('Failed to get place details:', detailsError);
                    // Continue with next prediction if one fails
                }
            }

            return addresses;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to get place predictions';
            return [];
        }
    };

    return {
        isLoading,
        error,
        initializeGoogleMaps,
        getPlacePredictions
    };
} 