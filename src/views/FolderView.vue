<script setup>
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMediaStore } from '@/stores/media';
import { storeToRefs } from 'pinia';
// @ts-ignore
import UploadFileGrid from '@/components/upload/UploadFileGrid.vue';

const route = useRoute();
const router = useRouter();
const mediaStore = useMediaStore();
const showAddFolderModal = ref(false);
const newFolderName = ref('');
// const uploadedFiles = ref([]);

const {fb: mediaFb, currentFolder} = storeToRefs(mediaStore);

async function submitNewFolder() {
    const media_id = parseInt(route.params.id);

    const folder = {
        folder_id: 1,
        name: newFolderName.value,
        breadcrumb: currentFolder.value,
        media_id: media_id
    };

    try {
        const created = await mediaStore.addFolder(folder);
        await mediaStore.fetchSubFolders(media_id, created.path);
        router.push(`/files-folders/folder/${media_id}/${created.path}`);
        showAddFolderModal.value = false;
        newFolderName.value = '';
    } catch (error) {
        console.error('Failed to add folder:', error);
    }
}
</script>
<template>
    <div>
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
                <router-view @showAddFolderModal="showAddFolderModal = true"></router-view>
            </div>
        </div>
        <Dialog v-model:visible="showAddFolderModal" header="Add Folder" :modal="true" :closable="true">
            <div class="flex flex-col gap-4">
                <label for="folderName">Folder Name</label>
                <InputText id="folderName" v-model="newFolderName" placeholder="Enter folder name" />
                <Button label="Create" @click="submitNewFolder" :disabled="!newFolderName" />
            </div>
        </Dialog>
    </div>
</template>

<style scoped lang="scss">
.loading, .error, .empty-folder {
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