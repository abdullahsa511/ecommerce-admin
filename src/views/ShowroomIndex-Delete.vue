<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useShowroomStore } from '@/stores/showroom';
import ShowRoomFilter from '@/filters/ShowRoomFilter.js';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { Showroom } from '@/models/Showroom';

const router = useRouter();
const toast = useToast();
const showroomStore = useShowroomStore();
const { fb, showrooms } = storeToRefs(showroomStore);
const filters = ref(new ShowRoomFilter());

onMounted(() => {
  showroomStore.getShowrooms();
});

const editShowroom = async (data: Showroom) => {
  try {
    router.push(`/showrooms/${data.showrooms_id}`);
  } catch (error) {
    console.error('Error fetching showroom details:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load showroom details. Please try again later.',
      life: 3000
    });
  }
};

const deleteShowroom = async (data: any) => {
  try {
    await showroomStore.deleteShowroom(data.showrooms_id);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Showroom deleted successfully',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to delete showroom. Please try again later.',
      life: 3000
    });
  }
};


const initFilters = () => {
  console.log('Initializing filters');
  filters.value = new ShowRoomFilter();
};

const clearFilter = () => {
  console.log('Clearing filters');
  initFilters();
};

</script>

<template>
  <div>
    <DataTable v-model:filters="filters" :value="showrooms" paginator showGridlines :rows="10" dataKey="showrooms_id"
      filterDisplay="menu" :loading="fb.loading.showroom"
      :globalFilterFields="['title', 'slug', 'description', 'address', 'phone', 'email']">
      <template #header>
        <div class="flex justify-between items-center">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
          <div class="flex items-center gap-2">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
          </div>
        </div>
      </template>

      <template #empty> No showrooms found. </template>
      <template #loading> Loading showrooms. Please wait. </template>

      <!-- Thumbnail Column -->
      <Column header="Thumbnail" style="min-width: 7rem">
        <template #body="{ data }">
          <img v-if="data.image.length" :src="data.image[0].objectURL" :alt="data.image[0].alt"
            style="width: 50px; height: 50px; object-fit: cover;" class="shadow-2 border-round" />
        </template>
      </Column>

      <!-- Title Column -->
      <Column field="title" header="Title" style="min-width: 12rem">
        <template #body="{ data }">
          <a class="link truncate" @click.stop="editShowroom(data)">{{ data.title }}</a>
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" placeholder="Search by title" />
        </template>
      </Column>

      <!-- Slug Column -->
      <Column field="slug" header="Slug" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.slug }}
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" placeholder="Search by slug" />
        </template>
      </Column>

      <!-- Description Column -->
      <Column field="description" header="Description" style="min-width: 10rem">
        <template #body="{ data }">
          <div v-html="data.description"></div>
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" placeholder="Search by description" />
        </template>
      </Column>

      <!-- Address Column -->
      <Column field="address" header="Address" style="min-width: 10em">
        <template #body="{ data }">
          {{ data.address ?? '' }}
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" placeholder="Search by address" />
        </template>
      </Column>
      <!-- Status Column -->
      <Column field="status" header="Status" style="min-width: 6rem">
        <template #body="{ data }">
          {{ data.status }}
        </template>
        <template #filter="{ filterModel }">
          <MultiSelect v-model="filterModel.value" :options="['active', 'inactive']" placeholder="Any" />
        </template>
      </Column>

      <!-- Created Date Column -->
      <Column field="created_at" header="Created At" style="min-width: 12rem">
        <template #body="{ data }">
          {{ new Date(data.created_at).toLocaleDateString() }}
        </template>
        <template #filter="{ filterModel }">
          <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" :showButtonBar="true" />
        </template>
      </Column>

      <!-- Actions Column -->
      <Column header="Actions" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button icon="pi pi-pencil" rounded outlined severity="success" @click="editShowroom(data)" />
            <Button icon="pi pi-trash" rounded outlined severity="danger" @click="deleteShowroom(data)" />
          </div>
        </template>
      </Column>

    </DataTable>
  </div>
</template>

<style scoped>
.link {
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
}

.link:hover {
  color: #1d4ed8;
}
</style>
