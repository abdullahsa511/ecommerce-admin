/// <reference types="vite/client" />

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
// Import with type declarations
import { useComponentStore } from '@/stores/component';
// @ts-ignore
import ComponentService from '@/service/ComponentService';
import Component from '@/models/Component';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import FileUpload from 'primevue/fileupload';
import Select from 'primevue/select';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

// Updated FileUpload event interface
interface FileUploadEvent {
  files: File | File[];
  [key: string]: any;
}


const toast = useToast();
const componentStore = useComponentStore();
const emit = defineEmits(['update:component', 'saved']);
// Use defineProps directly
const props = defineProps({
  component: {
    type: Object as () => Component,
    required: true
  }
});

const component = ref(new Component({}));

// Copy the component data from props to the local ref
onMounted(() => {
  component.value = new Component({...props.component});
});

const isSaving = ref(false);

const themeOptions = [
    { label: 'Landing', value: 'landing' },
    { label: 'Blog', value: 'blog' },
    { label: 'Shop', value: 'shop' }
];

const templateOptions = [
    { label: '-- Default template --', value: 'default' }
];

const sectionTemplateOptions = [
    { label: 'Default Section', value: 'default' },
    { label: 'Hero Section', value: 'hero' },
    { label: 'Feature Section', value: 'feature' },
    { label: 'Content Section', value: 'content' }
];

interface ImageItem {
  id: number;
  image: string;
  description: string;
  file?: File;
}

interface LinkItem {
  id: number;
  title: string;
  url: string;
  target: string;
  icon: string;
}

// Images Section
const imageModalVisible = ref(false);
const newImage = ref({
  file: null as File | null,
  description: ''
});

// Add ref for the FileUpload component
const fileUploadRef = ref(null);

// Define singleImage as a ref object instead of a plain object
const singleFileUploadRef = ref(null);
const singleImage = ref<{file: File | null}>({
  file: null
});

// Handle file selection from FileUpload
const onFileSelect = (event: FileUploadEvent) => {
  // Extract the file from the event
  const file = event.files && (Array.isArray(event.files) ? event.files[0] : event.files);
  
  if (file) {
    // Store the file in newImage
    newImage.value.file = file;
    
    toast.add({ 
      severity: 'info', 
      summary: 'File Selected', 
      detail: `Image "${file.name}" selected successfully`, 
      life: 3000 
    });
  }
};

// Upload image handler
const onUploadImage = async (event: any) => {
  if (!newImage.value.file) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please select an image before uploading',
      life: 3000
    });
    return;
  }
  
  if (!newImage.value.description) {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please provide a description for the image',
      life: 3000
    });
    return;
  }
  
  // Find the next available index
  const nextIndex = component.value.images.length;
  
  try {
    // Use componentStore to upload the image with TypeScript casting to avoid errors
    const response = await (componentStore as any).uploadComponentImage(newImage.value.file, nextIndex);
    
    // Process the response
    if (response && response.files && response.files.length > 0) {
      // Use the first file in the response
      const uploadedFile = response.files[0];
      
      if (uploadedFile && uploadedFile.file) {
        // Add to component images array
        component.value.images.push({
          id: Date.now(),
          image: uploadedFile.file,
          description: newImage.value.description
        });
        
        // Reset the form and close modal
        imageModalVisible.value = false;
        newImage.value = { file: null, description: '' };
        
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Image uploaded successfully',
          life: 3000
        });
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not process uploaded image',
          life: 3000
        });
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No files returned from server',
        life: 3000
      });
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to upload image',
      life: 3000
    });
  }
};

// Delete image handler
const deleteImage = (id: number) => {
  component.value.images = component.value.images.filter(img => img.id !== id);
  
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Image removed successfully',
    life: 3000
  });
};

// Buttons Section
const buttonModalVisible = ref(false);
const newButton = ref({
  title: '',
  url: '',
  target: '_self',
  icon: ''
});

