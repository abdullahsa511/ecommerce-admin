<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useWeightTypeStore } from '@/stores/weightType';


const emit = defineEmits(['update:weightType', 'saved', 'editTabUnmunted', 'editTabMounted']);

const props = defineProps<{ id?: string }>();

const route = useRoute();
const weightTypeStore = useWeightTypeStore();
const { weightType, fb } = storeToRefs(weightTypeStore);

onMounted(async () => {
    emit('editTabMounted');
    if (route.params.id) {
        await weightTypeStore.fetchWeightTypeById(route.params.id as string);//string data type
    }
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <div class="loading-overlay" v-if="fb.loading['weightType.edit.' + (props.id ?? (route.params.id as string))]">
        <div class="flex justify-center items-center h-full spinner">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
            <p class="mt-2">Loading weight type details. Please wait.</p>
        </div>
    </div>

    <div class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column: Weight Type Form -->
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Edit Weight Type</h3>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <!-- Weight Type user -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
                        Name
                    </label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="weightType.name" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter weight type name"
                            :class="{'p-invalid': fb.errors?.['weightType.update.' + (props.id ?? (route.params.id as string))]?.name}" />
                            <Message v-if="fb.errors?.['weightType.update.' + (props.id ?? (route.params.id as string))]?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['weightType.update.' + (props.id ?? (route.params.id as string))]?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                  
                    <!-- description  -->
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Unit</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="weightType.unit"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter unit"
                            :class="{'p-invalid': fb.errors?.['weightType.update.' + (props.id ?? (route.params.id as string))]?.unit}" />
                            <Message v-if="fb.errors?.['weightType.update.' + (props.id ?? (route.params.id as string))]?.unit" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['weightType.update.' + (props.id ?? (route.params.id as string))]?.unit" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Value</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="weightType.value as unknown as string | null"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter value" type="number"
                            :class="{'p-invalid': fb.errors?.['weightType.update.' + (props.id ?? (route.params.id as string))]?.value}" />
                            <Message v-if="fb.errors?.['weightType.update.' + (props.id ?? (route.params.id as string))]?.value" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['weightType.update.' + (props.id ?? (route.params.id as string))]?.value" :key="error" class="flex flex-col">
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
