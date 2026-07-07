<script setup lang="ts">
import { onMounted } from 'vue';
import PostSidebar from './PostSidebar.vue';
import { usePostStore } from '@/stores/post';
import { storeToRefs } from 'pinia';
import RichTextEditor from '@/components/form/RichTextEditor.vue';

defineEmits(['update:post', 'saved']);

const postStore = usePostStore();
const { fb, post } = storeToRefs(postStore);

const openInPageEditor = () => {
    // Implement page editor logic
};

const onNameInput = (e: any) => {
    // post.value.postContent.slug = e.target.value.toLowerCase().replace(/ /g, '-');
    post.value.postContent.slug = e.target.value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')        // replace spaces with -
        .replace(/[^a-z0-9-]/g, '')  // remove all special chars except -
        .replace(/-+/g, '-');        // remove duplicate -
        
}

onMounted(() => {
    // postStore.resetPostType();

});

</script>

<template>
    <!-- General Tab -->
    <div class="flex flex-col gap-6 card">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Details</h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Name -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Name</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="post.postContent.name" @input="onNameInput"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter name"
                            :class="{ 'p-invalid': fb.errors['post.create'] || fb.errors['post.update'] }" />
                            <Message v-if="fb.errors['post.create'] || fb.errors['post.update']" severity="error"
                                size="small" variant="title">
                                <span v-for="error in fb.errors['post.create']?.name || fb.errors['post.update']?.name" :key="error"
                                    class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>
                    <!-- Slug -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Slug</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="post.postContent.slug" @input="onNameInput"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter slug" :class="{ 'p-invalid': fb.errors['post.create'] || fb.errors['post.update'] }" />
                            <Message v-if="fb.errors['post.create'] || fb.errors['post.update']" severity="error"
                                size="small" variant="title">
                                <span v-for="error in fb.errors['post.create']?.slug || fb.errors['post.update']?.slug" :key="error"
                                    class="flex flex-col">
                                    {{ error }}
                                </span>
                            </Message>
                    </div>

                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Excerpt</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Textarea v-model="post.postContent.excerpt"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter excerpt" />
                    </div>

                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Meta Keywords</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Textarea v-model="post.postContent.meta_keywords"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter meta keywords" />
                    </div>

                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Meta Description</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Textarea v-model="post.postContent.meta_description"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter meta description" />
                    </div>

                </div>
                <!-- Content -->
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label class="col-span-12 md:col-span-2 flex text-lg">Content</label>
                    <div class="col-span-12 md:col-span-4">

                        <Button label="Open in Page Editor" icon="pi pi-external-link" @click="openInPageEditor"
                            class="mb-4" severity="secondary" />
                    </div>

                </div>

                <div style="margin-top: 0px;">
                    <RichTextEditor 
                    v-model="post.description" 
                    label="Description" 
                    :post-id="post.post_id" 
                    />
                </div>
                <div style="margin-top: 25px;">
                    <RichTextEditor 
                    v-model="post.description_one" 
                    label="Description One" 
                    :post-id="post.post_id" 
                    />
                </div>
                <div style="margin-top: 25px;">
                    <RichTextEditor 
                    v-model="post.description_two" 
                    label="Description Two" 
                    :post-id="post.post_id" 
                    />
                </div>
                <div style="margin-top: 25px;">
                    <RichTextEditor 
                    v-model="post.description_three" 
                    label="Description Three" 
                    :post-id="post.post_id" 
                    />
                </div>
            </div>

            <!-- Right column -->
            <PostSidebar :post="post" v-bind.post="post" />
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

.way-points-button > button {
    margin-left: 80px;
    margin-bottom: 15px;
    font-size: 0.85rem;
    padding: 2px 9px;
    border-radius: 8px;
    font-weight: 500;
}

</style>