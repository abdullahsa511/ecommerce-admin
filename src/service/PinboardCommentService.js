import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/comments`;

export default class PinboardCommentService {
  static async loadComments(payload = {}) {
    const { model_uuid, model_type } = payload;
    const response = await axios.get(`${API_URL}/${model_uuid}`, {
      params: { model_type },
    });
    return response.data;
  }

  static async submitComment(formData) {
    const response = await axios.post(`${API_URL}/pinboard-comment-save`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
  static async deleteComment(commentId) {
    // const response = await axios.delete(`${API_URL}/${commentId}`);
    const response = await axios.post(`${API_URL}/checked`, {
      comment_id: commentId,
    });
    return response.data;
  }

  static async upvoteComment(commentId, userId, uuid) {
    const response = await axios.post(`${API_URL}/upvote`, {
      comment_id: commentId,
      user_id: userId,
      uuid,
    });
    return response.data;
  }

  static async submitReplyComment(formData) {
    const response = await axios.post(`${API_URL}/reply`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
}
