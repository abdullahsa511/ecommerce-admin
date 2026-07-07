import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/categories';
const CATEGORY_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/category-import';
const API_URL_PRODUCT_CATEGORIES = import.meta.env.VITE_API_BASE_URL + '/products-categories';

const API_URL_WAY_POINTS = import.meta.env.VITE_API_BASE_URL + '/category-banner-way-points/update';
const API_URL_WAY_POINT_SUGGESTIONS = import.meta.env.VITE_API_BASE_URL + '/product-search-for-waypoints';

class CategoryService {
    //Get Product Categories
    static getProductCategories() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL_PRODUCT_CATEGORIES)
                .then(response => {
                    // console.log("response.data", response.data);
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching categories:', error);
                    reject(error);
                });
        });
    }
    // Get all categories
    static getCategories() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching categories:', error);
                    reject(error);
                });
        });
    }

    // Get a single category by ID
    static getCategoryById(categoryId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${categoryId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching category:', error);
                    reject(error);
                });
        });
    }

    // Create a new category
    static createCategory(newCategory) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL_PRODUCT_CATEGORIES, newCategory, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating category:', error);
                reject(error);
            });
        });
    }

    static async update(categoryId, updates) {
        try {
            // Fetch current categories
            const response = await fetch(this.baseUrl);
            let categories = await response.json();
            
            // Find the category to update
            const categoryIndex = categories.findIndex(c => c.category_id === categoryId);
            if (categoryIndex === -1) {
                throw new Error('Category not found');
            }

            // Store the old parent ID for later use
            const oldParentId = categories[categoryIndex].parent_id;
            
            // Update the category
            categories[categoryIndex] = {
                ...categories[categoryIndex],
                ...updates
            };

            // If parent_id is being updated
            if (updates.parent_id !== undefined) {
                // If moving to a new parent
                if (updates.parent_id !== oldParentId) {
                    // Update all children of the moved category to maintain the tree structure
                    categories = categories.map(category => {
                        if (category.parent_id === categoryId) {
                            return {
                                ...category,
                                parent_id: updates.parent_id
                            };
                        }
                        return category;
                    });
                }
            }

            // TODO: In a real application, you would send this updated data to your backend
            // For now, we'll just return the updated category
            return categories[categoryIndex];
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    }

    // Update an existing category
    static updateCategory(updatedCategory) {
        return new Promise((resolve, reject) => {
            axios.put(`${API_URL}/${updatedCategory.category_id}`, {category: updatedCategory}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating category:', error);
                reject(error);
            });
        });
    }

    // Delete a category
    static deleteCategory(categoryId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${categoryId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting category:', error);
                reject(error);
            });
        });
    }

    static createCategoryImport(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(CATEGORY_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Category Import:', error);
                    reject(error);
                });
        });
    }

    static async updateCategoryWayPoints(categoryId, property, wayPoints) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL_WAY_POINTS}`, {model_id: categoryId, model_type: property, way_points: wayPoints})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating category way points:', error);
                reject(error);
            });
        });
    }

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

    static async updateCategoryOrder(orderedCategories) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/update-category-order`, {categories: orderedCategories})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating category order:', error);
                reject(error);
            });
        });
    }

     // upload category images
     static async uploadCategoryImage(files, property, categoryId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for(const file of files) {
                formData.append(file.index.toString(), file.file);
            }
            // Add property to form data for backend processing
            if (property) {
                formData.append('property', property);
            }
            console.log( "formData images", formData);
            axios.post(`${API_URL}/${categoryId}/upload`, formData, {
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

    // delete category images
    static async deleteCategoryImage(file, property, categoryId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/${categoryId}/delete`, {file: file, property: property})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                return reject(error);
            });
        })
    }

}

export default CategoryService;