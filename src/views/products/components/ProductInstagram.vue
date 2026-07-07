<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { debounce } from 'lodash';
import ProductSidebar from './ProductSidebar.vue';
import Product from '@/models/Product.ts';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import InstagramService from '@/service/InstagramService.js';

interface InstagramHashtag {
    id: number;
    name?: string;
    hashtag?: string;
}

interface InstagramPost {
    instagram_media_id: string;
    instagram_url: string;
    thumbnail_url?: string;
    caption?: string;
    hashtag?: string;
    media_type?: string;
}

interface ProductInstagramLink {
    product_instagram_id?: number;
    product_id?: number;
    instagram_media_id: string;
    instagram_url: string;
    thumbnail_url?: string;
    caption?: string;
    hashtag?: string;
    media_type?: string;
    sort_order: number;
}

interface InstagramSyncResponse {
    product_id: number;
    items: ProductInstagramLink[];
    deleted_ids?: number[];
    deleted_count?: number;
}

const props = defineProps({
    product: {
        type: Product,
        required: true,
        default: () => new Product({})
    }
});

const productStore = useProductStore();
const { fb } = storeToRefs(productStore);
const route = useRoute();
const toast = useToast();

const hashtagQuery = ref('');
const hashtagSuggestions = ref<InstagramHashtag[]>([]);
const selectedHashtag = ref<InstagramHashtag | null>(null);
const availablePosts = ref<InstagramPost[]>([]);
const selectedPostIds = ref<Set<string>>(new Set());
const linkedPosts = ref<ProductInstagramLink[]>([]);
const isSearchingHashtags = ref(false);
const isLoadingPosts = ref(false);
const isLoadingLinks = ref(false);
const isSaving = ref(false);
const isReordering = ref(false);

const linkedMediaIds = computed(() => new Set(linkedPosts.value.map(p => p.instagram_media_id)));

const productId = computed(() => {
    const fromProduct = props.product?.product_id;
    const fromRoute = Number(route.params.id);
    if (fromProduct && fromProduct > 0) return fromProduct;
    if (fromRoute > 0) return fromRoute;
    return null;
});

const normalizeItems = <T>(data: unknown): T[] => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
        const obj = data as Record<string, unknown>;
        if (Array.isArray(obj.items)) return obj.items as T[];
        if (Array.isArray(obj.links)) return obj.links as T[];
        if (Array.isArray(obj.data)) return obj.data as T[];
    }
    return [];
};

const getHashtagLabel = (hashtag: InstagramHashtag) => {
    const value = hashtag.name || hashtag.hashtag || '';
    return value.startsWith('#') ? value : `#${value}`;
};

const loadLinkedPosts = async () => {
    const id = productId.value;
    if (!id) return;

    isLoadingLinks.value = true;
    try {
        const response = await InstagramService.getProductInstagramLinks(id);
        linkedPosts.value = normalizeItems<ProductInstagramLink>(response)
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    } catch (error) {
        console.error('Error loading product Instagram links:', error);
        linkedPosts.value = [];
        toast.add({
            severity: 'error',
            summary: 'Load failed',
            detail: 'Could not load linked Instagram posts.',
            life: 3000
        });
    } finally {
        isLoadingLinks.value = false;
    }
};

const searchHashtags = debounce(async (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
        hashtagSuggestions.value = [];
        return;
    }

    isSearchingHashtags.value = true;
    try {
        const response = await InstagramService.searchHashtags(trimmed);
        hashtagSuggestions.value = normalizeItems<InstagramHashtag>(response).map(hashtag => ({
            ...hashtag,
            name: hashtag.name || hashtag.hashtag || ''
        }));
    } catch {
        hashtagSuggestions.value = [];
        toast.add({
            severity: 'error',
            summary: 'Search failed',
            detail: 'Could not search Instagram hashtags.',
            life: 3000
        });
    } finally {
        isSearchingHashtags.value = false;
    }
}, 300);

const onHashtagInput = (event: { query: string }) => {
    searchHashtags(event.query);
};

const onHashtagSelect = async (event: { value: InstagramHashtag }) => {
    selectedHashtag.value = event.value;
    hashtagQuery.value = getHashtagLabel(event.value);
    selectedPostIds.value = new Set();
    await loadHashtagPosts(event.value.id);
};

