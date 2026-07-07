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

const isDragging = ref(false);

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

// file handling funcion (input change and drop)
function handleFileChange(event: Event | DragEvent) {
  let files: FileList | null = null;

  // check it is drop event or normal input change.
  if ('dataTransfer' in event && event.dataTransfer) {
    files = event.dataTransfer.files;
  } else {
    const input = event.target as HTMLInputElement;
    files = input.files;
  }

  if (!files?.length) return;

  const newFiles: SelectedFile[] = [];

  Array.from(files).forEach((file) => {
    // duplicate check 
    const isDuplicate = selectedFiles.value.some(
      (f) => f.name === file.name && f.size === file.size
    );

    if (!isDuplicate) {
      newFiles.push({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        objectURL: URL.createObjectURL(file),
      });
    }
  });

  // old and new file append 
  selectedFiles.value = [...selectedFiles.value, ...newFiles];
}

// remove file from the list
function removeFile(fileToRemove: SelectedFile) {
  if (fileToRemove.objectURL) {
    URL.revokeObjectURL(fileToRemove.objectURL);
  }
  selectedFiles.value = selectedFiles.value.filter(
    (f) => !(f.name === fileToRemove.name && f.size === fileToRemove.size)
  );
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
  <div class="w-full">
    <div
      v-show="showAttachmentArea"
      id="comment-attachment-area"
      class="mb-4 border bg-gray-50 rounded-lg p-5 transition-all duration-100"
      :class="{
        'opacity-100 scale-100': showAttachmentArea,
        'opacity-0 scale-95': !showAttachmentArea,
        'border-dashed border-blue-400 bg-blue-50/30': isDragging, 'border-gray-200': !isDragging
   
      }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="isDragging = false; handleFileChange($event)"
    >
      <div class="relative flex flex-col items-start gap-3">
        
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center justify-center bg-[#3B82F6] hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded transition-colors shadow-sm gap-2"
            @click.prevent="handleBrowseClick"
          >
            <span class="text-base font-normal">+</span> Choose
          </button>

          <input
            ref="attachmentInputRef"
            type="file"
            multiple
            class="hidden"
            @change="(e) => { handleFileChange(e); (e.target as HTMLInputElement).value = ''; }"
          />
          <button
            type="button"
            class="inline-flex items-center gap-1.5 bg-[#F8FAFC] hover:bg-gray-100 text-gray-600 font-medium text-sm py-2 px-3 rounded border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!selectedFiles.length"
            @click.prevent="clearAttachments(true)"
          >
            <i class="pi pi-times text-xs" />
            <span>Cancel</span>
          </button>
        </div>

        <p class="text-[13px] text-gray-600 mt-1">
          Drag and drop files to here to upload.
        </p>

        <div class="absolute inset-0 w-full h-full opacity-0 pointer-events-none" aria-hidden="true" />
      </div>

      <ul v-if="selectedFiles.length" class="mt-4 space-y-2 border-t border-gray-200 pt-3">
        <li
          v-for="file in selectedFiles"
          :key="file.name + file.size"
          class="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 shadow-sm"
        >
          <i class="pi pi-file-lines text-blue-500 text-base" aria-hidden="true" />
          <span class="font-medium truncate flex-1">{{ file.name }}</span>
          <span class="text-xs text-gray-400 font-mono whitespace-nowrap">{{ formatFileSize(file.size) }}</span>
          
          <button 
            type="button" 
            class="text-gray-400 hover:text-red-500 transition-colors"
            @click="removeFile(file)"
          >
            <i class="pi pi-trash text-xs" />
          </button>
        </li>
      </ul>
    </div>

    <div class="flex items-center gap-3">
      <button
        type="button"
        class="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm py-2 px-4 rounded-lg transition-colors border border-gray-200"
        :aria-expanded="showAttachmentArea ? 'true' : 'false'"
        aria-controls="comment-attachment-area"
        @click.prevent="toggleAttachmentArea"
      >
        <i class="pi pi-paperclip text-xs transition-transform duration-200" :class="{'rotate-45': showAttachmentArea}" />
        <span>{{ showAttachmentArea ? 'Hide' : 'Attachment' }}</span>
      </button>

      <button
        type="button"
        class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 px-5 rounded-lg shadow-sm transition-all hover:shadow disabled:opacity-50 disabled:pointer-events-none"
        :disabled="loading"
        @click="emitSubmit"
      >
        <span
          v-if="loading"
          class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"
          role="status"
          aria-hidden="true"
        />
        <span>Comment</span>
        <i v-if="!loading" class="pi pi-arrow-right text-xs" />
      </button>
    </div>
  </div>
</template>