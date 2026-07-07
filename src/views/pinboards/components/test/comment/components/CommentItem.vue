<script setup lang="ts">
import { ref } from 'vue';
import CommentReplyItem from './CommentReplyItem.vue';
import {
  getCommentReplies,
  isParentComment,
  type PinboardCommentRecord,
} from '../models/PinboardComment';

const props = defineProps<{
  comment: PinboardCommentRecord;
  commentKey: string;
  modelType: string;
  modelRef: string;
  loading?: boolean;
  expanded?: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
  delete: [commentId: number];
  upvote: [payload: { commentId: number; userId?: number; uuid?: string }];
  reply: [payload: { commentId: number; userId?: number; content: string; uuid?: string }];
}>();

const replyContent = ref('');
const replyEditorOpen = ref(false);
const isReplySubmitting = ref(false);

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

function toggleReplyEditor() {
  replyEditorOpen.value = !replyEditorOpen.value;
  if (!replyEditorOpen.value) {
    replyContent.value = '';
  }
}

function submitReply() {
  const trimmed = replyContent.value.trim();
  if (!trimmed || isReplySubmitting.value || props.loading) return;

  isReplySubmitting.value = true;
  emit('reply', {
    commentId: props.comment.comment_id!,
    userId: props.comment.user_id,
    content: trimmed,
    uuid: props.comment.uuid,
  });
  replyContent.value = '';
  replyEditorOpen.value = false;
  isReplySubmitting.value = false;
}

function beforeAccordionEnter(el: Element) {
  const node = el as HTMLElement;
  node.style.height = '0';
  node.style.opacity = '0';
  node.style.overflow = 'hidden';
  node.style.transition = 'height 0.3s ease, opacity 0.3s ease';
}

function accordionEnter(el: Element) {
  const node = el as HTMLElement;
  requestAnimationFrame(() => {
    node.style.height = `${node.scrollHeight}px`;
    node.style.opacity = '1';
  });
}

function afterAccordionEnter(el: Element) {
  const node = el as HTMLElement;
  node.style.height = 'auto';
  node.style.opacity = '1';
  node.style.overflow = '';
  node.style.transition = '';
}

function beforeAccordionLeave(el: Element) {
  const node = el as HTMLElement;
  node.style.height = `${node.scrollHeight}px`;
  node.style.opacity = '1';
  node.style.overflow = 'hidden';
  node.style.transition = 'height 0.3s ease, opacity 0.3s ease';
}

function accordionLeave(el: Element) {
  const node = el as HTMLElement;
  requestAnimationFrame(() => {
    node.style.height = '0';
    node.style.opacity = '0';
  });
}

function afterAccordionLeave(el: Element) {
  const node = el as HTMLElement;
  node.style.height = '0';
  node.style.opacity = '0';
  node.style.overflow = '';
  node.style.transition = '';
}
</script>

