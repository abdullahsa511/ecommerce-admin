<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import CommentItem from './CommentItem.vue';
import type { PinboardCommentRecord } from '../models/PinboardComment';
import { getCommentReplies } from '../models/PinboardComment';

const props = defineProps<{
  comments: PinboardCommentRecord[];
  modelType: string;
  modelRef: string;
  loading?: boolean;
  searchQuery?: string;
}>();

const emit = defineEmits<{
  'delete-comment': [commentId: number];
  'upvote-comment': [payload: { commentId: number; userId?: number; uuid?: string }];
  'reply-comment': [payload: { commentId: number; userId?: number; content: string; uuid?: string }];
}>();

const expandedKeys = ref<string[]>([]);

const filteredComments = computed(() => {
  const q = (props.searchQuery || '').trim().toLowerCase();
  if (!q) return props.comments;

  return props.comments.filter((comment) => {
    if (commentMatchesQuery(comment, q)) return true;
    return getCommentReplies(comment).some((reply) => commentMatchesQuery(reply, q));
  });
});

function commentMatchesQuery(item: PinboardCommentRecord, query: string) {
  const haystack = [item.user_name, item.author, item.email, item.content]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

function resolveCommentKey(comment: PinboardCommentRecord, index: number) {
  return comment.comment_id != null ? String(comment.comment_id) : String(index);
}

function isExpanded(key: string) {
  return expandedKeys.value.includes(key);
}

function toggleExpanded(key: string) {
  const index = expandedKeys.value.indexOf(key);
  if (index === -1) {
    expandedKeys.value.push(key);
  } else {
    expandedKeys.value.splice(index, 1);
  }
}

watch(
  () => props.comments,
  (comments) => {
    if (comments?.length && !expandedKeys.value.length) {
      expandedKeys.value = [resolveCommentKey(comments[0], 0)];
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="comments-container pt-50">
    <div class="comments-container-top">
      <div class="expand-all-container">
        <button class="th-comment-btn-mini" type="button">
          <span class="fa fa-angle-down" />
          <span class="p-ink" />
        </button>
      </div>
      <div class="comments-container-top-right">
        <div class="comments-meta-info">
          <small>{{ filteredComments.length }} of {{ comments.length }}</small>
        </div>
      </div>
    </div>

    <template v-if="filteredComments.length">
      <CommentItem
        v-for="(comment, index) in filteredComments"
        :key="resolveCommentKey(comment, index)"
        :comment="comment"
        :comment-key="resolveCommentKey(comment, index)"
        :model-type="modelType"
        :model-ref="modelRef"
        :loading="loading"
        :expanded="isExpanded(resolveCommentKey(comment, index))"
        @toggle="toggleExpanded(resolveCommentKey(comment, index))"
        @delete="emit('delete-comment', $event)"
        @upvote="emit('upvote-comment', $event)"
        @reply="emit('reply-comment', $event)"
      />
    </template>

    <div v-else class="text-center py-4">
      <p v-if="(searchQuery || '').trim()" class="mb-0">Data not found</p>
      <p v-else class="mb-0">No comments found</p>
    </div>
  </div>
</template>
