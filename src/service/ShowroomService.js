import axios from 'axios';
import ProjectService from './ProjectService';

// const API_URL = '/api/showrooms';
const API_URL = import.meta.env.VITE_API_BASE_URL + '/showrooms';
const API_SHOWROOM_URL = import.meta.env.VITE_API_BASE_URL + '/showroom';
const API_URL_SHOWROOM_SECTION = import.meta.env.VITE_API_BASE_URL + '/showroom/sections';
const API_UPLOAD_URL = import.meta.env.VITE_API_BASE_URL;
const API_SECTION_URL = import.meta.env.VITE_API_BASE_URL + '/sections';
// const SHOWROOM_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/showrooms-import';
// const SHOWROOM_IMAGE_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/showroom-image-import';
const API_URL_WAY_POINTS = import.meta.env.VITE_API_BASE_URL + '/showroom/update-way-points';
const API_URL_WAY_POINT_SUGGESTIONS = import.meta.env.VITE_API_BASE_URL + '/product-search-for-waypoints';

class ShowroomService {
    /**
     * --------------- showroom service -------------------
    */
    // Get all showrooms
    static getShowrooms() {
        // console.log('get showroom ' + API_URL + '/' + 'lists');
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}`)
                .then(response => {
                    resolve(response.data);
                    // console.log(response.data);
                })
                .catch(error => {
                    console.error('Error fetching showrooms:', error);
                    reject(error);
                });
        });
    }

    // Get a single showroom by ID
    static getShowroomById(showroomId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${showroomId}`)
                .then(response => {
                    //banner way points will be json string
                    response.data.banner_way_points = JSON.parse(response.data.banner_way_points);
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching showrooms:', error);
                    reject(error);
                });
        });
    }

    // Create a new showroom
    static createShowrooms(newShowroom) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, newShowroom, {
                headers: {'Content-Type': 'application/json'}
            })
            .then(response => {
                console.log('rqs ', response);
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating showroom:', error);
                reject(error);
            });
        });
    }

    // Update an existing showroom
    static updateShowroom(updatedShowroom) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedShowroom.showrooms_id}`, updatedShowroom, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating showroom:', error);
                reject(error);
            });
        });
    }

    // Delete a showroom
    static deleteShowroom(showroomId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/${showroomId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting showroom:', error);
                reject(error);
            });
        });
    }

    static deleteShowroomImageByProperty(showroomId, property, type) {
        const typeParam = type === 'section' ? 'section' : 'showroom';
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${showroomId}/delete-image/${property}?type=${typeParam}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting showroom image by property:', error);
                reject(error);
            });
        });
    }

    /**
     * --------------- section service -------------------
    */
    // Get all Sections
    static getSections(showroomId) {
        // console.log('get Section ' + API_URL + '/' + 'lists');
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${showroomId}/sections`)
                .then(response => {
                    resolve(response.data);
                    // console.log(response.data);
                })
                .catch(error => {
                    console.error('Error fetching Sections:', error);
                    reject(error);
                });
        });
    }

    // Get a single Section by ID
    static getSectionDetails(showroomSlug,slug) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_SHOWROOM_URL}/${showroomSlug}/sections/${slug}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching Sections:', error);
                    reject(error);
                });
        });
    }

    // Create a new Section
    static addSection(newSection) {
        return new Promise((resolve, reject) => {
            console.log('section serv. ', newSection);
            axios.post(`${API_URL}/${newSection.showroom_id}/sections`, newSection, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating Section:', error);
                reject(error);
            });
        });
    }

    // Update an existing Section
    static updateSection(updatedSection) {
        return new Promise((resolve, reject) => {

            axios.put(`${API_SECTION_URL}/${updatedSection.project_sections_id}`, updatedSection, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating Section:', error);
                reject(error);
            });
        });
    }

    // Delete a Section
    static deleteSection(sectionId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_SECTION_URL}/${sectionId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting showroom:', error);
                reject(error);
            });
        });
    }

     /**
     * --------------- section image service -------------------
    */
    // Get all Sections
    static getSectionImages(sectionId) {
        // console.log('get SectionImage ' + API_URL + '/' + 'lists');
        return new Promise((resolve, reject) => {
            axios.get(`${API_SECTION_URL}/${sectionId}/images`)
                .then(response => {
                    resolve(response.data);
                    // console.log(response.data);
                })
                .catch(error => {
                    console.error('Error fetching SectionImages:', error);
                    reject(error);
                });
        });
    }

    // Get a single SectionImage by ID
    static getSectionImagesById(sectionImageId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_SECTION_URL}/${sectionImageId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching Section Images:', error);
                    reject(error);
                });
        });
    }

    // Create a new SectionImage
    static createSectionImages(newSectionImage) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_SECTION_URL}/${newSectionImage.section_id}/images`, {SectionImage: newSectionImage}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating SectionImage:', error);
                reject(error);
            });
        });
    }

    // Update an existing SectionImage
    static updateSectionImage(updatedSectionImage, sectionImageId) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_SECTION_URL}/${updatedSectionImage.section_id}/images/${sectionImageId}`, {SectionImage: updatedSectionImage}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating SectionImage:', error);
                reject(error);
            });
        });
    }

    // Delete a SectionImage
    // static deleteSectionImage(showroomId) {
    //     return new Promise((resolve, reject) => {
    //         axios.delete(`${API_URL}/${showroomId}`)
    //         .then(response => {
    //             resolve(response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error deleting showroom:', error);
    //             reject(error);
    //         });
    //     });
    // }


         /**
     * --------------- section Product service -------------------
    */
    // Get all Sections
    static getSectionProducts(sectionId) {
        // console.log('get SectionProduct ' + API_URL + '/' + 'lists');
        return new Promise((resolve, reject) => {
            axios.get(`${API_SECTION_URL}/${sectionId}/products`)
                .then(response => {
                    resolve(response.data);
                    // console.log(response.data);
                })
                .catch(error => {
                    console.error('Error fetching SectionProducts:', error);
                    reject(error);
                });
        });
    }

    // Get a single SectionProduct by ID
    static getSectionProductsById(SectionProductId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${SectionProductId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching SectionProducts:', error);
                    reject(error);
                });
        });
    }

    // Create a new SectionProduct
    static addSectionProducts(newSectionProduct) {
        return new Promise((resolve, reject) => {
             axios.post(`${API_SECTION_URL}/${newSectionProduct.section_id}/products`, newSectionProduct, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating SectionProduct:', error);
                reject(error);
            });
        });
    }

    // Update an existing SectionProduct
