<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useReturnStatusStore } from '@/stores/returnStatus';
import { storeToRefs } from 'pinia';
import ReturnStatus from '@/models/ReturnStatus';
import { useLanguageStore } from '@/stores/language';
const returnStatusStore = useReturnStatusStore();
const languageStore = useLanguageStore();

const { languages } = storeToRefs(languageStore);
const { fb, returnStatus } = storeToRefs(returnStatusStore);

const emit = defineEmits(['update:returnStatus', 'saved', 'editTabUnmunted', 'editTabMounted']);

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
                    Return Status Details
                </h3>
                <div class="grid grid-cols-12 gap-2">
                    <label for="name"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText v-model="returnStatus.name" :disabled="fb.loading['returnStatus.create']" class="w-full text-lg border border-gray-200 rounded-md p-2" id="name" type="text" placeholder="Name" 
                        :class="{'p-invalid': fb.errors?.['returnStatus.create']?.name}" />
                        <Message v-if="fb.errors?.['returnStatus.create']?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['returnStatus.create']?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="language"
                        class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Language</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select v-model="returnStatus.language_id" :options="languages" optionLabel="name" optionValue="language_id" :disabled="fb.loading['returnStatus.create']" class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Select a Language" />
                    </div>
                </div>
            </div>
            <!-- <div class="w-2/5 space-y-4" v-if="fb.errors['returnStatus.create']">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">
                    Errors
                </h3>
                <div v-html="fb.renderErrors('returnStatus.create')"
                    class="border border-red-300 bg-red-50 text-red-700 rounded-md p-3"></div>
            </div> -->
        </div>
    </div>
</template>

<style scoped>
</style>