const loadHashtagPosts = async (hashtagId: number) => {
    isLoadingPosts.value = true;
    availablePosts.value = [];
    try {
        const response = await InstagramService.getHashtagPosts(hashtagId);
        availablePosts.value = normalizeItems<InstagramPost>(response);
    } catch {
        availablePosts.value = [];
        toast.add({
            severity: 'error',
            summary: 'Load failed',
            detail: 'Could not load posts for this hashtag.',
            life: 3000
        });
    } finally {
        isLoadingPosts.value = false;
    }
};

const isPostSelected = (post: InstagramPost) => selectedPostIds.value.has(post.instagram_media_id);

const isPostAlreadyLinked = (post: InstagramPost) => linkedMediaIds.value.has(post.instagram_media_id);

const togglePostSelection = (post: InstagramPost) => {
    if (isPostAlreadyLinked(post)) return;

    const next = new Set(selectedPostIds.value);
    if (next.has(post.instagram_media_id)) {
        next.delete(post.instagram_media_id);
    } else {
        next.add(post.instagram_media_id);
    }
    selectedPostIds.value = next;
};

const addSelectedPosts = () => {
    const postsToAdd = availablePosts.value.filter(
        post => selectedPostIds.value.has(post.instagram_media_id) && !isPostAlreadyLinked(post)
    );

    if (!postsToAdd.length) {
        toast.add({
            severity: 'warn',
            summary: 'No posts selected',
            detail: 'Select at least one post that is not already linked.',
            life: 3000
        });
        return;
    }

    const startOrder = linkedPosts.value.length;
    postsToAdd.forEach((post, index) => {
        linkedPosts.value.push({
            instagram_media_id: post.instagram_media_id,
            instagram_url: post.instagram_url,
            thumbnail_url: post.thumbnail_url,
            caption: post.caption,
            hashtag: post.hashtag || selectedHashtag.value?.name || selectedHashtag.value?.hashtag,
            media_type: post.media_type,
            sort_order: startOrder + index + 1
        });
    });

    selectedPostIds.value = new Set();
    toast.add({
        severity: 'success',
        summary: 'Posts added',
        detail: `${postsToAdd.length} post(s) added. Click Save Instagram Links to persist.`,
        life: 3000
    });
};

const removeLinkedPost = (index: number) => {
    linkedPosts.value.splice(index, 1);
    linkedPosts.value.forEach((post, idx) => {
        post.sort_order = idx + 1;
    });
};

const onLinkedPostsReorder = async (event: { value: ProductInstagramLink[] }) => {
    const reordered = event.value.map((post, index) => ({
        ...post,
        sort_order: index + 1
    }));
    linkedPosts.value = reordered;

    const id = productId.value;
    if (!id) return;

    const productInstagramIds = reordered
        .map(post => post.product_instagram_id)
        .filter((pid): pid is number => !!pid);

    if (!productInstagramIds.length || productInstagramIds.length !== reordered.length) {
        return;
    }

    isReordering.value = true;
    try {
        const response = await InstagramService.reorderProductInstagramLinks(id, productInstagramIds);
        linkedPosts.value = normalizeItems<ProductInstagramLink>(response.items ?? response)
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    } catch (error) {
        console.error('Error reordering Instagram links:', error);
        await loadLinkedPosts();
        toast.add({
            severity: 'error',
            summary: 'Reorder failed',
            detail: 'Could not save the new order. List restored.',
            life: 3000
        });
    } finally {
        isReordering.value = false;
    }
};

const armRowDrag = (event: MouseEvent) => {
    const row = (event.target as HTMLElement)?.closest?.('tr[data-pc-section="bodyrow"]');
    const cell = (event.target as HTMLElement)?.closest?.('td[data-pc-section="bodycell"]');
    if (!row || !cell) return;
    if (cell.classList.contains('instagram-row-reorder-cell')) {
        (row as HTMLElement).draggable = true;
    }
};

const buildSyncPayload = () => linkedPosts.value.map((post, index) => ({
    ...(post.product_instagram_id ? { product_instagram_id: post.product_instagram_id } : {}),
    instagram_media_id: post.instagram_media_id,
    instagram_url: post.instagram_url,
    thumbnail_url: post.thumbnail_url,
    caption: post.caption,
    hashtag: post.hashtag,
    media_type: post.media_type,
    sort_order: post.sort_order ?? index + 1
}));

