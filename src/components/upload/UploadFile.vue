<script setup>
import { ref, computed } from 'vue';
import { useToast } from "primevue/usetoast";
import { mediaUrl } from '@/utils/mediaUrl';

const toast = useToast();

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
    'update:uploadedFilesData'
]);

const props = defineProps({
    uploadedFilesData: { type: Array, default: [] },
    fb: { type: Object, default: null },
    imageStyle: { type: String, default: '' }
});

const filesData = computed({
    get: () => props.uploadedFilesData,
    set: (newFiles) => {
        emit('update:uploadedFilesData', newFiles);
    }
});
const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);

const onRemove = (event, removeFileCallback, i) => {
    const {file, index} = event;
    // Remove file from selected files
    filesData.value.splice(index, 1);
    removeFileCallback(i);
};

const onRemoveUploadedFile = (file, index, removeFileCallback, i) => {
    emit('removeUploadedFile', file);
    removeFileCallback(i);
};

const onSelect = (event) => {
    let error = [];
    props.fb.setError(error, 'component.upload.errors');
    for(let file of event.files) {
        let index = filesData.value.findIndex(f => f.name === file.name);
        if(index !== -1) {
            event.files.splice(index, 1);
            error.push(file.name + ' is already uploaded');
        }
    }

    props.fb.setError(error, 'component.upload.errors');
    
    if(event.files.length > 0) {
        setFiles(event.files, filesData.value);
    }
};
const setFiles = (files, data) => {
    files.forEach(file => {
        data.push({
            name: file.name,
            size: file.size,
            type: file.type,
            objectURL: file.objectURL,
            file: file,
            status: { name: 'Pending', severity: 'warning' }
        });
    });
}

const onUpload = (files) => {
    let data = [];
    files.forEach((file, index) => {
        data.push({
            file: file,
            index: index
        });
    });

    emit('upload', {files: data});
};


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
</script>

<template>
    <FileUpload 
        :multiple="false" 
        accept="image/*" 
        :maxFileSize="100000000" 
        :auto="false"
        customUpload
        @uploader="onUpload" 
        @select="onSelect"
        :pt="{
            content: { 
                style: {minWidth: '200px', minHeight: '120px'}
            },
            empty: {
                class: { 'empty-section': true, 'd-none': filesData.length > 0 }
            },
            header: {
                class: { 'd-none': files.length > 0 }
            }
        }"
    >
        <template #header="{ chooseCallback, uploadCallback, clearCallback }">
            <div v-if="filesData.length === 0" class="flex flex-wrap justify-between items-center flex-1">
                <div class="flex gap-2">
                    <Button @click="chooseCallback()" outlined severity="primary">Select File</Button>
                </div>
            </div>
            <span v-else></span>
        </template>
        <template #content="{ removeFileCallback, messages, i, files }">
            <div v-if="filesData.length > 0 || messages.length > 0" class="flex flex-col gap-8 pt-4">
                <Message v-for="message of messages" :key="message" :class="{ 'mb-8': !filesData.length}" severity="error">
                    {{ message }}
                </Message>

                <div v-if="filesData.length > 0">
                    <div class="flex flex-wrap gap-4">
                        <div v-for="(file, index) of filesData" :key="file.name + file.type + file.size" class="p-8 rounded-border flex border border-surface items-center gap-4">
                            <div>
                                <img role="presentation" :alt="file.name" :src="mediaUrl(file.objectURL)" width="100" height="50" />
                            </div>
                            <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                            <div>{{ formatSize(file.size) }}</div>
                            <ProgressBar v-if="props.fb.loading['component.image.upload'] && file.status?.name === 'Pending'" 
                            mode="indeterminate" style="height: 6px;width:100px" class="mb-1 w-full" />
                            <Badge v-else :value="file.status?.name" :severity="file.status?.severity" />
                            <Button v-if="file.status?.name === 'Pending' && !fb.loading['component.image.upload']"
                             icon="pi pi-times" @click="onRemove(file, removeFileCallback, i)" outlined rounded severity="danger" />
                            <Button v-else-if="file.status?.name === 'Uploaded'" 
                                icon="pi pi-times" @click="onRemoveUploadedFile(file, index, removeFileCallback, i)" outlined rounded severity="success" />
                            <Button v-if="file.status?.name === 'Pending' && !fb.loading['component.image.upload']" 
                                icon="pi pi-check" @click="onUpload(files)" outlined rounded severity="success" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #empty>
            <div v-if="filesData.length === 0" class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center">
                <div class="text-gray-400">
                    <i class="pi pi-camera" style="font-size: 2rem;"></i>
                </div>
            </div>
            <template v-else>
                
            </template>
        </template>
    </FileUpload>
</template>

<style scoped>
:deep(.empty-section) {
    margin-top: 1rem;
}
:deep(.empty-section > div) {
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}
:deep(.p-fileupload-header) {
    padding-bottom: 0px;
}
:deep(.p-fileupload-header.d-none),
:deep(.empty-section.d-none) {
    display: none;
}
</style>