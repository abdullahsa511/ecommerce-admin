<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { usePostTypeStore } from '@/stores/postType';
import { storeToRefs } from 'pinia';
const emit = defineEmits(['update:postType', 'saved', 'editTabUnmunted', 'editTabMounted']);
const postTypeStore = usePostTypeStore();
const { postType, fb } = storeToRefs(postTypeStore);

onMounted(() => {
    emit('editTabMounted');
    postTypeStore.fetchPostTypes();
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">
            <div class="flex flex-col gap-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Add New Post Type</h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="postType.name" class="text-lg" id="name" type="text" placeholder="Enter post type name" 
                        :class="{ 'p-invalid': fb.errors['postType.create']?.name }" />
                        <Message v-if="fb.errors['postType.create']?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['postType.create']?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="type" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Type</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="postType.type" class="text-lg" id="type" type="text" placeholder="Example: post" 
                        :class="{ 'p-invalid': fb.errors['postType.create']?.type }" />
                        <Message v-if="fb.errors['postType.create']?.type" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['postType.create']?.type" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="plural" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Plural</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="postType.plural" class="text-lg" id="plural" type="text" placeholder="Example: posts" 
                        :class="{ 'p-invalid': fb.errors['postType.create']?.plural }" />
                        <Message v-if="fb.errors['postType.create']?.plural" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['postType.create']?.plural" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="icon" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Icon</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="postType.icon" class="text-lg" id="icon" type="text" placeholder="icon-document-text-outline" :class="{ 'p-invalid': fb.errors['postType.create']?.icon }" />
                        <Message v-if="fb.errors['postType.create']?.icon" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['postType.create']?.icon" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

            </div>
        </div>
    </Fluid>
</template>