<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useReturnResolutionStore } from '@/stores/returnResolution';
import { storeToRefs } from 'pinia';
import ReturnResolution from '@/models/ReturnResolution';
import { useLanguageStore } from '@/stores/language';

const emit = defineEmits(['update:returnResolution', 'saved', 'editTabUnmunted', 'editTabMounted']);

const returnResolutionStore = useReturnResolutionStore();
const languageStore = useLanguageStore();
const {languages} = storeToRefs(languageStore);
const {fb, returnResolution} = storeToRefs(returnResolutionStore);

onMounted(() => {
    emit('editTabMounted');
    languageStore.fetchLanguages();
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
     <div class="flex flex-col gap-6">
        <div class="flex gap-6">
            <div class="w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Return Resolution Add
                </h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="returnResolution.name" :disabled="fb.loading['returnResolution.create']"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" id="name" type="text"
                            placeholder="Name" :class="{'p-invalid': fb.errors['returnResolution.create']?.name}" />
                        <Message v-if="fb.errors['returnResolution.create']?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['returnResolution.create']?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="language" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Language</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select v-model="returnResolution.language_id" :options="languages" optionLabel="name"
                            optionValue="language_id" :disabled="fb.loading['returnResolution.create']"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Select a Language" :class="{'p-invalid': fb.errors['returnResolution.create']?.language_id}" />
                        <Message v-if="fb.errors['returnResolution.create']?.language_id" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['returnResolution.create']?.language_id" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
            </div>
            <!-- <div class="w-2/5" v-if="fb.errors['returnResolution.create']">
                <div class="mt-4">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                        Errors
                    </h3>
                    <div v-html="fb.renderErrors('returnResolution.create')"
                        class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
                </div>  
            </div> -->
        </div>
    </div>
</template>

<style scoped>
label {
    font-size: 1.2rem;
}
:deep(input::placeholder),
:deep(textarea::placeholder) {
    color: #767779 !important;
    opacity: 1;
    font-size: 1.2rem;
}
</style>