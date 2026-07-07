import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import TagService from '../service/TagService';
import TagFilter from '../filters/TagFilter';
import FeedbackHandler from '../utils/FeedbackHandler';
export const useTagStore = defineStore('tag', () => {
    const tags = ref([]);
    const filter = ref(new TagFilter());
    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'tag';

    const filteredTags = computed(() => {
        return tags.value.filter(tag => filter.value.matches(tag));
    });

    async function fetchTags() {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            tags.value = await TagService.getPostTags();
            fb.value.showSuccess(model);
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };
    const createTag = async (newTag) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        
        try {
            const createdTag = await TagService.createTag(newTag);
            tags.value.push(createdTag);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const updateTag = async (tagId, updatedTag) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const tag = await TagService.updateTag(tagId, updatedTag);
            const index = tags.value.findIndex(t => t.tag_id === tagId);
            if (index !== -1) {
                tags.value[index] = tag;
            }
            fb.value.showSuccess('Tag updated successfully');
        } catch (err) {
            fb.value.setError(err);
        } finally {
            fb.value.finishLoading();
        }
    };

    const deleteTag = async (tagId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await TagService.deleteTag(tagId);
            tags.value = tags.value.filter(t => t.tag_id !== tagId);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };
    

    function setFilter(newFilter) {
        filter.value = newFilter;
    }

    return {
        tags,
        filter,
        fb,
        filteredTags,
        fetchTags,
        setFilter,
        createTag,
        updateTag,
        deleteTag
    };
}); 