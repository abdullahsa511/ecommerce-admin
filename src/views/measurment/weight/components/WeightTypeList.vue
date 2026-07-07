<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useWeightTypeStore } from '@/stores/weightType';
import WeightTypeFilter from '@/filters/WeightTypeFilter';

const router = useRouter();
const weightTypeStore = useWeightTypeStore();
const { weightTypes, fb } = storeToRefs(weightTypeStore);
const filters = ref({...new WeightTypeFilter()});
const toast = useToast();

const editWeightType = (data: any) => {
    router.push(`/configuration/settings/weight/edit/${data.weight_type_id}`);
};

const deleteWeightType = async (data: any) => {
    try {
        await weightTypeStore.deleteWeightType(data.weight_type_id);
        toast.add({ severity: 'success', summary: 'Success', detail: 'Weight Type deleted successfully', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete weightType.', life: 3000 });
    }
};

const clearFilter = () => {
    filters.value = { ...new WeightTypeFilter() };
};


watch(weightTypes.value, () => {

});

onMounted(() => {
    weightTypeStore.fetchWeightTypes();
});
</script>

<template>
    <div class="weightType-index">
        <DataTable 
            v-model:filters="filters" 
            paginator 
            dataKey="weight_type_id"
            filterDisplay="menu" 
            selectionMode="multiple" class="th-table"
            :value="weightTypes" 
            :rows="10" 
            :loading="fb.loading['weightType.list']"
            :globalFilterFields="['name', 'unit', 'value', 'action']" 
            >
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    </div>
                    <InputText v-model="filters['global'].value as string" placeholder="Keyword Search" />
                </div>
            </template>
            <template #empty> No Weight types to display! </template>
            <template #loading> Loading weight type data. Please wait. </template>



            <Column field="weight_type_id" header="Weight Type ID" style="min-width: 10rem">
                <template #body="{ data }">
                    <a @click="editWeightType(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        #{{ data.weight_type_id }}
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
                        <Button 
                            :icon="fb.loading['weightType.edit.' + data.weight_type_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
                           
                            :disabled="fb.loading['weightType.edit.' + data.weight_type_id]"
                            rounded outlined 
                            severity="success" 
                            class="mr-2"
                            @click="editWeightType(data)" 
                        />
                        <Button 
                        :icon="fb.loading['weightType.delete.' + data.weight_type_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                        
                        :disabled="fb.loading['weightType.delete.' + data.weight_type_id]"
                        rounded outlined 
                        severity="danger" 
                        @click="deleteWeightType(data)" />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>


<style scoped>
</style>