//     static updateSectionProduct(updatedSectionProduct) {
//         return new Promise((resolve, reject) => {
// axios.put(`${API_SECTION_URL}/${updatedSectionImage.section_id}/product/${updatedSectionImage.section_id}`, {SectionImage: updatedSectionImage}, {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             })
//             .then(response => {
//                 resolve(response.data);
//             })
//             .catch(error => {
//                 console.error('Error updating SectionProduct:', error);
//                 reject(error);
//             });
//         });
//     }

    // Delete a SectionProduct
    static deleteSectionProduct(sectionId, sectionProductId) {
        console.log('data svc', sectionId, sectionProductId);
        return new Promise((resolve, reject) => {
            axios.delete(`${API_SECTION_URL}/${sectionId}/section-product/${sectionProductId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting showroom:', error);
                reject(error);
            });
        });
    }
    // Delete a SectionImage
    static deleteSectionImage(sectionId, imageId) {
        console.log('image svc', sectionId, imageId);
        return new Promise((resolve, reject) => {
            axios.delete(`${API_SECTION_URL}/${sectionId}/images/${imageId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting showroom:', error);
                reject(error);
            });
        });
    }

     /**
     * --------------- file upload service -------------------
    */

    static uploadShowroomImage(files, context, id, showroomId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for(const file of files) {
                formData.append(file.index.toString(), file.file);
            }

             const endPoint = context === 'section-gallery'
            ? `${API_UPLOAD_URL}/showrooms-files-upload/${id}/${showroomId}`
            : `${API_UPLOAD_URL}/showrooms-files-upload/${context}/${id}/${showroomId}`;

            formData.append('property', context);
            axios.post(endPoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error uploading files:', error);
                reject(error);
            });
        });
    }

    static uploadFiles(files, context, id, showroomId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for(const file of files) {
                formData.append(file.index.toString(), file.file);
            }
            formData.append('property', context);
            
            axios.post(`${API_UPLOAD_URL}/showrooms-files-upload/${id}/${showroomId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error uploading files:', error);
                reject(error);
            });
        });
    }


    static getStatuses() {
        return ProjectService.getProjectStatuses();
    }

    static async updateShowroomWayPoints(showroomId, property, wayPoints) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL_WAY_POINTS}`, {model_id: showroomId, model_type: property, way_points: wayPoints})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating showroom way points:', error);
                reject(error);
            });
        });
    }


    // static getShowroomSectins() {
    //     // console.log('get showroom ' + API_URL + '/' + 'lists');
    //     return new Promise((resolve, reject) => {
    //         // axios.get(`${API_URL}/showroom-section/1`)
    //         axios.get(`${API_URL}/lists`)
    //             .then(response => {
    //                 resolve(response.data);
    //                 // console.log(response.data);
    //             })
    //             .catch(error => {
    //                 console.error('Error fetching showrooms:', error);
    //                 reject(error);
    //             });
    //     });
    // }

    // Get way point suggestions
    static async getWayPointSuggestions(query) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL_WAY_POINT_SUGGESTIONS}?search=${query}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error getting way point suggestions:', error);
                reject(error);
            });
        });
    }

}

export default ShowroomService;
