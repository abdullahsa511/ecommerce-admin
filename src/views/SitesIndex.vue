<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSiteStore } from '@/stores/site';
import SiteFilter from '@/filters/SiteFilter'; // Assuming you have a SiteFilter similar to PostFilter
import InputText from 'primevue/inputtext';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const siteStore = useSiteStore();
const { sites, fb } = storeToRefs(siteStore);
const filters = ref({...new SiteFilter()});
const loading = ref(true);
const router = useRouter();


const siteNames = computed(() => siteStore.siteNames);
const fetchSites = async () => {
  loading.value = true;
  await siteStore.fetchSites();
  loading.value = false;
};

const editSite = (data) => {
  router.push(`/configuration/settings/sites/${data.site_id}`);
};

// const deleteSite = async (data) => {
//   await siteStore.deleteSite(data.site_id);
// };

onMounted(() => {
  fetchSites();
});

const initFilters = () => {
  filters.value = {...new SiteFilter()};
};

const clearFilter = () => {
  initFilters();
};

</script>

<template>
  <div>
    <DataTable
      v-model:filters="filters"
      :value="siteStore.sites"
      paginator
      showGridlines
      :rows="10"
      dataKey="site_id"
      filterDisplay="menu"
      :loading="loading"
      :globalFilterFields="['name', 'host', 'theme', 'template']"
    >
      <template #header>
        <div class="flex justify-between">
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
            @click="clearFilter()"
          />
          <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
        </div>
      </template>
      <template #empty> No sites found. </template>
      <template #loading> Loading sites data. Please wait. </template>
      
      <Column header="name" filterField="siteNames" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
        <template #body="{ data }">
          {{ data.name }}
        </template>
        <template #filter="{ filterModel }">
            <MultiSelect v-model="filterModel.value" :options="siteNames"  placeholder="Any">
                <template #option="slotProps">
                    <div class="flex items-center gap-2">
                        <span>{{ slotProps.option }}</span>
                    </div>
                </template>
            </MultiSelect>
        </template>
      </Column>
      
      <Column field="url" header="URL" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.host }}
        </template>
        <template #filter="{ filterModel }">
          <InputText 
            v-model="filterModel.value" 
            type="text" 
            placeholder="Search by URL" 
            class="p-2"
          />
        </template>
      </Column>
      
      <Column field="host" header="Host" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.host }}
        </template>
        <template #filter="{ filterModel }">
          <InputText 
            v-model="filterModel.value" 
            type="text" 
            placeholder="Search by host" 
            class="p-2"
          />
        </template>
      </Column>
      
      <Column field="theme" header="Theme" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.theme }}
        </template>
        <template #filter="{ filterModel }">
          <InputText 
            v-model="filterModel.value" 
            type="text" 
            placeholder="Search by theme" 
            class="p-2"
          />
        </template>
      </Column>
      
      <Column field="template" header="Home Template" style="min-width: 12rem">
        <template #body="{ data }">
          {{ data.template }}
        </template>
        <template #filter="{ filterModel }">
          <InputText 
            v-model="filterModel.value" 
            type="text" 
            placeholder="Search by home template" 
            class="p-2"
          />
        </template>
      </Column>
      
      <Column header="Actions" :exportable="false" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button 
              :icon="fb.loading['site.edit.'+data.site_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
              rounded 
              outlined 
              severity="success" 
              class="mr-2"
              @click="editSite(data)"
            />
            <!-- <Button 
              :icon="fb.loading['site.delete.'+data.site_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
              :disabled="fb.loading['site.delete.'+data.site_id]"
              rounded 
              outlined 
              severity="danger"
              @click="deleteSite(data)"
            /> -->
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>