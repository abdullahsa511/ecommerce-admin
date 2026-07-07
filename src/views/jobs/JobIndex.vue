<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';
// Remove curly braces for default import
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useJobStore } from '@/stores/job';

const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();
const jobStore = useJobStore();
const { job, fb } = storeToRefs(jobStore);
const toast = useToast();

const emit = defineEmits({})

//Define local variables here
const items = ref([
  { route: `/jobs/list`, label: 'Job List', icon: 'pi pi-home' },
  { route: `/jobs/add`, label: 'Add', icon: 'pi pi-link' },
  { route: `/jobs/import`, label: 'Import', icon: 'pi pi-link' },
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
    console.log('handleSave job:', job.value);
    try {
        let response: any;
        if (job.value.job_id) {
            response = await jobStore.updateJob(job.value);
        } else {
            // Create new document
            response = await jobStore.createJob(job.value);
        }
        console.log('response from handleSave:', response);
        if (response?.job_id) {
            router.push('/jobs/edit/' + response.job_id);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Job saved successfully',
                life: 3000
            });
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save job: ' + (response?.message || ''), life: 5000 });
        }
    } catch (error) {
        console.error('Error saving job:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An error occurred while saving the job.',
            life: 5000
        });
    }
};

const refreshTabs = () => {
  const routeId = router.currentRoute.value.params.id;
  if (routeId) {
    const editRoute = `/jobs/edit/${routeId}`;
    const detailsRoute = `/jobs/details/${routeId}`;
    const existRoute = items.value.find(item => item.route === editRoute);
    if (!existRoute) {
      items.value.push({ route: editRoute, label: 'Edit', icon: 'pi pi-list' });
    }
    const existDetailsRoute = items.value.find(item => item.route === detailsRoute);
    if (!existDetailsRoute) {
      items.value.push({ route: detailsRoute, label: 'Details', icon: 'pi pi-eye' });
    }
  } else {
    items.value = items.value.filter(item => !item.route.includes('/edit') && !item.route.includes('/details'));
    jobStore.resetJob();
  }
}
refreshTabs();

//Lifecycle hook started from here
onMounted(() => {
    refreshTabs();
})
</script>

<template>
    <div class="job card relative p-0">
        <div class="sticky top-0 z-50 bg-white p-2">
            <Button v-if="showSaveButton" 
            :label="fb.loading['job.create'] ? 'Saving...' : (fb.loading['job.update.'+job.job_id] ? 'Updating...' : saveLabel)" 
            :icon="fb.loading['job.create'] || fb.loading['job.update.'+job.job_id] ? 'pi pi-spinner pi-spin' : 'pi pi-save'" 
            :disabled="fb.loading['job.create'] || fb.loading['job.update.'+job.job_id]"
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