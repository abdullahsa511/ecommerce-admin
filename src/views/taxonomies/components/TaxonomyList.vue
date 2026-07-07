<script setup lang="ts">
    import { onMounted, computed, ref } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useRouter } from 'vue-router';
    import DataTable from 'primevue/datatable';
    import Column from 'primevue/column';
    import Button from 'primevue/button';
    import InputText from 'primevue/inputtext';
    import MultiSelect from 'primevue/multiselect';
    import { useToast } from 'primevue/usetoast';
    
    import { useTaxonomyStore } from '@/stores/taxonomy';
    const taxonomyStore = useTaxonomyStore();
    const router = useRouter();
    const toast = useToast();
    
    const { taxonomies, fb } = storeToRefs(taxonomyStore);

    const filters = ref({
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' }
    });
    
    // Taxonomy names for MultiSelect filter
    const taxonomyNames = computed(() => taxonomies.value.map(t => t.name));
    
    // Fetch data on mount
    onMounted(() => {
      taxonomyStore.fetchTaxonomies();
    });
    
    // Clear all filters
    const clearFilter = () => {
      filters.value = {
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' }
      };
    };

    const editTaxonomy = (data: any) => {
      router.push(`/configuration/settings/taxonomies/edit/${data.taxonomy_id}`);
    };

    const deleteTaxonomy = async (data: any) => {
      
      try {
        await taxonomyStore.deleteTaxonomy(data.taxonomy_id);
          toast.add({ severity: 'success', summary: 'Success', detail: 'Vendor deleted successfully', life: 3000 });
      } catch (error) {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete vendor.', life: 3000 });
      }
    };
    </script>
    
    <template>
      <div class="taxonomy-index">
        <DataTable
          v-model:filters="filters"
          :value="taxonomies"
          paginator
          :rows="10"
          dataKey="taxonomy_id"
          filterDisplay="menu"
          :loading="fb.loading['taxonomy.list']"
          :globalFilterFields="['name', 'type', 'post_type']"
          class="th-table"
        >
          <!-- Header -->
          <template #header>
            <div class="flex justify-between items-center gap-2">
              <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
              <InputText v-model="filters.global.value" placeholder="Keyword Search" />
            </div>
          </template>
    
          <template #empty> No taxonomies to display! </template>
          <template #loading> Loading taxonomy data. Please wait. </template>
    
          <!-- Columns -->
          <Column field="taxonomy_id" header="ID" style="min-width: 10rem">
            <template #body="{ data }">
                #{{ data.taxonomy_id }}
            </template>
          </Column>
    
          <Column field="name" header="Name" filterField="name" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
            <template #body="{ data }">
                {{ data.name }}
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
    
          <Column field="type" header="Taxonomy Type" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.type }}
            </template>
          </Column>
    
          <Column field="post_type" header="Model Type" style="min-width: 12rem">
            <template #body="{ data }">
              {{ data.post_type }}
            </template>
          </Column>
    
          <Column header="Actions" :exportable="false" style="min-width: 8rem">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button 
                  :icon="fb.loading['taxonomy.edit.' + data.taxonomy_id] ? 'pi pi-spinner pi-spin' : 'pi pi-pencil'"
                  :loading="fb.loading['taxonomy.edit.' + data.taxonomy_id]"
                  rounded 
                  outlined 
                  severity="success" 
                  @click="editTaxonomy(data)" 
                />
                <Button 
                  :icon="fb.loading['taxonomy.delete.' + data.taxonomy_id] ? 'pi pi-spinner pi-spin' : 'pi pi-trash'"
                  :disabled="fb.loading['taxonomy.delete.' + data.taxonomy_id]"
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
    