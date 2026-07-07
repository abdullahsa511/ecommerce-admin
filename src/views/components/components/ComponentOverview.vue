<script setup lang="ts">
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';
import { computed, onMounted, ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useComponentStore } from '@/stores/component';
import PostRichTextField from '@/components/form/RichTextEditor.vue';
// @ts-ignore
import ComponentService from '@/service/ComponentService';
import { useRouter } from 'vue-router';
import 
    {   
        ButtonItemObject, 
        ComponentVisible, 
        LinkItemObject } from '@/models/Component.ts';
import { FileUploadEvent } from '@/models/File';
// @ts-ignore
import UploadFileDatatable from '@/components/upload/UploadFileDatatable.vue';
import { storeToRefs } from 'pinia';
import { FileModel } from '@/models/Media';

import WayPoint from '@/views/wayPoint/WayPoint.vue';


const router = useRouter();
//System Variables
const toast = useToast();
const componentStore = useComponentStore();
const { fb, componentData } = storeToRefs(componentStore);

// Define emit
const emit = defineEmits(['saved']);

// Use defineProps directly
const props = defineProps({
  id: {
    type: Number
  }
});

const id = computed(() => {
  return router.currentRoute.value.params.id;
});
//Data
const sectionTemplateOptions = [
    { label: 'Default Section', value: 'default' },
    { label: 'Hero Section', value: 'hero' },
    { label: 'Feature Section', value: 'feature' },
    { label: 'Content Section', value: 'content' }
];

//Data Images Related
const isSaving = ref(false);
const newButton = ref<ButtonItemObject>(new ButtonItemObject(null));
const editingButtonIndex = ref<number | null>(null);
const newLink = ref<LinkItemObject>(new LinkItemObject(null));

const visible = ref(false);
const wayPointSuggestions = ref<any[]>([]);

const targetOptions = [
  { label: 'Same Window', value: '_self' },
  { label: 'New Window', value: '_blank' }
];

const componentVisible = ref<ComponentVisible>({
  imageModal: false,
  linkModal: false,
  buttonModal: false
});

const imagesColumns = ref([
    { field: 'description', header: 'Description' },
    { field: 'link', header: 'Link' }
]);

