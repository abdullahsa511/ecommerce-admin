<script setup>
import { ref } from 'vue';
import UploadFile from '@/components/upload/UploadFile.vue';
import Tag from '@/models/Tag';
import router from '@/router';
import { useTagStore } from '@/stores/tag';

const tag = ref(new Tag());
const tagStore = useTagStore();

const dropdownStatusValues = ref([
    { name: 'Enabled', code: 'E' },
    { name: 'Disabled', code: 'D' },
]);
const dropdownValue = ref(dropdownStatusValues.value[0]);

const onUpload = (event) => {
    console.log(event);
    tag.value.image = "picture.jpg";
}

const goToTagList = () => {
    router.push('/configuration/settings/tags');
};

const saveTag = () => {
    tagStore.createTag(tag.value);
    goToTagList();
}

</script>

<template>
    <div class="flex justify-end gap-2 mb-6">
        <Button 
            icon="pi pi-arrow-left"
            label="Tag List"
            severity="secondary"
            @click="goToTagList"
            class="p-button-md"
        />
        <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            @click="saveTag"
            class="p-button-md"
        />
    </div>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">
            <div class="flex flex-col gap-6">

                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="name" type="text" placeholder="Name" v-model="tag.name" />
                    </div>
                </div>
                <div class="grid grid-cols-12 gap-2">
                    <label for="slug" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Slug</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg" id="slug" type="text" placeholder="Slug" v-model="tag.slug" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="description" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Description</label>
                    <div class="col-span-12 md:col-span-10">
                        <Textarea class="text-md" placeholder="Description" :autoResize="true" rows="3" cols="30" v-model="tag.description" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="avatar" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Image</label>
                    <div class="col-span-12 md:col-span-10 flex flex-col items-start">
                        <UploadFile @upload="onUpload" />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2 ">
                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select class="text-lg" v-model="dropdownValue" :options="dropdownStatusValues" optionLabel="name" placeholder="Select" />
                    </div>
                </div>

            </div>
        </div>
        
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