// Links Section
const linkModalVisible = ref(false);
const newLink = ref({
  title: '',
  url: '',
  target: '_self',
  icon: ''
});

const targetOptions = [
  { label: 'Same Window', value: '_self' },
  { label: 'New Window', value: '_blank' }
];

const updateComponent = (prop: string, value: any) => {
    // Update the local component ref with a type assertion to handle string index
    (component.value as any)[prop] = value;
    console.log(`Updated component.${prop} to:`, value);
    
    // Also emit for parent component
    emit('update:component', prop, value);
};

const saveComponent = async () => {
    isSaving.value = true;
    try {
        console.log('Saving component with the following data:');
        console.log('Image URL:', component.value.image);
        console.log('Images:', component.value.images);
        console.log('Buttons:', component.value.buttons);
        console.log('Links:', component.value.links);
        
        // Format the component data according to the required structure
        const componentData = new Component({
            // Basic component info
            component_id: props.component && props.component.component_id ? props.component.component_id : null,
            name: component.value.name,
            section_title: component.value.section_title,
            section_subtitle: component.value.section_subtitle,
            section_link: component.value.section_link,
            title: component.value.title,
            subtitle: component.value.subtitle,
            description: component.value.description,
            image: component.value.image,
            template: component.value.template,
            
            // Format images array as required
            images: component.value.images.map(img => ({
                image: img.image, 
                description: img.description
            })),
            
            // Format buttons array as required
            buttons: component.value.buttons.map(btn => ({
                url: btn.url,
                icon: btn.icon || 'fa-solid fa-arrow-right',
                title: btn.title,
                target: btn.target || '_self',
                type: btn.type || 'Small' // Add default type if not specified
            })),
            
            // Format links array as required
            links: component.value.links.map(link => ({
                url: link.url,
                icon: link.icon || 'fa-solid fa-arrow-right',
                title: link.title,
                target: link.target || '_self'
            }))
        });
        
        console.log('Formatted component data:', componentData);
        
        let result;
        if (componentData.component_id) {
            // Update existing component
            result = await componentStore.updateComponent(componentData.component_id, componentData);
        } else {
            // Create new component
            result = await componentStore.createComponent(componentData);
        }
        
        console.log('Save result:', result);
        
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `Component ${componentData.component_id ? 'updated' : 'created'} successfully`,
            life: 3000
        });
        
        // Emit the saved event with the result so parent can navigate
        emit('saved', result);
        
        // Also update the local component with the new ID if it was created
        if (result && result.component_id) {
            component.value.component_id = result.component_id;
            
            // Update other fields from the result if they exist
            if (result.image) {
                component.value.image = result.image;
                console.log('Updated component image from response:', component.value.image);
            }
        }
    } catch (error) {
        console.error('Error saving component:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to ${props.component && props.component.component_id ? 'update' : 'create'} component. Please try again.`,
            life: 3000
        });
    } finally {
        isSaving.value = false;
    }
};

// Function to handle single image upload
const onSingleImageUpload = async (event: any) => {
  console.log('onSingleImageUpload called, singleImage:', singleImage.value);
  
  if (!singleImage.value.file) {
    console.error('No file in singleImage:', singleImage.value);
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please select an image before uploading',
      life: 3000
    });
    return;
  }
  
  try {
    console.log('Uploading file:', singleImage.value.file.name);
    // Use component store to upload the image
    const response = await (componentStore as any).uploadComponentImage(singleImage.value.file, 0);
    console.log('Upload response:', response);
    
    if (response && response.files && response.files.length > 0) {
      const uploadedFile = response.files[0];
      console.log('Uploaded file from response:', uploadedFile);
      
      if (uploadedFile && uploadedFile.file) {
        // Store the uploaded file URL in component
        const imageUrl = uploadedFile.file;
        
        // Update the component image
        updateComponent('image', imageUrl);
        
        // Reset the file selection
        singleImage.value.file = null;
        
        // Clear the FileUpload component - using type assertion to avoid TypeScript error
        if (singleFileUploadRef.value && typeof (singleFileUploadRef.value as any).clear === 'function') {
          (singleFileUploadRef.value as any).clear();
        }
        
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Image uploaded successfully',
          life: 3000
        });
        
        // Log the updated component to verify the image URL is saved
        console.log('Updated component with image URL:', component.value.image);
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not process uploaded image',
          life: 3000
        });
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No files returned from server',
        life: 3000
      });
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to upload image',
      life: 3000
    });
  }
};

