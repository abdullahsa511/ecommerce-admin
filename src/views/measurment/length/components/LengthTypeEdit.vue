<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useLengthTypeStore } from '@/stores/lengthType';


const emit = defineEmits(['update:lengthType', 'saved', 'editTabUnmunted', 'editTabMounted']);
const props = defineProps<{ id?: string }>();

const route = useRoute();
const lengthTypeStore = useLengthTypeStore();
const { lengthType, fb } = storeToRefs(lengthTypeStore);

onMounted(async () => {
    emit('editTabMounted');
    const lengthTypeId = props.id ?? (route.params.id as string | undefined);
    if (lengthTypeId) {
        await lengthTypeStore.fetchLengthTypeById(lengthTypeId);
    }
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>

    <div class="loading-overlay" v-if="fb.loading['lengthType.edit.' + (props.id ?? (route.params.id as string))]">
        <div class="flex justify-center items-center h-full spinner">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
            <p class="mt-2">Loading length type data. Please wait.</p>
        </div>
    </div>



    <div class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column: Length Type Form -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Length Type</h3>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Length Type user -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
                        Name
                    </label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText 
                        v-model="lengthType.name" 
                        class="w-full text-lg border border-gray-200 rounded-md p-2"
                        placeholder="Enter length type name"
                        :class="{'p-invalid': fb.errors?.['lengthType.update.'+route.params.id]?.name}"
                        />
                            <Message v-if="fb.errors?.['lengthType.update.'+route.params.id]?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['lengthType.update.'+route.params.id]?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                  
                    <!-- unit  -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Unit</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="lengthType.unit"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter unit" 
                            :class="{'p-invalid': fb.errors?.['lengthType.update.'+route.params.id]?.unit}"
                            />
                            <Message v-if="fb.errors?.['lengthType.update.'+route.params.id]?.unit" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['lengthType.update.'+route.params.id]?.unit" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>

                    </div>
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Value</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="lengthType.value"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter value" type="number" 
                            :class="{'p-invalid': fb.errors?.['lengthType.update.'+route.params.id]?.value}"
                            />
                            <Message v-if="fb.errors?.['lengthType.update.'+route.params.id]?.value" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['lengthType.update.'+route.params.id]?.value" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Optional custom styles */
</style>
