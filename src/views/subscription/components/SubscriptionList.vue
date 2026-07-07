<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import { useSubscriptionStore } from '@/stores/subscription';
import SubscriptionFilter from '@/filters/SubscriptionFilter';

const router = useRouter();
const subscriptionStore = useSubscriptionStore();
const { subscriptions, fb } = storeToRefs(subscriptionStore);
const filters = ref({...new SubscriptionFilter()});
const toast = useToast();

const editSubscription = (data: any) => {
  router.push(`/ecommerce/sales/subscriptions/edit/${data.subscription_id}`);
};

const deleteSubscription = async (data: any) => {
  try {
    await subscriptionStore.deleteSubscription(data.subscription_id);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Subscription deleted successfully',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete subscription.',
      life: 3000
    });
  }
};

const clearFilter = () => {
  filters.value = {...new SubscriptionFilter()};
};

const formatDate = (data: any) => {
  const date = new Date(data);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const renderIcon = (icon: string, action: string, id: number) => {
  return fb.value.loading[`subscription.${action}.${id}`] ? 'pi pi-spinner pi-spin' : icon;
};

watch(subscriptions.value, (newVal) => {
  console.log('subscription:', newVal);
});

onMounted(() => {
  subscriptionStore.fetchSubscriptions();
});
</script>

<template>
  <div class="subscription-index">
    <DataTable
      v-model:filters="filters"
      :value="subscriptions"
      paginator
      :rows="10"
      dataKey="subscription_id"
      filterDisplay="menu"
      :globalFilterFields="['subscription_id', 'user', 'reason', 'status', 'action']"
      selectionMode="multiple"
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
      <template #empty> No subscriptions to display! </template>
      <!-- <template #loading> Loading subscriptions data. Please wait. </template> -->

      <template #loading>
        <div class="flex items-center justify-center gap-2 py-8">
          <i class="pi pi-spinner pi-spin" style="font-size: 2rem"></i>
        </div>
      </template>

      <Column field="subscription_id" header="Subscription ID" style="min-width: 10rem" sortable>
        <template #body="{ data }">
          <a
            @click="editSubscription(data)"
            class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
          >
            #{{ data.subscription_id }}
          </a>
        </template>
      </Column>

      <Column field="user" header="User" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.user }}
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" placeholder="Search by user" />
        </template>
      </Column>

      <Column field="reason" header="Reason" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.reason }}
        </template>
      </Column>

      <Column field="status" header="Status" style="min-width: 12rem">
        <template #body="{ data }">
          <span
            :class="[
              'px-3 py-1 text-sm font-medium rounded-lg',
              data.status === 'active'
                ? 'bg-emerald-500 text-gray-900'
                : data.status === 'processing'
                  ? 'bg-sky-200 text-gray-900'
                  : data.status === 'pending'
                    ? 'bg-sky-200 text-gray-900'
                    : 'bg-amber-400 text-gray-900'
            ]"
            style="display: inline-block"
          >
            {{ data.status }}
          </span>
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect
            v-model="filterModel.value"
            :options="['Complete', 'Incomplete']"
            placeholder="Any"
          />
        </template>
      </Column>

      <Column field="action" header="Action" style="min-width: 12rem">
        <template #body="{ data }">
          <span
            :class="[
              'px-3 py-1 text-sm font-medium rounded-lg',
              data.action === 'upgrade'
                ? 'bg-amber-100 text-gray-900'
                : data.action === 'downgrade'
                  ? 'bg-amber-100 text-gray-900'
                  : data.action === 'renew'
                    ? 'bg-amber-100 text-gray-900'
                    : 'bg-amber-400 text-gray-900'
            ]"
            style="display: inline-block"
          >
            {{ data.action }}
          </span>
        </template>
        <template #filter="{ filterModel }">
          <Dropdown
            v-model="filterModel.value"
            optionLabel="label"
            optionValue="value"
            placeholder="Select Action"
            class="p-2"
          />
        </template>
      </Column>

      <Column field="created_at" header="Date Added" style="min-width: 12rem">
        <template #body="{ data }">
          {{ formatDate(data.created_at) }}
        </template>
      </Column>

      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              :icon="renderIcon('pi pi-pencil', 'edit', data.subscription_id)"
              rounded
              outlined
              severity="success"
              @click="editSubscription(data)"
            />
            <Button
              rounded
              outlined
              severity="danger"
              :icon="renderIcon('pi pi-trash', 'delete', data.subscription_id)"
              @click="deleteSubscription(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
/* .subscription-index {
    padding: 2rem;
} */

.subscription-area {
  padding: 2rem;
  min-height: 200px;
  background-color: #f8f9fa;
}

.p-datatable .p-datatable-tbody > tr > td {
  padding: 1rem;
}

/* .p-button {
    border: none;
} */

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
