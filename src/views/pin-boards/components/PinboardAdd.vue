<script setup lang="ts">
import { defineEmits, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useLengthTypeStore } from '@/stores/lengthType';


const lengthTypeStore = useLengthTypeStore();
const { lengthType, fb } = storeToRefs(lengthTypeStore);

const emit = defineEmits(['update:lengthType', 'saved']);


onMounted(async () => {
    lengthTypeStore.resetLengthType(); //reset form for add.
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex gap-6">
            <!-- Left column: Post Tag Form -->
            <div class="w-3/5 space-y-4">

                <div class="grid grid-cols-12 gap-2">
                    <label for="name"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg w-full" id="name" type="text" v-model="lengthType.name"
                            placeholder="Name" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="unit"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Unit</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg w-full" id="unit" type="text" v-model="lengthType.unit"
                            placeholder="Unit" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="value"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Value</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg w-full" id="value" type="text" v-model="lengthType.value"
                            placeholder="Value" />
                    </div>
                </div>
            </div>

            <div class="w-2/5 space-y-4" v-if="fb.errors['variant.create']">
                <h3 class="text-lg font-medium border-b border-gray-200 pt-5 pb-2 text-red-600">
                    Errors
                </h3>
                <div v-html="fb.renderErrors('variant.create')"
                    class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
            </div>


        </div>
    </div>
</template>

<style scoped></style>