// Buttons handling
const addButton = () => {
  if (newButton.value.title && newButton.value.url) {
    // Create a new button with the required format
    const button = {
      id: Date.now(),
      url: newButton.value.url,
      icon: newButton.value.icon || 'fa-solid fa-arrow-right',
      title: newButton.value.title,
      target: newButton.value.target || '_self',
      type: 'Small' // Default button type
    };
    
    // Add to component buttons array
    component.value.buttons.push(button);
    console.log('Added button:', button);
    console.log('Updated buttons array:', component.value.buttons);
    
    // Reset and close modal
    buttonModalVisible.value = false;
    newButton.value = { title: '', url: '', target: '_self', icon: '' };
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Button added successfully',
      life: 3000
    });
  } else {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please provide button title and URL',
      life: 3000
    });
  }
};

const deleteButton = (id: number) => {
  component.value.buttons = component.value.buttons.filter(btn => btn.id !== id);
  console.log('Button deleted, updated buttons array:', component.value.buttons);
  
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Button removed successfully',
    life: 3000
  });
};

// Links handling
const addLink = () => {
  if (newLink.value.title && newLink.value.url) {
    // Create a new link with the required format
    const link = {
      id: Date.now(),
      url: newLink.value.url,
      icon: newLink.value.icon || 'fa-solid fa-arrow-right',
      title: newLink.value.title,
      target: newLink.value.target || '_self'
    };
    
    // Add to component links array
    component.value.links.push(link);
    console.log('Added link:', link);
    console.log('Updated links array:', component.value.links);
    
    // Reset and close modal
    linkModalVisible.value = false;
    newLink.value = { title: '', url: '', target: '_self', icon: '' };
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Link added successfully',
      life: 3000
    });
  } else {
    toast.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please provide link title and URL',
      life: 3000
    });
  }
};

const deleteLink = (id: number) => {
  component.value.links = component.value.links.filter(link => link.id !== id);
  console.log('Link deleted, updated links array:', component.value.links);
  
  toast.add({
    severity: 'success',
    summary: 'Success',
    detail: 'Link removed successfully',
    life: 3000
  });
};

