<script setup lang="ts">
import {ref, computed, onMounted } from 'vue'; // Add computed import
import { useRouter } from 'vue-router'; // Add router import
import ProjectSidebar from './ProjectSidebar.vue';
import { debounce } from 'lodash-es';
import { useProjectStore } from '@/stores/project';
import { Customer } from '@/models/Customer';    
import { storeToRefs } from 'pinia';
import { Address } from '@/models/Google';
import AddressAutocomplete from '@/components/AddressAutocomplete.vue';
import RichTextEditor from '@/components/form/RichTextEditor.vue';
// import { useMediaStore } from '@/stores/media';
const emit = defineEmits(['update:project', 'saved']);
const router = useRouter(); // Add router instance
const projectStore = useProjectStore();
const {fb, project } = storeToRefs(projectStore);
// const mediaStore = useMediaStore();

const isAddMode = computed(() => {
    return router.currentRoute.value.path.includes('/add/');
});


type CustomerItem = { customer_id: number, name: string };
const customers = ref<CustomerItem[]>([]);
const showCustomerAutocomplete = ref(true);

//Locations Autocomplete 
const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
// const selectedAddress = ref<Address>();


const openInPageEditor = () => {
    // Implement page editor logic
};

const onNameInput = (e: any) => {
    // console.log('update',project);
    // project.value.slug = e.target.value.toLowerCase().replace(/ /g, '-');
    project.value.slug = e.target.value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')        // replace spaces with -
        .replace(/[^a-z0-9-]/g, '')  // remove all special chars except -
        .replace(/-+/g, '-');        // remove duplicate -
}

const searchCustomers = (e: any) => {
  const query = e.target?.value?.toLowerCase();
  if (query?.length > 0) {
    projectStore.searchCustomers(query).then(results => {
      customers.value = results;
    });
  } else {
    customers.value = [];
  }
}

const onCustomerInput = debounce(searchCustomers, 300);
const addCustomer = (event: { value: CustomerItem }) => {
    if (!project.value?.customer?.customer_id) {
        // project.value?.customer_id = event.value.customer_id;
        project.value.customer = new Customer(event.value);
        emit('update:project', project.value);
    }
}

const handleAddressSelect = (address: Address) => {
    if (project.value) {
        project.value.location = address;
        emit('update:project', project.value);
    }
};

const onLocationInput = (value: string) => {
    if (!project.value) return;

    if (!project.value.location) {
        project.value.location = {} as any;
    }

    project.value.location.description = value;

    emit('update:project', project.value);
};

const uploadMainImage = async (event: any, property: string) => {
    try {
        await projectStore.uploadFiles(event.files, property, project.value.project_id);
        // const response: any = await mediaStore.uploadFiles(event.files, property, options);
        // project.value[property] = response.files.map((file: any) => new FileModel(file));
        emit('update:project', project.value);
    } catch (error) {
        console.error('Error uploading site logo:', error);
    }
}
const deleteMainImage = async (file: any, property: 'main_image_one' | 'main_image_two') => {
    try {
        // await mediaStore.deleteImageByFilePath(file.image, property);
        await projectStore.deleteImageByFilePath(file.image, property, project.value.project_id);
        project.value[property] = [];
        emit('update:project', project.value);
    } catch (error) {
        console.error('Error deleting site logo:', error);
    }
}
onMounted(() => {
    // Debug: Ensure the lifecycle runs and variable is reactive
    // console.log('project on mounted', project.value?.slug, project);
});
</script>

