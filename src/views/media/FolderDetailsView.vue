<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMediaStore } from '@/stores/media';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
// @ts-ignore
import UploadFileGrid from '@/components/upload/UploadFileGrid.vue';
import { useToast } from 'primevue/usetoast';
import { FileUploadEvent } from '@/models/File';
import { mediaUrl } from '@/utils/mediaUrl';

const emit = defineEmits(['showAddFolderModal']);

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    breadcrumb: {
        type: String,
        required: false,
        default: ''
    }
});
const visible = ref(false);

const route = useRoute();
const router = useRouter();
const mediaStore = useMediaStore();
const { currentFolder, subFolders, folderFiles, breadcrumbs } = storeToRefs(mediaStore);
const toast = useToast();
const previousFolder = ref(null);

const { fb: mediaFb } = storeToRefs(mediaStore);
const imageModalFile = ref<any>(null);
const imageModalFiles = ref<any[]>([]);
const currentPreviewIndex = ref(0);
const acceptFileFormates = ref('image/*,video/mp4,.mp4,application/pdf,application/acad,application/dwg,application/max,application/skp,application/rfa,.dwg,.skp,.rfa,.max,application/zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,image/vnd.dwg,application/octet-stream,.lcf');

onBeforeMount(async () => {
    const breadcrumb = route.params.breadcrumb as string | null;
    await mediaStore.fetchSubFolders(parseInt(route.params.id as string), breadcrumb);
});

async function onRemoveFile(removeFile: any) {
    try {
        await mediaStore.deleteFile(removeFile.id, currentFolder.value);
    } catch (err) {
        console.error('Error removing file:', err);
    }
}

const onFolderClick = async (folder: any) => {
    previousFolder.value = currentFolder.value.media_id;
    await mediaStore.fetchSubFolders(folder.media_id, null);
    router.push(`/files-folders/folder/${folder.media_id}`);
};

const onSubFolderClick = async (folder: any, parentId: string, breadcrumb: string) => {
    const breadcrumbString = breadcrumb ? breadcrumb + '/' + folder.name : folder.name;
    await mediaStore.fetchSubFolders(parentId, breadcrumbString);
    router.push(`/files-folders/folder/${parentId}/${breadcrumbString}`);
};

const onSubFolderClickBreadcrumb = async (parentId: string, breadcrumb: string) => {
    if (breadcrumb === 'media') {
        router.push(`/files-folders`);
    } else {
        await mediaStore.fetchSubFolders(parentId, breadcrumb);
        router.push(`/files-folders/folder/${parentId}/${breadcrumb}`);
    }
};

const uploadImages = async (event: FileUploadEvent) => {
    try {
        const uploadedSourceNames = new Set(
            (event.files || [])
                .map((entry: any) => entry?.file?.name || entry?.name)
                .filter(Boolean)
        );

        const result: any = await mediaStore.uploadFilesToFolder(
            event.files,
            parseInt(route.params.id as string),
            currentFolder.value
        );

        // folderFiles.value = result.files;
        let files = Array.isArray(result.files) ? result.files : [result.files];

        if (uploadedSourceNames.size > 0) {
            folderFiles.value = folderFiles.value.filter((existing: any) => {
                const isPending = existing?.status?.name === 'Pending';
                return !(isPending && uploadedSourceNames.has(existing?.name));
            });
        }

        const uploadVersion = Date.now();
        files.forEach((file: any, fileIndex: number) => {
            file.previewVersion = uploadVersion + fileIndex;
            const index = folderFiles.value.findIndex(
                (img: any) => img.name === file.name
            );

            if (index !== -1) {
                folderFiles.value[index] = file;
            } else {
                folderFiles.value.push(file);
            }
        });
        // remove event.files from the event
        // event.files = event.files.filter((file: any) => !file.media_id);
        event.files = []; // clear uploaded files

        const count = files.filter(Boolean).length;
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: count === 1 ? 'File uploaded successfully' : 'Files uploaded successfully',
            life: 3000
        });
    } catch (error) {
        console.error('Error uploading images:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to upload file(s). Please try again.',
            life: 3000
        });
    }
};

const deleteFiles = async (files: any) => {
    currentFolder.value
    await mediaStore.deleteFiles(currentFolder.value, files);
}

