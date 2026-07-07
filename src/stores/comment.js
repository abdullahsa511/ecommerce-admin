import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import Comment from '../models/Comment';
import CommentService from '../service/CommentService';
import FeedbackHandler from '../utils/FeedbackHandler';
import CommentFilter from '../filters/CommentFilter';
export const useCommentStore = defineStore('comment', () => {
    /**
     * @type {Ref<Comment[]>}
     */
    const comments = ref([]);
    const filter = ref(new CommentFilter());

    const selectedStatus = ref('All');

    /**
     * @type {import('vue').Ref<FeedbackHandler>}
     */
    const fb = ref(new FeedbackHandler());
    const model = 'comment';

    // const filteredComments = computed(() => {
    //     return comments.value.filter(comment => filter.value.matches(comment));
    // });

    const filteredComments = computed(() => {
        if (selectedStatus.value === 'All') {
            return comments.value;
        }
        return comments.value.filter(comment => comment.status === selectedStatus.value);
        // return comments.value.filter(comment => filter.value.matches(comment));
    });


    async function fetchComments() {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            comments.value = await CommentService.getComments();
            fb.value.showSuccess(model);
        } catch (err) {
            console.error(err);
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const setStatus = (status) => {
        selectedStatus.value = status;
    }


    const fetchCommentById = async (commentId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const comment = await CommentService.getCommentById(commentId);
            return comment;
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    }

    const createComment = async (newComment) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        
        try {
            const createdComment = await CommentService.createComment(newComment);
            comments.value.push(createdComment);
            fb.value.showSuccess(model);
        } catch (err) {
            fb.value.setError(err, model);
        } finally {
            fb.value.finishLoading(model);
        }
    };

    const updateComment = async (CommentId, updatedComment) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            const comment = await CommentService.updateComment(CommentId, updatedComment);
            const index = comments.value.findIndex(t => t.Comment_id === CommentId);
            if (index !== -1) {
                comments.value[index] = comment;
            }
            fb.value.showSuccess('Comment updated successfully');
        } catch (err) {
            fb.value.setError(err);
        } finally {
            fb.value.finishLoading();
        }
    };

    const deleteComment = async (CommentId) => {
        fb.value.clearError(model);
        fb.value.removeSuccess(model);
        fb.value.startLoading(model);
        try {
            await CommentService.deleteComment(CommentId);
            comments.value = comments.value.filter(t => t.Comment_id !== CommentId);
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
        comments,
        selectedStatus,
        setStatus,
        filter,
        fb,
        filteredComments,
        fetchComments,
        fetchCommentById,
        setFilter,
        createComment,
        updateComment,
        deleteComment
    };
}); 