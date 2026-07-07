<script setup>
import { ref, watch, computed, nextTick } from 'vue';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { useComponentStore } from '@/stores/component';

const componentStore = useComponentStore();
const fileUploadRef = ref(null);
/** Bump to remount PrimeVue `FileUpload` — resets `files`, `uploadedFileCount`, and `fileLimit` bookkeeping (clear/slot alone is not enough in v4). */
const fileUploadInstanceKey = ref(0);
const MAX_UPLOAD_FILE_SIZE_BYTES = 25 * 1024 * 1024;
const DEFAULT_FILE_LIMIT = 50;

const DEFAULT_VIEW_MODE_STORAGE_KEY = 'upload-file-grid.view-mode';

function readStoredViewMode(storageKey) {
    if (typeof localStorage === 'undefined') {
        return 'grid';
    }
    try {
        const v = localStorage.getItem(storageKey);
        if (v === 'list' || v === 'grid') {
            return v;
        }
    } catch {
        /* quota / private mode */
    }
    return 'list';
}

function writeStoredViewMode(storageKey, mode) {
    if (typeof localStorage === 'undefined') {
        return;
    }
    try {
        localStorage.setItem(storageKey, mode);
    } catch {
        /* ignore */
    }
}

const emit = defineEmits([
    'upload', 
    'uploading', 
    'uploader',
    'remove',
    'clear',
    'select',
    'clearAll',
    'removeAll',
    'removeAll',
    'removeUploadedFile',
    'update:uploadedFilesData',
    'onFormatChange',
    'showImageModal',
    'reorder:uploadedFiles',
    'delete-files'
]);

const props = defineProps({
    fb: {type : FeedbackHandler},
    url: { type: String, required: true },
    maxFileSize: { type: Number, default: MAX_UPLOAD_FILE_SIZE_BYTES },
    fileLimit: { type: Number, default: DEFAULT_FILE_LIMIT },
    multiple: { type: Boolean, default: true },
    accept: { type: String, default: 'image/*' },
    auto: { type: Boolean, default: true },
    columns: { type: Array, default: [{ field: 'description', header: 'Description' }] },
    uploadedFilesData: { type: Array, default: [] },
    showEditButton: { type: Boolean, default: true },
    showPencilButton: { type: Boolean, default: true },
    imageStyle: { type: String, default: '' },
    showImageModalButton: { type: Boolean, default: false },
    /** localStorage key for persisting grid vs list across reloads (override if multiple grids on one origin need separate prefs). */
    viewModeStorageKey: { type: String, default: DEFAULT_VIEW_MODE_STORAGE_KEY },
    /** When false, PrimeVue Toast is not rendered here (parent view already includes `<Toast />`). */
    includeToastHost: { type: Boolean, default: true },
    permissions: {
        type: Object,
        default: () => ({
            delete: true,
            copyLink: true,
            show: true,
            size: true
        })
    }
});

/** 'grid' | 'list' — list uses the table layout (UploadDatatable). Restored from localStorage when possible. */
const viewMode = ref(readStoredViewMode(props.viewModeStorageKey));
const quickFilter = ref('');
const sortOption = ref('recent_desc');

watch(viewMode, (mode) => {
    writeStoredViewMode(props.viewModeStorageKey, mode);
});

const filesData = computed({
    get: () => props.uploadedFilesData,
    set: (newFiles) => {
        emit('update:uploadedFilesData', newFiles);
    }
});

const sortOptions = [
    { label: 'Manual order', value: 'manual' },
    { label: 'Newest first', value: 'recent_desc' },
    { label: 'Oldest first', value: 'recent_asc' },
    { label: 'Name A-Z', value: 'name_asc' },
    { label: 'Name Z-A', value: 'name_desc' },
    { label: 'Size: largest', value: 'size_desc' },
    { label: 'Size: smallest', value: 'size_asc' }
];

function getDateValue(file) {
    const raw = file?.file?.lastModified ?? file?.lastModified ?? file?.dateAdded;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
}