// Delete image handler
const deleteImage = async (file: any) => {
    try {
        await mediaStore.deleteFile(parseInt(route.params.id as string), currentFolder.value + '/' + file.name);
        let index = folderFiles.value.findIndex((img: any) => img.name === file.name);

        if (index !== -1) {
            folderFiles.value.splice(index, 1);
        }

        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Image removed successfully',
            life: 3000
        });
    } catch (error) {
        console.error('Error deleting image:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete image. Please try again.',
            life: 3000
        });
    }
};

const currentPreviewFile = computed(() => {
    if (!imageModalFiles.value.length) return imageModalFile.value;
    return imageModalFiles.value[currentPreviewIndex.value] || imageModalFiles.value[0];
});

const hasMultiplePreviewFiles = computed(() => imageModalFiles.value.length > 1);

const getCacheSafeUrl = (file: any) => {
    let url = file?.objectURL || file?.image || '';
    if (!url || typeof url !== 'string') return '';
    if (url.startsWith('blob:') || url.startsWith('data:')) return url;

    url = mediaUrl(url);

    const version =
        file?.previewVersion ??
        file?.updated_at ??
        file?.updatedAt ??
        file?.lastModified;

    if (!version) return url;

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${encodeURIComponent(String(version))}`;
};

const showImageModal = (event: any) => {
    const incomingFiles = Array.isArray(event?.files) ? event.files.filter(Boolean) : [];
    if (incomingFiles.length > 0) {
        imageModalFiles.value = incomingFiles;
        imageModalFile.value = incomingFiles[0];
        currentPreviewIndex.value = 0;
    } else {
        imageModalFile.value = event?.file || null;
        imageModalFiles.value = imageModalFile.value ? [imageModalFile.value] : [];
        currentPreviewIndex.value = 0;
    }
    visible.value = !!currentPreviewFile.value;
};

const onFormatChange = (file: any) => {
    folderFiles.value = folderFiles.value.map((f: any) => {
        if (f.name === file.name) {
            f.format = file.format;
        }
        return f;
    });
}
const showPencilButton = computed(() => {
    return folderFiles.value.some((f: any) => f.data_type === 'models');
});
</script>

<template>
    <div class="folder-details-root">
        <div
            v-if="mediaFb.loading['media.files.upload.to.folder']"
            class="loading-overlay folder-upload-overlay"
        >
            <div class="flex flex-col justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Uploading files. Please wait.</p>
            </div>
        </div>
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 md:col-span-5 xl:col-span-3">
                <div class="card">
                    <div class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-4">Media</div>
                    <ul class="list-none p-0 m-0">
                        <li 
                            v-for="(folder, i) in mediaStore.folders" :key="i" 
                            :class="['p-4 mb-4 flex items-center justify-between cursor-pointer rounded border border-[#f1f1f1] hover:bg-[#e6e6e6]',
                            folder.media_id == parseInt(route.params.id as string) ? 'bg-[#e6e6e6]' : 'bg-transparent', mediaFb.loading['media.subFolders.' + folder.media_id] ? 'p-disabled' : '']"
                            @click="onFolderClick(folder)"
                            >
                            <div class="flex items-center">
                                <img :src="mediaUrl('/media/folder.png')" alt="folder icon" class="w-8 h-8 mr-4"
                                v-if="!mediaFb.loading[`media.subFolders.${folder.media_id}`]">
                                <i v-else class="text-2xl mr-4 pi pi-spinner pi-spin" />
                                <span class="text-lg font-medium">{{ folder.name }}</span>
                            </div>
                            <span class="text-lg font-bold">{{ folder.file_count }}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-span-12 md:col-span-7 xl:col-span-9">
                <div class="card">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <img :src="mediaUrl('/media/open-folder.png')" alt="folder icon" class="w-8 h-8 mr-4" />
                            <div class="text-surface-900 dark:text-surface-0 text-xl font-semibold">
                                <template v-for="(breadcrumb, index) in breadcrumbs" :key="index">
                                    <span v-if="breadcrumb.path === '#'">
                                        {{ breadcrumb.name }}
                                    </span>
                                    <a v-else href="javascript:void(0)"
                                        @click="onSubFolderClickBreadcrumb(route.params.id as string, breadcrumb.path)"
                                        class="cursor-pointer hover:underline">
                                        {{ breadcrumb.name }}
                                    </a>
                                    <span v-if="index < breadcrumbs.length - 1"> / </span>
                                </template>
                            </div>
                            <Button label="Add Folder" icon="pi pi-plus" class="ml-4" size="small"
                                @click="emit('showAddFolderModal')" />
                        </div>
                    </div>

                    <div v-if="mediaFb.loading['media.subFolders.' + parseInt(route.params.id as string)]" class="loading flex justify-center items-center">
                        <img :src="mediaUrl('/media/loading.gif')" alt="loading" style="width: 40px; height: 40px;">
                    </div>
                    <div v-else-if="mediaFb.errors['media.subFolders.' + route.params.id]" class="error">
                        {{ mediaFb.errors['media.subFolders.' + route.params.id] }}
                    </div>
                    <div v-else>
                        <div v-if="subFolders?.length === 0 && folderFiles?.length === 0" class="empty-folder">
                            This folder is empty
                        </div>
                        <div v-else>
                            <div class="grid grid-cols-12 gap-4 mb-4" v-if="subFolders?.length > 0">
                                <div v-for="folder in subFolders" :key="folder.id"
                                    class="col-span-12 md:col-span-6 xl:col-span-4">
                                    <div class="p-4 border border-surface-200 dark:border-surface-700 flex items-center justify-between hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer rounded"
                                        @click="onSubFolderClick(folder, route.params.id as string, currentFolder)">
                                        <div class="flex items-center">
                                            <img :src="mediaUrl('/media/folder.png')" alt="folder icon" class="w-8 h-8 mr-4"
                                                v-if="!mediaFb.loading[`media.folders.delete.${folder.media_id}`]">
                                            <i v-else class="text-2xl mr-4 pi pi-spinner pi-spin" />
                                            <span class="text-surface-900 dark:text-surface-0 text-lg font-medium">{{
                                                folder.name }}</span>
                                        </div>
                                        <span class="text-surface-600 dark:text-surface-200 text-lg font-semibold">{{
                                            folder.file_count
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                            <!-- <div v-if="false"
                                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                                <div v-for="file in folderFiles" :key="file?.id"
                                    class="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
                                    <div class="flex flex-col">
                                        <div class="w-full aspect-video flex-shrink-0 rounded-t-lg overflow-hidden">
                                            {{ file?.path }}
                                            <img v-if="file?.type === 'file'" :src="file?.path" :alt="file?.name"
                                                class="w-full h-full object-cover" />
                                            <div v-else
                                                class="w-full h-full flex items-center justify-center bg-surface-100 dark:bg-surface-800">
                                                <i :class="file?.icon"
                                                    class="text-4xl text-surface-600 dark:text-surface-400"></i>
                                            </div>
                                        </div>
                                        <div class="p-3">
                                            <div class="flex flex-col">
                                                <div class="text-surface-900 dark:text-surface-0 font-medium mb-1 truncate">
                                                    {{ file?.name }}</div>
                                                <div class="text-surface-600 dark:text-surface-200 text-sm">{{
                                                    file?.fileSize
                                                    }}
                                                </div>
                                                <div class="flex items-center justify-between mt-3">
                                                    <div class="flex items-center gap-2">
                                                        <Button icon="pi pi-pencil" class="p-button-text p-button-sm !p-1"
                                                            severity="secondary" />
                                                        <Button icon="pi pi-trash" class="p-button-text p-button-sm !p-1"
                                                            severity="danger" @click="onRemoveFile(file)" />
                                                    </div>
                                                    <Checkbox v-model="file.selected" :binary="true" class="!w-4 !h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> -->
                        </div>
                    </div>

                    <div class="card" v-if="!mediaFb.loading['media.subFolders']" style="border: none; padding:0">
                        <UploadFileGrid 
                            :showImageModalButton="true" 
                            :url="'/api/upload'" 
                            :maxFileSize="47185920"
                            :fileLimit="50"
                            :multiple="true" 
                            :showPencilButton="showPencilButton" 
                            :accept="acceptFileFormates" 
                            :auto="true"
                            :include-toast-host="false"
                            :fb="mediaFb" 
                            v-model:uploadedFilesData="folderFiles"
                            @upload="uploadImages"
                            @onFormatChange="onFormatChange($event)"
                            @removeUploadedFile="deleteImage($event)"
                            @showImageModal="showImageModal($event)"
                            @delete-files="deleteFiles"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Dialog v-model:visible="visible" modal header="Media Preview" maximizable :maximized="true"
        :style="{ width: '100vw', maxHeight: '100%', height: '100%', backgroundColor: 'black', color: 'white' }"
        class="media-preview-dialog">
        <!-- download button -->
        <div class="flex justify-end">
            <a v-if="currentPreviewFile" class="p-button-text file-download-button" severity="secondary" :href="currentPreviewFile.objectURL"
                :download="currentPreviewFile.name">
                <i class="pi pi-download"></i>
            </a>
        </div>
        <template v-if="currentPreviewFile">
            <div class="media-preview-content">
                <div class="media-preview-main">
                    <!-- Image Preview -->
                    <img v-if="['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp', 'image/tiff', 'image/ico', 'image/webp'].includes(currentPreviewFile.type)"
                        :src="getCacheSafeUrl(currentPreviewFile)" :alt="currentPreviewFile.name"
                        class="media-preview-image" />

                    <!-- PDF Preview -->
                    <iframe v-else-if="['application/pdf'].includes(currentPreviewFile.type)" :src="getCacheSafeUrl(currentPreviewFile)"
                        class="media-preview-pdf"></iframe>

                    <!-- Other Files (zip, doc, etc) -->
                    <div v-else class="flex flex-col items-center justify-center h-full text-center gap-4">
                        <i class="pi pi-file text-6xl text-gray-400"></i>
                        <div class="text-xl font-semibold">
                            Cannot preview this file type
                        </div>
                        <div class="text-gray-500">
                            {{ currentPreviewFile.name }}
                        </div>

                        <a :href="currentPreviewFile.objectURL" :download="currentPreviewFile.name"
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Download File
                        </a>
                    </div>
                </div>

                <div v-if="hasMultiplePreviewFiles" class="media-preview-thumbs justify-center">
                    <button
                        v-for="(file, idx) in imageModalFiles"
                        :key="`${file?.name || 'file'}-${idx}`"
                        type="button"
                        class="media-thumb-btn"
                        :class="{ 'media-thumb-btn-active': currentPreviewIndex === idx }"
                        @click="currentPreviewIndex = idx"
                    >
                        <img
                            v-if="['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp', 'image/tiff', 'image/ico', 'image/webp'].includes(file?.type)"
                            :src="getCacheSafeUrl(file)"
                            :alt="file?.name || `File ${idx + 1}`"
                            class="media-thumb-image"
                        />
                        <div v-else class="media-thumb-fallback">
                            <i class="pi pi-file" />
                        </div>
                    </button>
                </div>
            </div>
        </template>
    </Dialog>

    <!-- <ContextMenu ref="menu" :model="contextMenuItems" @hide="selectedFolder = null" /> -->
    <Toast />
</template>

<style scoped lang="scss">
/* Full-viewport overlay during folder upload (store key: media.files.upload.to.folder) */
.folder-upload-overlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    z-index: 11000;
}

.media-preview-dialog {
    color: white !important;
    :deep(.p-dialog-content) {
        overflow: hidden !important;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }
    .p-dialog-header-actions {
        :deep(.p-button-text) {
            color: white !important;
        }
    }
}

.media-preview-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 8rem);
    gap: 0.75rem;
}

.media-preview-main {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.media-preview-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.media-preview-pdf {
    width: 100%;
    height: 100%;
    border: none;
}

.media-preview-thumbs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    overflow-x: auto;
    padding: 0.25rem 0.25rem 0.5rem;
}

.media-thumb-btn {
    width: 72px;
    height: 72px;
    border: 2px solid transparent;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.1);
}

.media-thumb-btn-active {
    border-color: #60a5fa;
}

.media-thumb-image,
.media-thumb-fallback {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #e5e7eb;
}

// li disabled background color with not clickable
:deep(.p-disabled) {
    background-color: #f1f1f1 !important;
    opacity: 0.5 !important;
    cursor: not-allowed !important;
    pointer-events: none !important; /* prevents clicking */
}

.file-download-button {
    // background-color: #007bff;
    color: white;
    position: absolute;
    top: 18px;
    right: 120px;
    padding: 10px;
    border-radius: 50%;
}

.loading,
.error,
.empty-folder {
    text-align: center;
    padding: 40px;
    color: var(--text-color);
}

.remove-file-wrapper:hover {
    .remove-button {
        display: flex !important;
    }
}

.upload-button {
    :deep(.p-button) {
        background: var(--primary-color);
        border: 1px solid var(--primary-color);
        color: var(--primary-color-text);

        &:hover {
            background: var(--primary-600);
            border-color: var(--primary-600);
        }
    }
}

.th-upload-files-container {
    justify-content: center;
    margin-top: 20px;
}
</style>