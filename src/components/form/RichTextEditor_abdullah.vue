<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Quill, { Delta } from 'quill';
/** Quill 2 list markup uses <ol><li data-list="bullet|ordered">; PrimeVue’s bundled Quill CSS is legacy and omits data-list rules, so bullets look like numbers without this. */
import 'quill/dist/quill.snow.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- JS service, no typedef
// @ts-expect-error
import MediaService from '@/service/MediaService';
import { FileModel } from '@/models/Media';
import { useToast } from 'primevue/usetoast';

const props = withDefaults(
    defineProps<{
        modelValue: string;
        label?: string;
        postId?: number | null;
        editorStyle?: string;
        pt?: any;
        modules?: any;
        required?: boolean;
    }>(),
    {
        editorStyle: 'height: 200px',
        pt: {},
        modules: {},
        required: false,
    }
);

const style = "min-height:100px; height:auto";

const emit = defineEmits<{
    'update:modelValue': [value: string];
}>();

const toast = useToast();
/** Quill's `</>` toolbar control is *code block* (pre), not raw HTML — use this toggle for HTML */
const htmlSource = ref(false);

/**
 * Quill toolbar attach() uses `button.value` to decide list type; with PrimeVue/Vue DOM that can be wrong
 * so both list buttons apply ordered. Capture the real `value` attribute on mousedown (before click/focus).
 */
const lastListToolbarListType = ref<'' | 'bullet' | 'ordered' | 'check'>('');

