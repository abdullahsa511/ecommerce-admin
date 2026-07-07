<script setup lang="ts">
/**
 * Admin HTML editor workflow:
 * 1. Load — parent passes HTML string from DB via v-model
 * 2. Store — hidden textarea holds that string (form field / source of truth)
 * 3. Edit — CodeMirror binds to the same string with HTML syntax highlighting
 * 4. Save — parent reads v-model and sends via API (e.g. pageStore.updatePage)
 */
import { computed, ref, shallowRef } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { html } from '@codemirror/lang-html';
import { EditorView } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import type { EditorView as CMEditorView } from '@codemirror/view';

const props = withDefaults(
    defineProps<{
        modelValue: string | null;
        label?: string;
        name?: string;
        containerStyle?: string;
        editorStyle?: string;
        placeholder?: string;
    }>(),
    {
        name: 'htmlContent',
        containerStyle: 'width: 100%;',
        editorStyle: 'height: 400px',
        placeholder: 'Paste your full HTML code here...',
    }
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

/** Hidden textarea — mirrors DB value; stays in sync on every CodeMirror change */
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const htmlContent = computed({
    get: () => props.modelValue ?? '',
    set: (value: string) => {
        emit('update:modelValue', value);
        if (textareaRef.value && textareaRef.value.value !== value) {
            textareaRef.value.value = value;
        }
    },
});

const cmView = shallowRef<CMEditorView | null>(null);

const extensions = [
    basicSetup,
    html(),
    EditorView.lineWrapping,
    EditorView.theme({
        '&': { height: '100%', width: '100%' },
        '.cm-scroller': { overflow: 'auto' },
        '.cm-content': { wordBreak: 'break-all' },
    }),
];

const editorHeightStyle = computed(() => {
    const match = props.editorStyle.match(/height:\s*([^;]+)/i);
    return { height: match?.[1]?.trim() ?? '400px' };
});

/** Copy latest CodeMirror document into textarea + v-model (call before save if needed) */
function syncToTextarea(): string {
    const fromEditor = cmView.value?.state.doc.toString();
    const value = fromEditor ?? htmlContent.value;
    htmlContent.value = value;
    return value;
}

function onEditorReady(payload: { view: CMEditorView }) {
    cmView.value = payload.view;
}

defineExpose({ syncToTextarea, getValue: syncToTextarea });
</script>

<template>
    <div class="html-code-editor">
        <label v-if="label" class="block text-gray-700 text-lg mb-2">{{ label }}</label>

        <!-- 1. Textarea holds database content (hidden; same value sent on save) -->
        <textarea
            ref="textareaRef"
            :id="name"
            :name="name"
            class="html-code-textarea"
            :value="htmlContent"
            tabindex="-1"
            aria-hidden="true"
            @input="htmlContent = ($event.target as HTMLTextAreaElement).value"
        />

        <!-- 2. CodeMirror editor surface -->
        <div class="editor-container" :style="containerStyle">
            <Codemirror
                v-model="htmlContent"
                :placeholder="placeholder"
                :style="editorHeightStyle"
                :indent-with-tab="true"
                :tab-size="2"
                :extensions="extensions"
                @ready="onEditorReady"
            />
        </div>
    </div>
</template>

<style scoped>
.html-code-textarea {
    display: none;
}

.editor-container {
    width: 100%;
    max-width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
}

.html-code-editor {
    width: 100%;
    max-width: 100%;
    min-width: 0;
}

.editor-container :deep(.v-codemirror) {
    display: block;
    width: 100%;
    max-width: 100%;
}

.editor-container :deep(.cm-editor) {
    width: 100%;
    max-width: 100%;
    height: 100%;
    font-size: 14px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.editor-container :deep(.cm-scroller) {
    overflow: auto;
}
</style>
