<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
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
  uploadedFilesData: { type: Array, default: () => [] }, //previous default: []
  fb: { type: Object, default: null },
  property: { type: String, default: null },
  customStyle: { type: [String, Object], default: null }
});
const defaultImageStyle = {
  maxHeight: '250px',
};

const filesData = computed({
  get: () => props.uploadedFilesData??[],
  set: (newFiles) => {
    emit('update:uploadedFilesData', newFiles);
  }
});
const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);

const onRemove = (event, removeFileCallback, i) => {
  const { file, index } = event;
  // Remove file from selected files
  filesData?.value?.splice(index, 1);
  removeFileCallback(i);
};

const onRemoveUploadedFile = (file, index, removeFileCallback, i) => {
  emit('removeUploadedFile', file);
  removeFileCallback(i);
};

const onSelect = (event) => {
  let error = [];
  props.fb.setError(error, 'component.upload.errors');
  for (let file of event.files) {
    let index = 1;
    if(Array.isArray(filesData?.value)) {
      index = filesData?.value?.findIndex((f) => f.name === file.name);
    }
    if (index !== -1) {
      event.files.splice(index, 1);
      error.push(file.name + ' is already uploaded');
    }
  }

  props.fb.setError(error, 'component.upload.errors');

  if (event.files.length > 0) {
    setFiles(event.files, filesData?.value||[]);
  }
};
const setFiles = (files, data) => {
  if(!Array.isArray(data)) {
    data = [];
  }
  files.forEach((file) => {
    data.push({
      name: file.name,
      size: file.size,
      type: file.type,
      objectURL: file.objectURL,
      file: file,
      status: { name: 'Pending', severity: 'warning' }
    });
  });
};

const onUpload = (files, callback, i) => {
  let data = [];
  files.forEach((file, index) => {
      data.push({
        file: file,
        index: index
      });
  });

  emit('upload', { files: data });
  callback(i);
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

  if(isNaN(formattedSize) || isNaN(i)) {
    return `File Size Not Available`;
  }

  return `${formattedSize} ${sizes[i]}`;
};


</script>

<template>
  <FileUpload
    :multiple="false"
    accept="image/*"
    :maxFileSize="1000000"
    :auto="false"
    customUpload
    @uploader="onUpload"
    @select="onSelect"
    :pt="{
      root: {
        style: {
          border: 'none',
          position: 'relative',
          padding: '0px',
          margin: '0px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      },
      content: {
        style: { minWidth: '200px', minHeight: '120px', padding: '0px', gap: '0px', flex: 1 }
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
        <div class="flex flex-col items-center gap-2">
            <h4 class="text-gray-400">Drop File Here</h4>
            <i class="pi pi-camera text-gray-400" style="font-size: 2rem"></i>
            <Button @click="chooseCallback()" outlined severity="primary">Select File</Button>
        </div>
      </div>
      <span v-else></span>
    </template>
    <template #content="{ removeFileCallback, messages, i = 0, files }">
      <div v-if="filesData.length > 0 || messages.length > 0" class="flex flex-col gap-8">
        <Message
          v-for="message of messages"
          :key="message"
          :class="{ 'mb-8': !filesData.length && !uploadedFilesData.length }"
          severity="error"
        >
          {{ message }}
        </Message>

        <div v-if="filesData.length > 0">
          <div class="flex flex-wrap gap-4">
            <div
              v-for="(file, index) of filesData"
              :key="file.name + file.type + file.size"
              class="upload-tile"
            >
              <div>
                <img
                  role="presentation"
                  :alt="file.name"
                  :src="mediaUrl(file.objectURL)"
                  class="upload-tile__image"
                 :style="customStyle ? { ...defaultImageStyle, ...customStyle } : defaultImageStyle"
                />
                <!-- <img
                  role="presentation"
                  :alt="file.name"
                  :src="mediaUrl(file.objectURL)"
                  class="upload-tile__image"
                  style="max-height: 250px;"
                /> -->
              </div>
              <span class="upload-tile__filename">{{ file.name }}</span>
              <div class="upload-tile__size">{{ formatSize(file.size) }}</div>
              <div class="upload-tile__actions">
                <ProgressBar
                  v-if="
                    fb.loading['media.files.upload.' + property] ||
                    fb.loading['media.files.delete.' + property]
                  "
                  mode="indeterminate"
                  style="height: 6px; width: 60px"
                  class="mb-1"
                />
                <Badge
                  v-else
                  :value="file.status?.name"
                  :severity="file.status?.severity"
                  class="upload-tile__status"
                />
                <button
                  v-if="file.status?.name === 'Pending' && !fb.loading['file.upload']"
                  class="upload-tile__btn upload-tile__btn--cross"
                  @click="onRemove({ file, index }, removeFileCallback, index)"
                >
                  <i class="pi pi-times"></i>
                </button>
                <button
                  v-if="file.status?.name === 'Pending' && !fb.loading['file.upload']"
                  class="upload-tile__btn upload-tile__btn--check"
                  @click="onUpload(files || [], removeFileCallback, index)"
                >
                  <i class="pi pi-check"></i>
                </button>
                <button
                  v-else-if="file.status?.name === 'Uploaded'"
                  class="upload-tile__btn upload-tile__btn--cross"
                  @click="onRemoveUploadedFile(file, index, removeFileCallback, index)"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span velse></span>
    </template>
    <template #empty>
      <div
        v-if="filesData.length === 0"
        class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center"
      >
        <div class="text-gray-400">
     
        </div>
      </div>
      <template v-else> </template>
    </template>
  </FileUpload>
</template>

<style scoped>
:deep(.empty-section) {

}
:deep(.empty-section > div) {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(.p-fileupload-header) {
  padding-bottom: 0px;
  position: absolute;
  padding: 0px;
  margin: 0px;
}
:deep(.p-fileupload-header.d-none),
:deep(.empty-section.d-none) {
  display: none;
}
.upload-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  margin: 0 auto;
  margin-bottom: 12px;
}
.upload-tile__image {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #f9fafb;
}
.upload-tile__filename {
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 2px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}
.upload-tile__size {
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 6px;
}
.upload-tile__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  justify-content: center;
}
.upload-tile__status {
  font-size: 0.85rem;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 500;
}
.upload-tile__btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.upload-tile__btn--cross:hover {
  background: #fee2e2;
}
.upload-tile__btn--check:hover {
  background: #d1fae5;
}
.upload-tile__btn i {
  font-size: 1.1rem;
}
</style>
