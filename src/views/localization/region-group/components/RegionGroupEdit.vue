<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRegionGroupStore } from '@/stores/regionGroup';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['update:regionGroup', 'saved', 'editTabUnmunted', 'editTabMounted']);
const regionGroupStore = useRegionGroupStore();
const { newRegionGroup, fb } = storeToRefs(regionGroupStore);

const route = useRoute();
const regionGroupId = route.params.id;

onMounted(async () => {
    emit('editTabMounted');
    await regionGroupStore.fetchRegionGroupById(regionGroupId);
    console.log('newRegionGroup', newRegionGroup.value);
})
onUnmounted(() => {
    emit('editTabUnmunted');
});

</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="loading-overlay" v-if="fb.loading['regionGroup.edit.' + regionGroupId]">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading region group data. Please wait.</p>
            </div>
        </div>
        <div class="w-full">
            <div class="flex flex-col gap-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Region Group</h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="name" type="text" placeholder="Name" v-model="newRegionGroup.name" :class="{'p-invalid': fb.errors['regionGroup.update.' + regionGroupId]?.name}" />
                        <Message v-if="fb.errors['regionGroup.update.' + regionGroupId]?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['regionGroup.update.' + regionGroupId]?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="content" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Content</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="content" type="text" placeholder="Content" v-model="newRegionGroup.content" :class="{'p-invalid': fb.errors['regionGroup.update.' + regionGroupId]?.content}" />
                        <Message v-if="fb.errors['regionGroup.update.' + regionGroupId]?.content" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['regionGroup.update.' + regionGroupId]?.content" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>