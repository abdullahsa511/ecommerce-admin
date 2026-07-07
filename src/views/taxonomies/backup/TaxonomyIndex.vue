<script setup>
import { ref, onMounted, computed } from 'vue';
import { useTaxonomyStore } from '@/stores/taxonomy';
import TaxonomyFilter from '@/filters/TaxonomyFilter';
import InputText from 'primevue/inputtext';
import { useSiteStore } from '@/stores/site';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();
const taxonomyStore = useTaxonomyStore();
const siteStore = useSiteStore();
const filters = ref(new TaxonomyFilter());
const loading = ref(true);
const selectedTaxonomies = ref([]);
const taxonomyNames = computed(() => taxonomyStore.taxonomyNames);
const taxonomyTypes = computed(() => Object.keys(taxonomyStore.taxonomyTypes));

const fetchData = async () => {
  loading.value = true;
  await Promise.all([
    taxonomyStore.fetchTaxonomies(),
    siteStore.fetchSites()
  ]);
  loading.value = false;
};

const editTaxonomy = (data) => {
  router.push(`/configuration/settings/edit-taxonomy/${data.taxonomy_id}`);
};

const deleteTaxonomy = async (data) => {
  await taxonomyStore.deleteTaxonomy(data.taxonomy_id);
};

const deleteSelectedTaxonomies = async () => {
  if (selectedTaxonomies.value.length > 0) {
    for (const taxonomy of selectedTaxonomies.value) {
      await taxonomyStore.deleteTaxonomy(taxonomy.taxonomy_id);
    }
    selectedTaxonomies.value = [];
  }
};
const onRowSelect = (event) => {
  console.log(event);
};

const onRowUnselect = (event) => {
  console.log(event);
};

onMounted(() => {
  fetchData();
});

const initFilters = () => {
  filters.value = new TaxonomyFilter();
};

const clearFilter = () => {
  initFilters();
};

const getSiteName = (siteId) => {
  const site = siteStore.sites.find(s => s.site_id === siteId);
  return site ? site.name : 'Unknown Site';
};

const addTaxonomy = () => {
  router.push('/configuration/settings/add-taxonomy');
};

</script>

<template>
  <div>
    <div class="flex justify-end gap-2 mb-6">
      <Button
        icon="pi pi-plus"
        label="Add Taxonomy"
        @click="addTaxonomy"
        class="p-button-md"
      />
    </div>
    <DataTable
      v-model:filters="filters"
      v-model:selection="selectedTaxonomies"
      :value="taxonomyStore.taxonomies"
      paginator
      :rows="10"
      dataKey="taxonomy_id"
      filterDisplay="menu"
      :loading="loading"
      :globalFilterFields="['name', 'post_type', 'type']"
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
              v-if="selectedTaxonomies.length > 0"
              type="button"
              icon="pi pi-trash"
              label="Delete Selected"
              severity="danger"
              @click="deleteSelectedTaxonomies"
            />
          </div>
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </div>
      </template>
      <template #empty> No taxonomies found. </template>
      <template #loading> Loading taxonomies data. Please wait. </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      
      <Column header="Name" filterField="taxonomyNames" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
        <template #body="{ data }">
          <a 
            @click="editTaxonomy(data)" 
            class="text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
          >
            {{ data.name }}
          </a>
        </template>
        <template #filter="{ filterModel }">
            <MultiSelect v-model="filterModel.value" :options="taxonomyNames" placeholder="Any">
                <template #option="slotProps">
                    <div class="flex items-center gap-2">
                        <span>{{ slotProps.option }}</span>
                    </div>
                </template>
            </MultiSelect>
        </template>
      </Column>

      <Column field="type" header="Type" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.type }}
        </template>
        <template #filter="{ filterModel }">
          <Dropdown
            v-model="filterModel.value"
            :options="taxonomyTypes"
            placeholder="Select Type"
            class="p-2"
          />
        </template>
      </Column>
      
      <Column field="post_type" header="Post Type" style="min-width: 36rem">
        <template #body="{ data }">
          {{ data.post_type }}
        </template>
        <template #filter="{ filterModel }">
          <InputText 
            v-model="filterModel.value" 
            type="text" 
            placeholder="Search by post type" 
            class="p-2"
          />
        </template>
      </Column>
      
      <Column field="site_id" header="Site Name By Id" style="min-width: 12rem">
        <template #body="{ data }">
          <span class="px-3 py-1 text-sm font-medium rounded-full bg-green-700 text-white" style="display: inline-block;">
            {{ getSiteName(data.site_id) }}
          </span>
        </template>
        <template #filter="{ filterModel }">
          <Dropdown
            v-model="filterModel.value"
            :options="siteStore.sites"
            optionLabel="name"
            optionValue="site_id"
            placeholder="Select Site"
            class="p-2"
          />
        </template>
      </Column>
      
      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              icon="pi pi-pencil" 
              rounded 
              outlined 
              severity="success" 
              class="mr-2"
              @click="editTaxonomy(data)"
            />
            <Button 
              icon="pi pi-trash" 
              rounded 
              outlined 
              severity="danger"
              @click="deleteTaxonomy(data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>