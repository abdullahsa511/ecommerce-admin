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
  <div ref="editorWrapperRef" class="form-group th-comment-editor-container">
    <div ref="editorRef" id="editor" class="th-comment-editor" />
  </div>
</template>
