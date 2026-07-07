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
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Post Tag Details
                </h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Post Tag Name -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">
                        Name
                    </label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="postTag.name" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter tag name" @input="onFieldChange" />
                    </div>
                    <!-- Slug -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Slug</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="postTag.slug" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter slug" />
                    </div>
                    <!-- description  -->
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Description</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <Textarea v-model="postTag.description" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter description" />
                    </div>

                   
                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Dropdown 
                            v-model="postTag.status" 
                            :options="statusOptions" 
                            optionLabel="label" 
                            optionValue="code"
                            placeholder="Select Status"
                            class="w-full text-lg"
                        />
                    </div>

                </div>
            </div>

            <div class="w-2/5 space-y-4" v-if="fb.errors['postTag.create']">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                Errors
                </h3>
                <div v-html="fb.renderErrors('postTag.create')"></div>
            </div>

        </div>
    </div>
</template>

<style scoped></style>
