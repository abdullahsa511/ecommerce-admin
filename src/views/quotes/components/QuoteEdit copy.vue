<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from 'vue-router';
import { useQuoteStore } from '@/stores/quote';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { useQuoteItemStore } from "@/stores/quoteItem";

const emit = defineEmits(['update:option', 'saved', 'editTabUnmunted', 'editTabMounted']);
const route = useRoute();

// const router = useRouter();
const quoteStore = useQuoteStore();
const {quote, fb} = storeToRefs(quoteStore);
const quoteItemStore = useQuoteItemStore();
const { quoeItem } = storeToRefs(quoteItemStore);
const toast = useToast();

const props = defineProps({
    id: {
        type: String,
        required: true
    }
});
const items = ref([
    { route: `/quotes/${props.id}/overview`, label: 'Overview', icon: 'pi pi-home' },
    { route: `/quotes/${props.id}/items`, label: 'Items', icon: 'pi pi-link' }
]);

const currentRoute = computed(() => {
    return router.currentRoute.value.path;
});

const quote = ref<Quote>(); //Good Job

const isSaving = ref(false);

const onQuoteItemSaved = async () => {
    try {
        if (quote.value?.quote_id) {
            // await quoteStore.updateQuote(quote.value);
            if(quote.value.items.length > 0) {
                const response = await quoteItemStore.createQuoteItem(quote.value.items);
                console.log("Server response:", response);
                // Don't overwrite quote with QuoteItem - keep it as Quote
                // quote.value = response; // This was causing the type error
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Quote Item created successfully',
                    life: 3000
                });
            }
            else {
                await quoteStore.updateQuote(quote.value);
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Quote updated successfully',
                    life: 3000
                });

            }
        }
    } catch (error: any) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message || 'Failed to save Quote',
            life: 3000
        });
    } finally {
        isSaving.value = false;
    }
}

onMounted(async () => {
    quote.value = await quoteStore.fetchQuoteById(props.id);
})

</script>
<template>
    <div class="card relative">
        <Button 
            :icon="fb.loading['product.update'] ? 'pi pi-spin pi-spinner' : 'pi pi-save'"
            label="Save"
            severity="primary"
            :loading="fb.loading['product.update']"
            :disabled="fb.loading['product.update']"
            @click="onQuoteItemSaved"
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
                <router-view :quote="quote"  v-model.quote="quote"  @saved="onQuoteItemSaved"/>
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