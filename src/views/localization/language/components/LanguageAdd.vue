<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLanguageStore } from '@/stores/language';
import { storeToRefs } from 'pinia';
import Language from '@/models/Language';
import { useToast } from 'primevue/usetoast';

const languageStore = useLanguageStore();
const { languages, newLanguage, fb } = storeToRefs(languageStore);

const statusOptions = ref([
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
]);

const yesNoOptions = ref([
    { name: 'Yes', code: 1 },
    { name: 'No', code: 0 }
]);

onMounted(() => {
    languageStore.fetchLanguages();
});

</script>

<template>
    <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
        <div class="w-full">
            <div class="flex flex-col gap-6">
                <h3 class="text-lg font-medium border-b border-gray-200 pb-2">Add Language</h3>
                <!-- <div class="grid grid-cols-12 gap-2">
                    <label for="language" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Language</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select 
                            class="text-lg w-full" 
                            v-model="newLanguage.language" 
                            :options="languages" 
                            optionLabel="name"
                            placeholder="Select Language"
                           :class="{'p-invalid': fb.errors['language.create']?.language}"
                        />
                    </div>
                </div> -->

                <!-- <div class="grid grid-cols-12">
                    <label for="translations" class="flex flex-col col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">
                        <span>Language pack</span>
                        <span class="text-gray-500 text-base">Translations</span>
                    </label>
                </div> -->

                <div class="grid grid-cols-12 gap-2">
                    <label for="name" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Name</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg w-full" id="name" type="text" v-model="newLanguage.name" placeholder="Name" 
                        :class="{'p-invalid': fb.errors['language.create']?.name}"
                        />
                        <Message v-if="fb.errors['language.create']?.name" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['language.create']?.name" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="code" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Code</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg w-full" id="code" type="text" v-model="newLanguage.code" placeholder="Code"
                         :class="{'p-invalid': fb.errors['language.create']?.code}"
                        />
                        <Message v-if="fb.errors['language.create']?.code" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['language.create']?.code" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="locale" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Locale</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputText class="text-lg w-full" id="locale" type="text" v-model="newLanguage.locale" placeholder="Locale"
                         :class="{'p-invalid': fb.errors['language.create']?.locale}"
                        />
                        <Message v-if="fb.errors['language.create']?.locale" severity="error" size="small" variant="title">
                            <span v-for="error in fb.errors['language.create']?.locale" :key="error" class="flex flex-col">
                                {{ error }}
                            </span>
                        </Message>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="status" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Status</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select 
                            class="text-lg w-full" 
                            v-model="newLanguage.status" 
                            :options="statusOptions" 
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Select Status"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="rtl" class="flex flex-col col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">
                        <span>RTL</span>
                        <span class="text-gray-500 text-base">Right to left</span>
                    </label>
                    <div class="col-span-12 md:col-span-10">
                        <Select 
                            class="text-lg w-full" 
                            v-model="newLanguage.rtl" 
                            :options="yesNoOptions" 
                            optionLabel="name"
                            optionValue="code"
                            placeholder="Select RTL"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="default" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Default</label>
                    <div class="col-span-12 md:col-span-10">
                        <Select 
                            class="text-lg w-full" 
                            v-model="newLanguage.default" 
                            :options="yesNoOptions" 
                            optionLabel="name"
                            optionValue="code"
                            placeholder="Select Default"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-2">
                    <label for="sort_order" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Sort Order</label>
                    <div class="col-span-12 md:col-span-10">
                        <InputNumber 
                            class="text-lg w-full" 
                            id="sort_order" 
                            v-model="newLanguage.sort_order" 
                            placeholder="Sort Order"
                            :min="0"
                        />
                    </div>
                </div>
            </div>
        </div>
    </Fluid>
</template>