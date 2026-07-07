<script setup lang="ts">
import { defineProps, defineEmits, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router'; // ✅ include useRoute
import PageSidebar from './PageSidebar.vue';
import { useToast } from 'primevue/usetoast';
import { FileModel } from '@/models/Media.ts';
import { storeToRefs } from 'pinia';
import { Page } from '@/models/Page.ts';
import { usePageStore } from '@/stores/page';
import HtmlCodeEditor from '@/components/form/HtmlCodeEditor.vue';


const toast = useToast();
const pageStore = usePageStore();
const { fb } = storeToRefs(pageStore);
const emit = defineEmits(['update:page', 'saved']);
const route = useRoute(); // ✅ reactive route
const isAddMode = computed(() => route.path.includes('/add')); // ✅ fixed reactive detection
const props = defineProps({
    page: {
        type: Page,
        required: true,
        default: () => new Page({})
    }
});

// Update the input handler to use props.page
const onNameInput = (e: any) => {
    props.page.postContent.slug = e.target.value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')        // replace spaces with -
        .replace(/[^a-z0-9-]/g, '')  // remove all special chars except -
        .replace(/-+/g, '-');        // remove duplicate -
}

const uploadImages = async (event: any, property: string) => {
    try {
        const response: any = await pageStore.uploadFiles(event.files, property, props.page.post_id);
        // const response: any = await mediaStore.uploadFiles(event.files, property, options);
        props.page[property] = response.files.map((file: any) => new FileModel(file));
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Image Updated successfully',
            life: 3000
        });
        emit('update:page', props.page);
    } catch (error) {
        console.error('Error uploading site logo:', error);
    }
}
const deleteMainImage = async (file: any, property: string) => {
    try {
        await pageStore.deleteImageByFilePath(file.image, property, props.page.post_id);
        props.page[property] = [];
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Image Delete successfully',
            life: 3000
        });
        emit('update:page', props.page);
    } catch (error) {
        console.error('Error deleting site logo:', error);
    }
};

onMounted(() => {
    console.log('on mounted', props.page);
});
</script>

<template>
    <!-- General Tab -->
    <div class="flex flex-col gap-6">
        <div class="flex gap-6">
            <!-- Left column -->
            <div class="w-5/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Details</h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Name -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="props.page.postContent.name"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter name"
                            @input="onNameInput"
                            :class="{ 'p-invalid': fb.errors['page.create'] || fb.errors['page.update.' + route.params.id] }" />
                        <Message v-if="fb.errors['page.create'] || fb.errors['page.update.' + route.params.id]?.name"
                            severity="error" size="small" variant="title">
                            <span
                                v-for="error in fb.errors['page.create']?.name || fb.errors['page.update.' + route.params.id]?.name"
                                :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                    <!-- Slug -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Slug</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="props.page.postContent.slug"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter slug"
                            :class="{ 'p-invalid': fb.errors['page.create'] || fb.errors['page.update.' + route.params.id]?.slug }" />
                        <Message v-if="fb.errors['page.create'] || fb.errors['page.update.' + route.params.id]?.slug"
                            severity="error" size="small" variant="title">
                            <span
                                v-for="error in fb.errors['page.create']?.slug || fb.errors['page.update.' + route.params.id]?.slug"
                                :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>

                    </div>
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Excerpt</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="props.page.postContent.excerpt"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter excerpt" />
                    </div>
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Meta Keywords</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="props.page.postContent.meta_keywords"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter meta keywords" />
                    </div>
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Meta Description</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="props.page.postContent.meta_description"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter meta description" />
                    </div>
                </div>
                <!-- <div class="form-group" style="margin-top: 0px;">
                    <RichTextEditor v-model="props.page.description" :label="'Description'" :editorStyle="'height: 200px'"/>
                </div> -->
                <div class="form-group">
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Title</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="props.page.title"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter Title"
                            :class="{ 'p-invalid': fb.errors['page.create'] || fb.errors['page.update.' + route.params.id]?.title }" />
                        <Message v-if="fb.errors['page.create'] || fb.errors['page.update.' + route.params.id]?.title"
                            severity="error" size="small" variant="title">
                            <span
                                v-for="error in fb.errors['page.create']?.title || fb.errors['page.update.' + route.params.id]?.title"
                                :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                    <div class="form-group" style="margin-top: 25px;">
                        <!-- <label class="block text-gray-700 text-lg mb-2">Description One</label> -->
                        <!-- <Editor v-model="page.description_one" editorStyle="height: 200px" /> -->
                        <HtmlCodeEditor
                            v-model="props.page.postContent.content"
                            label="Content"
                            editor-style="height: 1000px"
                            container-style="width: 100%"
                        />
                    </div>
                </div>
                <!-- Content End -->

                <!-- Sites Section -->
                <!-- <div class="bg-white rounded-lg shadow-sm">
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Sites</label>
                    <RadioButton v-model="props.page.site_id" :value="props.page.site_id" class="scale-110" />
                    <label class="ml-2">{{ props.page.site_id }}</label>
                </div>

                <div class="bg-white rounded-lg shadow-sm">
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Template</label>

                    <Select v-model="props.page.template" :options="['-- Default template --']" class="w-full" />
                </div> -->



            </div>
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
    border-radius: 5px;
    padding: 10px;
    flex: 1;
}
</style>