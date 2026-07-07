<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSubscriptionStatusStore } from '@/stores/subscriptionStatus';
import { storeToRefs } from 'pinia';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import MultiSelect from 'primevue/multiselect';
import { useRouter } from 'vue-router';
import SubscriptionStatusFilter from '@/filters/SubscriptionStatusFilter';

const router = useRouter();

const subscriptionStatusStore = useSubscriptionStatusStore();
const { subscriptionStatuses, fb } = storeToRefs(subscriptionStatusStore);

const filters = ref({...new SubscriptionStatusFilter()});

const subscriptionStatusNames = computed(() => {
  return subscriptionStatuses.value.map(status => status.name);
});

onMounted(() => {
  subscriptionStatusStore.fetchSubscriptionStatuses();
});

const clearFilter = () => {filters.value = {...new SubscriptionStatusFilter()};};

const editSubscriptionStatus = (subscriptionStatus) => {
  router.push(`/configuration/settings/subscription-statuses/edit/${subscriptionStatus.subscription_status_id}`);
};

const deleteSubscriptionStatus = (subscriptionStatus) => {
  subscriptionStatusStore.deleteSubscriptionStatus(subscriptionStatus.subscription_status_id);
};

</script> 
<template>
  <div>
      <DataTable
        v-model:filters="filters"
        :value="subscriptionStatuses"
        paginator
        :rows="10"
        dataKey="subscription_status_id"
        filterDisplay="menu"
        :loading="fb.loading['subscriptionStatus.list']"
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
            <InputText v-model="filters.name" placeholder="Keyword Search" />
          </div>
        </template>
        <template #empty> No subscription statuses found. </template>
        <template #loading> Loading subscription statuses data. Please wait. </template>

        
        <Column header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 36rem">
          <template #body="{ data }">
            <a 
              @click="editSubscriptionStatus(data)" 
              class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
            >
              {{ data.name }}
            </a>
          </template>
          <template #filter="{ filterModel }">
            <MultiSelect v-model="filterModel.value" :options="subscriptionStatusNames" placeholder="Any">
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
                :icon="fb.loading['subscriptionStatus.edit.' + data.subscription_status_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
                :disabled="fb.loading['subscriptionStatus.edit.' + data.subscription_status_id]"
                rounded 
                outlined 
                severity="success" 
                class="mr-2"
                @click="editSubscriptionStatus(data)"
              />
              <Button 
                :icon="fb.loading['subscriptionStatus.delete.' + data.subscription_status_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                :disabled="fb.loading['subscriptionStatus.delete.' + data.subscription_status_id]"
                rounded 
                outlined 
                severity="danger" 
                @click="deleteSubscriptionStatus(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
  </div>
</template>
