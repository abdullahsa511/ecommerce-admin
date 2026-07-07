<script setup>
import { computed, inject, watch } from 'vue';
import { usePrimeVue } from 'primevue/config';

const props = defineProps({
    /** FileUpload’s pending `files` (from header slot) — used if $pcFileUpload inject is unavailable. */
    fileUploadFiles: { type: Array, default: () => [] },
    /** Same as FileUpload `fileLimit` — upload stays disabled while selection exceeds this. */
    fileLimit: { type: Number, default: null },
    /** Pending rows in parent `uploadedFilesData` (e.g. status Pending); keeps upload state in sync when slot `files` is cleared but grid still shows rows. */
    pendingUploadCount: { type: Number, default: null },
    chooseCallback: { type: Function, required: true },
    uploadCallback: { type: Function, required: true },
    clearCallback: { type: Function, required: true },
    /**
     * Parent-owned `{ fn: null }`; we assign `fn = clearCallback` so the parent can call PrimeVue’s
     * official clear after custom upload (ref.clear() alone does not always reset `fileLimit` state).
     */
    fileUploadClearHolder: { type: Object, default: null },
    showViewToggles: { type: Boolean, default: false },
    viewMode: { type: String, default: 'grid' },
    quickFilter: { type: String, default: '' },
    sortOption: { type: String, default: 'recent_desc' },
    sortOptions: { type: Array, default: () => [] }
});

const emit = defineEmits(['update:viewMode', 'update:quickFilter', 'update:sortOption']);

/** PrimeVue FileUpload provides this to components rendered in its header slot. */
const pc = inject('$pcFileUpload', null);

const primevue = usePrimeVue();

const chooseLabel = computed(() => pc?.chooseButtonLabel ?? primevue.config.locale?.choose ?? 'Choose');
const uploadLabel = computed(() => pc?.uploadButtonLabel ?? primevue.config.locale?.upload ?? 'Upload');
const cancelLabel = computed(() => pc?.cancelButtonLabel ?? primevue.config.locale?.cancel ?? 'Cancel');

/**
 * How many files would upload — max of PrimeVue slot `files` and parent pending count so we
 * neither leave Upload stuck disabled after removals nor leave it enabled when over `fileLimit`.
 */
const effectiveUploadFileCount = computed(() => {
    const slotLen = props.fileUploadFiles?.length ?? 0;
    const pending = props.pendingUploadCount;
    if (typeof pending === 'number') {
        return Math.max(pending, slotLen);
    }
    return slotLen;
});

const uploadDisabled = computed(() => {
    if (pc?.disabled === true) return true;
    // Do not use `pc.uploadDisabled` alone: it can stay true after the user fixes the grid.
    const n = effectiveUploadFileCount.value;
    if (n < 1) return true;
    const lim = props.fileLimit;
    if (typeof lim === 'number' && lim > 0 && n > lim) return true;
    return false;
});
const cancelDisabled = computed(() => effectiveUploadFileCount.value < 1);
const chooseDisabled = computed(() => pc?.chooseDisabled ?? false);

const onFocus = () => pc?.onFocus?.();
const onBlur = () => pc?.onBlur?.();

watch(
    () => props.clearCallback,
    (cb) => {
        const holder = props.fileUploadClearHolder;
        if (holder && typeof cb === 'function') {
            holder.fn = cb;
        }
    },
    { immediate: true }
);
</script>

<template>
    <div class="flex flex-wrap items-center justify-between gap-2 w-full min-w-0">
        <div class="flex flex-wrap items-center gap-2">
            <Button
                type="button"
                icon="pi pi-plus"
                :label="chooseLabel"
                :class="pc?.chooseButtonClass"
                :style="pc?.style"
                :disabled="chooseDisabled"
                :unstyled="pc?.unstyled"
                v-bind="pc?.chooseButtonProps"
                :pt="pc?.ptm?.('pcChooseButton')"
                @click="chooseCallback"
                @keydown.enter="chooseCallback"
                @focus="onFocus"
                @blur="onBlur"
            />
            <Button
                v-if="pc?.showUploadButton !== false"
                type="button"
                icon="pi pi-upload"
                :class="pc?.cx?.('pcUploadButton')"
                :label="uploadLabel"
                :disabled="uploadDisabled"
                :unstyled="pc?.unstyled"
                v-bind="pc?.uploadButtonProps"
                :pt="pc?.ptm?.('pcUploadButton')"
                @click="uploadCallback"
            />
            <Button
                v-if="pc?.showCancelButton !== false"
                type="button"
                icon="pi pi-times"
                :class="pc?.cx?.('pcCancelButton')"
                :label="cancelLabel"
                :disabled="cancelDisabled"
                :unstyled="pc?.unstyled"
                v-bind="pc?.cancelButtonProps"
                :pt="pc?.ptm?.('pcCancelButton')"
                @click="clearCallback"
            />
        </div>
        <div v-if="showViewToggles" class="flex flex-wrap items-center gap-2 shrink-0">
            <IconField iconPosition="left" class="w-40 max-w-full">
                <InputIcon class="pi pi-search" />
                <InputText
                    :model-value="quickFilter"
                    placeholder="Quick filter"
                    class="w-full"
                    size="small"
                    @update:model-value="emit('update:quickFilter', $event)"
                />
            </IconField>
            <Select
                v-if="viewMode === 'list'"
                :model-value="sortOption"
                :options="sortOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Sort"
                class="w-36"
                size="small"
                @update:model-value="emit('update:sortOption', $event)"
            />
            <Button
                type="button"
                icon="pi pi-th-large"
                size="small"
                rounded
                outlined
                :severity="viewMode === 'grid' ? 'primary' : 'secondary'"
                v-tooltip.bottom="'Grid view'"
                aria-label="Grid view"
                :aria-pressed="viewMode === 'grid'"
                @click="emit('update:viewMode', 'grid')"
            />
            <Button
                type="button"
                icon="pi pi-list"
                size="small"
                rounded
                outlined
                :severity="viewMode === 'list' ? 'primary' : 'secondary'"
                v-tooltip.bottom="'List view'"
                aria-label="List view"
                :aria-pressed="viewMode === 'list'"
                @click="emit('update:viewMode', 'list')"
            />
        </div>
    </div>
</template>