const saveInstagramLinks = async () => {
    const id = productId.value;
    if (!id) return;

    isSaving.value = true;
    try {
        const response = await InstagramService.syncProductInstagramLinks(
            id,
            buildSyncPayload()
        ) as InstagramSyncResponse;

        linkedPosts.value = normalizeItems<ProductInstagramLink>(response.items ?? response)
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

        const deletedCount = response.deleted_count ?? response.deleted_ids?.length ?? 0;
        const detail = deletedCount > 0
            ? `Instagram links saved. ${deletedCount} removed link(s) deleted.`
            : 'Instagram links saved successfully.';

        toast.add({
            severity: 'success',
            summary: 'Saved',
            detail,
            life: 3000
        });
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Save failed',
            detail: 'Could not save Instagram links. Please try again.',
            life: 3000
        });
    } finally {
        isSaving.value = false;
    }
};

const truncateCaption = (caption?: string, max = 80) => {
    if (!caption) return '';
    return caption.length > max ? `${caption.slice(0, max)}...` : caption;
};

onBeforeMount(loadLinkedPosts);
</script>

<template>
    <div class="flex flex-col gap-8">
        <div class="loading-overlay" v-if="fb.loading['product.show'] || isLoadingLinks">
            <div class="flex justify-center items-center h-full spinner">
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                <p class="mt-2">Loading Instagram data. Please wait.</p>
            </div>
        </div>

        <div class="flex gap-6" v-if="!fb.loading['product.show'] && !isLoadingLinks">
            <div class="w-3/4 space-y-8">
                <div class="flex items-center justify-between">
                    <h2 class="text-2xl font-bold">Instagram</h2>
                    <Button
                        label="Save Instagram Links"
                        icon="pi pi-save"
                        :loading="isSaving"
                        :disabled="isSaving"
                        @click="saveInstagramLinks"
                    />
                </div>

                <div class="border border-gray-200 rounded-lg p-4 space-y-4">
                    <h3 class="text-lg font-semibold">1. Search hashtag</h3>
                    <p class="text-sm text-gray-500">Search for a hashtag to browse Instagram posts.</p>
                    <AutoComplete
                        v-model="hashtagQuery"
                        :suggestions="hashtagSuggestions"
                        optionLabel="name"
                        :loading="isSearchingHashtags"
                        placeholder="Type a hashtag, e.g. krost"
                        class="w-full"
                        inputClass="w-full"
                        @complete="onHashtagInput"
                        @item-select="onHashtagSelect"
                    >
                        <template #option="{ option }">
                            <span>{{ getHashtagLabel(option) }}</span>
                        </template>
                    </AutoComplete>
                </div>

                <div v-if="selectedHashtag" class="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div class="flex items-center justify-between gap-4">
                        <div>
                            <h3 class="text-lg font-semibold">2. Select posts</h3>
                            <p class="text-sm text-gray-500">
                                Posts for {{ getHashtagLabel(selectedHashtag) }}
                            </p>
                        </div>
                        <Button
                            label="Add Selected"
                            icon="pi pi-plus"
                            :disabled="!selectedPostIds.size"
                            @click="addSelectedPosts"
                        />
                    </div>

                    <div v-if="isLoadingPosts" class="flex items-center justify-center gap-2 py-8">
                        <i class="pi pi-spinner pi-spin" style="font-size: 1.5rem;"></i>
                        <span>Loading posts...</span>
                    </div>

                    <div v-else-if="!availablePosts.length" class="text-center text-gray-500 py-8">
                        No posts found for this hashtag.
                    </div>

                    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <button
                            v-for="post in availablePosts"
                            :key="post.instagram_media_id"
                            type="button"
                            class="instagram-post-card"
                            :class="{
                                'instagram-post-card--selected': isPostSelected(post),
                                'instagram-post-card--linked': isPostAlreadyLinked(post),
                                'instagram-post-card--disabled': isPostAlreadyLinked(post)
                            }"
                            :disabled="isPostAlreadyLinked(post)"
                            @click="togglePostSelection(post)"
                        >
                            <div class="instagram-post-card__image-wrap">
                                <img
                                    v-if="post.thumbnail_url"
                                    :src="post.thumbnail_url"
                                    :alt="post.caption || 'Instagram post'"
                                    class="instagram-post-card__image"
                                />
                                <div v-else class="instagram-post-card__placeholder">
                                    <i class="pi pi-image" />
                                </div>
                                <span v-if="isPostAlreadyLinked(post)" class="instagram-post-card__badge">
                                    Linked
                                </span>
                                <span v-else-if="isPostSelected(post)" class="instagram-post-card__badge instagram-post-card__badge--selected">
                                    <i class="pi pi-check" />
                                </span>
                            </div>
                            <p class="instagram-post-card__caption">{{ truncateCaption(post.caption) }}</p>
                        </button>
                    </div>
                </div>

                <div class="border border-gray-200 rounded-lg p-4 space-y-4">
                    <h3 class="text-lg font-semibold">3. Linked posts</h3>
                    <p class="text-sm text-gray-500">
                        These posts will be shown on the product page. Reorder or remove, then save.
                        Saving replaces the full linked list — anything removed here will be deleted.
                    </p>

                    <div v-if="!linkedPosts.length" class="text-center text-gray-500 py-8">
                        No Instagram posts linked yet.
                    </div>

                    <DataTable
                        v-else
                        :value="linkedPosts"
                        dataKey="instagram_media_id"
                        class="instagram-linked-posts-table"
                        tableStyle="min-width: 100%"
                        size="small"
                        :loading="isReordering"
                        @rowReorder="onLinkedPostsReorder"
                        @mousedown="armRowDrag"
                    >
                        <Column
                            rowReorder
                            headerStyle="width: 3rem"
                            bodyClass="instagram-row-reorder-cell"
                            :reorderableColumn="false"
                        />
                        <Column header="Thumbnail" headerStyle="width: 3.5rem" :reorderableColumn="false">
                            <template #body="{ data }">
                                <img
                                    v-if="data.thumbnail_url"
                                    :src="data.thumbnail_url"
                                    :alt="data.caption || 'Linked post'"
                                    class="linked-post-thumb"
                                />
                                <div v-else class="linked-post-thumb linked-post-thumb--placeholder">
                                    <i class="pi pi-image" />
                                </div>
                            </template>
                        </Column>
                        <Column field="instagram_url" header="URL" :reorderableColumn="false">
                            <template #body="{ data }">
                                <a
                                    :href="data.instagram_url"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="linked-post-url"
                                >
                                    {{ data.instagram_url }}
                                </a>
                            </template>
                        </Column>
                        <Column header="" headerStyle="width: 3.5rem" :reorderableColumn="false">
                            <template #body="{ index }">
                                <Button
                                    icon="pi pi-trash"
                                    text
                                    rounded
                                    severity="danger"
                                    @click="removeLinkedPost(index)"
                                />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </div>

            <ProductSidebar :product="product" />
        </div>
    </div>
