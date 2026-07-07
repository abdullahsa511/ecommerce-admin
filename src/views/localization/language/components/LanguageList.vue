<script setup>
import { ref, onMounted, computed } from 'vue';
import { useLanguageStore } from '@/stores/language';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';

const router = useRouter();
const languageStore = useLanguageStore();
const { languages, fb } = storeToRefs(languageStore);
const selectedLanguages = ref([]);
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    code: { value: null, matchMode: 'contains' },
    locale: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'equals' }
});

const languageNames = computed(() => {
    return languages.value.map(lang => lang.name);
});

const statusOptions = ref([
    { name: 'Active', code: 'active' },
    { name: 'Inactive', code: 'inactive' }
]);

onMounted(() => {
    languageStore.fetchLanguages();
});

const clearFilter = () => {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
        code: { value: null, matchMode: 'contains' },
        locale: { value: null, matchMode: 'contains' },
        status: { value: null, matchMode: 'equals' }
    };
};

const editLanguage = (language) => {
    router.push(`/configuration/settings/languages/edit/${language.language_id}`);
};
const deleteLanguage = async (languageId) => {
    try {
        await languageStore.deleteLanguage(languageId);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Comment deleted successfully',
            life: 3000
        });
        languageStore.fetchLanguages();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete language',
            life: 3000
        });
    }
};

</script>

<template>
    <div>
        <DataTable
            v-model:filters="filters"
            v-model:selection="selectedLanguages"
            :value="languages"
            paginator
            :rows="10"
            dataKey="language_id"
            filterDisplay="menu"
            :loading="fb.loading['language.list']"
            :globalFilterFields="['name', 'code', 'locale', 'status']"
            class="th-table"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button
                            type="button"
                            icon="pi pi-filter-slash"
                            label="Clear"
                            outlined
                            @click="clearFilter()"
                        />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No languages found. </template>
            <template #loading> Loading languages data. Please wait. </template>

            <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 16rem">
                <template #body="{ data }">
                    <a 
                        @click="editLanguage(data)" 
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                    >
                        {{ data.name }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="languageNames" placeholder="Any">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <span>{{ slotProps.option }}</span>
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column>

            <Column header="Code" field="code" style="min-width: 8rem" />
            
            <Column header="Locale" field="locale" style="min-width: 8rem" />

            <Column header="Status" filterField="status" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 10rem">
                <template #body="{ data }">
                    <span :class="{'text-green-500': data.status === 'active', 'text-red-500': data.status === 'inactive'}">
                        {{ data.status }}
                    </span>
                </template>
                <template #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="statusOptions" optionLabel="name" placeholder="Any">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <span>{{ slotProps.option.name }}</span>
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column>

            <Column header="RTL" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.rtl ? 'Yes' : 'No' }}
                </template>
            </Column>

            <Column header="Default" style="min-width: 8rem">
                <template #body="{ data }">
                    {{ data.default ? 'Yes' : 'No' }}
                </template>
            </Column>

            <Column header="Sort Order" field="sort_order" style="min-width: 8rem" />

            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button 
                            :icon="fb.loading['language.edit.' + data.language_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'" 
                            :loading="fb.loading['language.edit.' + data.language_id]"
                            :disabled="fb.loading['language.edit.' + data.language_id]"
                            rounded 
                            outlined 
                            severity="success" 
                            class="mr-2"
                            @click="editLanguage(data)"
                        />
                        <Button 
                            :icon="fb.loading['language.delete.' + data.language_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'" 
                            :loading="fb.loading['language.delete.' + data.language_id]"
                            :disabled="fb.loading['language.delete.' + data.language_id]"
                            rounded 
                            outlined 
                            severity="danger"
                            @click="deleteLanguage(data.language_id)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
.status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
}
</style>