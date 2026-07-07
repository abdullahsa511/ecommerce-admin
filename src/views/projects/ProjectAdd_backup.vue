<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from 'vue-router';
// import { Project, ProjectStatus } from '@/models/Project.ts';
import Project, { ProjectStatus } from '@/models/Project.ts';
import { useToast } from 'primevue/usetoast';
import { useProjectStore } from '@/stores/project';
import { storeToRefs } from 'pinia';
import { Customer } from "@/models/Customer";
import { Address } from "@/models/Google";

const router = useRouter();
const toast = useToast();
const projectStore = useProjectStore();
const {fb} = storeToRefs(projectStore);


const items = ref([
    { route: '/ecommerce/projects/add/general', label: 'General', icon: 'pi pi-home' },
    { route: '/ecommerce/projects/add/images', label: 'Images', icon: 'pi pi-link' },
]);

const currentRoute = computed(() => router.currentRoute.value.path);

const project = ref(new Project({
    name: "New Project_" + new Date().getTime(),
    slug: "new-project-" + new Date().getTime(),
    description: "New Project Description",
    customer: new Customer({
        customer_id: 1,
        name: "John Doe",
    }),
    location: new Address({
        description: "123 Main St, Anytown, USA"
    }),
    status: 1,
    site_id: 6,
    image: [
        {
            "image": "/media/uploads2025/06/1736338103592.jpeg",
            "name": "1736338103592.jpeg",
            "description": "",
            "size": 164134,
            "type": "image/jpeg",
            "objectURL": "http://localhost:8089/media/uploads2025/06/1736338103592.jpeg",
            "status": {
                "name": "Uploaded",
                "severity": "success"
            }
        }
    ],
    images: [
        {
            "image": "/media/uploads2025/06/1736338103592.jpeg",
            "name": "1736338103592.jpeg",
            "description": "",
            "size": 164134,
            "type": "image/jpeg",
            "objectURL": "http://localhost:8089/media/uploads2025/06/1736338103592.jpeg",
            "status": {
                "name": "Uploaded",
                "severity": "success"
            }
        }
    ],
}));

const onProjectSaved = async () => {
    // console.log(product.value);
    try {
        // product.value.sku = "New Product_" + new Date().getTime();
        console.log("you hit with project", project.value);
        // TODO: Save product to backend (implement your save logic here)
        const savedProject = await projectStore.createProject(project.value);
        project.value = savedProject;
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product created successfully',
            life: 3000
        });
        // Optionally, redirect to product detail page
        router.push(`/ecommerce/projects/${savedProject.project_id}`);
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save product',
            life: 3000
        });
    }
};

</script>
<template>
    <div class="card relative">
        <Button 
                icon="pi pi-save"
                label="Save"
                severity="primary"
                :loading="fb.loading['project.create']"
                @click="onProjectSaved"
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
                <router-view :project="project" v-model.project="project" @saved="onProjectSaved"/>
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


