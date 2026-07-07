<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useOptionStore } from '@/stores/option';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import OptionFilter from '@/filters/OptionFilter';

const router = useRouter();
const optionStore = useOptionStore();
const { options, fb } = storeToRefs(optionStore);
const filters = ref({ ...new OptionFilter() });
const toast = useToast();

// const fetchOptions = async () => {
//   try {
//     await optionStore.fetchOptions();
//   } catch (error) {
//     console.error('Error fetching options:', error);
//     toast.add({
//       severity: 'error',
//       summary: 'Error',
//       detail: 'Failed to fetch options.',
//       life: 3000,
//     });
//   }
// };

const emit = defineEmits(['update:option', 'saved', 'editTabUnmunted', 'editTabMounted']);

const editOption = (data: any) => {
    router.push(`/configuration/settings/options/edit/${data.option_id}`);
};

const deleteOption = async (data: any) => {
    try {
        await optionStore.deleteOption(data.option_id);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Option deleted successfully.',
            life: 3000,
        });
        // await fetchOptions();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete option.',
            life: 3000,
        });
    }
};

const clearFilter = () => {
    filters.value = { ...new OptionFilter() };
};

const renderIcon = (icon: string, action: string, id: number) => {
    return fb.value.loading[`option.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
};

onMounted(() => {
    emit('editTabMounted')
    // fetchOptions();
    optionStore.fetchOptions()
});
onUnmounted(()=>{
    emit('editTabUnmunted')
})
</script>

<template>
    <div class="option-index">
        <DataTable 
        v-model:filters="filters" 
        :value="options" 
        paginator 
        :rows="100" 
        dataKey="option_id"
        filterDisplay="menu" 
        :loading="fb.loading['option.list']" 
        :globalFilterFields="['content.name','type','sort_order']"
        selectionMode="multiple" 
        class="th-table"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex gap-2">
                        <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                    </div>
                    <div class="flex gap-2 items-center">
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </div>
                </div>
            </template>
            <template #empty> No options found. </template>
            <!-- <template #loading> Loading options data. Please wait... </template> -->
            <template #loading>
                <div class="flex items-center justify-center gap-2 py-8">
                    <i class="pi pi-spinner pi-spin" style="font-size: 2rem;"></i>
                </div>
            </template>

            <Column field="content.name" header="Name" style="min-width: 12rem" filterField="content.name" sortable>
                <template #body="{ data }">
                    <a @click="editOption(data)"
                        class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
                        {{ data?.content?.name }}
                    </a>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" placeholder="Search by name" />
                </template>
            </Column>
            <Column header="Type Name" style="min-width: 12rem" >
                <template #body="{ data }">
                    {{ data.type }}
                </template>
            </Column>
            <Column header="Language Name" style="min-width: 12rem" >
                <template #body="{ data }">
                    {{ data.content?.language_name ?? data.content?.language_name + ' ( ' + data.content?.language_code + ' )' }}
                </template>
            </Column>
            <Column field="sort_order" header="Sort" style="min-width: 6rem" sortable />
            <Column header="Actions" :exportable="false" style="min-width: 8rem">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button 
                            :icon="renderIcon('pi pi-pencil', 'edit', data.option_id)"
                            rounded outlined
                            severity="success" @click="editOption(data)"
                        />
                        <Button 
                            :icon="renderIcon('pi pi-trash', 'delete', data.option_id)"
                            rounded outlined
                            severity="danger"
                            @click="deleteOption(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped></style>