<template>
  <div class="p-accordion p-component">
    <div :class="['p-accordion-tab', { 'p-accordion-tab-active': expanded }]">
      <div :class="['p-accordion-header', { 'p-highlight': expanded }, 'mb-5']">
        <a
          role="tab"
          class="p-accordion-header-link d-flex"
          tabindex="0"
          :aria-expanded="expanded ? 'true' : 'false'"
          :id="`comment-${commentKey}-header`"
          :aria-controls="`comment-${commentKey}-content`"
          href="#"
          @click.prevent="emit('toggle')"
          @keydown.enter.prevent="emit('toggle')"
          @keydown.space.prevent="emit('toggle')"
        >
          <span :class="['p-accordion-toggle-icon', 'pi', expanded ? 'pi-chevron-down' : 'pi-chevron-right']" />
          <div class="d-flex align-items-center gap-2">
            <i :class="['fa-solid', expanded ? 'fa-angle-down' : 'fa-angle-right']" />
            <span class="p-accordion-header-text">
              {{ modelType }} &gt;
              <span>{{ modelRef }}</span>
              &gt; {{ formatDate(comment.created_at) }}
            </span>
            <div class="ms-auto">
              <button
                class="border-0 bg-transparent"
                type="button"
                @click.stop="emit('delete', comment.comment_id!)"
              >
                <i class="fa-solid fa-trash" />
              </button>
            </div>
          </div>
        </a>
      </div>

      <transition
        @before-enter="beforeAccordionEnter"
        @enter="accordionEnter"
        @after-enter="afterAccordionEnter"
        @before-leave="beforeAccordionLeave"
        @leave="accordionLeave"
        @after-leave="afterAccordionLeave"
      >
        <div
          v-show="expanded"
          class="p-toggleable-content"
          role="region"
          :id="`comment-${commentKey}-content`"
          :aria-labelledby="`comment-${commentKey}-header`"
          :aria-hidden="expanded ? 'false' : 'true'"
        >
          <div class="p-accordion-content">
            <div class="comment-display">
              <div class="comment-content">
                <div class="comment-top-content">
                  <div class="comment-user-and-likes">
                    <div class="comment-user-name d-flex">
                      <span>{{ comment.email || comment.author || comment.user_name }}</span>
                      <div class="comment-upvotes">
                        <div class="upvote-button-container">
                          <button
                            type="button"
                            :class="['p-button p-component p-button-icon-only p-button-link', comment.liked ? 'is-liked' : 'user-liked']"
                            :aria-pressed="comment.liked ? 'true' : 'false'"
                            :title="comment.liked ? 'Unlike' : 'Like'"
                            @click="
                              emit('upvote', {
                                commentId: comment.comment_id!,
                                userId: comment.user_id,
                                uuid: comment.uuid,
                              })
                            "
                          >
                            <span
                              class="fas fa-thumbs-up p-button-icon big-icon"
                              :style="{ color: comment.liked ? '#16a34a' : '#9aa1a8' }"
                            />
                            <span class="p-ink" />
                          </button>
                        </div>
                        <button class="upvote-count" type="button">
                          <span>{{ comment.votes || 0 }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="comment-time">{{ formatDate(comment.created_at) }}</div>
                </div>
                <div class="auto-comment-mention-tags" />
                <div class="comment-message">
                  <p>{{ comment.content }}</p>
                </div>
                <div class="comment-footer" />
              </div>
            </div>

            <div
              v-if="isParentComment(comment) && getCommentReplies(comment).length"
              class="comment-replies"
            >
              <CommentReplyItem
                v-for="reply in getCommentReplies(comment)"
                :key="reply.comment_id"
                :reply="reply"
                @upvote="
                  emit('upvote', {
                    commentId: reply.comment_id!,
                    userId: reply.user_id,
                    uuid: reply.uuid,
                  })
                "
              />
            </div>

            <transition name="reply-editor-fade">
              <div v-show="replyEditorOpen" class="comment-editor reply-editor">
                <div class="reply-editor-main">
                  <div class="comment-user-image" />
                  <div class="reply-editor-input">
                    <textarea
                      v-model="replyContent"
                      :id="`replyCommentData-${commentKey}`"
                      class="form-control"
                      rows="3"
                      placeholder="Enter your reply here..."
                    />
                  </div>
                </div>
                <div class="editor-buttons reply-buttons">
                  <div>
                    <button class="th-btn-cancel p-button-link" type="button" @click="toggleReplyEditor">
                      <span class="p-button-label">Cancel</span>
                    </button>
                    <button
                      class="th-btn-reply-submit"
                      type="button"
                      :disabled="isReplySubmitting || loading"
                      @click="submitReply"
                    >
                      <span v-if="isReplySubmitting || loading" class="p-button-label">
                        <i class="fas fa-spin fa-spinner-third me-1" />
                        Submitting...
                      </span>
                      <span v-else class="p-button-label">Submit</span>
                    </button>
                  </div>
                </div>
              </div>
            </transition>

            <transition name="reply-button-fade">
              <div v-show="!replyEditorOpen && comment.is_reply === 0" class="comment-reply-button">
                <button
                  class="th-btn-outline-reply p-button-link"
                  type="button"
                  @click="toggleReplyEditor"
                >
                  <span class="fas fa-reply p-button-icon p-button-icon-left" />
                  <span class="p-button-label">Reply</span>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
