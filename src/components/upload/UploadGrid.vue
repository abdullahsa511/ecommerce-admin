<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { mediaUrl } from '@/utils/mediaUrl';
const emit = defineEmits([
    'onRowEditSave',
    'removeFileCallback',
    'removeUploadedFileCallback',
    'onFormatChange',
    'showImageModal'
]);

const props = defineProps({
    fb: {type : FeedbackHandler},
    files: { type: Array, required: true },
    columns: { type: Array, required: true },
    messages: { type: Array, required: true, default: [] },
    showEditButton: { type: Boolean, default: false },
    showPencilButton: { type: Boolean, default: true },
    imageStyle: { type: String, default: '' },
    showImageModalButton: { type: Boolean, default: false }
});

const editingRows = ref([]);
// Key by File reference — avoids wrong previews when size/lastModified exceed safe integers
// or collide when string-concatenated (name+size+time).
const blobUrls = ref(/** @type {Map<File, string>} */ (new Map()));

const filesData = computed(() => {
    return props.files.map(file => {
        for(const col of props.columns) {
            file[col.field] = file[col.field] || "";
        }
        return file;
    })
});

const onRemove = (file, index) => {
    emit('removeFileCallback', {file, index});    
};

const showImageModal = (file, index) => {
    emit('showImageModal', {file, index});    
};

const onRemoveUploadedFile = (file, index) => {
    emit('removeUploadedFileCallback', file, index);
};

const onRowEditSave = (event) => {
   emit('onRowEditSave', event);
}