function compareBySortOption(a, b, option) {
    if (option === 'manual') {
        return 0;
    }
    if (option === 'recent_asc') {
        return getDateValue(a) - getDateValue(b);
    }
    if (option === 'name_asc') {
        return String(a?.name || '').localeCompare(String(b?.name || ''), undefined, { sensitivity: 'base' });
    }
    if (option === 'name_desc') {
        return String(b?.name || '').localeCompare(String(a?.name || ''), undefined, { sensitivity: 'base' });
    }
    if (option === 'size_desc') {
        return (Number(b?.size) || 0) - (Number(a?.size) || 0);
    }
    if (option === 'size_asc') {
        return (Number(a?.size) || 0) - (Number(b?.size) || 0);
    }
    return getDateValue(b) - getDateValue(a);
}

const visibleFilesData = computed(() => {
    const term = quickFilter.value.trim().toLowerCase();
    let list = [...filesData.value];

    if (term) {
        list = list.filter((file) => {
            const name = String(file?.name || '').toLowerCase();
            const type = String(file?.type || file?.file?.type || '').toLowerCase();
            const description = String(file?.description || '').toLowerCase();
            return name.includes(term) || type.includes(term) || description.includes(term);
        });
    }

    if (viewMode.value === 'list' && sortOption.value !== 'manual') {
        list.sort((a, b) => compareBySortOption(a, b, sortOption.value));
    }

    return list;
});

const onSelect = (event) => {
    // Selecting an already-present filename should replace it, not raise a duplicate error.
    props.fb.setError([], 'component.upload.errors');
    if (event.files.length > 0) {
        upsertFiles(event.files, filesData.value);
    }
    nextTick(() => {
        const lim = Number(props.fileLimit);
        if (lim < 1) return;
        const pen = (filesData.value || []).filter((f) => f?.status?.name === 'Pending').length;
        if (pen <= lim) {
            clearPrimeFileUploadValidationMessages();
        }
    });
};

const onRowEditSaveSelected = (event) => {
    filesData.value[event.index].description = event.newData.description;
    console.log(filesData.value);
}

const onRowEditSaveUploaded = (event) => {
    const updatedFiles = [...props.uploadedFilesData];
    if (updatedFiles[event.index]) {
        updatedFiles[event.index].description = event.newData.description;
        emit('update:uploadedFilesData', updatedFiles);
    }
}

// Method to manually trigger file selection dialog
const chooseFiles = () => {
    if (fileUploadRef.value) {
        const fileInput = fileUploadRef.value.$el.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.click();
        }
    }
}

/** PrimeVue header slot’s `clearCallback` — stored so we can try soft-clear before remount. */
const fileUploadClearHolder = { fn: /** @type {null | (() => void)} */ (null) };

function trySoftClearFileUpload() {
    try {
        if (typeof fileUploadClearHolder.fn === 'function') {
            fileUploadClearHolder.fn();
        }
        const fu = fileUploadRef.value;
        if (fu && typeof fu.clear === 'function') {
            fu.clear();
        }
        if (fu) {
            if (typeof fu.uploadedFileCount === 'number') {
                fu.uploadedFileCount = 0;
            }
            const list = fu.files;
            if (Array.isArray(list) && list.length > 0) {
                list.splice(0, list.length);
            }
            const msgs = fu.messages;
            if (Array.isArray(msgs) && msgs.length > 0) {
                msgs.splice(0, msgs.length);
            }
        }
        if (fu && fu.$el) {
            const input = fu.$el.querySelector('input[type="file"]');
            if (input) input.value = '';
        }
    } catch (e) {
        console.error('Error soft-resetting FileUpload:', e);
    }
}

function clearPrimeFileUploadValidationMessages() {
    const fu = fileUploadRef.value;
    if (fu && Array.isArray(fu.messages) && fu.messages.length > 0) {
        fu.messages.splice(0, fu.messages.length);
    }
}

/** Full reset for `fileLimit`: new FileUpload instance (parent `uploadedFilesData` unchanged). */
function remountFileUploadWidget() {
    fileUploadClearHolder.fn = null;
    fileUploadInstanceKey.value += 1;
}

