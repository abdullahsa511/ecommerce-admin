<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRegionGroupStore } from '@/stores/regionGroup';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
const emit = defineEmits(['update:regionGroup', 'saved']);
const regionGroupStore = useRegionGroupStore();
const { newRegionGroup, fb } = storeToRefs(regionGroupStore);

</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8">
        <div class="w-full">
            <div class="flex flex-col gap-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Add Region Group</h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="name" type="text" placeholder="Name" v-model="newRegionGroup.name" :class="{'p-invalid': fb.errors['regionGroup.create']?.name}" />
                        <Message v-if="fb.errors['regionGroup.create']?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['regionGroup.create']?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="content" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Content</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="content" type="text" placeholder="Content" v-model="newRegionGroup.content" :class="{'p-invalid': fb.errors['regionGroup.create']?.content}" />
                        <Message v-if="fb.errors['regionGroup.create']?.content" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['regionGroup.create']?.content" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>