<script setup lang="ts">
import { defineEmits, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { usePostTagStore } from '@/stores/postTag';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

const route = useRoute();
const postTagStore = usePostTagStore();
const { postTag, fb } = storeToRefs(postTagStore);
const emit = defineEmits(['update:postTags', 'saved']);

// update slug

const onFieldChange = () => {
    postTag.value.slug = postTag?.value?.name?.toLowerCase().replace(/ /g, '-');
    emit('update:postTags', postTag.value);
};

const statusOptions = [
    { label: 'Enabled', code: 1 },
    { label: 'Disabled', code: 0 },
];

// Fetch post tag if editing
watch(() => route.params.id, async (id) => {
    if (id) {
        const postTagId = Array.isArray(id) ? id[0] : id;
        await postTagStore.fetchPostTagById(postTagId);
    } else {
        postTagStore.resetPostTag();
    }
}, { immediate: true });

onMounted(async () => {
    const id = route.params.id;
    if (id) {
        const postTagId = Array.isArray(id) ? id[0] : id;
        await postTagStore.fetchPostTagById(postTagId);
    } else {
        postTagStore.resetPostTag();
    }
});
</script>

<template>
    <div class="flex flex-col gap-6 mt-6">
        <div class="flex gap-6">
            <!-- Left column: Post Tag Form -->
            <div class="w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b pb-2">
                    Post Category Details
                </h3>
                <div class="flex flex-col gap-6">
                    <div class="grid grid-cols-12 gap-2">
                        <label for="title"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Title</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText class="text-lg w-full" id="name" type="text" v-model="postTag.name"
                                placeholder="Name" />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label for="slug"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Slug</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText class="text-lg w-full" id="slug" type="text" v-model="postTag.slug"
                                placeholder="Name" />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label for="content"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Content</label>
                        <div class="col-span-12 md:col-span-10">
                            <Textarea class="text-md w-full" v-model="postTag.description" placeholder="Content"
                                :autoResize="true" rows="3" cols="30" />
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-2">
                        <label for="meta_title"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Meta Title</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText class="text-lg w-full" id="meta_title" type="text" v-model="postTag.meta_title"
                                placeholder="Name" />
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2">
                        <label for="meta_description"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Meta
                            Description</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText class="text-lg w-full" id="meta_description" type="text"
                                v-model="postTag.meta_description" placeholder="Name" />
                        </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2">
                        <label for="meta_keywords"
                            class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Meta
                            Keywords</label>
                        <div class="col-span-12 md:col-span-10">
                            <InputText class="text-lg w-full" id="meta_keywords" type="text"
                                v-model="postTag.meta_keywords" placeholder="Name" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="w-2/5 space-y-4" v-if="fb.errors['postTag.create']">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Errors
                </h3>
                <div v-html="fb.errors['postTag.create']"></div>
            </div>

        </div>
    </div>
</template>

<style scoped></style>
