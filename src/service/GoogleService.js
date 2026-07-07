import axios from 'axios';

class GoogleService {
    static async initGoogleMapsScript() {
        return new Promise((resolve, reject) => {
            // Check if the script is already loaded
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            // Create script element
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async&callback=initMap`;
            document.head.appendChild(script);

            // Define the callback function
            window.initMap = () => {
                resolve();
            };

            // Handle loading errors
            script.onerror = () => {
                reject(new Error('Failed to load Google Maps script'));
            };
        });
    }

    static async searchAddresses(query) {
        try {
            await this.initGoogleMapsScript();
            
            return new Promise((resolve, reject) => {
                const request = {
                    input: query,
                    types: ['address']
                };

                const service = new window.google.maps.places.AutocompleteService();
                
                service.getQueryPredictions(
                    request,
                    (predictions) => {
                        if (predictions) {
                            resolve(predictions);
                        } else {
                            reject(new Error('Failed to get address predictions'));
                        }
                    }
                );
            });
        } catch (error) {
            console.error('Error in searchAddresses:', error);
            throw error;
        }
    }
}

export default GoogleService; 