/** Quill getSemanticHTML() uses &nbsp; for spaces; normalize to plain spaces for HTML source + stored HTML */
function normalizeNbspToSpaces(html: string): string {
    if (!html) {
        return html;
    }
    return html
        .replace(/\u00A0/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#160;/g, ' ')
        .replace(/&#xA0;/gi, ' ');
}

/**
 * Quill 2 always outputs bullet lists as <ol><li data-list="bullet"> (same tag as ordered lists).
 * Convert homogeneous bullet-only <ol> blocks to <ul><li> for stored HTML / HTML source.
 * Ordered lists stay <ol><li data-list="ordered">. Clipboard still accepts <ul> on load.
 */
function quillBulletOlToUl(html: string): string {
    if (!html || !html.includes('<ol')) {
        return html;
    }
    if (typeof DOMParser === 'undefined') {
        return html;
    }
    try {
        const doc = new DOMParser().parseFromString(`<div class="ql-root">${html}</div>`, 'text/html');
        const root = doc.querySelector('.ql-root');
        if (!root) {
            return html;
        }
        const depth = (el: Element) => {
            let d = 0;
            let p: Element | null = el;
            while (p) {
                d++;
                p = p.parentElement;
            }
            return d;
        };
        const ols = [...root.querySelectorAll('ol')].sort((a, b) => depth(b) - depth(a));
        for (const ol of ols) {
            if (!ol.isConnected) {
                continue;
            }
            const lis = [...ol.children].filter((el): el is HTMLLIElement => el.tagName === 'LI');
            if (lis.length === 0) {
                continue;
            }
            if (!lis.every((li) => li.getAttribute('data-list') === 'bullet')) {
                continue;
            }
            const ul = doc.createElement('ul');
            for (const li of lis) {
                const clone = li.cloneNode(true) as HTMLLIElement;
                clone.removeAttribute('data-list');
                clone.querySelectorAll('.ql-ui').forEach((el) => el.remove());
                ul.appendChild(clone);
            }
            ol.replaceWith(ul);
        }
        return root.innerHTML;
    } catch {
        return html;
    }
}

function normalizeEditorHtml(html: string): string {
    return quillBulletOlToUl(normalizeNbspToSpaces(html));
}

/** Visual editor: normalize nbsp + Quill bullet <ol> → <ul> on every emit */
const editorContent = computed({
    get: () => props.modelValue ?? '',
    set: (v: string) => emit('update:modelValue', normalizeEditorHtml(v)),
});

/** Raw HTML textarea: pass through user edits */
const htmlContent = computed({
    get: () => props.modelValue ?? '',
    set: (v: string) => emit('update:modelValue', v),
});

watch(htmlSource, (showHtml) => {
    if (!showHtml) {
        return;
    }
    const raw = props.modelValue ?? '';
    const normalized = normalizeEditorHtml(raw);
    if (normalized !== raw) {
        emit('update:modelValue', normalized);
    }
});

type ToolbarModule = {
    addHandler?: (
        format: string,
        handler: (this: { quill: InstanceType<typeof Quill> }, value: boolean | string) => void
    ) => void;
    container?: HTMLElement;
};

/** Explicit handler so code-block always calls format() like Quill’s default toolbar path */
function onEditorLoad({ instance }: { instance: InstanceType<typeof Quill> }) {
    const toolbar = instance.getModule('toolbar') as ToolbarModule;
    const container = toolbar?.container;
    if (container && !container.dataset.listToolbarValueFix) {
        container.dataset.listToolbarValueFix = '1';
        container.addEventListener(
            'mousedown',
            (e: MouseEvent) => {
                const target = (e.target as HTMLElement | null)?.closest?.('button.ql-list') as HTMLButtonElement | null;
                if (!target) {
                    return;
                }
                const v = target.getAttribute('value');
                if (v === 'bullet' || v === 'ordered' || v === 'check') {
                    lastListToolbarListType.value = v;
                }
            },
            true
        );
    }

    toolbar?.addHandler?.('list', function (this: { quill: InstanceType<typeof Quill> }, value: boolean | string) {
        const quill = this.quill;
        const range = quill.getSelection(true);
        if (!range) {
            return;
        }
        const formats = quill.getFormat(range);

        if (value === false) {
            lastListToolbarListType.value = '';
            quill.format('list', false, Quill.sources.USER);
            return;
        }

        let listType: string =
            typeof value === 'string' && value ? value : '';
        const fromAttr = lastListToolbarListType.value;
        lastListToolbarListType.value = '';
        if (fromAttr === 'bullet' || fromAttr === 'ordered' || fromAttr === 'check') {
            listType = fromAttr;
        }

        if (listType === 'check') {
            if (formats.list === 'checked' || formats.list === 'unchecked') {
                quill.format('list', false, Quill.sources.USER);
            } else {
                quill.format('list', 'unchecked', Quill.sources.USER);
            }
        } else if (listType) {
            quill.format('list', listType, Quill.sources.USER);
        }
    });

    toolbar?.addHandler?.('code-block', function (this: { quill: InstanceType<typeof Quill> }, value: boolean | string) {
        const quill = this.quill;
        const range = quill.getSelection(true);
        if (!range) {
            return;
        }
        // Toolbar passes boolean for toggles; union type is from Quill’s handler signature
        quill.format('code-block', value as boolean, Quill.sources.USER);
    });
}

const editorModules = {
    uploader: {
        mimetypes: ['image/png', 'image/jpeg', 'image/gif'],
        handler(this: { quill: InstanceType<typeof Quill> }, range: { index: number; length: number }, files: File[]) {
            const quill = this.quill;
            if (!quill.scroll.query('image')) {
                return;
            }
            const payload = files.map((file, index) => ({ index, file }));
            MediaService.uploadFiles(payload, props.postId ?? null, {
                property: 'post_editor',
                upload_dir: 'media/Blogs/content',
            })
                .then((response: { files?: unknown[] }) => {
                    const urls = (response.files ?? []).map((raw: any) => {
                        let f = raw;
                        if (!f?.ObjectURL && f?.file && typeof f.file === 'string') {
                            f = JSON.parse(f.file);
                        }
                        return new FileModel(f).objectURL;
                    }).filter(Boolean);
                    if (!urls.length) {
                        toast.add({
                            severity: 'warn',
                            summary: 'Upload',
                            detail: 'No image URL returned from server',
                            life: 4000,
                        });
                        return;
                    }
                    const update = urls.reduce(
                        (delta, url) => delta.insert({ image: url }),
                        new Delta().retain(range.index).delete(range.length)
                    );
                    quill.updateContents(update, Quill.sources.USER);
                    quill.setSelection(range.index + urls.length, Quill.sources.SILENT);
                })
                .catch((err: any) => {
                    console.error('Editor image upload failed:', err);
                    const detail =
                        err?.response?.data?.message ??
                        err?.response?.data?.error ??
                        err?.message ??
                        'Could not upload image';
                    toast.add({
                        severity: 'error',
                        summary: 'Upload failed',
                        detail,
                        life: 5000,
                    });
                });
        },
    },
};
</script>

<template>
    <div class="form-group">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label class="block text-gray-700 text-lg">{{ label }}</label>
            <Button
                type="button"
                :label="htmlSource ? 'Visual editor' : 'HTML source'"
                :icon="htmlSource ? 'pi pi-palette' : 'pi pi-code'"
                :title="htmlSource ? 'Switch to rich text' : 'Edit raw HTML'"
                severity="secondary"
                text
                size="small"
                @click="htmlSource = !htmlSource"
            />
        </div>
        <Textarea v-if="htmlSource" v-model="htmlContent" class="w-full font-mono text-sm" rows="14" />
        <!-- Use PrimeVue’s default toolbar so Quill + Snow theme wire every control (incl. code block). -->
        <Editor
            v-else
            v-model="editorContent"
            :editor-style="style"
            :modules="editorModules"
            @load="onEditorLoad"
            :pt="pt"
            :required="required"
        />
    </div>
</template>


<style scoped>
/* Override global `.ql-editor ol li:before { counter(...) }`: Quill uses <ol> for bullets; markers are on `.ql-ui:before`. :deep() reaches PrimeVue Editor’s inner DOM. */
:deep(.ql-editor ol li[data-list='bullet']::before),
:deep(.ql-editor ol li[data-list='checked']::before),
:deep(.ql-editor ol li[data-list='unchecked']::before) {
    content: none !important;
}

:deep(.ql-editor ol li[data-list='ordered']::before) {
    content: none !important;
}
</style>