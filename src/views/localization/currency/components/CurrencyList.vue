<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCurrencyStore } from '@/stores/currency';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { formatFrontendDate } from '@/utils/DateUtil';
const toast = useToast();
const router = useRouter();
const currencyStore = useCurrencyStore();
const { currencies, fb } = storeToRefs(currencyStore);
const selectedCurrencies = ref([]);
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    symbol: { value: null, matchMode: 'contains' },
    code: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    value: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'contains' }
});

const currencySymbols = computed(() => {
    return [...new Set(currencies.value.map(curr => curr.symbol_start + curr.symbol_end))];
});

const currencyCodes = computed(() => {
    return [...new Set(currencies.value.map(curr => curr.code))];
});

const currencyNames = computed(() => {
    return currencies.value.map(curr => curr.name);
});

const currencyStatuses = computed(() => {
    return [...new Set(currencies.value.map(curr => curr.status))];
});

onMounted(() => {
    currencyStore.fetchCurrencies();
});

const clearFilter = () => {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        symbol: { value: null, matchMode: 'contains' },
        code: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
        value: { value: null, matchMode: 'contains' },
        status: { value: null, matchMode: 'contains' }
    };
};

const onRowSelect = (event) => {
    console.log('Row selected:', event.data);
};

const onRowUnselect = (event) => {
    console.log('Row unselected:', event.data);
};

const deleteSelectedCurrencies = async () => {
    if (selectedCurrencies.value && selectedCurrencies.value.length > 0) {
        try {
            for (const currency of selectedCurrencies.value) {
                await currencyStore.deleteCurrency(currency.currency_id);
            }
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Selected currencies deleted successfully',
                life: 3000
            });
            currencyStore.fetchCurrencies();
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete selected currencies',
                life: 3000
            });
        }
    }
};

const editCurrency = (currency) => {
    router.push(`/configuration/settings/currencies/edit/${currency.currency_id}`);
};

const deleteCurrency = async (currency) => {
    try {
        await currencyStore.deleteCurrency(currency.currency_id);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Currency deleted successfully',
            life: 3000
        });
        currencyStore.fetchCurrencies();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete currency',
            life: 3000
        });
    }
};

</script>

<template>
  <div>
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedCurrencies"
      :value="currencies"
      paginator
      :rows="10"
      dataKey="currency_id"
      filterDisplay="menu"
      :loading="fb.loading['currency.list']"
      :globalFilterFields="['symbol', 'code', 'name', 'value', 'status']"
      selectionMode="multiple"
      @rowSelect="onRowSelect"
      @rowUnselect="onRowUnselect"
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
            <Button
              v-if="selectedCurrencies && selectedCurrencies.length > 0"
              type="button"
              icon="pi pi-trash"
              label="Delete Selected"
              severity="danger"
              @click="deleteSelectedCurrencies"
            />
          </div>
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </div>
      </template>
      <template #empty> No currencies found. </template>
      <template #loading> Loading currencies data. Please wait. </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      
      <Column header="Symbol" filterField="symbol" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 8rem">
        <template #body="{ data }">
          {{ data.sign_start }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="currencySymbols" placeholder="Any">
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <Column header="Code" filterField="code" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 8rem">
        <template #body="{ data }">
          {{ data.code }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="currencyCodes" placeholder="Any">
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 24rem">
        <template #body="{ data }">
          <a 
            @click="editCurrency(data)" 
            class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
          >
            {{ data.name }}
          </a>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="currencyNames" placeholder="Any">
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <Column header="Value" filterField="value" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.value }}
        </template>
      </Column>

      <Column header="Status" filterField="status" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
        <template #body="{ data }">
          <div class="flex gap-2 items-center">
            <span :class="['status-badge', data.status === 'Active' ? 'bg-green-700 text-white' : 'status-disabled']">
              {{ data.status }}
            </span>
          </div>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="currencyStatuses" placeholder="Any">
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <Column header="Last updated" style="min-width: 12rem">
        <template #body="{ data }">
          <span>{{ formatFrontendDate(data.updated_at) }}</span>
        </template>
      </Column>

      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              icon="pi pi-pencil" 
              :icon="fb.loading['currency.edit.' + data.currency_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
              :loading="fb.loading['currency.edit.' + data.currency_id]"
              :disabled="fb.loading['currency.edit.' + data.currency_id]"
              rounded 
              outlined 
              severity="success" 
              class="mr-2"
              @click="editCurrency(data)"
            />
            <Button 
              icon="pi pi-trash" 
              :icon="fb.loading['currency.delete.' + data.currency_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
              :loading="fb.loading['currency.delete.' + data.currency_id]"
              :disabled="fb.loading['currency.delete.' + data.currency_id]"
              rounded 
              outlined 
              severity="danger"
              @click="deleteCurrency(data)"
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

.status-disabled {
  background-color: #E0E0E0;
  color: #666666;
}
</style> 