//Any methods
const uploadImage = async (event: FileUploadEvent) => {
    try {
        console.log('Component ID:', componentData.value.component_id);
        // await componentStore.uploadComponentImage(event.files, 'image');
        const result: any = await componentStore.uploadComponentImage(event.files, 'image', componentData.value.component_id as number);
        let files = result.files;
        // componentData.value.image = files[0];
        componentData.value.image = [new FileModel(files[0])];
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}
const uploadMobileBanner = async (event: FileUploadEvent) => {
    try {
        const result: any = await componentStore.uploadComponentMobileBanner(event.files, 'image', componentData.value.component_id as number);
        let files = result.files;
        componentData.value.mobile_banner = [new FileModel(files[0])];
    } catch (error) {
        console.error('Error uploading mobile banner:', error);
    }
}
const uploadImages = async (event: FileUploadEvent, property: string) => {
    try {
        const result: any = await componentStore.uploadComponentImages(event.files, property, componentData.value.component_id as number);
        let files = result.files;
        for(let file of files) {
            let index = componentData.value.images.findIndex(img => img.name === file.name);
            if(index !== -1) {
                componentData.value.images[index] = file;
            } else {
                componentData.value.images.push(file);
            }
        }
    } catch (error) {
        console.error('Error uploading images:', error);
    }
}

const resetButtonForm = () => {
  editingButtonIndex.value = null;
  newButton.value = new ButtonItemObject({
    id: Date.now(),
    title: '',
    url: '',
    target: '_self',
    icon: 'fa-solid fa-arrow-right',
    type: 'Small'
  });
};

const openButtonModal = () => {
  resetButtonForm();
  componentVisible.value.buttonModal = true;
};

const addButton = () => {
  componentData.value.buttons.push(newButton.value);
  componentVisible.value.buttonModal = false;
  resetButtonForm();
};

const addLink = () => {
  componentData.value.links.push(newLink.value);
  componentVisible.value.linkModal = false;
  newLink.value = new LinkItemObject({
    id: Date.now(),
    title: '',
    url: '',
    target: '_self',
    icon: 'fa-solid fa-arrow-right'
  });
};

const triggerToast = (severity: string, summary: string, detail: string) => {
  toast.add({
    severity: severity,
    summary: summary,
    detail: detail,
    life: 3000
  });
}

// Images Section

// Delete image handler
const deleteImage = async (file: any, property: 'images' | 'image' | 'mobile_banner') => {
  try {
    const filePath = file.image;
    await componentStore.deleteImageByFilePath(filePath, property, componentData.value.component_id as number);
    let index = componentData.value[property].findIndex(img => img.name === file.name);
    if(index !== -1) {
      componentData.value[property].splice(index, 1);
    }
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Image removed successfully',
      life: 3000
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    triggerToast('error', 'Error', 'Failed to delete image. Please try again.');
  }
};

const updateComponent = (prop: string, value: any) => {
    // Update the local component ref with a type assertion to handle string index
    (componentData.value as any)[prop] = value;    
};

const saveComponent = async () => {
    isSaving.value = true;
    try {   
        let result;
        if (componentData.value.component_id) {
            // Update existing component
            result = await componentStore.updateComponent(componentData.value.component_id, componentData.value);
            emit('saved', result);
        } else {
            // Create new component
            result = await componentStore.createComponent(componentData.value);
            emit('saved', result);
        }
        
        triggerToast('success', 'Success', `Component ${componentData.value.component_id ? 'updated' : 'created'} successfully`);
        
        // Emit the saved event with the result so parent can navigate
      
    
    } catch (error) {
        console.error('Error saving component:', error);
        triggerToast(
            'error', 
            'Error', 
            `Failed to ${componentData.value.component_id ? 'update' : 'create'} componentData. Please try again.`);
        
    } finally {
        isSaving.value = false;
    }
};

// Buttons handling
const deleteButton = async (index: number) => {
  if(!componentData.value.component_id) {
    return;
  }
  componentData.value.buttons.splice(index, 1);
  await componentStore.updateComponent(componentData.value.component_id, componentData.value);
  
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Button removed successfully',
    life: 3000
  });
};

const editButton = (index: number) => {
    editingButtonIndex.value = index;
    componentVisible.value.buttonModal = true;
    newButton.value = new ButtonItemObject(JSON.parse(JSON.stringify(componentData.value.buttons[index])));
};

const updateButton = () => {
    if (editingButtonIndex.value === null) return;
    componentData.value.buttons[editingButtonIndex.value] = new ButtonItemObject({
        ...newButton.value
    });
    componentVisible.value.buttonModal = false;
    resetButtonForm();
};

// Links handling
const deleteLink = (id: number) => {
  componentData.value.links = componentData.value.links.filter(link => link.id !== id);

  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Link removed successfully',
    life: 3000
  });
};


// ------------- way points section start ------------- 
const bannerWayPointsData = computed(() => {
    return componentData.value?.banner_way_points ? componentData.value?.banner_way_points : [];
});


const updateWayPoints = async (wayPoints: any) => {
    let response: any = await componentStore.updateComponentWayPoints(componentData.value.component_id as number, wayPoints);
    if (response) {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Way Points saved successfully',
        life: 3000
      });
    } else {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save way points: ' + (response?.message || ''), life: 5000 });
    }
};

const searchWayPointSuggestions = async (query: any) => {
    const suggestions: any = await componentStore.getWayPointSuggestions(query);
    wayPointSuggestions.value = suggestions;
};

// ------------- way points section end ------------- 

// watch(componentData, (newVal) => {
//     console.log('componentData', newVal);
// });
onMounted(() => {
    componentStore.resetComponent();
    componentStore.fetchComponentById(id.value as string);  

});

