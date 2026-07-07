<script setup lang="ts">
import type { PinboardCommentRecord } from '@/models/PinboardComment';

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
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = String(dateObj.getFullYear()).slice(-2);

  let hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12 || 12;

  return `${dow} ${day}/${month}/${year} ${hours}:${minutes}${period}`;
}

function commentAuthor(reply:any) {
  if (reply.email && reply.email.includes('@')) {
    return reply.email.split('@')[0];
  }

  return reply.author || reply.user_name || '';
}
</script>

<template>
  <div class="comment-display reply-display list-complete-item flex items-start gap-3  border-l-2 border-gray-100 space-y-3">
    <div class="comment-user-image shrink-0">
      
    </div>

    <div class="comment-content flex-1 min-w-0">
      <div class="comment-top-content flex items-start justify-between gap-3">
        <div class="comment-user-and-likes flex items-center gap-2 min-w-0 flex-1">
          <div class="comment-user-name flex items-center gap-2 min-w-0">
            <span class="name font-semibold truncate">
              @{{ commentAuthor(reply) }}
            </span>

            <div
              class="comment-upvotes flex items-center bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded-full transition-colors shrink-0"
            >
              <div class="upvote-button-container">
                <button
                  type="button"
                  :class="[
                    'p-0 flex items-center justify-center transition-transform active:scale-95',
                    reply.liked ? 'is-liked' : 'user-liked'
                  ]"
                  :aria-pressed="reply.liked ? 'true' : 'false'"
                  :title="reply.liked ? 'Unlike' : 'Like'"
                  @click="
                    emit('upvote', {
                      replyId: reply.comment_id,
                      userId: reply.user_id,
                      uuid: reply.uuid,
                    })
                  "
                >
                  <span
                    class="pi pi-thumbs-up thumbs-icon-size transition-colors duration-200"
                    :style="{ color: reply.liked ? '#16a34a' : '#9aa1a8' }"
                  />
                </button>
              </div>

              <button
                class="upvote-count text-xs font-semibold text-gray-500 cursor-default flex items-center"
                type="button"
              >
                <span class="ml-1">{{ reply.votes || 0 }}</span>
              </button>
            </div>
          </div>
        </div>

        <div
          class="comment-time text-xs text-gray-400 whitespace-nowrap shrink-0"
        >
          {{ formatDate(reply.created_at) }}
        </div>
      </div>

      <div class="auto-comment-mention-tags" />

      <div class="comment-message mt-2">
        <p class="break-words leading-6">
          {{ reply.content }}
        </p>
      </div>

      <div class="comment-footer" />
    </div>
  </div>
</template>