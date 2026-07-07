import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import FeedbackHandler from '../utils/FeedbackHandler';
import PostTag from '../models/PostTag';
import PostTagService from '../service/PostTagService';
import PostTagFilter from '../filters/PostTagFilter';
import { FileModel } from '@/models/Media';
import PostTagImportResponse from '@/models/PostTagImport';
import { mediaUrl } from '@/utils/mediaUrl';

export const usePostTagStore = defineStore('postTag', () => {
  const server = import.meta.env.VITE_API_BASE_URL;
  /**
     * @type {import('vue').Ref<PostTagImportResponse>}
     */
  const importExport = ref(new PostTagImportResponse())
  
  /**
   * @type {import('vue').Ref<PostTag[]>}
   */
  const postTags = ref([]);
  const postTag = ref(new PostTag());
  const filter = ref(new PostTagFilter());

  /**
   * @type {import('vue').Ref<FeedbackHandler>}
   */
  const fb = ref(new FeedbackHandler());
  const model = 'postTag';

  const resetPostTag = () => {
    postTag.value = new PostTag();
  };

  // const postTagNames = computed(() => {
  //   return postTags.value.map((postTag) => postTag.name);
  // });

  const fetchPostTags = async () => {
    try {
      const response = await PostTagService.getPostTags();
      console.log('data', response);
      postTags.value = response.map(tag => new PostTag(tag)); 
      fb.value.showSuccess(model + ".list");
    } catch (err) {
      console.error(err);
      fb.value.setError(err, model + ".list");
    } finally {
      fb.value.finishLoading(model + ".list");
    }
  };


  const createPostTag = async (newPostTag) => {
    
    fb.value.clearError(model + '.create');
    fb.value.removeSuccess(model + '.create');
    fb.value.startLoading(model + '.create');
    try {
      const createdTag = await PostTagService.createPostTag(newPostTag);
      const tag = new PostTag(createdTag);
      // postTags.value.push(tag);
      postTag.value = tag;
      fb.value.showSuccess(model + '.create');
      return tag;
    } catch (err) {
      fb.value.setError(err, model + '.create');
      throw err;
    } finally {
      fb.value.finishLoading(model + '.create');
    }
  };

  const updatePostTag = async (posttagId, updatedTag) => {
    // console.log('update posss'+posttagId, updatedTag );
    
    fb.value.clearError(model);
    fb.value.removeSuccess(model);
    fb.value.startLoading(model);
    try {
      const tag = await PostTagService.updatePostTag(posttagId, updatedTag);
      const updatedPostTag = new PostTag(tag);
      const index = postTags.value.findIndex((t) => t.post_tag_id === posttagId);
      if (index !== -1) {
        postTags.value[index] = updatedPostTag;
      }
      postTag.value = updatedPostTag;
      fb.value.showSuccess('Post tag updated successfully');
      return updatedPostTag;
    } catch (err) {
      fb.value.setError(err, model);
      throw err;
    } finally {
      fb.value.finishLoading(model);
    }
  };

  const getPostTagById = async (posttagId) => {
    fb.value.clearError(model + '.update');
    fb.value.removeSuccess(model + '.update');
    fb.value.startLoading(model + '.update');
    try {
        const response = await PostTagService.getPostTagById(posttagId);
        postTag.value = new PostTag(response);
        fb.value.showSuccess(model + '.update');
        return response;
    } catch (err) {
        console.error('Error updating post tag:', err);
        fb.value.setError(err, model + '.update');
        throw err;
    } finally {
        fb.value.finishLoading(model + '.update');
    }
};

  const deletePostTag = async (posttagId) => {
    fb.value.clearError(model);
    fb.value.removeSuccess(model);
    fb.value.startLoading(model);
    try {
      await PostTagService.deletePostTag(posttagId);
      postTags.value = postTags.value.filter((t) => t.post_tag_id !== posttagId);
      fb.value.showSuccess('Post tag deleted successfully');
    } catch (err) {
      fb.value.setError(err, model);
    } finally {
      fb.value.finishLoading(model);
    }
  };

  const uploadFiles = async (files, property, postTagId) => {
    
    fb.value.clearError('media.files.upload' + property);
    fb.value.removeSuccess('media.files.upload' + property);
    fb.value.startLoading('media.files.upload' + property);
    
    
    try {
      const response = await PostTagService.uploadFiles(files, property, postTagId);
      response.files = response.files.map((file) => {
        if (!file?.ObjectURL && file?.file && typeof file.file === 'string') {
          file = JSON.parse(file.file);
        }
        // Create the image object
        const imageObject = new FileModel(file);

        // Make sure the image path is fully qualified
        if (file.objectURL) {
          imageObject.objectURL = mediaUrl(file.objectURL);
        }
        return imageObject;
      });

      fb.value.showSuccess('Files uploaded successfully', model + '.files.upload' + property);
      return response;
    } catch (err) {
      fb.value.setError(err, model + '.files.upload' + property);

      throw err;
    } finally {
      for (let file of files) {
        fb.value.finishLoading(model + '.files.upload' + property);
      }
    }
  };

  const deletePostTagImageByProperty = async (postTagId, property) => {
    fb.value.clearError(model+'.delete-post-image');
    fb.value.removeSuccess(model+'.delete-post-image');
    fb.value.startLoading(model+'.delete-post-image');
    try {
        await PostTagService.deletePostTagImageByProperty(postTagId, property);
        post.value[property] = [];
        fb.value.showSuccess(model+'.delete-post-image');
    } catch (err) {
        fb.value.setError(err, model+'.delete-post-image');
    } finally {
        fb.value.finishLoading(model+'.delete-post-image');
    }
};

  const deleteImageByFilePath = async (filepath, property, postTagId) => {
    fb.value.clearError(model + '.files.delete.' + property);
    fb.value.removeSuccess(model + '.files.delete.' + property);
    fb.value.startLoading(model + '.files.delete.' + property);
    try {
      const response = await PostTagService.deleteFileByPath(filepath, property, postTagId);
      fb.value.showSuccess('Image deleted successfully', model + '.files.delete.' + property);
      return response;
    } catch (err) {
      fb.value.setError(err, model + '.files.delete.' + property);
      throw err;
    } finally {
      fb.value.finishLoading(model + '.files.delete.' + property);
    }
  };

  const postTagsImport = async (newImport) => {
    fb.value.clearError(model+'.import');
    fb.value.removeSuccess(model+'.import');
    fb.value.startLoading(model+'.import');
    try {
        if (!newImport) {
            throw new Error('No file data provided');
        }
        const response = await PostTagService.postTagsImport(newImport);
        console.log('Store received response:', response);
        importExport.value = new PostTagImportResponse(response);
        fb.value.showSuccess(model+'.import');
        return importExport.value;
    } catch (err) {
        console.error('Import error:', err);
        fb.value.setError(err, model+'.import');
        throw err;
    } finally {
        fb.value.finishLoading(model+'.import');
    }
};


  return {
    importExport,
    postTags,
    postTag,
    filter,
    fb,
    resetPostTag,
    fetchPostTags,
    createPostTag,
    updatePostTag,
    getPostTagById,
    deletePostTag,
    uploadFiles,
    deletePostTagImageByProperty,
    deleteImageByFilePath,
    postTagsImport
  };
});