watch(componentData, (newVal) => {
    console.log("componentData", newVal);
}, { deep: true });
</script>
<template>
    <!-- Header with Save Button -->
    <div class="flex justify-end items-center mb-6">
        <Button 
            icon="pi pi-save"
            label="Save Component"
            severity="primary"
            :loading="isSaving"
            @click="saveComponent"
            class="p-button-md"
        />
    </div>
    
    <!-- General Tab -->
    <div class="flex flex-col gap-6">
        <!-- Component Name -->
        <div class="grid grid-cols-12">
            <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Name</label>
            <div class="col-span-12 md:col-span-8 lg:col-span-10">
                <InputText :value="componentData.name" @input="updateComponent('name', $event.target.value)" class="w-full text-lg" />
            </div>
        </div>
        <!-- Template Selection -->
        <div class="grid grid-cols-12">
            <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Template</label>
            <div class="col-span-12 md:col-span-8 lg:col-span-10">
                <Select 
                    :value="componentData.template" 
                    :options="sectionTemplateOptions" 
                    optionLabel="label" 
                    placeholder="Select a Template" 
                    class="w-full text-lg" 
                    @change="updateComponent('template', $event.value.value)"
                />
            </div>
        </div>
        <!-- Content Details -->
        <div class="space-y-4 border-b border-gray-200 pb-4">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Content Details</h3>
            
            <!-- Title -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Title</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <InputText :value="componentData.section_title" @input="updateComponent('section_title', $event.target.value)" class="w-full text-lg" />
                </div>
            </div>

            <!-- Subtitle -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Subtitle</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <InputText :value="componentData.section_subtitle" @input="updateComponent('section_subtitle', $event.target.value)" class="w-full text-lg" />
                </div>
            </div>

            <!-- Description -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Description</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <!-- <Editor
                        v-model="componentData.description"
                        editorStyle="height: 200px"
                    /> -->

                    <PostRichTextField v-model="componentData.description" />
                </div>
            </div>

            <!-- Image Uploader -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Image</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <div class="flex gap-4">  
                        <UploadFile 
                        v-model:uploadedFilesData="componentData.image"
                        :fb="fb"
                        @upload="uploadImage"
                        @removeUploadedFile="deleteImage($event, 'image')"
                        />
                        <div class="way-points-button">
                            <Button v-if="componentData.image.length > 0" label="Setup Way-Points" @click="visible = true" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mobile banner -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Mobile bannder</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <div class="flex gap-4">  
                        <UploadFile 
                            v-model:uploadedFilesData="componentData.mobile_banner"
                            :fb="fb"
                            @upload="uploadMobileBanner"
                            @removeUploadedFile="deleteImage($event, 'mobile_banner')"
                        />
                    </div>
                </div>
            </div>
        </div>
        <!-- Section Details -->
        <div class="space-y-4">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Section Details</h3>
            
            <!-- Section Title -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Section Title</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <InputText :value="componentData.section_title" @input="updateComponent('section_title', $event.target.value)" class="w-full text-lg" />
                </div>
            </div>

            <!-- Section Subtitle -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Section Subtitle</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <InputText :value="componentData.section_subtitle" @input="updateComponent('section_subtitle', $event.target.value)" class="w-full text-lg" />
                </div>
            </div>

            <!-- Section Link -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Section Link</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <InputText :value="componentData.section_link" @input="updateComponent('section_link', $event.target.value)" class="w-full text-lg" />
                </div>
            </div>
        </div>

        <!-- Images Section -->
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Images</h3>
            </div>

            <UploadFileDatatable
              :url="'/api/upload'"
              :maxFileSize="1000000"
              :multiple="true"
              :accept="'image/*'"
              :auto="true"
              :columns="imagesColumns"
              :fb="fb"
              v-model:uploadedFilesData="componentData.images"
              @upload="uploadImages($event, 'images')"
              @removeUploadedFile="deleteImage($event, 'images')"
            />
        </div>

        <!-- Buttons Section -->
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Buttons</h3>
                <Button icon="pi pi-plus" label="Add Button" @click="openButtonModal" />
            </div>

            <DataTable :value="componentData.buttons" class="p-datatable-sm">
                <Column field="title" header="Title" />
                <Column field="url" header="URL" />
                <Column field="target" header="Target" />
                <Column field="icon" header="Icon" />
                <Column header="Actions" style="width: 100px">
                    <template #body="{index}">
                        <Button icon="pi pi-trash" severity="danger" text @click="deleteButton(index)" />
                        <Button icon="pi pi-pencil" severity="info" text @click="editButton(index)" />
                    </template>
                </Column>
            </DataTable>

            <Dialog v-model:visible="componentVisible.buttonModal" :header="editingButtonIndex !== null ? 'Edit Button' : 'Add Button'" :style="{ width: '30rem' }">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">Title</label>
                        <InputText v-model="newButton.title" placeholder="Enter button text" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">URL</label>
                        <InputText v-model="newButton.url" placeholder="Enter URL" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">Target</label>
                        <Select v-model="newButton.target" :options="targetOptions" optionLabel="label" optionValue="value" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">Icon</label>
                        <InputText v-model="newButton.icon" placeholder="fa-solid fa-arrow-right" />
                    </div>
                </div>
                <template #footer>
                    <Button label="Cancel" @click="componentVisible.buttonModal = false; resetButtonForm()" class="p-button-text" />
                    <Button :label="editingButtonIndex !== null ? 'Update' : 'Add'" @click="editingButtonIndex !== null ? updateButton() : addButton()" :disabled="!newButton.title || !newButton.url" class="p-button-primary" />
                </template>
            </Dialog>
        </div>

        <!-- Links Section -->
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Links</h3>
                <Button icon="pi pi-plus" label="Add Link" @click="componentVisible.linkModal = true" />
            </div>

            <DataTable :value="componentData.links" class="p-datatable-sm">
                <Column field="title" header="Title" />
                <Column field="url" header="URL" />
                <Column field="target" header="Target" />
                <Column field="icon" header="Icon" />
                <Column header="Actions" style="width: 100px">
                    <template #body="slotProps">
                        <Button icon="pi pi-trash" severity="danger" text @click="deleteLink(slotProps.data.id)" />
                    </template>
                </Column>
            </DataTable>

            <Dialog v-model:visible="componentVisible.linkModal" header="Add Link" :style="{ width: '30rem' }">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">Title</label>
                        <InputText v-model="newLink.title" placeholder="Enter link text" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">URL</label>
                        <InputText v-model="newLink.url" placeholder="Enter URL" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">Target</label>
                        <Select v-model="newLink.target" :options="targetOptions" optionLabel="label" optionValue="value" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">Icon</label>
                        <InputText v-model="newLink.icon" placeholder="fa-solid fa-arrow-right" />
                    </div>
                </div>
                <template #footer>
                    <Button label="Cancel" @click="componentVisible.linkModal = false" class="p-button-text" />
                    <Button label="Add" @click="addLink" :disabled="!newLink.title || !newLink.url" class="p-button-primary" />
                </template>
            </Dialog>
        </div>

          
        <Dialog v-model:visible="visible" modal header="Setup Way-Points" maximizable :maximized="true"
            :style="{ width: '100vw', maxHeight: '100%', height: '100%' }">

            <div class="body-container">

                    <WayPoint 
                    :wayPointSuggestions="wayPointSuggestions"
                    :imageSrc="resolveMediaImage(componentData.image)"
                    :wayPoints="bannerWayPointsData"
                    :modelId="componentData.component_id"
                    :fb="fb"
                    @update:wayPoints="updateWayPoints"
                    @search:way-points-suggestions="searchWayPointSuggestions"     
                    />

            </div>
        </Dialog>
    </div>
</template>

<style scoped>
.th-site-logo-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 180px;
}
.th-site-logo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 160px;
    border: 1px solid #e8e8e8;
    border-radius: 5px;
    padding: 10px;
    flex:1;
}
.p-fileupload-no-button-bar .p-fileupload-buttonbar {
  display: none !important;
}
.way-points-button {
    display: flex;
    align-items: flex-end;
}

.way-points-button > button {
    margin-left: -220px !important;
    margin-bottom: 30px;
    font-size: 0.85rem;
    padding: 2px 9px;
    border-radius: 8px;
    font-weight: 500;
}
</style>