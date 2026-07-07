<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';

const router = useRouter();
const toast = useToast();
const projectStore = useProjectStore();
const { project, fb } = storeToRefs(projectStore); // use store project

// Tabs
const items = ref([
    { route: '/ecommerce/projects/add/general', label: 'General', icon: 'pi pi-home' },
    { route: '/ecommerce/projects/add/images', label: 'Images', icon: 'pi pi-link' },
]);

const currentRoute = computed(() => router.currentRoute.value.path);
const onProjectSaved = async () => {
    try {
        const savedProject = await projectStore.createProject(project.value);
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Project created successfully',
            life: 3000
        });
        router.push(`/ecommerce/projects/${savedProject.project_id}`);
    } catch (error: any) {
        console.log(error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create the project. Please ensure the title is unique and check your network connection.', // error.message || 'Failed to save project',
            life: 3000
        });
    }
};
onMounted(() => {
    projectStore.resetProjectForm()
});
</script>

<template>
    <div class="card relative">
        <!-- Save button -->
        <!-- <Button 
            icon="pi pi-save"
            label="Save"
            severity="primary"
            :loading="fb.loading['project.create']"
            @click="onProjectSaved"
            class="p-button-md"
        /> -->

        <!-- Tabs -->
        <Tabs :value="currentRoute" scrollable>
            <TabList>
                <template v-for="tab in items" :key="tab.label">
                    <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                        <Tab :active="currentRoute === tab.route" :key="tab.label" :value="tab.route" @click="navigate">
                            <a v-ripple :href="href" class="flex items-center gap-2 text-inherit">
                                <i :class="tab.icon" />
                                <span>{{ tab.label }}</span>
                            </a>
                        </Tab>
                    </router-link>
                </template>
            </TabList>
            
            <!-- Tab content -->
            <div class="p-6">
                <!-- Pass the store project to routed child -->
                <router-view :project="project" />
            </div>
        </Tabs>
    </div>
</template>

<style scoped>
.p-button-md {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1000;
}
.p-button-md-bottom {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}
</style>
