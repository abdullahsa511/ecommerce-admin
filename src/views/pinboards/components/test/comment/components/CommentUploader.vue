<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';

interface SelectedFile {
  file: File;
  name: string;
  size: number;
  type: string;
  objectURL: string;
}

defineProps<{
  loading?: boolean;
}>();

const emit = defineEmits<{
  'submit-comment': [files: SelectedFile[]];
}>();

const selectedFiles = ref<SelectedFile[]>([]);
const showAttachmentArea = ref(false);
const attachmentInputRef = ref<HTMLInputElement | null>(null);

function revokeObjectURLs(files: SelectedFile[] = selectedFiles.value) {
  files.forEach((item) => {
    if (item.objectURL) {
      URL.revokeObjectURL(item.objectURL);
    }
  });
}

function toggleAttachmentArea() {
  showAttachmentArea.value = !showAttachmentArea.value;
}

function handleBrowseClick() {
  attachmentInputRef.value?.click();
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (!files?.length) {
    clearAttachments(true);
    return;
  }

  revokeObjectURLs();
  selectedFiles.value = Array.from(files).map((file) => ({
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    objectURL: URL.createObjectURL(file),
  }));
}

function clearAttachments(preserveAttachmentArea = false) {
  revokeObjectURLs();
  selectedFiles.value = [];
  if (attachmentInputRef.value) {
    attachmentInputRef.value.value = '';
  }
  if (!preserveAttachmentArea) {
    showAttachmentArea.value = false;
  }
}

function emitSubmit() {
  emit('submit-comment', selectedFiles.value);
}

function formatFileSize(bytes: number) {
  const units = ['KB', 'MB', 'GB'];
  let size = bytes / 1024;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

defineExpose({ clearAttachments });

onBeforeUnmount(() => revokeObjectURLs());
</script>

<template>
  <div class="form-group">
    <div
      v-show="showAttachmentArea"
      id="comment-attachment-area"
      class="th-comment-attachment"
      :class="{
        'v-enter-active': showAttachmentArea,
        'v-leave-active': !showAttachmentArea,
      }"
    >
      <div class="th-comment-attachment__dropzone">
        <input
          ref="attachmentInputRef"
          type="file"
          multiple
          class="th-comment-attachment__input"
          @change="handleFileChange"
        />
        <span class="th-comment-attachment__icon" aria-hidden="true">
          <i class="fa-solid fa-cloud-arrow-up" />
        </span>
        <p class="th-comment-attachment__title">Drag & Drop your files here</p>
        <p class="th-comment-attachment__subtitle">or</p>
        <button
          type="button"
          class="th-btn bg-gray text-black th-comment-attachment__browse"
          @click.prevent="handleBrowseClick"
        >
          Browse
        </button>
      </div>
      <ul v-if="selectedFiles.length" class="th-comment-attachment__files">
        <li
          v-for="file in selectedFiles"
          :key="file.name + file.size"
          class="th-comment-attachment__file"
        >
          <i class="fa-solid fa-file-lines" aria-hidden="true" />
          <span class="th-comment-attachment__file-name">{{ file.name }}</span>
          <span class="th-comment-attachment__file-size">{{ formatFileSize(file.size) }}</span>
        </li>
      </ul>
    </div>

    <div class="d-flex gap-2 mt-5">
      <button
        type="button"
        class="text-capitalize bg-black text-white w-100 th-attachment-toggle"
        :aria-expanded="showAttachmentArea ? 'true' : 'false'"
        aria-controls="comment-attachment-area"
        @click.prevent="toggleAttachmentArea"
      >
        <i class="fa-solid fa-paperclip" />
        {{ showAttachmentArea ? 'Hide' : 'Attachment' }}
      </button>
      <button
        type="button"
        class="th-btn text-capitalize bg-gray text-black w-100"
        :disabled="loading"
        @click="emitSubmit"
      >
        <span
          v-if="loading"
          class="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        />
        <span>Comment</span>
        <i v-if="!loading" class="fa-solid fa-arrow-right ms-1" />
      </button>
    </div>
  </div>
</template>
