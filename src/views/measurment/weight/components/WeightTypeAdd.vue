<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useWeightTypeStore } from '@/stores/weightType';


const weightTypeStore = useWeightTypeStore();
const { weightType, fb } = storeToRefs(weightTypeStore);

const emit = defineEmits(['update:weightType', 'saved']);


onMounted(async () => {
    weightTypeStore.resetWeightType(); //reset form for add.
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row gap-6">
            <!-- Left column: Post Tag Form -->
            <div class="sm:w-full md:w-3/5 space-y-4">

                <div class="grid grid-cols-12 gap-2">
                    <label for="name"
                        class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Name</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText class="text-lg w-full" id="name" type="text" v-model="weightType.name"
                            placeholder="Enter weight type name" :class="{'p-invalid': fb.errors?.['weightType.create']?.name}" />
                            <Message v-if="fb.errors?.['weightType.create']?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['weightType.create']?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="unit"
                        class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Unit</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText class="text-lg w-full" id="unit" type="text" v-model="weightType.unit"
                            placeholder="Enter unit" :class="{'p-invalid': fb.errors?.['weightType.create']?.unit}" />
                            <Message v-if="fb.errors?.['weightType.create']?.unit" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['weightType.create']?.unit" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="value"
                        class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Value</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText class="text-lg w-full" id="value" type="number" v-model="weightType.value as unknown as string"
                            placeholder="Enter value" :class="{'p-invalid': fb.errors?.['weightType.create']?.value}" />
                            <Message v-if="fb.errors?.['weightType.create']?.value" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['weightType.create']?.value" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
            </div>

            <div class="w-2/5 space-y-4" v-if="fb.errors['variant.create']">
                <h3 class="text-lg font-medium border-b border-gray-200 pt-5 pb-2 text-red-600">
                    Errors
                </h3>
                
            </div>


        </div>
    </div>
</template>

<style scoped></style>
