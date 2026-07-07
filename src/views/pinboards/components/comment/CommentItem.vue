<script setup lang="ts">
import { ref } from 'vue';
import CommentReplyItem from './CommentReplyItem.vue';
import {
  getCommentReplies,
  isParentComment,
  type PinboardCommentRecord,
} from '@/models/PinboardComment';

const props = defineProps<{
  comment: PinboardCommentRecord;
  commentKey: string;
  title: string;
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

function commentAuthor(comment: any) {
  if (comment.email && comment.email.includes('@')) {
    return comment.email.split('@')[0];
  }

  return comment.author || comment.user_name || '';
}
</script>

<template>
  <div class="p-accordion p-component">
    <div :class="['p-accordion-tab', { 'p-accordion-tab-active': expanded }]">
      <div :class="['p-accordion-header', { 'p-highlight': expanded }, 'mb-5']">
        <a
          role="tab"
          class="p-accordion-header-link flex gap-1"
          tabindex="0"
          :aria-expanded="expanded ? 'true' : 'false'"
          :id="`comment-${commentKey}-header`"
          :aria-controls="`comment-${commentKey}-content`"
          href="#"
          @click.prevent="emit('toggle')"
          @keydown.enter.prevent="emit('toggle')"
          @keydown.space.prevent="emit('toggle')"
        >
          <span
            :class="[
              'p-accordion-toggle-icon',
              'pi',
              expanded ? 'pi-chevron-down' : 'pi-chevron-right'
            ]"
          />

          <div class="flex align-items-center justify-between w-full gap-2">
            <span class="p-accordion-header-text">
              {{ modelType }} &gt; {{ title }}
            </span>

            <div class="flex items-center gap-3 shrink-0">
              <span class="text-xs text-gray-400 whitespace-nowrap">
                {{ formatDate(comment.created_at) }}
              </span>

              <button
                class="border-0 bg-transparent p-0 flex items-center justify-center"
                type="button"
                @click.stop="emit('delete', comment.comment_id!)"
              >
                <i class="pi pi-check text-green-600 text-sm" />
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
          <div class="p-accordion-content p-4 bg-white border border-gray-100 rounded-b-xl">
            <div class="comment-display flex items-start gap-3">
              <div class="comment-user-image shrink-0" />

              <div class="comment-content flex-1 min-w-0">
                <div class="comment-top-content flex items-start justify-between gap-3">
                  <div class="comment-user-and-likes flex items-center gap-2 min-w-0 flex-1">
                    <div class="comment-user-name flex items-center gap-2 min-w-0">
                      <span class="name font-semibold truncate">
                        @{{ commentAuthor(comment) }}
                      </span>

                      <div class="comment-upvotes flex items-center bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded-full transition-colors shrink-0">
                        <div class="upvote-button-container">
                          <button type="button"
                            :class="['p-0 flex items-center justify-center transition-transform active:scale-95',comment.liked ? 'is-liked' : 'user-liked']"
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
                            <span class="pi pi-thumbs-up thumbs-icon-size transition-colors duration-200" :style="{ color: comment.liked ? '#16a34a' : '#9aa1a8' }"/>
                          </button>
                        </div>

                        <button class="upvote-count text-xs font-semibold text-gray-500 cursor-default flex items-center" type="button" >
                          <span class="ml-1">{{ comment.votes || 0 }}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    class="comment-time text-xs text-gray-400 whitespace-nowrap shrink-0"
                  >
                    {{ formatDate(comment.created_at) }}
                  </div>
                </div>

                <div class="auto-comment-mention-tags" />

                <div class="comment-message mt-2">
                  <p class="break-words leading-6">
                    {{ comment.content }}
                  </p>
                </div>

                <div class="comment-footer" />
              </div>
            </div>

            <div
              v-if="isParentComment(comment) && getCommentReplies(comment).length"
              class="comment-replies ml-8 mt-3 pl-4"
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
              <div
                v-show="replyEditorOpen"
                class="comment-editor reply-editor mt-4 ml-8"
              >
                <div class="reply-editor-main flex">
                  <div class="reply-editor-input flex-1">
                    <textarea
                      v-model="replyContent"
                      :id="`replyCommentData-${commentKey}`"
                      class="w-full p-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                      rows="3"
                      placeholder="Enter your reply here..."
                    />
                  </div>
                </div>

                <div class="editor-buttons reply-buttons flex justify-end mt-2">
                  <div class="flex gap-2">
                    <button
                      class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors  bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm py-2 px-4 rounded-lg transition-colors border border-gray-200"
                      type="button"
                      @click="toggleReplyEditor"
                    >
                      <span>Cancel</span>
                    </button>

                    <button
                      class="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                      type="button"
                      :disabled="isReplySubmitting || loading"
                      @click="submitReply"
                    >
                      <span
                        v-if="isReplySubmitting || loading"
                        class="flex items-center gap-1.5"
                      >
                        <i class="pi pi-spin pi-spinner text-xs" />
                        Submitting...
                      </span>

                      <span v-else>Submit</span>
                    </button>
                  </div>
                </div>
              </div>
            </transition>

            <transition name="reply-button-fade">
              <div
                v-show="!replyEditorOpen && comment.is_reply === 0"
                class="comment-reply-button mt-2 ml-8"
              >
                <button
                  class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1.5 rounded-md transition-colors"
                  type="button"
                  @click="toggleReplyEditor"
                >
                  <span class="pi pi-reply text-xs" />
                  <span>Reply</span>
                </button>
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>