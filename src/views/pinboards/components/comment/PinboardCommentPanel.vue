<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import CommentSearch from './CommentSearch.vue';
import CommentEditor from './CommentEditor.vue';
import CommentUploader from './CommentUploader.vue';
import CommentAccordion from './CommentAccordion.vue';
import { usePinboardCommentStore } from '@/stores/pinboardComment';
import type { PinboardCommentContext } from '@/models/PinboardComment';
import { useToast } from 'primevue/usetoast';
const toast = useToast();

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
  toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Checked successfully',
            life: 3000
        });
}

function upvoteComment(payload: { commentId: number; userId?: number; uuid?: string }) {
  commentStore.upvoteComment({
    commentId: payload.commentId,
    user_id: payload.userId,
    uuid: payload.uuid,
  });
   toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Updated votes successfully',
        life: 3000
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
      <div class="flex items-center gap-2.5 text-base text-gray-600 font-medium th-comment-breadcrumbs">
        <span class="font-semibold text-gray-900">{{ breadcrumbs.modelType }}</span>
        
        <span class="flex items-center text-gray-400" aria-hidden="true">
          <i class="pi pi-chevron-right text-sm" />
        </span>
        

        <span class="truncate text-gray-500 max-w-[250px] md:max-w-[350px]" :title="breadcrumbs.title || breadcrumbs.modelId">
          {{ breadcrumbs.title || breadcrumbs.modelId || 'N/A' }}
        </span>
      </div>

      <div v-if="errorMessage" class="comment-error-message">
        <Message severity="error" :closable="false">{{ errorMessage }}</Message>
      </div>

      <CommentSearch :loading="commentSearchLoading" @search="onCommentSearch" />

      <div class="mb-6 bg-white">
        <form @submit.prevent>
          <div class="mb-4">
            <CommentEditor
              ref="commentEditorRef"
              :has-error="hasValidationError"
              @update-content="handleEditorUpdate"
            />
            <p v-if="hasValidationError" class="mt-2 text-sm text-red-600 flex items-center gap-1.5 animate-pulse">
              <i class="pi pi-exclamation-circle" />
              <span>Comment content is required.</span>
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
        :title = " breadcrumbs.title"
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
