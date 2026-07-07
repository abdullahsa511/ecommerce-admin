<script setup>
import { ref, onMounted } from 'vue';
import { useSubscriptionPlanStore } from '@/stores/subscriptionPlan';
import SubscriptionPlanFilter from '@/filters/SubscriptionPlanFilter';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const router = useRouter();
const subscriptionPlanStore = useSubscriptionPlanStore();
const { subscriptionPlans, fb } = storeToRefs(subscriptionPlanStore);
const filters = ref({...new SubscriptionPlanFilter()});

const editSubscriptionPlan = (data) => {
    router.push(`/configuration/settings/subscriptions-plans/edit/${data.subscription_plan_id}`);
};

const deleteSubscriptionPlan = async (data) => {
  await subscriptionPlanStore.deleteSubscriptionPlan(data.subscription_plan_id);
};



const initFilters = () => {
  filters.value = {...new SubscriptionPlanFilter()};
};

const clearFilter = () => {
  initFilters();
};

onMounted(() => {
  subscriptionPlanStore.fetchSubscriptionPlans();
  
  // setTimeout(() => {
  //   subscriptionPlanStore.fetchSubscriptionPlans();
  // }, 200);
  console.log('subscriptionPlans:', subscriptionPlans.value);

});
</script> 
<template>
  <div>
    <DataTable
      v-model:filters="filters"
      :value="subscriptionPlans"
      paginator
      :rows="10"
      dataKey="subscription_plan_id"
      filterDisplay="menu"
      :loading="fb.loading['subscriptionPlan.list']"
      :globalFilterFields="['name', 'period', 'length', 'cycle', 'status']"
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
      <template #empty> No subscription plans found. </template>
      <template #loading> Loading subscription plans data. Please wait. </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      
      <Column header="Name" filterField="subscription_plan_content_data.name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 36rem">
        <template #body="{ data }">
          <a 
            @click="editSubscriptionPlan(data)" 
            class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
          >
            {{ data.name}}
          </a>
        </template>
      </Column>

      <Column field="period" header="Period" style="min-width: 12rem">
        <template #body="{ data }">
            {{ data.period }}
        </template>
      </Column>

      <Column field="length" header="Length" style="min-width: 8rem">
        <template #body="{ data }">
          {{ data.length }}
        </template>
        <template #filter="{ filterModel }">
          <InputNumber 
            v-model="filterModel.value"
            placeholder="Enter length"
            class="p-2"
          />
        </template>
      </Column>
      
      <Column field="cycle" header="Cycle" style="min-width: 12rem">
        <template #body="{ data }">
            {{ data.cycle }}
        </template>
        <template #filter="{ filterModel }">
          <Dropdown
            v-model="filterModel.value"
            :options="['Auto', 'Manual']"
            placeholder="Select Cycle"
            class="p-2"
          />
        </template>
      </Column>

      <Column field="status" header="Status" style="min-width: 12rem">
        <template #body="{ data }">
          <span :class="[
            'px-3 py-1 text-sm font-medium rounded-lg',
            data.status === 1 ? 'bg-green-700 text-white' : 'bg-red-700 text-white'
          ]" style="display: inline-block;">
            {{ data.status === 1 ? 'Active' : 'Inactive' }}
          </span>
        </template>
        <template #filter="{ filterModel }">
          <Dropdown
            v-model="filterModel.value"
            :options="['Active', 'Inactive']"
            placeholder="Select Status"
            class="p-2"
          />
        </template>
      </Column>
      
      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              :icon="fb.loading['subscriptionPlan.edit.' + data.subscription_plan_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
              :disabled="fb.loading['subscriptionPlan.edit.' + data.subscription_plan_id]"
              rounded 
              outlined 
              severity="success" 
              class="mr-2"
              @click="editSubscriptionPlan(data)"
            />
            <Button 
              :icon="fb.loading['subscriptionPlan.delete.' + data.subscription_plan_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
              :disabled="fb.loading['subscriptionPlan.delete.' + data.subscription_plan_id]"
              rounded 
              outlined 
              severity="danger"
              @click="deleteSubscriptionPlan(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
