<script setup>
import { ref, watch, computed } from 'vue';
import FeedbackHandler from '@/utils/FeedbackHandler';
import { useComponentStore } from '@/stores/component';

const componentStore = useComponentStore();

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
    fb: {type : FeedbackHandler},
    url: { type: String, required: true },
    maxFileSize: { type: Number, default: 1000000 },
    multiple: { type: Boolean, default: true },
    accept: { type: String, default: 'image/*' },
    auto: { type: Boolean, default: true },
    columns: { type: Array, default: [{ field: 'description', header: 'Description' }] },
    uploadedFilesData: { type: Array, default: [] }
});

const filesData = computed({
    get: () => props.uploadedFilesData,
    set: (newFiles) => {
        emit('update:uploadedFilesData', newFiles);
    }
});

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
}

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

const onUpload = (event) => {
    let files = [];
    event.files.forEach((file, index) => {
        files.push({
            file: file,
            index: index
        });
    });

    emit('upload', {files: files});
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

const onRemove = (event, removeFileCallback, i) => {
    const {file, index} = event;
    // Remove file from selected files
    filesData.value.splice(index, 1);
    removeFileCallback(i);
};

const onRemoveUploadedFile = async (file, index) => {
    try {
        if (file.image) {
            console.log('Deleting file with filename:', file.image);
            // Update the parent component
            emit('removeUploadedFile', file);
        } else {
            console.error('Could not extract filename from file:', file);
        }
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

</script>
  
<template>
    <Toast />
    <FileUpload 
        ref="fileUploadRef"
        @select="onSelect($event)"
        @uploader="onUpload($event)" 
        :multiple="props.multiple" 
        :accept="props.accept" 
        :auto="false"
        customUpload
        :maxFileSize="props.maxFileSize"
    >
        <template #content="{index, removeFileCallback, messages }">
            <UploadDatatable 
                v-if="filesData.length > 0"
                :files="filesData" 
                :messages="(props.fb.errors['component.upload.errors']||[]).concat(messages||[])" 
                :columns="columns" 
                :fb="props.fb"
                @removeUploadedFileCallback="onRemoveUploadedFile"
                @onRowEditSave="removeFileCallback"
                @removeFileCallback="onRemove($event, removeFileCallback, index)"
            />
            <div v-else>
                <span>Drag and drop files to here to upload.</span>
            </div>
        </template>
    </FileUpload>
</template>