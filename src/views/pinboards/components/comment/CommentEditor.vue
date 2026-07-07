<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const props = withDefaults(
  defineProps<{
    hasError?: boolean;
    placeholder?: string;
  }>(),
  {
    hasError: false,
    placeholder: 'Type your comment here...',
  }
);

const emit = defineEmits<{
  'update-content': [value: string];
}>();

const editorRef = ref<HTMLElement | null>(null);
const editorWrapperRef = ref<HTMLElement | null>(null);
let quillInstance: Quill | null = null;

function applyErrorState(isError: boolean) {
  if (editorWrapperRef.value) {
    editorWrapperRef.value.classList.toggle('th-comment-editor-container--error', isError);
  }
}

function initQuill() {
  if (!editorRef.value || quillInstance) return;

  quillInstance = new Quill(editorRef.value, {
    theme: 'snow',
    placeholder: props.placeholder,
  });

  quillInstance.on('text-change', () => {
    const quillRoot = editorRef.value?.querySelector('.ql-editor');
    const text = quillRoot?.textContent ?? '';
    emit('update-content', text);
  });

  applyErrorState(props.hasError);
}

function clear() {
  quillInstance?.setText('');
  applyErrorState(false);
}

function focusEditor() {
  quillInstance?.focus();
}

defineExpose({ clear, focusEditor });

watch(
  () => props.hasError,
  (value) => applyErrorState(value),
  { immediate: true }
);

onMounted(() => initQuill());

onBeforeUnmount(() => {
  quillInstance = null;
});
</script>

<template>
  <div 
    ref="editorWrapperRef" 
    class="w-full rounded-none transition-all duration-200"
    :class="hasError ? 'border-2 border-red-500 ring-1 ring-red-200' : 'border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'"
  >
    <div 
      ref="editorRef" 
      id="editor" 
      class="min-h-[120px] p-4 bg-white rounded-none outline-none text-base leading-relaxed text-gray-800" 
    />
  </div>
</template>

<style scoped>
:deep(.ql-editor){
  padding: 0!important;
}
:deep(.ql-editor), :deep(.ck-content), #editor {
  font-size: 1rem !important;
  line-height: 1.5 !important;
}

:deep(.ql-editor.ql-blank::before) {
  font-style: normal !important;
  color: #9ca3af !important; /* Tailwind text-gray-400 */
  left: 16px !important;
  top: 12px !important;
}
</style>