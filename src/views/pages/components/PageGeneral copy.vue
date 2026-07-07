<script setup lang="ts">
import { defineProps, defineEmits, onMounted } from 'vue';
import PageSidebar from './PageSidebar.vue';
import { Page } from '@/models/Page.ts';

const emit = defineEmits(['update:page', 'saved']);

const props = defineProps({
  page: {
    type: Page,
    required: true,
    default: () => new Page({})
  }
});

// Update the input handler to use props.page
const onNameInput = (e: any) => {
    console.log('update', props.page);
    props.page.content.slug = e.target.value.toLowerCase().replace(/ /g, '-');
}

const openInPageEditor = () => {
    // Implement page editor logic
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
            <div class="w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Details</h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Name -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="props.page.content.name" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter name" @input="onNameInput"/>
                    </div>
                    <!-- Slug -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Slug</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="page.content.slug" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter slug" />
                    </div>

                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Excerpt</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="page.content.excerpt" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter excerpt" />
                    </div>

                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Meta Keywords</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="page.content.meta_keywords" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter meta keywords" />
                    </div>

                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Meta Description</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="page.content.meta_description" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter meta description" />
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

                <div class="form-group" style="margin-top: 0px;">
                    <label class="block text-gray-700 text-lg mb-2">Description</label>
                    <Editor v-model="page.description" editorStyle="height: 200px" />

                </div>
            </div>

            <!-- Right column -->
            <PageSidebar :page="page" v-bind.page="page" />
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
    flex:1;
}
</style>