/** Backwards compatible name — remounts the widget so the next batch respects `fileLimit`. */
function resetPrimeFileSelection() {
    trySoftClearFileUpload();
    remountFileUploadWidget();
}

const pendingUploadCount = computed(
    () => (props.uploadedFilesData || []).filter((f) => f?.status?.name === 'Pending').length
);

/**
 * Remount FileUpload only when the last pending row is gone — not on every row delete.
 * Remounting on partial delete clears PrimeVue’s internal `files` while the grid still has
 * pending `File` objects, so Upload would otherwise emit an empty list.
 */
watch(
    pendingUploadCount,
    (pending, prev) => {
        if (prev === undefined) return;
        const lim = Number(props.fileLimit);
        if (lim > 0 && prev > lim && pending <= lim) {
            props.fb.setError([], 'component.upload.errors');
            nextTick(() => {
                clearPrimeFileUploadValidationMessages();
            });
        }
        if (prev > 0 && pending === 0) {
            nextTick(() => {
                remountFileUploadWidget();
            });
        }
    },
    { flush: 'post' }
);

function getPendingNativeFilesForUpload() {
    return (props.uploadedFilesData || [])
        .filter((f) => f?.status?.name === 'Pending' && f?.file != null)
        .map((f) => f.file);
}

const onUpload = (event) => {
    const fromPrime = Array.isArray(event?.files) ? event.files : [];
    const fromGrid = getPendingNativeFilesForUpload();
    /** Grid is source of truth (stays in sync when user removes rows; Prime list can be empty after remount / fileLimit). */
    const rawFiles = fromGrid.length > 0 ? fromGrid : fromPrime;
    if (rawFiles.length === 0) {
        return;
    }

    const files = [];
    rawFiles.forEach((file, index) => {
        files.push({
            file: file,
            index: index
        });
    });

    emit('upload', { files: files });
    // Defer until after PrimeVue finishes the uploader tick; remount resets `uploadedFileCount` / `fileLimit`.
    nextTick(() => {
        trySoftClearFileUpload();
        remountFileUploadWidget();
    });
};

const upsertFiles = (files, data) => {
    const batchId = Date.now();
    const replaceVersion = batchId;
    files.forEach((file, fileIndex) => {
        const nextFileData = {
            id: `_new_${batchId}_${fileIndex}`,
            name: file.name,
            size: file.size,
            type: file.type,
            objectURL: file.objectURL,
            file: file,
            previewVersion: replaceVersion + fileIndex,
            status: { name: 'Pending', severity: 'warning' }
        };
        const existingIndex = data.findIndex((existingFile) => existingFile.name === file.name);
        if (existingIndex !== -1) {
            data.splice(existingIndex, 1, nextFileData);
            return;
        }
        data.push(nextFileData);
    });
    emit('update:uploadedFilesData', data);
}


const onRemove = (event, removeFileCallback, _slotIndex) => {
    const { file, index } = event;
    const list = filesData.value;
    const byRef = list.findIndex((f) => f === file);
    const byName = list.findIndex((f) => f?.name === file?.name);
    const ix = byRef !== -1 ? byRef : byName !== -1 ? byName : index;
    if (ix < 0 || ix >= list.length) {
        return;
    }
    list.splice(ix, 1);
    removeFileCallback(ix);
};
const showImageModal = (event) => {
    const {file, files, index} = event;
    emit('showImageModal', {file, files, index});
};

