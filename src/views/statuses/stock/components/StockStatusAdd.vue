<script setup>
import { useStockStatusStore } from '@/stores/stockStatus';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';
import { useLanguageStore } from '@/stores/language';

const emit = defineEmits(['update:stockStatus', 'saved', 'editTabUnmunted', 'editTabMounted']);

const stockStatusStore = useStockStatusStore();
const languageStore = useLanguageStore();
const {languages} = storeToRefs(languageStore);
const {fb, stockStatus} = storeToRefs(stockStatusStore);

onMounted(() => {
    emit('editTabMounted');
    languageStore.fetchLanguages();
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>


    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-3/5 mt-3">
            <div class="flex flex-col gap-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Stock Status Details
                </h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="name" type="text" placeholder="Name" v-model="stockStatus.name" 
                        :class="{'p-invalid': fb.errors['stockStatus.create']?.name}" />
                        <Message v-if="fb.errors['stockStatus.create']?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['stockStatus.create']?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Language</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select v-model="stockStatus.language_id" :options="languages" optionLabel="name" optionValue="language_id" placeholder="Select a Language" class="w-full md:w-56 text-lg" />
                    </div>
                </div>

            </div>
        </div>
        <!-- <div class="w-2/5 space-y-4" v-if="fb.errors['stockStatus.create']">
            <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
            Errors
            </h3>
            <div v-html="fb.renderErrors('stockStatus.create')" class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
        </div> -->
    </Fluid>
</template>

<style scoped>
label {
    font-size: 1.2rem;
}
:deep(input::placeholder),
:deep(textarea::placeholder) {
    color: #767779 !important; /* gray-600 equivalent */
    opacity: 1;
    font-size: 1.2rem;
}

</style>
