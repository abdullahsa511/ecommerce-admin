<script setup lang="ts">
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';
import { ref, onMounted } from 'vue';
import { useShowroomStore } from '@/stores/showroom';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { Showroom } from '@/models/Showroom';
import ShowRoomFilter from '@/filters/ShowRoomFilter';

const router = useRouter();
const toast = useToast();
const showroomStore = useShowroomStore();
const { fb, showrooms } = storeToRefs(showroomStore);
const filters = ref({...new ShowRoomFilter()});

onMounted(() => {
  showroomStore.getShowrooms();
});

const editShowroom = async (data: Showroom) => {
  try {
    router.push(`/showrooms/edit/${data.showrooms_id}`);
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
  filters.value = {...new ShowRoomFilter()};
};

const clearFilter = () => {
  initFilters();
};

const renderIcon = (icon: string, action: string, id: number) => {
    const loadingKey = `showroom.${action}.${id}`;
    // console.log("showroom", loadingKey);
    return fb.value.loading[loadingKey] ? 'pi pi-spinner pi-spin' : icon;
};

</script>

<template>
  <div>
    <DataTable 
    v-model:filters="filters" 
    :value="showrooms" 
    paginator 
    showGridlines 
    :rows="10" 
    dataKey="showrooms_id"
    filterDisplay="menu" 
    :loading="fb.loading['showroom.list']"
    :globalFilterFields="['title', 'slug', 'description', 'address', 'phone', 'email']"
    class="th-table"
    >
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
      <!-- <template #loading> Loading showrooms. Please wait. </template> -->

      <template #loading>
          <div class="flex items-center justify-center gap-2 py-8">
              <i class="pi pi-spinner pi-spin" style="font-size: 2rem;"></i>
          </div>
      </template>

      <!-- Thumbnail Column -->
      <Column header="Thumbnail" style="min-width: 7rem">
        <template #body="{ data }">
          <img v-if="data.image.length" :src="resolveMediaImage(data.image)" :alt="data.image[0].alt"
            style="width: 50px; height: 50px; object-fit: cover;" class="shadow-2 border-round" />
        </template>
      </Column>

      <!-- Title Column -->
      <Column field="title" header="Title" sortable style="min-width: 12rem">
        <template #body="{ data }">
          <a class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline" @click.stop="editShowroom(data)">{{ data.title }}</a>
        </template>
        <!-- <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" placeholder="Search by title" />
        </template> -->
        <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by title" />
        </template>
      </Column>

      <!-- Slug Column -->
      <Column field="slug" header="Slug" sortable style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.slug }}
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" placeholder="Search by slug" />
        </template>
      </Column>

      <!-- Description Column -->
      <Column field="description" header="Description" sortable style="min-width: 10rem">
        <template #body="{ data }">
          <div v-html="data.description"></div>
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" placeholder="Search by description" />
        </template>
      </Column>

      <!-- Address Column -->
      <Column field="address" header="Address" sortable style="min-width: 10em">
        <template #body="{ data }">
          {{ data.address ?? '' }}
        </template>
        <template #filter="{ filterModel }">
          <InputText v-model="filterModel.value" type="text" placeholder="Search by address" />
        </template>
      </Column>
      <!-- Section Activation Column -->
      <Column field="is_section_active" header="Section Activation" sortable style="min-width: 6rem">
        <template #body="{ data }">
          {{ data.is_section_active ? 'Active' : 'Inactive' }}
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
            <Button :icon="renderIcon('pi pi-pencil', 'edit', data.showrooms_id)" rounded outlined severity="success" @click="editShowroom(data)" />
            <Button :icon="renderIcon('pi pi-trash', 'delete', data.showrooms_id)" rounded outlined severity="danger" @click="deleteShowroom(data)" />
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
