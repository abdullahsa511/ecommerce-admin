<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useReturnStatusStore } from '@/stores/returnStatus';
import { storeToRefs } from 'pinia';
import ReturnStatus from '@/models/ReturnStatus';
import { useLanguageStore } from '@/stores/language';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const emit = defineEmits(['editTabMounted', 'editTabUnmunted', 'saved']);
const route = useRoute();
const returnStatusStore = useReturnStatusStore();
const languageStore = useLanguageStore();
const { languages } = storeToRefs(languageStore);
const { fb, returnStatus } = storeToRefs(returnStatusStore);

const returnStatusId = route.params.id;

onMounted(async () => {
    try {
        emit('editTabMounted');
        languageStore.fetchLanguages();
        const fetchedReturnStatus = await returnStatusStore.findReturnStatusById(returnStatusId);
        returnStatus.value = new ReturnStatus(fetchedReturnStatus);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load return status details. Please try again.',
            life: 3000
        });
    }
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>

<div class="loading-overlay" v-if="fb.loading['returnStatus.edit.' + (route.params.id)]">
        <div class="flex justify-center items-center h-full spinner">
            <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
            <p class="mt-2">Loading return status details. Please wait.</p>
        </div>
    </div>


    <div class="flex flex-col gap-6">
        <div class="flex gap-6">
            <div class="w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Return Status Edit
                </h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label for="name"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="returnStatus.name" :disabled="fb.loading['returnStatus.update']"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" id="name" type="text"
                            placeholder="Name"
                            :class="{'p-invalid': fb.errors?.['returnStatus.update.' + (route.params.id)]?.name}" />
                        <Message v-if="fb.errors?.['returnStatus.update.' + (route.params.id)]?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['returnStatus.update.' + (route.params.id)]?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label for="language"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Language</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <Select v-model="returnStatus.language_id" :options="languages" optionLabel="name"
                            optionValue="language_id" :disabled="fb.loading['returnStatus.update']"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Select a Language" />
                    </div>
                </div>
            </div>
            <div class="w-2/5 space-y-4" v-if="returnStatus?.return_status_id">
                <div class="border border-gray-200 rounded-md p-4">
                    <h4 class="text-lg font-medium mb-2">Preview Return Status</h4>
                    <p><strong>Name:</strong> {{ returnStatus?.name }}</p>
                    <p><strong>Language:</strong> {{languages.find(language => language.language_id ===
                        returnStatus?.language_id)?.name}}</p>
                </div>
                <div v-if="fb.errors['returnStatus.update']" class="mt-4">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                        Errors
                    </h3>
                    <div v-html="fb.renderErrors('returnStatus.update')"
                        class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
                </div>
            </div>
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