</template>

<style scoped>
.instagram-post-card {
    border: 2px solid transparent;
    border-radius: 0.5rem;
    overflow: hidden;
    background: #fff;
    text-align: left;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.instagram-post-card:hover:not(:disabled) {
    border-color: #93c5fd;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.instagram-post-card--selected {
    border-color: #2563eb;
}

.instagram-post-card--linked {
    opacity: 0.65;
    cursor: not-allowed;
}

.instagram-post-card__image-wrap {
    position: relative;
    aspect-ratio: 1;
    background: #f3f4f6;
}

.instagram-post-card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.instagram-post-card__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-size: 2rem;
}

.instagram-post-card__badge {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(0, 0, 0, 0.65);
    color: #fff;
    font-size: 0.75rem;
    padding: 0.15rem 0.5rem;
    border-radius: 9999px;
}

.instagram-post-card__badge--selected {
    background: #2563eb;
    width: 1.75rem;
    height: 1.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.instagram-post-card__caption {
    padding: 0.5rem;
    font-size: 0.8rem;
    color: #4b5563;
    line-height: 1.3;
    min-height: 2.6rem;
}

.instagram-linked-posts-table :deep(.instagram-row-reorder-cell) {
    padding: 0 !important;
}

.instagram-linked-posts-table :deep(.p-datatable-reorderable-row-handle) {
    width: 100%;
    /* height: 2.5rem; */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    touch-action: none;
}

.linked-post-thumb {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 0.25rem;
    display: block;
}

.linked-post-thumb--placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    color: #9ca3af;
}

.linked-post-url {
    display: block;
    font-size: 0.85rem;
    color: #2563eb;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}
</style>
