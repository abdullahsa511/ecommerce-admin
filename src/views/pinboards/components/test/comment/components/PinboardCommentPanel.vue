<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import CommentSearch from './CommentSearch.vue';
import CommentEditor from './CommentEditor.vue';
import CommentUploader from './CommentUploader.vue';
import CommentAccordion from './CommentAccordion.vue';
import { usePinboardCommentStore } from '../store/pinboardCommentStore';
import type { PinboardCommentContext } from '../models/PinboardComment';

const props = defineProps<{
  context: PinboardCommentContext;
}>();

const commentStore = usePinboardCommentStore();
const { commentData, modelRef, modelType, fb } = storeToRefs(commentStore);

const commentContent = ref('');
const hasValidationError = ref(false);
const commentSearchQuery = ref('');
const commentSearchLoading = ref(false);

const commentEditorRef = ref<InstanceType<typeof CommentEditor> | null>(null);
const commentUploaderRef = ref<InstanceType<typeof CommentUploader> | null>(null);

const loading = computed(() => Boolean(fb.value.loading?.pinboardComment));
const errorMessage = computed(() => fb.value.errors?.pinboardComment);

const breadcrumbs = computed(() => ({
  modelType: modelType.value || props.context.modelType,
  modelRef: modelRef.value || props.context.modelRef,
  modelId: props.context.modelId,
  title: props.context.title,
}));

function handleEditorUpdate(content: string) {
  commentContent.value = content;
  if (hasValidationError.value && content.trim()) {
    hasValidationError.value = false;
  }
}

async function onCommentSearch(query: string) {
  commentSearchLoading.value = true;
  commentSearchQuery.value = query;
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  commentSearchLoading.value = false;
}

async function submitComment(files: Array<{ file: File }> = []) {
  const trimmedContent = commentContent.value.trim();
  if (!trimmedContent) {
    hasValidationError.value = true;
    commentEditorRef.value?.focusEditor();
    return;
  }

  const formData = new FormData();
  formData.append('model_uuid', String(props.context.modelUuid));
  formData.append('model_ref', String(props.context.modelRef));
  formData.append('content', trimmedContent);
  formData.append('model_type', String(props.context.modelType));
  formData.append('type', 'comment');

  files.forEach((item) => {
    if (item?.file) {
      formData.append('attachments[]', item.file);
    }
  });

  try {
    await commentStore.submitComment(formData);
    hasValidationError.value = false;
    commentContent.value = '';
    commentEditorRef.value?.clear();
    commentUploaderRef.value?.clearAttachments();
  } catch (error) {
    console.error('Failed to submit comment:', error);
  }
}

function deleteComment(commentId: number) {
  commentStore.deleteComment(commentId);
}

function upvoteComment(payload: { commentId: number; userId?: number; uuid?: string }) {
  commentStore.upvoteComment({
    commentId: payload.commentId,
    user_id: payload.userId,
    uuid: payload.uuid,
  });
}

function replyComment(payload: { commentId: number; userId?: number; content: string; uuid?: string }) {
  commentStore.replyCommentSubmit({
    commentId: payload.commentId,
    user_id: payload.userId,
    replyContent: payload.content,
    uuid: payload.uuid,
    is_reply: true,
  });
}
</script>

<template>
  <div class="th-comment-panel">
    <div class="th-comment-wrapper">
      <div class="d-flex gap-2 align-items-center th-comment-breadcrumbs">
        <span class="fw-semibold">{{ breadcrumbs.modelType }}</span>
        <span class="th-breadcrumb-separator" aria-hidden="true">
          <i class="fa-solid fa-chevron-right" />
        </span>
        <span class="text-uppercase">{{ breadcrumbs.modelRef || 'N/A' }}</span>
        <span class="th-breadcrumb-separator" aria-hidden="true">
          <i class="fa-solid fa-chevron-right" />
        </span>
        <span class="text-truncate">{{ breadcrumbs.title || breadcrumbs.modelId || 'N/A' }}</span>
      </div>

      <div v-if="errorMessage" class="comment-error-message">
        <Message severity="error" :closable="false">{{ errorMessage }}</Message>
      </div>

      <CommentSearch :loading="commentSearchLoading" @search="onCommentSearch" />

      <div class="th-comment-box">
        <form class="th-form th-custom-quote-form" @submit.prevent>
          <div class="comment-editor">
            <CommentEditor
              ref="commentEditorRef"
              :has-error="hasValidationError"
              @update-content="handleEditorUpdate"
            />
            <p v-if="hasValidationError" class="mt-2">
              <small class="p-error">Comment content is required.</small>
            </p>
          </div>

          <CommentUploader
            ref="commentUploaderRef"
            :loading="loading"
            @submit-comment="submitComment"
          />
        </form>
      </div>

      <div v-if="loading && !commentData.length" class="panel-loader flex justify-content-center py-6">
        <ProgressSpinner style="width: 40px; height: 40px" />
      </div>

      <CommentAccordion
        v-else
        :comments="commentData"
        :model-type="breadcrumbs.modelType"
        :model-ref="breadcrumbs.modelRef"
        :loading="loading"
        :search-query="commentSearchQuery"
        @delete-comment="deleteComment"
        @upvote-comment="upvoteComment"
        @reply-comment="replyComment"
      />
    </div>
  </div>
</template>