<template>
    <!-- General Tab -->
    <div class="flex flex-col gap-6">

        <div class="loading-overlay border-2" v-if="fb.loading['project.edit.' + router.currentRoute.value.params.id]">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading project details. Please wait.</p>
            </div>
        </div>
        
        <!-- <div class="w-full space-y-4" v-if="fb.errors['project.create'] || fb.errors['project.update']">
            <h3 class="text-lg font-medium border-b border-gray-200 pt-5 pb-2 text-red-600">
                Errors
            </h3>
            <div v-html="fb.errors['project.update'] ? fb.renderErrors('project.update') : fb.renderErrors('project.create')"
                class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
        </div> -->
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Details</h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Name -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Name</label>
                    <div class="col-span-12 md:col-span-4 py-2">
                        <InputText v-model="project.name" 
                            class="w-full text-lg border border-gray-200 rounded-md p-2" 
                            placeholder="Enter name" 
                            @input="onNameInput"
                            :class="{ 'p-invalid': fb.errors['project.create'] || fb.errors['project.update'] }" />
                        <Message v-if="fb.errors['project.create'] || fb.errors['project.update']" severity="error"
                            size="small" variant="title">
                            <span v-for="error in fb.errors['project.create']?.name || fb.errors['project.update']?.name" :key="error"
                                class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>

                    </div>
                    <!-- Slug -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Slug</label>
                    <div class="col-span-12 md:col-span-4 py-2">
                        <InputText v-model="project.slug" 
                        class="w-full text-lg border border-gray-200 rounded-md p-2" 
                        placeholder="Enter slug" 
                        :class="{ 'p-invalid': fb.errors['project.create'] || fb.errors['project.update'] }" />

                        <Message v-if="fb.errors['project.create'] || fb.errors['project.update']" severity="error"
                            size="small" variant="title">
                            <span v-for="error in fb.errors['project.create']?.slug || fb.errors['project.update']?.slug" :key="error"
                                class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                    <!--Customer-->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Customer</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <AutoComplete
                            ref="customerAutocomplete"
                            v-model="project.customer"
                            :suggestions="customers"
                            @input="onCustomerInput"
                            @item-select="addCustomer"
                            optionLabel="email"
                            optionValue="customer_id"
                            placeholder="Type for autocomplete"
                            class="w-full customer-autocomplete pb-2"
                            inputClass="py-2 text-lg w-full"
                            v-if="showCustomerAutocomplete"
                        />
                    </div>
                    <!-- Location -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Location</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <!-- <InputText
                            v-model="project.location.description"
                            class="w-full pb-2"
                            placeholder="Type a location"
                        /> -->
                        <AddressAutocomplete
                            v-model="project.location"
                            :api-key="googleApiKey"
                            class="w-full pb-2"
                            placeholder="Type a location"
                            @select="handleAddressSelect"
                            @input="onLocationInput" 
                        />
                    </div>
                    <!-- Title -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Title</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="project.title" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter title" 
                        :class="{ 'p-invalid': fb.errors['project.create'] || fb.errors['project.update'] }" />
                        <Message v-if="fb.errors['project.create'] || fb.errors['project.update']" severity="error"
                            size="small" variant="title">
                            <span v-for="error in fb.errors['project.create']?.title || fb.errors['project.update']?.title" :key="error"
                                class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                    <!-- Label -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Label</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="project.label" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter Label" />
                    </div>
                    <!-- Link Text -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Link Text</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="project.link_text" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter link text" />
                    </div>
                    <!-- Designer -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Credit Label</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="project.credit_label" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter Credit Label text" />
                    </div>
                    <!-- Designer -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Designer</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="project.designer" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter Designer text" />
                    </div>
                    <!-- Photographer -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Photographer</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="project.photographer" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter Photographer text" />
                    </div>
                </div>
                <!-- Content -->
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label class="col-span-12 md:col-span-2 flex text-lg">Content</label>
                    <div class="col-span-12 md:col-span-4">
                        
                        <Button
                        label="Open in Page Editor"
                        icon="pi pi-external-link"
                        @click="openInPageEditor"
                        class="mb-4"
                        severity="secondary"
                    />
                    </div>
                    
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <!-- <label class="block text-gray-700 text-lg mb-2">Preview Text</label> -->
                    <!-- <div ref="editorRef" class="h-[320px]"></div> -->
                    <!-- <Editor v-model="project.preview_text" editorStyle="height: 200px" /> -->
                    <RichTextEditor 
                        v-model="project.preview_text" 
                        :label="'Preview Text'"
                    />
                </div>
                <div class="form-group" style="margin-top: 15px;">
                    <!-- <label class="block text-gray-700 text-lg mb-2">Description</label> -->
                    <!-- <Editor v-model="project.description" editorStyle="height: 200px" /> -->
                    <RichTextEditor 
                        v-model="project.description" 
                        :label="'Description'"
                    />
                </div>
                <!-- Description 2 -->
                <!-- <div class="form-group" style="margin-top: 15px;"> -->
                    <!-- <label class="block text-gray-700 text-lg mb-2">Description Two</label> -->
                    <!-- <div ref="editorRef" class="h-[320px]"></div> -->
                    <!-- <Editor v-model="project.meta_description" editorStyle="height: 200px" /> -->
                    <!-- <RichTextEditor 
                    v-model="project.meta_description" 
                    :label="'Description Two'" 
                    /> -->
                <!-- </div> -->
                <div class="form-group">
                    <h2 class="text-lg font-medium border-b border-gray-200 mb-10 mt-10">Project Main Section</h2>
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Main Section Title</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="project.main_title" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter Title" />
                    </div>
                    <div class="flex flex-col md:flex-row gap-4 mt-10 mb-10" v-if="!isAddMode">
                        <div class="flex flex-col gap-2">
                            <label class="col-span-12 md:col-span-2 flex items-center text-lg">Main Image One</label>
                            <!-- {size: {width: 1346, height: 608}} -->
                            <UploadFileFeature 
                                v-model:uploadedFilesData="project.main_image_one"
                                :fb="fb"
                                :property="'main_image_one'"
                                @upload="uploadMainImage($event, 'main_image_one')"
                                @removeUploadedFile="deleteMainImage($event, 'main_image_one')"
                            />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="col-span-12 md:col-span-2 flex items-center text-lg">Main Image Two</label>
                             <!-- {size: {width: 670, height: 686}} -->
                            <UploadFileFeature 
                                v-model:uploadedFilesData="project.main_image_two"
                                :fb="fb"
                                :property="'main_image_two'"
                                @upload="uploadMainImage($event, 'main_image_two')"
                                @removeUploadedFile="deleteMainImage($event, 'main_image_two')"
                            />
                        </div>
                    </div>
                    <div class="form-group" style="margin-top: 15px;">
                        <!-- <label class="block text-gray-700 text-lg mb-2">Main Description One</label> -->
                        <!-- <Editor v-model="project.main_description_one" editorStyle="height: 200px" /> -->
                        <RichTextEditor 
                        v-model="project.main_description_one" 
                        :label="'Main Description One'"
                        />
                    </div>
                    <div class="form-group" style="margin-top: 15px;">
                        <!-- <label class="block text-gray-700 text-lg mb-2">Main Description Two</label> -->
                        <!-- <Editor v-model="project.main_description_two" editorStyle="height: 200px" /> -->
                        <RichTextEditor 
                        v-model="project.main_description_two" 
                        :label="'Main Description Two'" 
                        />
                    </div>
                    <div class="form-group" style="margin-top: 15px;">
                        <!-- <label class="block text-gray-700 text-lg mb-2">Main Description Three</label> -->
                        <!-- <Editor v-model="project.main_description_three" editorStyle="height: 200px" /> -->
                        <RichTextEditor 
                        v-model="project.main_description_three" 
                        :label="'Main Description Three'" 
                        />
                    </div>
                    <div class="form-group" style="margin-top: 15px;">
                        <!-- <label class="block text-gray-700 text-lg mb-2">Main Description Four</label> -->
                        <!-- <Editor v-model="project.main_description_four" editorStyle="height: 200px" /> -->
                        <RichTextEditor 
                        v-model="project.main_description_four" 
                        :label="'Main Description Four'" 
                        />
                    </div>
                </div>
                <!-- meta data -->
                <div class="space-y-4">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Meta Data</h3>
                    <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Meta
                            Title</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <InputText v-model="project.meta_title" class="w-full text-lg p-2"
                                placeholder="Enter meta title" />
                        </div>
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Meta
                            Description</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <Textarea v-model="project.meta_description" class="w-full text-lg p-2"
                                placeholder="Enter meta description" />
                        </div>
                        <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Meta
                            Keywords</label>
                        <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                            <Textarea v-model="project.meta_keywords"
                                class="w-full text-lg border border-gray-200 rounded-md p-2"
                                placeholder="Enter meta keywords" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right column -->
            <!-- <ProjectSidebar :projectData="project" :is-add-mode="isAddMode" /> -->
            <ProjectSidebar :is-add-mode="isAddMode" />
        </div>
    </div>
</template>

<style scoped>

</style>