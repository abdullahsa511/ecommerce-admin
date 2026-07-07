<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from 'vue-router';
import Project from '@/models/Project.ts';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { FileModel } from "@/models/Media";

const router = useRouter();
const projectStore = useProjectStore();
const {fb, project} = storeToRefs(projectStore);
const toast = useToast();

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});
const items = ref([
    { route: `/ecommerce/projects/edit/${props.id}/general`, label: 'General', icon: 'pi pi-home' },
    { route: `/ecommerce/projects/edit/${props.id}/images`, label: 'Images', icon: 'pi pi-link' }
]);

const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});


const isSaving = ref(false);

const onProductSaved = async () => {
    try {
        if (project.value?.project_id) {
            await projectStore.updateProject(project.value);
            toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Project updated successfully',
                life: 3000
            });
        }
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update the project. Please ensure the title is unique and check your network connection.', // error.message || 'Failed to save project',
            life: 3000
        });
    } finally {
        isSaving.value = false;
    }
}

const onProjectUpdated = (data: Project) => {
    // Instead of reassigning the entire project, update its properties
    if (project.value && data) {
        Object.assign(project.value, data);
    }
}
const addImages = (files: any) => {
    project.value.images = project.value.images.map((file: any) => {
        let f = files.find((img: any) => img.file?.name === file.name);
        if(f) return new FileModel(f);
        return file;
    });
}

onMounted(async () => {    
    try {
        await projectStore.fetchProjectById(props.id);
    } catch (error) {
        console.error('Error in onMounted:', error);
    }
})

watch(project, (newVal, oldVal) => {
    // Project changed in store
}, { deep: true });

</script>
<template>
    <div class="card relative">
        <Button 
                :icon="fb.loading['project.update'] ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
                :label="fb.loading['project.update'] ? 'Updating...' : 'Update'"
                severity="primary"
                :loading="fb.loading['project.update']"
                :disabled="fb.loading['project.update']"
                @click="onProductSaved"
                class="p-button-md"
            />
        <Tabs :value="currentRoute" scrollable>
            <TabList >
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
            <div class="p-6">
                <router-view  
                @saved="onProductSaved" @update:project="onProjectUpdated"
                @add:images="addImages"
                />
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


