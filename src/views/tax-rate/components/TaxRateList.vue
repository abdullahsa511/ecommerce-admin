<script setup>
import { ref, onMounted, computed } from 'vue';
import { useTaxRateStore } from '@/stores/taxRate';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();

const taxRateStore = useTaxRateStore();
const { taxRates, fb } = storeToRefs(taxRateStore);
const selectedTaxRates = ref([]);

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  name: { value: null, matchMode: 'contains' },
  rate: { value: null, matchMode: 'contains' },
  type: { value: null, matchMode: 'contains' }
});

const taxRateNames = computed(() => {
  return taxRates.value.map(rate => rate.name);
});

const taxRateTypes = computed(() => {
  return [...new Set(taxRates.value.map(rate => rate.type))];
});

onMounted(() => {
  taxRateStore.fetchTaxRates();
});

const clearFilter = () => {
  filters.value = {
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    rate: { value: null, matchMode: 'contains' },
    type: { value: null, matchMode: 'contains' }
  };
};

const editTaxRate = (taxRate) => {
  router.push(`/configuration/settings/tax-rates/edit/${taxRate.tax_rate_id}`);
};

const deleteTaxRate = async (taxRate) => {
  try {
    await taxRateStore.deleteTaxRate(taxRate.tax_rate_id);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Tax rate deleted successfully',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete tax rate',
      life: 3000
    });
  }
};

</script>

<template>
  <div>
    <DataTable v-model:filters="filters" v-model:selection="selectedTaxRates" :value="taxRates" paginator :rows="10"
      dataKey="tax_rate_id" filterDisplay="menu" :loading="fb.loading['taxRate.list']"
      :globalFilterFields="['name', 'rate', 'type']" selectionMode="multiple" class="th-table">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
          </div>
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </div>
      </template>
      <template #empty> No tax rates found. </template>
      <template #loading> Loading tax rates data. Please wait. </template>

      <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 36rem">
        <template #body="{ data }">
          <a @click="editTaxRate(data)" class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">
            {{ data.name }}
          </a>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="taxRateNames" placeholder="Any">
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <Column header="Rate" filterField="rate" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.rate }}%
        </template>
      </Column>

      <Column header="Type" filterField="type" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }"
        style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.type }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="taxRateTypes" placeholder="Any">
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button icon="pi pi-pencil" :disabled="fb.loading['taxRate.edit.' + data.tax_rate_id]"
              :loading="fb.loading['taxRate.edit.' + data.tax_rate_id]"
              :icon="fb.loading['taxRate.edit.' + data.tax_rate_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'" rounded
              outlined severity="success" class="mr-2" @click="editTaxRate(data)" />
            <Button icon="pi pi-trash" :disabled="fb.loading['taxRate.delete.' + data.tax_rate_id]"
              :loading="fb.loading['taxRate.delete.' + data.tax_rate_id]"
              :icon="fb.loading['taxRate.delete.' + data.tax_rate_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'" rounded
              outlined severity="danger" @click="deleteTaxRate(data)" />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>