const formatSize = (bytes) => {
    const k = 1024;
    const dm = 3;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    if (bytes === 0) {
        return '0 ' + sizes[0];
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return formattedSize + ' ' + sizes[i];
};

const isPdf = (file) => {
    // Checks if the file is a PDF by MIME type or by extension
    const fileType = file.type || file.file?.type;
    const fileName = file.name || file.file?.name;
    const objectURL = file.objectURL;
    
    return fileType === 'application/pdf' || 
           (objectURL && objectURL.toLowerCase().endsWith('.pdf')) ||
           (fileName && fileName.toLowerCase().endsWith('.pdf'));
}

const isZip = (file) => {
    const fileType = (file.type || file.file?.type || '').toLowerCase();
    const fileName = (file.name || file.file?.name || '').toLowerCase();
    const objectURL = typeof file.objectURL === 'string' ? file.objectURL.toLowerCase() : '';

    return (
        fileType === 'application/zip' ||
        fileType === 'application/x-zip-compressed' ||
        fileName.endsWith('.zip') ||
        objectURL.endsWith('.zip')
    );
};

/** Same asset as `FILE_FORMAT_IMAGES['ZIP']` in `@/models/DesignResource.ts` */
const zipIconSrc = mediaUrl('/media/design-resource/icons/zip.png');

/** Same paths as `FILE_FORMAT_IMAGES` (GSM, DWG, MAX, SKP, RFA) in `@/models/DesignResource.ts` */
const CAD_FORMAT_ICON = {
    gsm: mediaUrl('/media/design-resource/icons/gsm.png'),
    rfa: mediaUrl('/media/design-resource/icons/rfa.png'),
    skp: mediaUrl('/media/design-resource/icons/skp.png'),
    dwg: mediaUrl('/media/design-resource/icons/dwg.png'),
    max: mediaUrl('/media/design-resource/icons/max.png'),
    lcf: mediaUrl('/media/design-resource/icons/lcf.webp'),
};

/**
 * Preview icon from the selected `file.format` (e.g. model attach dropdown: SKP, ZIP, …).
 * Takes precedence over filename so the thumbnail updates when the user changes format.
 */
const formatIconFromSelection = (file) => {
    const raw = file?.format;
    if (raw == null || String(raw).trim() === '') return null;
    const key = String(raw).trim().toLowerCase();
    if (key === 'zip') {
        return { src: zipIconSrc, label: 'ZIP' };
    }
    if (Object.prototype.hasOwnProperty.call(CAD_FORMAT_ICON, key)) {
        return { src: CAD_FORMAT_ICON[key], label: key.toUpperCase() };
    }
    return null;
};

const cadFormatPreview = (file) => {
    const fileName = (file.name || file.file?.name || '').toLowerCase();
    const objectURL = typeof file.objectURL === 'string' ? file.objectURL.toLowerCase() : '';
    let ext = '';
    const nameMatch = fileName.match(/\.([^.]+)$/);
    if (nameMatch) {
        ext = nameMatch[1];
    } else {
        const urlMatch = objectURL.match(/\.([^.?#]+)(?:\?|#|$)/);
        if (urlMatch) ext = urlMatch[1];
    }
    if (!ext || !Object.prototype.hasOwnProperty.call(CAD_FORMAT_ICON, ext)) return null;
    const label = ext.toUpperCase();
    return { src: CAD_FORMAT_ICON[ext], label };
};

/** ZIP / CAD / GSM thumbnail: selected format first, then .zip by filename, then extension. */
const resolveFormatPreview = (file) => {
    const fromSelection = formatIconFromSelection(file);
    if (fromSelection) return fromSelection;
    if (isZip(file)) {
        return { src: zipIconSrc, label: 'ZIP' };
    }
    return cadFormatPreview(file);
};

/** Per-row format thumbnail; depends on `file.format` so dropdown changes refresh the icon. */
const formatPreviews = computed(() => props.files.map((file) => resolveFormatPreview(file)));

// Convert PDF URLs to use proxy (same origin) to bypass CSP frame-ancestors restriction
const getPdfUrl = (file, addPageHash = true) => {
    let url = file?.objectURL;
    
    // If no objectURL exists but we have a File object, create a blob URL
    if (!url && file?.file instanceof File) {
        const f = file.file;
        if (!blobUrls.value.has(f)) {
            url = URL.createObjectURL(f);
            blobUrls.value.set(f, url);
        } else {
            url = blobUrls.value.get(f);
        }
    }
    
    if (!url) return '';

    url = mediaUrl(url);

    try {
        // If URL contains localhost:8089 or 127.0.0.1:8089, convert to relative path to use proxy
        if (url.includes('localhost:8089') || url.includes('127.0.0.1:8089')) {
            const urlObj = new URL(url);
            // Return relative path which will be proxied through Vite
            let path = urlObj.pathname + urlObj.search;
            // Add page hash if requested and not already present
            if (addPageHash && !urlObj.hash) {
                path += '#page=1';
            } else if (urlObj.hash) {
                path += urlObj.hash;
            }
            return path;
        }
        // For non-proxied URLs (including blob URLs), add page hash if needed
        if (addPageHash && !url.includes('#page=') && !url.includes('#')) {
            return url + '#page=1';
        }
        return url;
    } catch (e) {
        // If URL parsing fails, return original with page hash if needed
        if (addPageHash && !url.includes('#page=') && !url.includes('#')) {
            return url + '#page=1';
        }
        return url;
    }
};

// Get image URL from file object or File blob
const getImageUrl = (file) => {
    if (file?.objectURL) {
        return getCacheSafeUrl(file.objectURL, file);
    }

    if (file?.image) {
        return getCacheSafeUrl(file.image, file);
    }

    if (file?.file instanceof File) {
        const f = file.file;
        if (!blobUrls.value.has(f)) {
            const url = URL.createObjectURL(f);
            blobUrls.value.set(f, url);
            return url;
        }
        return blobUrls.value.get(f);
    }

    return '';
};

const getCacheSafeUrl = (url, file) => {
    if (!url || typeof url !== 'string') return '';
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;

    url = mediaUrl(url);

    const version =
        file?.previewVersion ??
        file?.updated_at ??
        file?.updatedAt ??
        file?.lastModified ??
        file?.file?.lastModified;

    if (!version) return url;

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${encodeURIComponent(String(version))}`;
};

const rowKey = (file, idx) => {
    return [
        file?.id ?? file?.name ?? idx,
        file?.previewVersion ?? '',
        file?.objectURL ?? file?.image ?? ''
    ].join('|');
};

const renderClass = computed(() => {
    return props.imageStyle ? props.imageStyle : 'rounded-t-lg';
});

const renderLoadingClass = (file, className) => {
    return file.loading ? 'pi pi-spinner pi-spin' : className;
};

const onFormatChange = (file) => {
    file.isEditing = false;
    emit('onFormatChange', file);
}

// Cleanup blob URLs when component unmounts
onBeforeUnmount(() => {
    blobUrls.value.forEach(url => {
        URL.revokeObjectURL(url);
    });
    blobUrls.value.clear();
});

const downloadModel = (file, idx) => {
    // download the model file
    const url = file.objectURL;
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    // console.log('downloading model:', file);
}
</script>

<template>
    <div class="flex flex-wrap gap-6">
        <div v-for="(file, idx) in filesData" :key="rowKey(file, idx)" class="bg-white rounded-lg shadow p-2 flex flex-col w-full sm:w-56">
                <div class="w-full aspect-video flex-shrink-0 rounded-t-lg overflow-hidden bg-gray-50 flex justify-center">
                    <iframe 
                        v-if="isPdf(file)" 
                        :src="getPdfUrl(file, true)" 
                        type="application/pdf" 
                        width="100%" 
                        height="600px" 
                        class="border-0" 
                        frameborder="0"
                        allow="fullscreen"
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <div
                        v-else-if="formatPreviews[idx]"
                        class="w-full aspect-video flex-shrink-0 rounded-t-lg overflow-hidden bg-gray-50 flex justify-center"
                        role="img"
                        :aria-label="`${formatPreviews[idx].label} file: ${file.name}`"
                    >
                        <img
                            :src="formatPreviews[idx].src"
                            alt=""
                            class="max-h-full max-w-[min(100%,10rem)] w-auto object-contain select-none"
                            draggable="false"
                        />
                    </div>
                    <img v-else :src="getImageUrl(file)" :class="(file.data_type == 'models' ? '' : (file.data_type != 'none' ? renderClass: 'rounded-t-lg object-cover' ))" />
                </div>
                <div class="p-3">
                    <div class="flex flex-col">
                        <div class="text-surface-900 dark:text-surface-0 text-xs mb-1 whitespace-normal break-all leading-4">{{ file.name }}</div>
                        <div v-if="file.size" class="text-surface-600 dark:text-surface-200 text-sm">{{ formatSize(file.size) }}</div>
                        <div v-if="file.format && !file.isEditing" class="text-surface-600 dark:text-surface-200 text-sm">{{ file.format }}</div>
                        <div v-if="file.formats && file.isEditing" class="text-surface-600 dark:text-surface-200 text-sm">
                            <Select v-model="file.format" :options="file.formats" class="w-full text-sm border border-gray-200 rounded-md p-0" 
                            @change="onFormatChange(file)" />
                        </div>
                        <div class="flex items-center justify-between mt-3">
                            <div class="flex items-center gap-2">
                                <div v-if="showPencilButton">
                                    <Button v-if="showEditButton && !file.isEditing" 
                                    id="image-edit" 
                                    icon="pi pi-pencil" 
                                    class="p-button-text p-button-sm !p-1" 
                                    severity="secondary" 
                                    @click="file.isEditing = true" />

                                    <Button v-else="showEditButton && !file.isEditing" 
                                    id="cancel-edit" 
                                    icon="pi pi-times" 
                                    class="p-button-text p-button-sm !p-1" 
                                    severity="secondary" 
                                    @click="file.isEditing = false" />
                                </div>
                                <ProgressBar
                                    v-if="
                                        fb.loading['media.files.upload'+file.id] ||
                                        fb.loading['media.files.delete'+file.id] ||
                                        file.loading
                                    "
                                    mode="indeterminate"
                                    style="height: 6px; width: 60px"
                                    class="mb-1"
                                />
                                <Button v-else-if="file.status.name === 'Uploaded'" :icon="renderLoadingClass(file, 'pi pi-trash')" class="p-button-text p-button-sm !p-1" 
                                    :disabled="file.loading"
                                    @click="onRemoveUploadedFile(file, idx)" outlined rounded severity="danger" />
                                <Button v-else icon="pi pi-trash" class="p-button-text p-button-sm !p-1" @click="onRemove(file, idx)" outlined rounded severity="danger" />        
                                <Button v-if="showImageModalButton && file.data_type != 'models'" icon="pi pi-eye" class="p-button-text p-button-sm !p-1" @click="showImageModal(file, idx)" outlined rounded severity="danger" />        
                                <Button v-if="showImageModalButton && file.data_type == 'models'" icon="pi pi-download" class="p-button-text p-button-sm !p-1" @click="downloadModel(file, idx)" outlined rounded severity="danger" />        
                            </div>
                            <div class="flex items-center gap-2">
                                <span v-if="file.status.name === 'Uploaded'" class="text-green-500">
                                    <span v-if="!showImageModalButton"> Uploaded </span>
                                    <i class="pi pi-check"></i>
                                </span>
                                <span v-else class="text-yellow-500 flex items-center gap-2">
                                    Pending
                                    <i class="pi pi-clock"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
    <div v-if="messages?.length > 0">
        <Message v-for="message of messages" :key="message" severity="error" closable>
            {{ message }}
        </Message>
    </div>
</template>