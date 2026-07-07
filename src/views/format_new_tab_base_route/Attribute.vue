<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router';

//System variables such as props, useStore or stateToRef etc
const props = defineProps({ id: { type: String, required: false, default: null } })
const router = useRouter();

//Declear emits
const emit = defineEmits({  })

//Define local variables here
const items = ref([
    { route: `/ecommerce/attributes/list`, label: 'Attributes', icon: 'pi pi-home' },
    { route: `/ecommerce/attributes/add`, label: 'Add', icon: 'pi pi-link' },
    { route: `/ecommerce/attributes/import`, label: 'Import', icon: 'pi pi-link' },
]);
const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});


//Define local methods here

const refreshTabs = () => {
   if(props.id) {
        const existRoute = items.value.find(item => item.route === `/ecommerce/attributes/edit/${props.id}`);
        if(!existRoute) {
            items.value.push({ route: `/ecommerce/attributes/edit/${props.id}`, label: 'Edit', icon: 'pi pi-list' });
        }
    }else{
        items.value = items.value.filter(item => !item.route.includes('/edit'));
    }
}
refreshTabs();

//Lifecycle hook started from here
onMounted(() => {  })
</script>

<template>
  <div class="attriutes card relative">
    <Tabs :value="currentRoute" scrollable>
        <TabList >
            <template v-for="tab in items" :key="tab.label">
                <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                    <Tab :active="currentRoute === tab.route" :key="tab.label" :value="tab.route" @click="navigate">
                        <a v-ripple :href="href" @click="navigate"class="flex items-center gap-2 text-inherit" >
                            <i :class="tab.icon" />
                            <span>{{ tab.label }}</span>
                        </a>
                    </Tab>
                </router-link>
            </template>
        </TabList>
        <div class="p-6">
            <router-view @editTabUnmunted="refreshTabs"/>
        </div>
    </Tabs>
  </div>
</template>