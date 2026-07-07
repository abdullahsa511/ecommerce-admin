<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMediaStore } from '@/stores/media';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import ContextMenu from 'primevue/contextmenu';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { storeToRefs } from 'pinia';
// @ts-ignore
import UploadFileGrid from '@/components/upload/UploadFileGrid.vue';
import { useToast } from 'primevue/usetoast';
import { mediaUrl, resolveMediaImage } from '@/utils/mediaUrl';
const router = useRouter();
const mediaStore = useMediaStore();
const { fb: mediaFb, folders } = storeToRefs(mediaStore);
const toast = useToast();

// Context menu state
const selectedFolder = ref<any>(null);
const menu = ref<any>(null);

const showAddFolderModal = ref(false);
const newFolderName = ref('');
const imageModalVisible = ref(false);
const imageModalFile = ref<any>(null);

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

onMounted(async () => {
    try {
        await Promise.all([
            mediaStore.fetchFiles(),
            mediaStore.fetchFolders(),
            mediaStore.fetchMetrics()
        ]);
    } catch (error) {
        console.error('Error loading media data:', error);
    }
});


async function onRemoveFile(removeFile: any) {
    try {
        await mediaStore.deleteFile(removeFile.media_id, null);
    } catch (error) {
        console.error('Error removing file:', error);
    }
}

function onFolderClick(folder: any) {
    // console.log("folder", folder)
    router.push(`/files-folders/folder/${folder.media_id}`);
}

async function submitNewFolder() {
    const folder = {
        folder_id: null,
        name: newFolderName.value,
        breadcrumb: '/media'
    };
    try {
       const created: any = await mediaStore.addFolder(folder);
       router.push(`/files-folders/folder/${created.media_id}`);
       console.log("created", created)
        showAddFolderModal.value = false;
        newFolderName.value = '';
    } catch (error) {
        console.error('Failed to add folder:', error);
    }
}

function formatSize(bytes: number) {
    if (!bytes && bytes !== 0) return '';
    const k = 1024;
    const dm = 2;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
const showImageModal = (file: any) => {
    console.log("file", file)
    imageModalVisible.value = true;
    imageModalFile.value = file;
}

</script>

<template>
    <div class="grid grid-cols-12 gap-4">
        <div class="col-span-12 md:col-span-5 xl:col-span-3">
            <div class="card">
                <div class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-4">Media</div>
                <ul class="list-none p-0 m-0">
                    <li 
                        v-for="(folder, i) in folders" 
                        :key="i" 
                        class="p-4 mb-4 flex items-center justify-between cursor-pointer rounded bg-[#ffffff] border border-[#f1f1f1]"  
                        @click="onFolderClick(folder)"
                    >
                        <div class="flex items-center" >
                            <img :src="mediaUrl('/media/folder.png')" alt="folder icon" class="w-8 h-8 mr-4" v-if="!mediaFb.loading[`media.subFolders.${folder.media_id}`]">
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
                <div class="flex items-center mb-4">
                    <div class="text-surface-900 dark:text-surface-0 text-xl font-semibold">Folders</div>
                    <Button label="Add Folder" icon="pi pi-plus" class="ml-4" size="small"
                        @click="showAddFolderModal = true" />
                </div>
            </div>
            <div class="card">
                <div class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-4">Recent Uploads</div>
                <DataTable :value="mediaStore.files" dataKey="id" paginator :rows="8">
                    <Column field="thumbnail" header="Thumbnail" style="min-width: 8rem">
                        <template #body="{ data }">
                            <img :src="resolveMediaImage(data.objectURL)" :alt="data.name"
                                class="w-16 h-16 object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors" />
                        </template>
                    </Column>
                    <Column field="meta.original_name" header="Name" sortable :headerStyle="{ minWidth: '12rem' }">
                        <template #body="{ data }">
                            <div class="flex items-center">
                                <i class="text-xl text-primary mr-2" :class="data.icon" />
                                <span>
                                    {{ data.meta?.original_name || data.name || 'No name' }}
                                </span>
                            </div>
                        </template>
                    </Column>
                    <Column field="created_at" header="Date" headerClass="whitespace-nowrap"
                        :headerStyle="{ minWidth: '12rem' }">
                        <template #body="{ data }">
                            <span>
                                {{ new Date(data.created_at).toLocaleDateString() }}
                            </span>
                        </template>
                    </Column>
                    <Column field="meta.size" header="File Size" sortable :headerStyle="{ minWidth: '12rem' }">
                        <template #body="{ data }">
                            <span>
                                {{ formatSize(data.size) }}
                            </span>
                        </template>
                    </Column>
                    <Column class="w-40">
                        <template #body="{ data }">
                            <div class="text-center">
                                <Button v-if="!mediaFb.loading[`media.files.delete.${data.media_id}`]"
                                    icon="pi pi-times" class="mr-2" severity="danger" text rounded
                                    @click="onRemoveFile(data)" />
                                <Button v-else icon="pi pi-spinner pi-spin" class="mr-2" severity="danger" text
                                    rounded />
                                <Button icon="pi pi-search" text rounded @click="showImageModal(data)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <Dialog v-model:visible="showAddFolderModal" header="Add Folder" :modal="true" :closable="true">
            <div class="flex flex-col gap-4">
                <label for="folderName">Folder Name</label>
                <InputText id="folderName" v-model="newFolderName" placeholder="Enter folder name" />
                <Button label="Create" @click="submitNewFolder" :disabled="!newFolderName" />
            </div>
        </Dialog>
        <Dialog v-model:visible="imageModalVisible" modal header="Header" :style="{ width: '50vw' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <p class="m-0">
                <img :src="resolveMediaImage(imageModalFile.objectURL)" :alt="imageModalFile.name" />
            </p>
        </Dialog>

        <ContextMenu ref="menu" :model="contextMenuItems" @hide="selectedFolder = null" />
        <Toast />
    </div>
</template>

<style scoped lang="scss">
.remove-file-wrapper:hover {
    .remove-button {
        display: flex !important;
    }
}
</style>
