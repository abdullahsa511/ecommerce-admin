<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useLengthTypeStore } from '@/stores/lengthType';
import LengthTypeFilter from '@/filters/LengthTypeFilter';

const router = useRouter();
const lengthTypeStore = useLengthTypeStore();
const { lengthTypes, fb } = storeToRefs(lengthTypeStore);
const filters = ref(new LengthTypeFilter());
const toast = useToast();

const editLengthType = (data: any) => {
    router.push(`/configuration/settings/length/edit/${data.length_type_id}`);
};

const deleteLengthType = async (data: any) => {
    try {
        await lengthTypeStore.deleteLengthType(data.length_type_id);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Length Type deleted successfully', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete lengthType.', life: 3000 });
    }
};

const clearFilter = () => {
    filters.value = new LengthTypeFilter();
};


watch(lengthTypes.value, () => {

});

onMounted(() => {
    lengthTypeStore.fetchLengthTypes();
});
</script>

<template>
    <div class="lengthType-index">
        <DataTable v-model:filters="filters" :value="lengthTypes" paginator :rows="10" dataKey="length_type_id"
            filterDisplay="menu" :loading="fb.loading['lengthType.list']"
            :globalFilterFields="['name', 'unit', 'value', 'action']" selectionMode="multiple" class="th-table">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    </div>
                    <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No Length types to display! </template>
            <template #loading> Loading length type data. Please wait. </template>



            <Column field="length_type_id" header="Length Type ID" style="min-width: 10rem">
                <template #body="{ data }">
                    <a @click="editLengthType(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        #{{ data.length_type_id }}
                    </a>
                </template>
            </Column>

            <Column field="name" header="Name" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.name }}
                </template>
            </Column>

            <Column field="unit" header="Unit" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.unit }}
                </template>
            </Column>
            <Column field="value" header="Value" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.value }}
                </template>
            </Column>



            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button icon="pi pi-pencil" rounded outlined severity="success" class="mr-2"
                            @click="editLengthType(data)" />
                        <Button icon="pi pi-trash" rounded outlined severity="danger" @click="deleteLengthType(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>


<style scoped>
.lengthType-index {
    padding: 2rem;
}

.lengthType-area {
    padding: 2rem;
    min-height: 200px;
    background-color: #f8f9fa;
}

.p-datatable .p-datatable-tbody>tr>td {
    padding: 1rem;
}

.p-button {
    border: none;
}

.p-card {
    background-color: #f8f9fa;
    border: none;
    box-shadow: none;
}

:deep(.p-card) {
    border: none;
    box-shadow: none;
}
</style>
