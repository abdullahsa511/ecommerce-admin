import axios from 'axios';

// const API_URL = '/api/posts';
const API_URL = import.meta.env.VITE_API_BASE_URL + '/posts';
const API_URL_REORDER_POST_IMAGES = import.meta.env.VITE_API_BASE_URL + '/reorder-post-images';
const API_URL_WAY_POINTS = import.meta.env.VITE_API_BASE_URL + '/projects/update-way-points';
const POST_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/posts-import';
const POST_IMAGE_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/post-image-import';
const PAGE_IMPORT_URL = import.meta.env.VITE_API_BASE_URL + '/pages-import';
const API_URL_WAY_POINT_SUGGESTIONS = import.meta.env.VITE_API_BASE_URL + '/product-search-for-waypoints';

class PostService {
    // Get all posts
    static getPosts() {
        return new Promise((resolve, reject) => {
            axios.get(API_URL)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching posts:', error);
                    reject(error);
                });
        });
    }

    // Get a single post by ID
    static getPostById(postId) {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}/${postId}`)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error fetching post:', error);
                    reject(error);
                });
        });
    }

    // Create a new post
    static createPost(newPost) {
        return new Promise((resolve, reject) => {
            axios.post(API_URL, {post: newPost}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error creating post:', error);
                reject(error);
            });
        });
    }

    // Update an existing post
    static updatePost(updatedPost) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/${updatedPost.post_id}`, {post: updatedPost}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating post:', error);
                reject(error);
            });
        });
    }

    // Delete a product
    static deletePost(postId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${postId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting post:', error);
                reject(error);
            });
        });
    }

    static getPostStatuses() {
        return new Promise((resolve, reject) => {
            axios.get(`${API_URL}-statuses`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error searching posts:', error);
                reject(error);
            });
        });
    }
    static uploadFiles(files, property, postId) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            for(const file of files) {
                formData.append(file.index.toString(), file.file);
            }
            formData.append('property', property);
            
            axios.post(`${API_URL}/${postId}/upload`, formData, {
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

   

    static deletePostImage(imageId) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/delete-image/${imageId}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting product:', error);
                reject(error);
            });
        });
    }
    // /api/posts/{id}/delete-image/{property}

    static deletePostImageByProperty(postId, property) {
        return new Promise((resolve, reject) => {
            axios.delete(`${API_URL}/${postId}/delete-image/${property}`)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error deleting post image by property:', error);
                reject(error);
            });
        });
    }
    static createPostImport(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(POST_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Post Import:', error);
                    reject(error);
                });
        });
    }
    static createPageImport(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(PAGE_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Page Import:', error);
                    reject(error);
                });
        });
    }

    static createPostImageImport(newImport) {
        return new Promise((resolve, reject) => {
            axios.post(POST_IMAGE_IMPORT_URL, newImport)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error creating Post Image Import:', error);
                    reject(error);
                });
        });
    }

    static async updatePostWayPoints(postId, property, wayPoints) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL_WAY_POINTS}`, {model_id: postId, model_type: property, way_points: wayPoints})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error updating post way points:', error);
                reject(error);
            });
        });
    }

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

    static async removePostWayPoint(postId, pointId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/remove-way-point`, {post_id: postId, point_id: pointId})
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error removing post way point:', error);
                reject(error);
            });
        });
    }

    static async reorderPostImages(reordered, postId) {
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL_REORDER_POST_IMAGES}/${postId}`, reordered)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                console.error('Error reordering post images:', error);
                reject(error);
            });
        });
    }

    static async deleteGalleryImage(postImagIds, property = 'images'){
        return new Promise((resolve, reject) => {
            axios.post(`${API_URL}/gallary-image/delete-by-ids`, { post_image_ids: postImagIds, property: property })
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    console.error('Error deleting post gallery image.:', error);
                    reject(error);
                });
        });
    }

}

export default PostService; 