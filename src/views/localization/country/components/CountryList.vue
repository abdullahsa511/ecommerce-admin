<script setup>
import { ref, onMounted, computed } from 'vue';
import { useCountryStore } from '@/stores/country';
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
const countryStore = useCountryStore();
const { countries, fb } = storeToRefs(countryStore);
const selectedCountries = ref([]);

const filters = ref({
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' },
    iso: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'contains' }
});

const countryNames = computed(() => {
    return countries.value.map(country => country.name);
});

const countryIsos = computed(() => {
    return [...new Set(countries.value.map(country => country.iso))];
});

const countryStatuses = computed(() => {
    return [...new Set(countries.value.map(country => country.status))];
});

onMounted(() => {
    countryStore.fetchCountries();
});

const clearFilter = () => {
    filters.value = {
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
        iso: { value: null, matchMode: 'contains' },
        status: { value: null, matchMode: 'contains' }
    };
};

const editCountry = (country) => {
    router.push(`/configuration/settings/countries/edit/${country.country_id}`);
};

const deleteCountry = async (country) => {
    try {
        await countryStore.deleteCountry(country.country_id);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Country deleted successfully',
            life: 3000
        });
        countryStore.fetchCountries();
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete country',
            life: 3000
        });
    }
};
</script>

<template>
  <div>
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedCountries"
      :value="countryStore.countries"
      paginator
      :rows="10"
      dataKey="country_id"
      filterDisplay="menu"
      :loading="fb.loading['country.list']"
      :globalFilterFields="['name', 'iso', 'status']"
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
      <template #empty> No countries found. </template>
      <template #loading> Loading countries data. Please wait. </template>
      
      <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 36rem">
        <template #body="{ data }">
          <a 
            @click="editCountry(data)" 
            class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
          >
            {{ data.name }}
          </a>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="countryNames" placeholder="Any">
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option }}</span>
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>

      <Column header="ISO" filterField="iso" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 8rem">
        <template #body="{ data }">
          {{ data.iso_code_2 }}
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

      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              icon="pi pi-pencil" 
              :loading="fb.loading['country.edit.' + data.country_id]"
              :disabled="fb.loading['country.edit.' + data.country_id]"
              :icon="fb.loading['country.edit.' + data.country_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
              rounded 
              outlined 
              severity="success" 
              class="mr-2"
              @click="editCountry(data)"
            />
            <Button 
              icon="pi pi-trash" 
              :loading="fb.loading['country.delete.' + data.country_id]"
              :disabled="fb.loading['country.delete.' + data.country_id]"
              :icon="fb.loading['country.delete.' + data.country_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
              rounded 
              outlined 
              severity="danger"
              @click="deleteCountry(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>