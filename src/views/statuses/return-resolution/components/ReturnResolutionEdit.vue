<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useReturnResolutionStore } from '@/stores/returnResolution';
import { storeToRefs } from 'pinia';
import ReturnResolution from '@/models/ReturnResolution';
import { useLanguageStore } from '@/stores/language';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const route = useRoute();
const returnResolutionStore = useReturnResolutionStore();
const languageStore = useLanguageStore();
const { languages } = storeToRefs(languageStore);
const { fb, returnResolution } = storeToRefs(returnResolutionStore);

const returnResolutionId = route.params.id;
const emit = defineEmits(['editTabMounted', 'editTabUnmunted', 'saved']);

onMounted(async () => {
    try {
        emit('editTabMounted');
        languageStore.fetchLanguages();
        const fetchedReturnResolution = await returnResolutionStore.findReturnResolutionById(returnResolutionId);
        returnResolution.value = new ReturnResolution(fetchedReturnResolution);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load return resolution details. Please try again.',
            life: 3000
        });
    }
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
                    Return Resolution Edit
                </h3>
                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <InputText v-model="returnResolution.name"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" id="name" type="text"
                            placeholder="Name" :class="{'p-invalid': fb.errors['returnResolution.update.'+returnResolutionId]?.name}" />
                        <Message v-if="fb.errors['returnResolution.update.'+returnResolutionId]?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['returnResolution.update.'+returnResolutionId]?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label class="col-span-12 md:col-span-2 flex items-center text-lg">Language</label>
                    <div class="col-span-12 md:col-span-10 py-2">
                        <Select v-model="returnResolution.language_id" :options="languages" optionLabel="name"
                            optionValue="language_id"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Select a Language" :class="{'p-invalid': fb.errors['returnResolution.update.'+returnResolutionId]?.language_id}" />
                        <Message v-if="fb.errors['returnResolution.update.'+returnResolutionId]?.language_id" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['returnResolution.update.'+returnResolutionId]?.language_id" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
            </div>
            <!--  -->
            <div class="w-2/5" v-if="returnResolution?.return_resolution_id">
                <div class="border border-gray-200 rounded-md p-4">
                    <h4 class="text-lg font-medium mb-2">Preview Return Resolution</h4>
                    <p><strong>Name:</strong> {{ returnResolution?.name }}</p>
                    <p><strong>Language:</strong> {{languages.find(language => language.language_id ===
                        returnResolution?.language_id)?.name}}</p>
                </div>
                <!-- <div v-if="fb.errors['returnResolution.update']" class="mt-4">
                    <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                        Errors
                    </h3>
                    <div v-html="fb.renderErrors('returnResolution.update')"
                        class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
                </div> -->
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