<script setup lang="ts">
import type { PinboardCommentRecord } from '../models/PinboardComment';

defineProps<{
  reply: PinboardCommentRecord;
}>();

const emit = defineEmits<{
  upvote: [];
}>();

function formatDate(date?: string) {
  if (!date) return '';
  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) return date;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dow = days[dateObj.getDay()];
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = String(dateObj.getFullYear()).slice(-2);
  let hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;

  return `${dow} ${day}/${month}/${year} ${hours}:${minutes}${period}`;
}
</script>

<template>
  <div class="comment-display reply-display list-complete-item">
    <div class="comment-user-image">
      <div class="reply-connector" />
    </div>
    <div class="comment-content">
      <div class="comment-top-content">
        <div class="comment-user-and-likes">
          <div class="comment-user-name d-flex">
            <span class="name">{{ reply.email || reply.author || reply.user_name }}</span>
            <div class="comment-upvotes">
              <div class="upvote-button-container">
                <button
                  type="button"
                  :class="['p-button p-component p-button-icon-only p-button-link', reply.liked ? 'is-liked' : 'user-liked']"
                  :aria-pressed="reply.liked ? 'true' : 'false'"
                  :title="reply.liked ? 'Unlike' : 'Like'"
                  @click="emit('upvote')"
                >
                  <span
                    class="fas fa-thumbs-up p-button-icon big-icon"
                    :style="{ color: reply.liked ? '#16a34a' : '#9aa1a8' }"
                  />
                  <span class="p-ink" />
                </button>
              </div>
              <button class="upvote-count" type="button">
                <span>{{ reply.votes || 0 }}</span>
              </button>
            </div>
          </div>
        </div>
        <div class="comment-time">{{ formatDate(reply.created_at) }}</div>
      </div>
      <div class="auto-comment-mention-tags" />
      <div class="comment-message">
        <p>{{ reply.content }}</p>
      </div>
      <div class="comment-footer" />
    </div>
  </div>
</template>
