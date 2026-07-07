<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMediaStore } from '@/stores/media';
import { storeToRefs } from 'pinia';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
// @ts-ignore
import UploadFileGrid from '@/components/upload/UploadFileGrid.vue';
import { useToast } from 'primevue/usetoast';
import ContextMenu from 'primevue/contextmenu';
import { FileUploadEvent } from '@/models/File';


const emit = defineEmits(['showAddFolderModal']);

const uploadedFiles = ref<any[]>([]);

// Context menu state
const selectedFolder = ref<any>(null);
const menu = ref<any>(null);

// Context menu items
const contextMenuItems = ref([
    {
        label: 'Delete Folder',
        icon: 'pi pi-trash',
        command: async () => {
            if (selectedFolder.value) {
                try {
                    await mediaStore.deleteFolder(selectedFolder.value.media_id);
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Folder deleted successfully',
                        life: 3000
                    });
                } catch (error) {
                    console.error('Error deleting folder:', error);
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete folder. Please try again.',
                        life: 3000
                    });
                }
            }
        }
    }
]);

const route = useRoute();
const router = useRouter();
const mediaStore = useMediaStore();
const { currentFolder, subFolders, folderFiles } = storeToRefs(mediaStore);
const toast = useToast();
const previousFolder = ref(null);

const { fb: mediaFb } = storeToRefs(mediaStore);


onBeforeMount(async () => {
    await mediaStore.fetchSubFolders(parseInt(route.params.id as string));
    console.log(currentFolder.value);
});

async function onRemoveFile(removeFile: any) {
    try {
        await mediaStore.deleteFile(removeFile.id);
    } catch (err) {
        console.error('Error removing file:', err);
    }
}

async function goBack() {
    if (previousFolder.value) {
        await mediaStore.fetchSubFolders(previousFolder.value);
        router.push(`/files-folders/folder/${previousFolder.value}`);
        previousFolder.value = null;
    } else {
        router.push('/files-folders');
    }
}



const onFolderClick = async (folder: any) => {
    previousFolder.value = currentFolder.value.media_id;
    await mediaStore.fetchSubFolders(folder.media_id);
    router.push(`/files-folders/folder/${folder.media_id}`);
};


const uploadImages = async (event: FileUploadEvent) => {
    try {
        const result: any = await mediaStore.uploadFilesToFolder(event.files, parseInt(route.params.id as string));
        let files = result.files;
        for (let file of files) {
            let index = uploadedFiles.value.findIndex((img: any) => img.name === file.name);
            if (index !== -1) {
                uploadedFiles.value[index] = file;
            } else {
                uploadedFiles.value.push(file);
            }
        }
    } catch (error) {
        console.error('Error uploading images:', error);
    }
}

// Delete image handler
const deleteImage = async (file: any) => {
    console.log('Deleting image:', file);
    try {
        await mediaStore.deleteFile(file.media_id);
        let index = uploadedFiles.value.findIndex((img: any) => img.name === file.name);

        if (index !== -1) {
            uploadedFiles.value.splice(index, 1);
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

const onRightClick = (event: any, folder: any) => {
    console.log("folder", folder)
    event.preventDefault();
    event.stopPropagation();
    selectedFolder.value = folder;
    menu.value.show(event);
};
</script>

<template>
    <div class="card">
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
                <Button icon="pi pi-arrow-left" text class="mr-2" @click="goBack" />
                <div class="text-surface-900 dark:text-surface-0 text-xl font-semibold">
                    {{ currentFolder?.name }}
                </div>
                <Button label="Add Folder" icon="pi pi-plus" class="ml-4" size="small"
                    @click="emit('showAddFolderModal')" />
            </div>
        </div>

        <div v-if="mediaFb.loading['media.subFolders']" class="loading">
            <i class="pi pi-spin pi-spinner"></i> Loading...
        </div>
        <div v-else-if="mediaFb.errors['media.subFolders']" class="error">
            {{ mediaFb.errors['media.subFolders'] }}
        </div>
        <div v-else>
            <div v-if="subFolders?.length === 0 && folderFiles?.length === 0" class="empty-folder">
                This folder is empty
            </div>
            <div v-else>
                <div class="grid grid-cols-12 gap-4 mb-4" v-if="subFolders?.length > 0">
                    <div v-for="folder in subFolders" :key="folder.id" @contextmenu="onRightClick($event, folder)"
                        class="col-span-12 md:col-span-6 xl:col-span-4">
                        <div class="p-4 border border-surface-200 dark:border-surface-700 flex items-center justify-between hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer rounded"
                            @click="onFolderClick(folder)">
                            <div class="flex items-center">
                                <i v-if="!mediaFb.loading[`media.folders.delete.${folder.media_id}`]"
                                    class="text-2xl mr-4" :class="folder.meta?.icon || 'pi pi-folder'" />
                                <i v-else class="text-2xl mr-4 pi pi-spinner pi-spin" />
                                <span class="text-surface-900 dark:text-surface-0 text-lg font-medium">{{ folder.name
                                    }}</span>
                            </div>
                            <!-- <span class="text-surface-600 dark:text-surface-200 text-lg font-semibold">{{ folder.size }}</span> -->
                            <span class="text-surface-600 dark:text-surface-200 text-lg font-semibold">{{
                                folder.file_count }}</span>
                        </div>
                    </div>
                </div>
                <div v-if="false"
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    <div v-for="file in folderFiles" :key="file.id"
                        class="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
                        <div class="flex flex-col">
                            <div class="w-full aspect-video flex-shrink-0 rounded-t-lg overflow-hidden">
                                <img v-if="file.type === 'image'" :src="file.url" :alt="file.name"
                                    class="w-full h-full object-cover" />
                                <div v-else
                                    class="w-full h-full flex items-center justify-center bg-surface-100 dark:bg-surface-800">
                                    <i :class="file.icon" class="text-4xl text-surface-600 dark:text-surface-400"></i>
                                </div>
                            </div>
                            <div class="p-3">
                                <div class="flex flex-col">
                                    <div class="text-surface-900 dark:text-surface-0 font-medium mb-1 truncate">{{
                                        file.name }}</div>
                                    <div class="text-surface-600 dark:text-surface-200 text-sm">{{ file.fileSize }}
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
                </div>
            </div>
        </div>


        <div class="card !p-0" v-if="!mediaFb.loading['media.subFolders']">
            <UploadFileGrid :url="'/api/upload'" :maxFileSize="1000000" :multiple="true" :accept="'image/*'"
                :auto="true" :fb="mediaFb" v-model:uploadedFilesData="folderFiles" @upload="uploadImages"
                @removeUploadedFile="deleteImage($event)" />
        </div>
    </div>

    <ContextMenu ref="menu" :model="contextMenuItems" @hide="selectedFolder = null" />
    <Toast />
</template>

<style scoped lang="scss">
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