// Define a function to copy text to clipboard to avoid TypeScript errors
const copyToClipboard = (text: string) => {
  try {
    window.navigator.clipboard.writeText(text);
    toast.add({
      severity: 'info',
      summary: 'URL Copied',
      detail: 'Image URL copied to clipboard',
      life: 3000
    });
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to copy URL to clipboard',
      life: 3000
    });
  }
};
</script>
<template>
    <!-- Header with Save Button -->
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold">{{ component.name || 'New Component' }}</h2>
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
                <InputText :value="component.name" @input="updateComponent('name', $event.target.value)" class="w-full text-lg" />
            </div>
        </div>

        <!-- Section Details -->
        <div class="space-y-4">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Section Details</h3>
            
            <!-- Section Title -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Section Title</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <InputText :value="component.section_title" @input="updateComponent('section_title', $event.target.value)" class="w-full text-lg" />
                </div>
            </div>

            <!-- Section Subtitle -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Section Subtitle</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <InputText :value="component.section_subtitle" @input="updateComponent('section_subtitle', $event.target.value)" class="w-full text-lg" />
                </div>
            </div>

            <!-- Section Link -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Section Link</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <InputText :value="component.section_link" @input="updateComponent('section_link', $event.target.value)" class="w-full text-lg" />
                </div>
            </div>
        </div>

        <!-- Content Details -->
        <div class="space-y-4 border-b border-gray-200 pb-4">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Content Details</h3>
            
            <!-- Title -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Title</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <InputText :value="component.title" @input="updateComponent('title', $event.target.value)" class="w-full text-lg" />
                </div>
            </div>

            <!-- Subtitle -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Subtitle</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <InputText :value="component.subtitle" @input="updateComponent('subtitle', $event.target.value)" class="w-full text-lg" />
                </div>
            </div>

            <!-- Description -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Description</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <Textarea :value="component.description" @input="updateComponent('description', $event.target.value)" class="w-full text-lg" rows="5" />
                </div>
            </div>

            <!-- Image Uploader -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Image</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <div class="flex flex-col items-center gap-4">
                        <div class="bg-white rounded p-4 w-[200px] h-[150px] flex items-center justify-center border border-gray-200">
                            <img v-if="component.image" :src="component.image" alt="Uploaded image" class="max-w-full max-h-full" />
                            <i v-else class="pi pi-image text-4xl text-gray-400"></i>
                        </div>
                        
                        <!-- Remove Image Button - Only show when an image exists -->
                        <Button 
                            v-if="component.image"
                            icon="pi pi-trash"
                            label="Remove Image" 
                            severity="danger"
                            size="small"
                            @click="() => {
                                updateComponent('image', null);
                                toast.add({
                                    severity: 'info',
                                    summary: 'Image Removed',
                                    detail: 'Image has been removed. Save component to apply changes.',
                                    life: 3000
                                });
                            }"
                            class="mb-2"
                        />
                        
                        <FileUpload
                            ref="singleFileUploadRef"
                            name="0"
                            :multiple="false"
                            accept="image/*"
                            :maxFileSize="1000000"
                            @select="(event: any) => { 
                                console.log('Single file select event:', event);
                                const file = event.files && (Array.isArray(event.files) ? event.files[0] : event.files);
                                if (file) {
                                    console.log('Selected file:', file.name);
                                    singleImage.value.file = file;
                                    console.log('Updated singleImage:', singleImage.value);
                                    toast.add({ 
                                        severity: 'info', 
                                        summary: 'File Selected', 
                                        detail: `Image '${file.name}' selected successfully`, 
                                        life: 3000 
                                    });
                                }
                            }"
                            @uploader="onSingleImageUpload"
                            :auto="false"
                            customUpload
                            chooseLabel="Choose"
                            uploadLabel="Upload"
                            cancelLabel="Cancel"
                            class="w-full"
                            :pt="{
                                content: { class: 'border border-gray-300 p-2 rounded' }
                            }"
                        />
                    </div>
                </div>
            </div>

            <!-- Display Uploaded Image URL -->
            <div v-if="component.image" class="grid grid-cols-12 mt-4">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Image URL</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <div class="flex gap-2">
                        <InputText :value="component.image" class="w-full bg-gray-50 border-blue-200" readonly />
                        <Button
                            icon="pi pi-copy"
                            @click="() => copyToClipboard(component.image)"
                            tooltip="Copy URL"
                            class="p-button-outlined p-button-info"
                        />
                    </div>
                    <small class="text-blue-600 block mt-1">This URL will be saved with the component and can be used in your templates</small>
                </div>
            </div>

            <!-- Template Selection -->
            <div class="grid grid-cols-12">
                <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Template</label>
                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                    <Select 
                        :value="component.template" 
                        :options="sectionTemplateOptions" 
                        optionLabel="label" 
                        placeholder="Select a Template" 
                        class="w-full text-lg" 
                        @change="updateComponent('template', $event.value.value)"
                    />
                </div>
            </div>
        </div>

        <!-- Images Section -->
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Images</h3>
                <Button icon="pi pi-plus" label="Add Image" @click="imageModalVisible = true" />
            </div>

            <DataTable :value="component.images" class="p-datatable-sm">
                <Column field="image" header="Image">
                    <template #body="slotProps">
                        <img :src="slotProps.data.image" class="w-20 h-20 object-cover" />
                    </template>
                </Column>
                <Column field="description" header="Description" />
                <Column header="Actions" style="width: 100px">
                    <template #body="slotProps">
                        <Button icon="pi pi-trash" severity="danger" text @click="deleteImage(slotProps.data.id)" />
                    </template>
                </Column>
            </DataTable>

            <Dialog v-model:visible="imageModalVisible" header="Add Image" :style="{ width: '30rem' }">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">Image</label>
                        <FileUpload
                            ref="fileUploadRef"
                            name="0"
                            :multiple="false"
                            accept="image/*"
                            :maxFileSize="1000000"
                            @select="onFileSelect"
                            @uploader="onUploadImage"
                            :auto="false"
                            customUpload
                            chooseLabel="Choose"
                            uploadLabel="Upload"
                            cancelLabel="Cancel"
                            class="w-full"
                            :pt="{
                                content: { class: 'border border-gray-300 p-2 rounded' }
                            }"
                        />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">Description</label>
                        <InputText v-model="newImage.description" placeholder="Enter image description" />
                    </div>
                </div>
                <template #footer>
                    <Button label="Cancel" @click="imageModalVisible = false" class="p-button-text" />
                    <Button label="Add" @click="onUploadImage" :disabled="!newImage.file || !newImage.description" class="p-button-primary" />
                </template>
            </Dialog>
        </div>

        <!-- Buttons Section -->
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Buttons</h3>
                <Button icon="pi pi-plus" label="Add Button" @click="buttonModalVisible = true" />
            </div>

            <DataTable :value="component.buttons" class="p-datatable-sm">
                <Column field="title" header="Title" />
                <Column field="url" header="URL" />
                <Column field="target" header="Target" />
                <Column field="icon" header="Icon" />
                <Column header="Actions" style="width: 100px">
                    <template #body="slotProps">
                        <Button icon="pi pi-trash" severity="danger" text @click="deleteButton(slotProps.data.id)" />
                    </template>
                </Column>
            </DataTable>

            <Dialog v-model:visible="buttonModalVisible" header="Add Button" :style="{ width: '30rem' }">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">Title</label>
                        <InputText v-model="newButton.title" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">URL</label>
                        <InputText v-model="newButton.url" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">Target</label>
                        <Select v-model="newButton.target" :options="targetOptions" optionLabel="label" optionValue="value" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">Icon</label>
                        <InputText v-model="newButton.icon" />
                    </div>
                </div>
                <template #footer>
                    <Button label="Cancel" severity="secondary" @click="buttonModalVisible = false" />
                    <Button label="Add" @click="addButton" />
                </template>
            </Dialog>
        </div>

        <!-- Links Section -->
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Links</h3>
                <Button icon="pi pi-plus" label="Add Link" @click="linkModalVisible = true" />
            </div>

            <DataTable :value="component.links" class="p-datatable-sm">
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

            <Dialog v-model:visible="linkModalVisible" header="Add Link" :style="{ width: '30rem' }">
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">Title</label>
                        <InputText v-model="newLink.title" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">URL</label>
                        <InputText v-model="newLink.url" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">Target</label>
                        <Select v-model="newLink.target" :options="targetOptions" optionLabel="label" optionValue="value" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-semibold">Icon</label>
                        <InputText v-model="newLink.icon" />
                    </div>
                </div>
                <template #footer>
                    <Button label="Cancel" severity="secondary" @click="linkModalVisible = false" />
                    <Button label="Add" @click="addLink" />
                </template>
            </Dialog>
        </div>
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
</style>