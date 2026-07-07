import axios from 'axios';

// const API_URL = '/data/sites.json'; // Adjust the path as necessary
const API_URL = import.meta.env.VITE_API_BASE_URL + '/sites'; 
const EMAIL_SETTINGS_URL = import.meta.env.VITE_API_BASE_URL + '/settings'; 

class SiteService {
    // Get all sites
    static getSites() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching sites:', error);
                    reject(error);
                });
        });
    }

    // Get a single site by ID
    static getSiteById(siteId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${siteId}`)
                .then(response => {
                    resolve(response.data);
            })
            .catch(error => {
                    console.error('Error fetching site:', error);
                    reject(error);
                });
        });
    }

    // Create a new site
    static createSite(newSite) {
        if(newSite?.siteSettings) {
            for(const property in newSite.siteSettings) {
                for(const key in newSite.siteSettings[property]) {
                    delete newSite.siteSettings[property][key].file;
                }
            }
        }
        return new Promise((resolve, reject) => {
            axios.post(API_URL, {site: newSite}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating site:', error);
                reject(error);
            });
        });
    }

    // Update an existing site
    static updateSite(updatedSite) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedSite.site_id}`, {site: updatedSite}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating site:', error);
                reject(error);
            });
        });
    }

    // Delete a site
    // static deleteSite(siteId) {
    //     return new Promise((resolve, reject) => {
    //         axios.delete(`${API_URL}/${siteId}`)
    //         .then(response => {
    //             resolve(response.data);
    //         })
    //         .catch(error => {
    //             reject(error);
    //         });
    //     });
    // }

    static getEmailSettings() {
        return new Promise((resolve, reject) => {
            axios.get(`${EMAIL_SETTINGS_URL}/email-settings`)
            .then(response => {
                    resolve(response.data);
            }).catch(error => {
                console.error('Error fetching email settings:', error);
                reject(error);
            });
        });
    }

    static createEmailSetting(newEmailSetting) {
        return new Promise((resolve, reject) => {
            axios.post(EMAIL_SETTINGS_URL + '/email-settings', newEmailSetting, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                resolve(response.data);
            }).catch(error => {
                console.error('Error creating email setting:', error);
                reject(error);
            });
        });
    }
    

}

export default SiteService;