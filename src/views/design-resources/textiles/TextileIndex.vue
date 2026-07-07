<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useTextileStore } from '@/stores/designResourceTextile';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const textileStore = useTextileStore();
const { textile, fb } = storeToRefs(textileStore);
const types = ref();
const toast = useToast();

const emit = defineEmits({})

//Define local variables here
const items = ref([
    { route: `/design-resource-textiles/list`, label: 'Textile List', icon: 'pi pi-home' },
    { route: `/design-resource-textiles/add`, label: 'Add', icon: 'pi pi-link' },
    { route: `/design-resource-textiles/import`, label: 'Import', icon: 'pi pi-link' },
    // { route: `/design-resource-textiles/export`, label: 'Download CSV', icon: 'pi pi-file-excel' },
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
    try {
        let response: any;
        if (textile.value.design_resource_id) {
            response = await textileStore.updateTextile(textile.value);
        } else {
            // Create new document
            response = await textileStore.createTextile(textile.value);
        }

        if (response?.design_resource_id) {
            router.push('/design-resource-textiles/edit/' + response.design_resource_id);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Textile saved successfully',
                life: 3000
            });
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save textile: ' + (response?.message || ''), life: 5000 });
        }
    } catch (error) {
        console.error('Error saving textile:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while saving the textile.',
            life: 5000
        });
    }
};

const refreshTabs = () => {
    const routeId = router.currentRoute.value.params.id;
    if (routeId) {
        const editRoute = `/design-resource-textiles/edit/${routeId}`;
        const existRoute = items.value.find(item => item.route === editRoute);
        if (!existRoute) {
            items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
        }
    } else {
        items.value = items.value.filter(item => !item.route.includes('/edit'));
    }
}
refreshTabs();

// const renderIcon = (icon: string) => {
//     return fb.value.loading['textile.update.' + textile.value?.design_resource_id] ? 'pi pi-spinner pi-spin' : icon;
// }

const renderIcon = (icon: string) => {
  return fb.value.loading['textile.update.'+textile.value?.design_resource_id] ? 'pi pi-spinner pi-spin' : icon;
}

//Lifecycle hook started from here
onMounted(async () => {
    const data = await textileStore.getTypes();
    types.value = data as unknown as any[];
    refreshTabs();
})
</script>

<template>
    <div class="textile card relative">
        <div class="sticky top-0 z-50 bg-white p-2">
            <Button v-if="showSaveButton" :label="saveLabel" :icon="renderIcon('pi pi-save')" class="p-button-md"
                @click="handleSave" />
        </div>
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

<style scoped></style>