<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useFinishStore } from '@/stores/designResourceFinish';

const finishStore = useFinishStore();
const { finish, fb } = storeToRefs(finishStore);

const types = ref<any[] | null>(null);
/** Select uses id; API expects type name (same as FinishEdit.vue) */
const selectedType = ref<number | string | null>(null);

const emit = defineEmits(['update:finish', 'saved', 'editTabUnmunted', 'editTabMounted']);

watch(selectedType, (newVal) => {
    if (newVal != null && types.value?.length) {
        finish.value.type = types.value.find((t: any) => t.id === newVal)?.name ?? null;
    } else {
        finish.value.type = null;
    }
});

const uploadFile = async (event: any, property: 'img' | 'img2') => {
    try {
        await finishStore.uploadFiles(event.files, property, 0);
        emit('update:finish', finish.value);
    } catch (error) {
        console.error('Error uploading finish file:', error);
    }
};

const deleteFile = async (_event: any, property: 'img' | 'img2') => {
    try {
        finish.value[property] = [] as any;
    } catch (error) {
        console.error('Error deleting finish file:', error);
    }
};

onMounted(async () => {
    emit('editTabMounted');
    finishStore.resetFinish();
    finish.value.img = finish.value.img ?? ([] as any);
    finish.value.img2 = finish.value.img2 ?? ([] as any);
    const data = await finishStore.getTypes();
    types.value = data as unknown as any[];
    selectedType.value = null;
});

onUnmounted(() => {
    emit('editTabUnmunted');
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="loading-overlay border-2" v-if="fb.loading['finish.types'] || fb.loading['finish.create']">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading finish add details. Please wait.</p>
            </div>
        </div>
        <div class="flex flex-col md:flex-row gap-6">
            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Add finish</h3>

                <div class="grid grid-cols-12 gap-x-6 gap-y-4">
                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">
                        Title
                    </label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="finish.title" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter title" :class="{'p-invalid': fb.errors?.['finish.create']?.title}" />
                        <Message v-if="fb.errors?.['finish.create']?.title" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors?.['finish.create']?.title" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>

                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Type</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Select v-model="selectedType" :options="(types as any[]) || []" optionLabel="name" optionValue="id"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Select a type" />
                    </div>

                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Grade</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="finish.grade" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter grade" />
                    </div>

                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Link Text</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="finish.link_text"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter link text" />
                    </div>

                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Brand</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="finish.brand" class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter brand" />
                    </div>

                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Hex Value</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <InputText v-model="finish.hex_value"
                            class="w-full text-lg border border-gray-200 rounded-md p-2"
                            placeholder="Enter hex value" />
                    </div>

                    <label class="col-span-12 md:col-span-3 xl:col-span-2 flex items-center text-lg">Description</label>
                    <div class="col-span-12 md:col-span-9 xl:col-span-10 py-2">
                        <Textarea v-model="finish.description"
                            class="w-full text-lg border border-gray-200 rounded-md p-2" placeholder="Enter description"
                            :class="{'p-invalid': fb.errors?.['finish.create']?.description}" />
                        <Message v-if="fb.errors?.['finish.create']?.description" severity="error" size="small"
                            variant="title">
                            <span v-for="error in fb.errors?.['finish.create']?.description" :key="error"
                                class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>
            </div>

            <div class="sm:w-full md:w-3/5 space-y-4">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Media</h3>
                <div class="flex flex-col gap-x-6 gap-y-4">
                    <label
                        class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary border-b">Image</label>
                    <div class="py-2">
                        <UploadFileFeature v-model:uploadedFilesData="finish.img" :fb="fb" :property="'img'"
                            @upload="uploadFile($event, 'img')" @removeUploadedFile="deleteFile($event, 'img')" />
                    </div>
                    <label
                        class="w-full px-6 py-4 text-left text-lg flex justify-between items-center text-primary border-b">Image
                        2</label>
                    <div class="py-2">
                        <UploadFileFeature v-model:uploadedFilesData="finish.img2" :fb="fb" :property="'img2'"
                            @upload="uploadFile($event, 'img2')" @removeUploadedFile="deleteFile($event, 'img2')" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
