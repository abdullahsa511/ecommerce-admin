import { defineStore } from 'pinia';
import { ref } from 'vue';
import PinboardCommentService from '@/service/PinboardCommentService';
import FeedbackHandler from '@/utils/FeedbackHandler';
import mockCommentsData from '@/views/pinboards/components/comment/comment.json';

/** Fall back to comment.json when the API is unavailable. Set false once API is live. */
const USE_MOCK_FALLBACK = false;

export const usePinboardCommentStore = defineStore('pinboardComment', () => {
  const commentData = ref([]);
  const modelId = ref('');
  const modelUuid = ref('');
  const modelRef = ref('');
  const modelType = ref('');
  const fb = ref(new FeedbackHandler());
  const model = 'pinboardComment';

  function normalizeComment(comment) {
    if (!comment || typeof comment !== 'object') return comment;
    return {
      ...comment,
      user_name: comment.user_name || comment.author || comment.email || 'Unknown User',
    };
  }

  function setContext(payload = {}) {
    modelId.value = payload.model_id ?? payload.modelId ?? '';
    modelUuid.value = payload.model_uuid ?? payload.modelUuid ?? '';
    modelRef.value = payload.model_ref ?? payload.modelRef ?? '';
    modelType.value = payload.model_type ?? payload.modelType ?? '';
  }

  function loadMockComments() {
    commentData.value = structuredClone(mockCommentsData).map(normalizeComment);
    fb.value.clearError(model);
    fb.value.showSuccess(model);
  }

  async function loadComments(payload = {}) {
    fb.value.clearError(model);
    fb.value.removeSuccess(model);
    fb.value.startLoading(model);
    setContext(payload);

    try {
      const response = await PinboardCommentService.loadComments({
        model_uuid: modelUuid.value,
        model_type: modelType.value,
      });

      if (response?.status === 404) {
        commentData.value = [];
        if (USE_MOCK_FALLBACK) {
          loadMockComments();
        }
        return;
      }

      commentData.value = Array.isArray(response) ? response.map(normalizeComment) : [];

      if (USE_MOCK_FALLBACK && commentData.value.length === 0) {
        loadMockComments();
        return;
      }

      fb.value.showSuccess(model);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        loadMockComments();
        return;
      }
      fb.value.setError(error, model);
      throw error;
    } finally {
      fb.value.finishLoading(model);
    }
  }

  async function submitComment(formData) {

    console.log(formData);

    
    fb.value.clearError(model);
    fb.value.removeSuccess(model);
    fb.value.startLoading(model);

    try {
      const response = await PinboardCommentService.submitComment(formData);
      if (response?.comment) {
        commentData.value = [normalizeComment(response.comment), ...commentData.value];
      }
      fb.value.showSuccess(model);
      return response;
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        const newComment = normalizeComment({
          comment_id: Date.now(),
          uuid: `cmt-mock-${Date.now()}`,
          user_id: 7,
          email: 'demo.user@krost.com.au',
          author: 'Demo User',
          content: formData.get('content'),
          created_at: new Date().toISOString(),
          votes: 0,
          liked: false,
          is_reply: 0,
          parent_id: null,
          replay: [],
        });
        commentData.value = [newComment, ...commentData.value];
        fb.value.showSuccess(model);
        return { comment: newComment };
      }
      fb.value.setError(error, model);
      throw error;
    } finally {
      fb.value.finishLoading(model);
    }
  }

  async function deleteComment(commentId) {
    fb.value.clearError(model);
    fb.value.removeSuccess(model);
    // fb.value.startLoading(model);

    try {
      await PinboardCommentService.deleteComment(commentId);
      // commentData.value = commentData.value.filter(
      //   (comment) => Number(comment.comment_id) !== Number(commentId)
      // );
      fb.value.showSuccess(model);
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        commentData.value = commentData.value
          .filter((comment) => Number(comment.comment_id) !== Number(commentId))
          .map((comment) => ({
            ...comment,
            replay: (comment.replay || []).filter(
              (reply) => Number(reply.comment_id) !== Number(commentId)
            ),
          }));
        fb.value.showSuccess(model);
        return;
      }
      fb.value.setError(error, model);
      throw error;
    } finally {
      fb.value.finishLoading(model);
    }
  }

  async function upvoteComment({ commentId, user_id, uuid }) {
    fb.value.clearError(model);
    fb.value.removeSuccess(model);
    // fb.value.startLoading(model);

    try {
      const response = await PinboardCommentService.upvoteComment(commentId, user_id, uuid);
      const nextVotes = typeof response?.votes === 'number' ? response.votes : null;
      const nextLiked = typeof response?.liked === 'boolean' ? response.liked : null;

      const applyToComment = (comment) => {
        if (!comment || Number(comment.comment_id) !== Number(commentId)) {
          return comment;
        }
        return {
          ...comment,
          votes: nextVotes !== null ? nextVotes : Number(comment.votes) || 0,
          liked: nextLiked !== null ? nextLiked : Boolean(comment.liked),
        };
      };

      commentData.value = commentData.value.map((comment) => {
        const updated = applyToComment(comment);
        const replies = Array.isArray(updated.replay) ? updated.replay : [];
        if (!replies.length) return updated;
        return {
          ...updated,
          replay: replies.map(applyToComment),
        };
      });

      fb.value.showSuccess(model);
      return response;
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        const toggle = (item) => {
          if (Number(item.comment_id) !== Number(commentId)) return item;
          const liked = !item.liked;
          return {
            ...item,
            liked,
            votes: Math.max(0, (item.votes || 0) + (liked ? 1 : -1)),
          };
        };
        commentData.value = commentData.value.map((comment) => {
          const updated = toggle(comment);
          if (!comment.replay?.length) return updated;
          return { ...updated, replay: comment.replay.map(toggle) };
        });
        fb.value.showSuccess(model);
        return;
      }
      fb.value.setError(error, model);
      throw error;
    } finally {
      fb.value.finishLoading(model);
    }
  }

  async function replyCommentSubmit({ commentId, user_id, replyContent, is_reply = true, uuid = null }) {
    fb.value.clearError(model);
    fb.value.removeSuccess(model);
    fb.value.startLoading(model);

    const formData = new FormData();
    formData.append('content', replyContent);
    formData.append('comment_id', String(commentId));
    formData.append('user_id', String(user_id));
    formData.append('is_reply', String(is_reply));
    if (uuid) formData.append('uuid', uuid);

    try {
      const response = await PinboardCommentService.submitReplyComment(formData);
      if (response?.comment) {
        const replyPayload = normalizeComment({
          ...response.comment,
          parent_id: response.comment.parent_id ?? commentId,
        });

        commentData.value = commentData.value.map((comment) => {
          if (Number(comment.comment_id) !== Number(commentId)) {
            return comment;
          }
          const existingReplies = Array.isArray(comment.replay)
            ? comment.replay
            : Array.isArray(comment.reply)
              ? comment.reply
              : [];
          return {
            ...comment,
            replay: [...existingReplies, replyPayload],
          };
        });
      }
      fb.value.showSuccess(model);
      return response;
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        const replyPayload = normalizeComment({
          comment_id: Date.now(),
          uuid: `reply-mock-${Date.now()}`,
          user_id: user_id || 7,
          email: 'demo.user@krost.com.au',
          author: 'Demo User',
          content: replyContent,
          created_at: new Date().toISOString(),
          votes: 0,
          liked: false,
          is_reply: 1,
          parent_id: commentId,
        });
        commentData.value = commentData.value.map((comment) => {
          if (Number(comment.comment_id) !== Number(commentId)) return comment;
          return {
            ...comment,
            replay: [...(comment.replay || []), replyPayload],
          };
        });
        fb.value.showSuccess(model);
        return { comment: replyPayload };
      }
      fb.value.setError(error, model);
      throw error;
    } finally {
      fb.value.finishLoading(model);
    }
  }

  function reset() {
    commentData.value = [];
    modelId.value = '';
    modelUuid.value = '';
    modelRef.value = '';
    modelType.value = '';
    fb.value.clearError(model);
    fb.value.removeSuccess(model);
  }

  return {
    commentData,
    modelId,
    modelUuid,
    modelRef,
    modelType,
    fb,
    setContext,
    loadComments,
    submitComment,
    deleteComment,
    upvoteComment,
    replyCommentSubmit,
    reset,
  };
});
