<script setup>
import { ref, watch, computed, onBeforeUnmount } from 'vue';
import FeedbackHandler from '@/utils/FeedbackHandler';
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
    showEditButton: { type: Boolean, default: true },
    imageStyle: { type: String, default: '' },
    showImageModalButton: { type: Boolean, default: false }
});

const editingRows = ref([]);
const blobUrls = ref(new Map()); // Store blob URLs for cleanup

const filesData = computed(() => {
    return props.files.map(file => {
        for(const col of props.columns) {
            file[col.field] = file[col.field] || "";
        }
        return file;
    })
})

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
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
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

// Convert PDF URLs to use proxy (same origin) to bypass CSP frame-ancestors restriction
const getPdfUrl = (file, addPageHash = true) => {
    let url = file?.objectURL;
    
    // If no objectURL exists but we have a File object, create a blob URL
    if (!url && file?.file instanceof File) {
        // Check if we already created a blob URL for this file
        const fileKey = file.file.name + file.file.size + file.file.lastModified;
        if (!blobUrls.value.has(fileKey)) {
            url = URL.createObjectURL(file.file);
            blobUrls.value.set(fileKey, url);
        } else {
            url = blobUrls.value.get(fileKey);
        }
    }
    
    if (!url) return '';
    
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
        return file.objectURL;
    }
    
    // If no objectURL exists but we have a File object, create a blob URL
    if (file?.file instanceof File) {
        const fileKey = file.file.name + file.file.size + file.file.lastModified;
        if (!blobUrls.value.has(fileKey)) {
            const url = URL.createObjectURL(file.file);
            blobUrls.value.set(fileKey, url);
            return url;
        }
        return blobUrls.value.get(fileKey);
    }
    
    return '';
};

const renderClass = computed(() => {
    return props.imageStyle ? props.imageStyle : 'rounded-t-lg object-cover h-64 w-full';
});

const renderLoadingClass = (file, className) => {
    return file.loading ? 'pi pi-spinner pi-spin' : className;
};

const onFormatChange = (file) => {
    emit('onFormatChange', file);
}

// Cleanup blob URLs when component unmounts
onBeforeUnmount(() => {
    blobUrls.value.forEach(url => {
        URL.revokeObjectURL(url);
    });
    blobUrls.value.clear();
});
watch(props.files, (newVal) => {
    console.log('files:', newVal);
}, {deep: true});

</script>

<template>
    <div class="flex flex-wrap gap-6">
        <div v-for="(file, idx) in filesData" :key="idx" class="bg-white rounded-lg shadow p-2 flex flex-col w-full sm:w-56">
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
                        referrerpolicy="no-referrer-when-downgrade"></iframe>
                    <div v-else-if="isOtherFile(file)">
                        <img :src="getOtherFileIcon(file)" :class="otherFileIconClass" />
                    </div>
                    <img v-else :src="getImageUrl(file)" :class="renderClass" />
                </div>
                <div class="p-3">
                    <div class="flex flex-col">
                        <div class="text-surface-900 dark:text-surface-0 font-medium mb-1 truncate">{{ file.name }}</div>
                        <div v-if="file.size" class="text-surface-600 dark:text-surface-200 text-sm">{{ formatSize(file.size) }}</div>
                        <div v-if="file.format && !file.isEditing" class="text-surface-600 dark:text-surface-200 text-sm">{{ file.format }}</div>
                        <div v-if="file.format && file.isEditing" class="text-surface-600 dark:text-surface-200 text-sm">
                            <Select v-model="file.format" :options="file.formats" class="w-full text-sm border border-gray-200 rounded-md p-0" 
                            @change="onFormatChange(file)" />
                        </div>
                        <div class="flex items-center justify-between mt-3">
                            <div class="flex items-center gap-2">
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
                                <Button v-if="showImageModalButton" icon="pi pi-eye" class="p-button-text p-button-sm !p-1" @click="showImageModal(file, idx)" outlined rounded severity="danger" />        
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