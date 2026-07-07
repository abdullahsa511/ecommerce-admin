<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useDocumentStore } from '@/stores/designResourceDocument';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const documentStore = useDocumentStore();
const { document, fb } = storeToRefs(documentStore);
const toast = useToast();

const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/design-resource-documents/list`, label: 'Document List', icon: 'pi pi-home' },
  { route: `/design-resource-documents/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/design-resource-documents/import`, label: 'Import', icon: 'pi pi-link' },
]);
const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});

const showSaveButton = computed(() => {
  const path = currentRoute.value || '';
  return path.includes('/add') || path.includes('/edit');
});
// Change Save button label based on route
const saveLabel = computed(() => {
  return currentRoute.value && currentRoute.value.includes('/edit') ? 'Save and Update' : 'Save';
})

// Fetch document if route is edit
const handleSave = async () => {
    console.log('handleSave document:', document.value);
    try {
        let response: any;
        if (document.value.design_resource_id) {
            // response = await documentStore.updateDocument(document.value.design_resource_document_id, document.value);
            // console.log('Updating document form value:', document.value);
            response = await documentStore.updateDocument(document.value);
        } else {
            // Create new document
            response = await documentStore.createDocument(document.value);
        }

        if (response?.design_resource_id) {
            router.push('/design-resource-documents/edit/' + response.design_resource_id);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Document saved successfully',
                life: 3000
            });
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save document: ' + (response?.message || ''), life: 5000 });
        }
    } catch (error) {
        console.error('Error saving document:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while saving the document.',
            life: 5000
        });
    }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/design-resource-documents/edit/${routeId}`;
    const existRoute = items.value.find(item => item.route === editRoute);
    if (!existRoute) {
      items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit'));
  }
}
refreshTabs();

const renderIcon = (icon: string) => {
    return fb.value.loading['document.update.'+document.value.design_resource_id] ? 'pi pi-spinner pi-spin' : icon;
}

//Lifecycle hook started from here
onMounted(() => {
    refreshTabs();
})
</script>

<template>
    <div class="document card relative p-0">
        <div class="sticky top-0 z-50 bg-white p-2">
            <Button v-if="showSaveButton" :label="saveLabel" 
            :icon="fb.loading['document.update.'+document.design_resource_id] ? 'pi pi-spinner pi-spin' : 'pi pi-save'" 
            :disabled="fb.loading['document.update.'+document.design_resource_id]"
            class="p-button-md" @click="handleSave" 
             />
        </div>
        <!-- <Button v-if="showSaveButton" :label="saveLabel" icon="pi pi-save" class="p-button-md " @click="handleSave" /> -->
        <Tabs :value="currentRoute" scrollable>
            <TabList>
                <template v-for="tab in items" :key="tab.label">
                    <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                        <Tab :active="currentRoute === tab.route" :key="tab.label" :value="tab.route" @click="navigate">
                            <a v-ripple :href="href" @click="navigate" class="flex items-center gap-2 text-inherit">
                                <i :class="tab.icon" />
                                <span>{{ tab.label }}</span>
                            </a>
                        </Tab>
                    </router-link>
                </template>
            </TabList>
            <div class="py-6">
                <router-view @editTabUnmunted="refreshTabs" @saved="handleSave" @editTabMounted="refreshTabs" />
            </div>
        </Tabs>
    </div>
</template>

<style scoped>

</style>