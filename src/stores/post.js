import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import PostService from '../service/PostService';
import { Post } from '../models/Post.ts';
import FeedbackHandler from '../utils/FeedbackHandler';
import { FileModel } from '@/models/Media';
import { WayPoint } from '@/models/WayPoint';
import { mediaUrl } from '@/utils/mediaUrl';

export const usePostStore = defineStore('post', () => {

    //State Start Here
    const server = import.meta.env.VITE_API_BASE_URL;
    /**
     * @type {import('vue').Ref<Post[]>}
     */
    const posts = ref([]);
     /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
     const fb = ref(new FeedbackHandler());
     const model = 'post';
     const postStatuses = ref([]);
     const post = ref(new Post());

     //State Minish here

    //Actions Start here
        const resetPostType = () => {
            post.value = new Post();
        };

     const fetchPosts = async () => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const response = await PostService.getPosts();
            posts.value = response.list?.map(post => new Post(post)) ?? [];
            fb.value.showSuccess(model);
        } catch (err) {
            console.log(err);
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const fetchPostById = async (postId) => {
        fb.value.clearError(model+'.edit.' + postId);
        fb.value.removeSuccess(model+'.edit.' + postId);
        fb.value.startLoading(model+'.edit.' + postId);
        try {
            const data = await PostService.getPostById(postId);
            post.value = new Post(data);
            if(post.value.banner_way_points.length <= 0) {
                post.value.banner_way_points = [
                    new WayPoint({
                        id: 1,
                        leftPx: 0,
                        topPx: 0,
                        leftPercent: 2,
                        topPercent: 2,
                        linkActive: false,
                        label: "Point 1",
                    }),
                ];
            }
            fb.value.showSuccess(model+'.edit.' + postId);

            return post.value;
        } catch (err) {
            console.log(err);
            fb.value.setError(err, model+'.edit.' + postId);
        } finally {
            fb.value.finishLoading(model+'.edit.' + postId);
        }
    };

    const createPost = async (newPost) => {
        fb.value.clearError(model+'.create');
        fb.value.removeSuccess(model+'.create');
        fb.value.startLoading(model+'.create');

        // return false;
        try {
            const createdPost = await PostService.createPost(newPost);
            let post = new Post(createdPost);
            posts.value.push(post);
            fb.value.showSuccess(model+'.create');
            return post;
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.create');
            throw error;
        } finally {
            fb.value.finishLoading(model+'.create');
        }
    };

    const updatePost = async (updatedPost) => {
        console.log('pppppppppppp', updatedPost);
        fb.value.clearError(model+'.update');
        fb.value.removeSuccess(model+'.update');
        fb.value.startLoading(model+'.update');
        try {
            const post = await PostService.updatePost(updatedPost);
            fb.value.showSuccess(model+'.update');
            return new Post(post);
        } catch (err) {
            let error = err.response?.data?.errors;
            if(!error) error = err;
            fb.value.setError(error, model+'.update');
            throw error;
        } finally {
            fb.value.finishLoading(model+'.update');
        }
    };

    const deletePost = async (postId) => {
        fb.value.clearError(model+'.delete.' + postId);
        fb.value.removeSuccess(model+'.delete.' + postId);
        fb.value.startLoading(model+'.delete.' + postId);
        try {
            await PostService.deletePost(postId);
            posts.value = posts.value.filter(p => p.post_id !== postId);
            fb.value.showSuccess(model+'.delete.' + postId);
        } catch (err) {
            fb.value.setError(err, model+'.delete.' + postId);
        } finally {
            fb.value.finishLoading(model+'.delete.' + postId);
        }
    };

    const getPostStatuses = async () => {
        fb.value.clearError(model+"-statuses");
        fb.value.removeSuccess(model+"-statuses");
        fb.value.startLoading(model+"-statuses");
        try {
            const response = await PostService.getPostStatuses();
            postStatuses.value = response;
            fb.value.showSuccess(model+"-statuses");
            return response;
        } catch (err) {
            fb.value.setError(err, model+"-statuses");
            return [];
        } finally {
            fb.value.finishLoading(model+"-statuses");
        }
    };
    const uploadFiles = async (files, property, postId) => {

        for(let file of files) {
            fb.value.clearError('media.files.upload'+file.id);
            fb.value.removeSuccess('media.files.upload'+file.id);
            fb.value.startLoading('media.files.upload'+file.id);
        }
        try {
            let feature_image_thumb = [];
            const response = await PostService.uploadFiles(files, property, postId);
            response.files = response.files.map(file => {
                if(!file?.ObjectURL && file?.file && typeof file.file === 'string') {
                    file = JSON.parse(file.file);
                }
                // Create the image object
                const imageObject = new FileModel(file);
                if(property === 'feature_image') {
                    if(!file?.thumbnail?.ObjectURL && file?.thumbnail?.file && typeof file.thumbnail.file === 'string') {
                        file.thumbnail = JSON.parse(file.thumbnail.file);
                        file.thumbnail.objectURL = mediaUrl(file.thumbnail.objectURL);
                    }
                    feature_image_thumb.push(new FileModel(file.thumbnail));
                    
                }
                
                // Make sure the image path is fully qualified
                if (file.objectURL) {
                    imageObject.objectURL = mediaUrl(file.objectURL);
                }
                return imageObject;
            });
            
            for(let file of files) {
                fb.value.showSuccess('Files uploaded successfully', 'media.files.upload'+file.id);
            }
            if(property === 'images') {
                post.value.images = post.value.images.map((img) => {
                    let f = response.files.find((f) => f.name === img.name);
                    if(f) return f;
                    return img;
                });
            }else if(property === 'feature_image') {
                post.value.feature_image = response.files;
            }else if(property === 'feature_image_thumb') {
                post.value.feature_image_thumb = response.files;
            }
            else{
                post.value[property] = response.files;
            }
            return response.files;
        } catch (err) {
            for(let file of files) {
                fb.value.setError(err, 'media.files.upload'+file.id);
            }
            throw err;
        } finally {
            for(let file of files) {
                fb.value.finishLoading('media.files.upload'+file.id);
            }
        }
    };
    const deletePostImage = async (imageId) => {
        fb.value.clearError(model+'.delete-image');
        fb.value.removeSuccess(model+'.delete-image');
        fb.value.startLoading(model+'.delete-image');
        try {
            await PostService.deletePostImage(imageId);
            post.value.images = post.value.images.filter(img => img.post_image_id !== imageId);
            fb.value.showSuccess(model+'.delete-image');
        } catch (err) {
            fb.value.setError(err, model+'.delete-image');
        } finally {
            fb.value.finishLoading(model+'.delete-image');
        }
    };
    const deletePostImageByProperty = async (postId, property) => {
        fb.value.clearError(model+'.delete-post-image');
        fb.value.removeSuccess(model+'.delete-post-image');
        fb.value.startLoading(model+'.delete-post-image');
        try {
            await PostService.deletePostImageByProperty(postId, property);
            post.value[property] = [];
            if(property === 'feature_image') {
                post.value.feature_image_thumb = [];
            }
            fb.value.showSuccess(model+'.delete-post-image');
        } catch (err) {
            fb.value.setError(err, model+'.delete-post-image');
        } finally {
            fb.value.finishLoading(model+'.delete-post-image');
        }
    };

    const createPostImport = async (newImport) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await PostService.createPostImport(newImport);
            console.log('Store received response:', response);
            fb.value.showSuccess(model+'.import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model+'.import');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.import');
        }
    };

    const createPageImport = async (newImport) => {
        fb.value.clearError(model+'.import');
        fb.value.removeSuccess(model+'.import');
        fb.value.startLoading(model+'.import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await PostService.createPageImport(newImport);
            console.log('Store received response:', response);
            fb.value.showSuccess(model+'.import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model+'.import');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.import');
        }
    };

    const createPostImageImport = async (newImport) => {
        fb.value.clearError(model+'.image-import');
        fb.value.removeSuccess(model+'.image-import');
        fb.value.startLoading(model+'.image-import');
        try {
            if (!newImport) {
                throw new Error('No file data provided');
            }

            const response = await PostService.createPostImageImport(newImport);
            fb.value.showSuccess(model+'.image-import');
            return response;
        } catch (err) {
            console.error('Import error:', err);
            fb.value.setError(err, model+'.image-import');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.image-import');
        }
    };

    //Action Finish here

    //Getters start here

    const postNames = computed(() => {
        return posts.value.map(post => post.name);
    });
    //Getters End here


    const updatePostWayPoints = async (postId, wayPoints) => {
        fb.value.clearError(model+'.wayPoints.'+postId);
        fb.value.removeSuccess(model+'.wayPoints.'+postId);
        fb.value.startLoading(model+'.wayPoints.'+postId);
        try {
            const property = 'post';
            const response = await PostService.updatePostWayPoints(postId, property, wayPoints);
            let updatedWayPoints = [];
            if (Array.isArray(response)) {
                updatedWayPoints = response;
            } else if (response && Array.isArray(response.way_points)) {
                updatedWayPoints = response.way_points;
            } else {
                updatedWayPoints = wayPoints;
            }

            post.value.banner_way_points = updatedWayPoints;
            fb.value.showSuccess(model+'.way-points.'+postId);
            // post.value.banner_way_points = response;
            // fb.value.showSuccess(model+'.wayPoints.'+postId);
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.wayPoints.'+postId);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.wayPoints.'+postId);
        }
    };

    const getWayPointSuggestions = async (query) => {
        fb.value.clearError(model+'.way-points-suggestions.'+query);
        fb.value.removeSuccess(model+'.way-points-suggestions.'+query);
        fb.value.startLoading(model+'.way-points-suggestions.'+query);
        try {
            const response = await PostService.getWayPointSuggestions(query);
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.way-points-suggestions.'+query);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.way-points-suggestions.'+query);
        }
    };

    const removePostWayPoint = async (postId, pointId) => {
        fb.value.clearError(model+'.way-points.remove.'+postId);
        fb.value.removeSuccess(model+'.way-points.remove.'+postId);
        fb.value.startLoading(model+'.way-points.remove.'+postId);
        try {
            await PostService.removePostWayPoint(postId, pointId);
            // update the way points
            post.value.banner_way_points = post.value.banner_way_points.filter(point => point.id != pointId);
            fb.value.showSuccess(model+'.way-points.remove.'+postId);
            return post.value.banner_way_points;
            
        } catch (err) {
            fb.value.setError(err, model+'.way-points.remove.'+postId);
            throw err;
        } finally {
            fb.value.finishLoading(model+'.way-points.remove.'+postId);
        }
    };

    const reorderPostImages = async (reordered, postId) => {
        fb.value.clearError(model+'.reorder-images');
        fb.value.removeSuccess(model+'.reorder-images');
        fb.value.startLoading(model+'.reorder-images');
        try {
            const response = await PostService.reorderPostImages(reordered, postId);
            fb.value.showSuccess('Images reordered successfully', model+'.reorder-images');
            return response;
        } catch (err) {
            fb.value.setError(err, model+'.reorder-images');
            fb.value.showError('Failed to reorder images. Please try again.', model+'.reorder-images');
            throw err;
        } finally {
            fb.value.finishLoading(model+'.reorder-images');
        }
    }

    // gallery image delete 
    const deleteGalleryImage = async (files, property = 'images') => {
        try {
            const postImagIds = files.map(file => file.post_image_id);
            const response = await PostService.deleteGalleryImage(postImagIds, property);
            return response;
        } catch (err) {
            console.error('Error deleting post image gallery:', err);
            throw err;
        }
    }

    return { 
        posts, 
        post,
        fb, 
        model, 
        postNames, 
        postStatuses,
        resetPostType,
        fetchPosts, 
        fetchPostById, 
        createPost, 
        updatePost, 
        deletePost, 
        createPostImport,
        createPageImport,
        createPostImageImport,
        getPostStatuses,
        uploadFiles,
        deletePostImage,
        deletePostImageByProperty,
        updatePostWayPoints,
        getWayPointSuggestions,
        removePostWayPoint,
        reorderPostImages,
        deleteGalleryImage
    };
}); 