const onRemoveUploadedFile = async (file, index) => {
    try {
        if (file.image || file.name) {
            console.log('Deleting file with filename:', file.image | file.name);
            // Update the parent component
            emit('removeUploadedFile', file);
        } else {
            console.error('Could not extract filename from file:', file);
        }
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};
const deleteFiles = (files) => {
    console.log('deleteFiles', files);
    emit('delete-files', files);
}

const onFormatChange = (file) => {
    emit('onFormatChange', file);
}

// Expose methods to parent components
const clear = () => {
    // Try to call PrimeVue FileUpload.clear() if available
    try {
        if (typeof fileUploadClearHolder.fn === 'function') {
            fileUploadClearHolder.fn();
        }
        if (fileUploadRef.value && typeof fileUploadRef.value.clear === 'function') {
            fileUploadRef.value.clear();
        } else if (fileUploadRef.value && fileUploadRef.value.$el) {
            // Fallback: reset native input
            const input = fileUploadRef.value.$el.querySelector('input[type="file"]');
            if (input) input.value = '';
        }

        // Clear internal filesData and notify parent
        if (Array.isArray(filesData.value)) {
            filesData.value.splice(0, filesData.value.length);
            emit('update:uploadedFilesData', filesData.value);
        }

        emit('clear');
        nextTick(() => {
            remountFileUploadWidget();
        });
    } catch (e) {
        console.error('Error clearing file upload:', e);
    }
}

const onReorderFiles = (reordered) => {
    console.log('onReorderFiles grid', reordered);
    filesData.value = [...reordered];
    sortOption.value = 'manual';
    emit('reorder:uploadedFiles', reordered);
};

defineExpose({ clear, resetPrimeFileSelection, remountFileUploadWidget });

</script>
  
<template>
    <Toast v-if="includeToastHost" />
    <FileUpload 
        :key="fileUploadInstanceKey"
        ref="fileUploadRef"
        @select="onSelect($event)"
        @uploader="onUpload($event)" 
        :multiple="props.multiple" 
        :accept="props.accept" 
        :auto="false"
        customUpload
        :maxFileSize="props.maxFileSize"
        :fileLimit="props.fileLimit"
    >
        <template #header="{ files, chooseCallback, uploadCallback, clearCallback }">
            <UploadFileGridHeaderRow
                :file-upload-files="files"
                :file-limit="props.fileLimit"
                :pending-upload-count="pendingUploadCount"
                :file-upload-clear-holder="fileUploadClearHolder"
                :choose-callback="chooseCallback"
                :upload-callback="uploadCallback"
                :clear-callback="clearCallback"
                :show-view-toggles="filesData.length > 0"
                v-model:view-mode="viewMode"
                v-model:quick-filter="quickFilter"
                v-model:sort-option="sortOption"
                :sort-options="sortOptions"
            />
        </template>

        <template #content="{index, removeFileCallback, messages }">
            <template v-if="visibleFilesData.length > 0">
                <UploadGrid
                    v-if="viewMode === 'grid'"
                    :files="visibleFilesData"
                    :messages="(props.fb.errors['component.upload.errors']||[]).concat(messages||[])"
                    :columns="columns"
                    :fb="props.fb"
                    :show-edit-button = "props.showEditButton"
                    :show-pencil-button = "props.showPencilButton"
                    :imageStyle="props.imageStyle"
                    :showImageModalButton="props.showImageModalButton"
                    @removeUploadedFileCallback="onRemoveUploadedFile"
                    @onRowEditSave="removeFileCallback"
                    @removeFileCallback="onRemove($event, removeFileCallback, index)"
                    @onFormatChange="onFormatChange($event)"
                    @showImageModal="showImageModal($event)"
                />
                
                <UploadDatatable
                    v-else
                    @reorderFiles="onReorderFiles"
                    :files="visibleFilesData"
                    :messages="(props.fb.errors['component.upload.errors']||[]).concat(messages||[])"
                    :columns="columns"
                    :fb="props.fb"
                    @delete-files="deleteFiles"
                    @onRowEditSave="removeFileCallback"
                    @removeFileCallback="onRemove($event, removeFileCallback, index)"
                    @showImageModal="showImageModal($event)"
                    :permissions=props.permissions
                />
            </template>
            <div v-else>
                <span>{{ filesData.length > 0 ? 'No files match your filter.' : 'Drag and drop files to here to upload.' }}</span>
            </div>
            <div v-if="fb.errors['media.files.upload.to.folder']">
                <div class="text-red-500">{{ fb.errors['media.files.upload.to.folder'] }}</div>
            </div>
        </template>
    </FileUpload>
</template>