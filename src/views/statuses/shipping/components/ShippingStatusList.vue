<script setup>
import { ref, onMounted, computed } from 'vue';
import { useShippingStatusStore } from '@/stores/shippingStatus';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';

const router = useRouter();

const shippingStatusStore = useShippingStatusStore();
const { shippingStatuses, fb } = storeToRefs(shippingStatusStore);

const filters = ref({
  global: { value: null, matchMode: 'contains' },
  name: { value: null, matchMode: 'contains' }
});

const shippingStatusNames = computed(() => {
  return shippingStatuses.value.map(status => status.name);
});

onMounted(() => {
  shippingStatusStore.fetchShippingStatuses();
});

const clearFilter = () => {
  filters.value = {
    global: { value: null, matchMode: 'contains' },
    name: { value: null, matchMode: 'contains' }
  };
};

const editShippingStatus = (shippingStatus) => {
  router.push(`/configuration/settings/shipping-statuses/edit/${shippingStatus.shipping_status_id}`);
};

const deleteShippingStatus = (shippingStatus) => {
  shippingStatusStore.deleteShippingStatus(shippingStatus.shipping_status_id);
};

const addShippingStatus = () => {
  router.push('/configuration/settings/add-shipping-statuses');
};
</script>

<template>
  <div>
      <DataTable
        v-model:filters="filters"
        :value="shippingStatuses"
        paginator
        :rows="10"  
        dataKey="shipping_status_id"
        filterDisplay="menu"
        :loading="fb.loading['shippingStatus.list']"
        :globalFilterFields="['name']"
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
        <template #empty> No shipping statuses found. </template>
        <template #loading> Loading shipping statuses data. Please wait. </template>

        
        <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 36rem">
          <template #body="{ data }">
            <a 
              @click="editShippingStatus(data)" 
              class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
            >
              {{ data.name }}
            </a>
          </template>
          <template #filter="{ filterModel }">
            <MultiSelect v-model="filterModel.value" :options="shippingStatusNames" placeholder="Any">
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
                :icon="fb.loading['shippingStatus.edit.' + data.shipping_status_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
                :disabled="fb.loading['shippingStatus.edit.' + data.shipping_status_id]"
                rounded 
                outlined 
                severity="success" 
                class="mr-2"
                @click="editShippingStatus(data)"
              />
              <Button 
                :icon="fb.loading['shippingStatus.delete.' + data.shipping_status_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                :disabled="fb.loading['shippingStatus.delete.' + data.shipping_status_id]"
                rounded 
                outlined 
                severity="danger"
                @click="deleteShippingStatus(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
  </div>
</template> 