// TODO: As of March 1st, 2025, google.maps.places.AutocompleteSuggestion is recommended for new customers.
// Migration will be required in the future, but AutocompleteService will continue to work with at least 12 months notice before discontinuation.
// Migration guide: https://developers.google.com/maps/documentation/javascript/places-migration-overview

/// <reference types="@types/google.maps" />

declare global {
    interface Window {
        google: typeof google;
        initGoogleMaps: () => void;
    }
}

export interface AutocompleteRequest {
    input: string;
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

export class GoogleMapsService {
    private static apiKey: string = ''; // You'll need to set this with your actual API key
    private static isLoaded: boolean = false;
    private static loadPromise: Promise<void> | null = null;

    public static initialize(apiKey: string): Promise<void> {
        this.apiKey = apiKey;
        
        if (this.isLoaded) {
            return Promise.resolve();
        }

        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = new Promise((resolve, reject) => {
            window.initGoogleMaps = () => {
                this.isLoaded = true;
                resolve();
            };

            try {
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places&loading=async&callback=initGoogleMaps`;
                script.async = true;
                script.defer = true;
                script.onerror = () => {
                    reject(new Error('Failed to load Google Maps API'));
                };
                document.head.appendChild(script);
            } catch (error) {
                reject(error);
            }
        });

        return this.loadPromise;
    }

    public static isApiLoaded(): boolean {
        return this.isLoaded;
    }

    public static async getAutocompleteSuggestions(request: AutocompleteRequest): Promise<google.maps.places.PlacePrediction[]> {
        if (!this.isLoaded) {
            throw new Error('Google Maps not initialized. Call initialize() first.');
        }

        try {
            // Import the places library
            const { AutocompleteSuggestion, AutocompleteSessionToken } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

            // Create a session token
            const token = new AutocompleteSessionToken();

            // Prepare the request with the session token
            const fullRequest = {
                ...request,
                sessionToken: token
            };

            // Fetch suggestions using the new API
            const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(fullRequest);

            // Filter out null values and return the place predictions
            return suggestions
                .map(suggestion => suggestion.placePrediction)
                .filter((prediction): prediction is google.maps.places.PlacePrediction => prediction !== null);
        } catch (error) {
            throw new Error(`Failed to get autocomplete suggestions: ${error}`);
        }
    }

    public static async getPlaceDetails(placePrediction: google.maps.places.PlacePrediction): Promise<{
        displayName: string;
        formattedAddress: string;
    }> {
        try {
            const place = placePrediction.toPlace();
            await place.fetchFields({
                fields: ['displayName', 'formattedAddress'],
            });

            const displayName = place.displayName ?? '';
            const formattedAddress = place.formattedAddress ?? '';

            return {
                displayName,
                formattedAddress
            };
        } catch (error) {
            throw new Error(`Failed to get place details: ${error}`);
        }
    }
} 