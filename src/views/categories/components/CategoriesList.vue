<script setup>
import { resolveMediaImage, hasMediaImage } from '@/utils/mediaUrl';
import { ref, onMounted, watch, computed } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { storeToRefs } from 'pinia';
import Tree from 'primevue/tree';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Fluid from 'primevue/fluid';
import { useToast } from 'primevue/usetoast';
import WayPoint from '@/views/wayPoint/WayPoint.vue';

const router = useRouter();
const toast = useToast();

const categoryStore = useCategoryStore();
const { categories, loading, error, fb } = storeToRefs(categoryStore);
const selectedKeys = ref({});
const expandedKeys = ref({});
const showAddForm = ref(false);
const isSubCategory = ref(false);
const selectedParentNode = ref(null);
const editingNode = ref(null);
const formData = ref({
    id: null,
    name: '',
    slug: '',
    content: '',
    meta_title: '',
    label_name: '',
    meta_description: '',
    meta_keywords: '',
    description: '',
    status: 1,
    image: null,
    slider_image: null,
    banner_way_points: [],
    sort_order: 1,
    link: '',
    products_link: ''
});
const visible = ref(false);
const wayPointSuggestions = ref([]);

// ------------- way points section start ------------- 
const bannerWayPointsData = computed(() => {
    return formData.value?.banner_way_points ? formData.value?.banner_way_points : [];
});
const updateWayPoints = async (wayPoints) => {
    let response = await categoryStore.updateCategoryWayPoints(formData.value.id, wayPoints);
    if (response) {
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Way Points saved successfully',
            life: 3000
        });
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save way points: ' + (response?.message || ''), life: 5000 });
    }
};
const searchWayPointSuggestions = async (query) => {
    const suggestions = await categoryStore.getWayPointSuggestions(query);
    wayPointSuggestions.value = suggestions;
};
// ------------- way points section end ------------- 

const statusOptions = ref([
    { name: 'Enabled', code: 'E' },
    { name: 'Disabled', code: 'D' }
]);

const parentCategoryOptions = computed(() => {
    const options = [{ id: null, key: null, label: '(Root / Main Category)', depth: 0 }];
    const flatten = (items, depth = 0) => {
        (items || []).forEach(cat => {
            if (cat?.data?.isEditForm) return;
            const label = cat?.label || cat?.data?.label || '';
            const indent = '—'.repeat(depth);
            options.push({
                id: cat?.id ?? cat?.key,
                key: cat?.key,
                label: depth > 0 ? `${indent} ${label}` : label,
                depth
            });
            if (cat?.children?.length) flatten(cat.children, depth + 1);
        });
    };
    flatten(treeNodes.value);
    return options;
});

onMounted(() => {
    categoryStore.fetchProductCategories();
});

/** Find ancestor category ids by traversing the categories tree (PrimeVue node may not have parent) */
const getAncestorIdsFromCategories = (categories, targetId, ancestors = []) => {
    for (const category of categories) {
        if (category.id === targetId) return ancestors;
        if (category.children?.length) {
            const found = getAncestorIdsFromCategories(
                category.children,
                targetId,
                [...ancestors, category.id]
            );
            if (found) return found;
        }
    }
    return null;
};

const transformToTreeNodes = (categories) => {
    return categories.map(category => {
        // console.log("category", category);

        const node = {
            id: category.id,
            key: category.id,
            label: category.label,
            content: category.content,
            meta_title: category.meta_title,
            label_name: category.label_name,
            meta_description: category.meta_description,
            meta_keywords: category.meta_keywords,
            image: category.image,
            slider_image: category.slider_image,
            banner_way_points: category.banner_way_points,
            status: 1,
            sort_order: category.sort_order,
            link: category.link,
            products_link: category.products_link,
            data: category,
            children: category.children ? transformToTreeNodes(category.children) : [],
            selectable: true,
            draggable: true,
            droppable: true
        };

        // If this is the node being edited, add the edit form as a child
        if (editingNode.value && editingNode.value.key === category.id) {
            node.children = [{
                key: 'edit-form-' + category.id,
                label: 'Edit Form',
                content: '',
                meta_title: '',
                label_name: '',
                meta_description: '',
                meta_keywords: '',
                image: null,
                slider_image: null,
                banner_way_points: [],
                sort_order: 1,
                link: '',
                products_link: '',
                data: { isEditForm: true },
                selectable: false,
                draggable: false,
                droppable: false
            }];
        }

        return node;
    });
};

const treeNodes = ref([]);
const isReordering = ref(false);

const updateTreeNodes = (options = {}) => {

    let newExpandedKeys;
    const { collapseNodeId } = options;

    if (editingNode.value) {
        newExpandedKeys = {};
        const nodeId = editingNode.value.key;
        // Expand the node being edited so the edit form is visible
        newExpandedKeys[nodeId] = true;
        // Expand all ancestor nodes so the path to the subcategory stays visible
        const ancestorIds = getAncestorIdsFromCategories(categories.value, nodeId);
        ancestorIds?.forEach((id) => {
            newExpandedKeys[id] = true;
        });
    } else {
        // Preserve existing expansion by id when not editing (e.g. cancel/save)
        newExpandedKeys = { ...expandedKeys.value };
        // Collapse the node that was being edited when cancel/save
        if (collapseNodeId != null) {
            delete newExpandedKeys[collapseNodeId];
        }
    }

    expandedKeys.value = newExpandedKeys;
    treeNodes.value = transformToTreeNodes(categories.value);
    // console.log("treeNodes", treeNodes.value);
};

// Watch for changes in categories (skip during reorder to avoid overwriting)
watch(categories, () => {
    if (isReordering.value) return;
    updateTreeNodes();
}, { deep: true });

const onNodeSelect = (node) => {

};

const formParentKey = ref(null);

const addCategory = (parentNode = null, subCategory = false) => {
    showAddForm.value = !subCategory;
    isSubCategory.value = subCategory;
    selectedParentNode.value = parentNode;
    formParentKey.value = parentNode ? parentNode.key : null;
    editingNode.value = null;
    formData.value = {
        id: null,
        name: '',
        slug: '',
        // content: '',
        meta_title: '',
        label_name: '',
        meta_description: '',
        meta_keywords: '',
        description: '',
        status: 1,
        image: null,
        slider_image: null,
        banner_way_points: [],
        sort_order: 1,
        link: '',
        products_link: '',
    };
};

const cancelAdd = (id) => {
    const cancelNodeId = id ?? null;
    showAddForm.value = false;
    isSubCategory.value = false;
    selectedParentNode.value = null;
    formParentKey.value = null;
    editingNode.value = null;
    formData.value = {
        name: '',
        slug: '',
        label_name: '',
        description: '',
        status: 1,
        sort_order: 1,
        link: '',
        products_link: '',
    };
    updateTreeNodes({ collapseNodeId: cancelNodeId });
};

const generateSlug = (name) => {
    return name.toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');
};

const saveCategory = async () => {
    const wasEditingNodeId = editingNode.value?.key ?? null;
    const isEditMode = !!editingNode.value;
    const parentId = formParentKey.value ?? selectedParentNode.value?.key ?? formData.value?.parent_id ?? null;
    const parentSlug = parentId ? generateSlug(selectedParentNode.value?.label) : null;
    const categoryLink = parentSlug ? `/categories/${parentSlug}/${formData.value.slug}` : `/categories/${formData.value.slug}`;

    console.log(categoryLink);
    console.log(formData.value.products_link);



    // console.log("parentId", parentId);
    // return;
    if (isEditMode) {
        // console.log("formData.value", formData.value);
        // return;
        const payload = {
            id: formData.value.id,
            category_id: formData.value.id,
            name: formData.value.name,
            slug: formData.value.slug,
            label: formData.value.name,
            parent_id: parentId,
            // content: formData.value.content,
            meta_title: formData.value.meta_title,
            label_name: formData.value.label_name,
            meta_description: formData.value.meta_description,
            meta_keywords: formData.value.meta_keywords,
            description: formData.value.description,
            content: formData.value.content,
            status: 1,
            sort_order: formData.value.sort_order,
            link: categoryLink,
            products_link: formData.value.products_link,
            image: formData.value.image,
            slider_image: formData.value.slider_image,
            banner_way_points: formData.value.banner_way_points
        };
        const response = await categoryStore.updateCategory(payload);
        if (response) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Category updated successfully', life: 3000 });
            await categoryStore.fetchProductCategories();
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update category', life: 5000 });
        }
    } else {
        const payload = {
            name: formData.value.name,
            slug: formData.value.slug,
            label: formData.value.name,
            // description: formData.value.content,
            meta_title: formData.value.meta_title,
            label_name: formData.value.label_name,
            meta_description: formData.value.meta_description,
            meta_keywords: formData.value.meta_keywords,
            description: formData.value.description,
            status: 1,
            parent_id: parentId,
            sort_order: formData.value.sort_order,
            link: categoryLink,
            products_link: formData.value.products_link,
        };
        const response = await categoryStore.createCategory(payload);
        if (response) {
            toast.add({ severity: 'success', summary: 'Success', detail: 'Subcategory created successfully', life: 3000 });
            await categoryStore.fetchProductCategories();
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create category', life: 5000 });
        }
    }

    showAddForm.value = false;
    isSubCategory.value = false;
    selectedParentNode.value = null;
    formParentKey.value = null;
    editingNode.value = null;
    formData.value = {
        id: null,
        name: '',
        slug: '',
        // content: '',
        meta_title: '',
        label_name: '',
        meta_description: '',
        meta_keywords: '',
        description: '',
        status: 1,
        image: null,
        slider_image: null,
        sort_order: 1,
        link: '',
        products_link: '',
        banner_way_points: []
    };
    updateTreeNodes({ collapseNodeId: wasEditingNodeId });
};

const editCategory = (node) => {
    // console.log("nodeexit", node);
    editingNode.value = node;
    formData.value = {
        id: node.data.id,
        name: node.data.label,
        slug: node.data.slug,
        // content: node.data.content,
        meta_title: node.data.meta_title,
        label_name: node.data.label_name,
        meta_description: node.data.meta_description,
        meta_keywords: node.data.meta_keywords,
        description: node.data.description,
        content: node.data.content,
        status: 1,
        image: node.data.image,
        slider_image: node.data.slider_image,
        banner_way_points: node.data.banner_way_points,
        sort_order: node.data.sort_order,
        link: node.data.link,
        products_link: node.data.products_link
    };
    // Populate parent selection so saveCategory can determine parent correctly
    const parentKey = node.data?.parent_id ?? node.data?.parentId ?? null;
    formParentKey.value = parentKey;
    // find parent node in current tree and set selectedParentNode if available
    const found = findNodeAndParent(treeNodes.value, node.key);
    selectedParentNode.value = found?.parent ?? null;

    updateTreeNodes();
};

const makeSlug = (name) => {
    const slug = name.toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // replace spaces with -
        .replace(/[^a-z0-9-]/g, '')  // remove all special chars except -
        .replace(/-+/g, '-');        // remove duplicate -

        formData.value.slug = slug;
        formData.value.products_link = `/products/${slug}`;
};

// const makeLink = (formData) => {
//     const {name, parent_id} = formData;
//     // console.log(parent_id);

//     //    const parData = categories.value.find(item => item.id === parent_id);
//     //    console.log(parData);
//     const slug = name
//         .toLowerCase()
//         .trim()
//         .replace(/\s+/g, '-')        // replace spaces with -
//         .replace(/[^a-z0-9-]/g, '')  // remove special chars except -
//         .replace(/-+/g, '-');        // remove duplicate -

//     formData.value.products_link = `products/${slug}`;
// };

const deleteCategory = (node) => {
    console.log('Delete category:', node);
};

/** ---------------Drag and Drop Feature Started --------------- */
const hasTouch = 'ontouchstart' in window;
const hasPointerEvents = () => {
    // let el = document.createElement('div'),
    //     docEl = document.documentElement;
    // if(!('pointerEvents' in el.style)) {
    //     return false;
    // }
    // el.style.pointerEvents = 'auto';
    // el.style.pointerEvents = 'x';
    // docEl.appendChild(el);
    // var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
    // docEl.removeChild(el);
    return !!supports;
};

/** Match keys - API may use number or string for ids */
const keyMatches = (a, b) => a != null && b != null && String(a) === String(b);

const findAndRemoveNode = (nodes, key) => {
    for (let i = 0; i < nodes.length; i++) {
        if (keyMatches(nodes[i].key, key)) {
            return nodes.splice(i, 1)[0];
        }

        if (nodes[i].children) {
            const found = findAndRemoveNode(nodes[i].children, key);
            if (found) return found;
        }
    }
    return null;
};

const findNodeAndParent = (nodes, key, parent = null) => {
    for (let node of nodes) {
        if (keyMatches(node.key, key)) {
            return { node, parent };
        }

        if (node.children) {
            const found = findNodeAndParent(node.children, key, node);
            if (found) return found;
        }
    }
    return null;
};

/** Check if drop is valid: main category cannot drop into subcategory; subcategory only within same parent */
const isValidDropTarget = (draggedKey, targetKey) => {
    if (!draggingItem.value || keyMatches(draggedKey, targetKey)) return false;
    const draggedResult = findNodeAndParent(treeNodes.value, draggedKey);
    const targetResult = findNodeAndParent(treeNodes.value, targetKey);
    if (!draggedResult || !targetResult) return false;
    const draggedParentKey = draggedResult.parent?.key ?? null;
    const targetParentKey = targetResult.parent?.key ?? null;
    const isDraggedMain = draggedParentKey === null || draggedParentKey === undefined;
    const isTargetInSubTree = targetParentKey !== null && targetParentKey !== undefined;
    if (isDraggedMain && isTargetInSubTree) return false;
    if (!isDraggedMain && draggedParentKey !== targetParentKey) return false;
    return true;
};


const eStart = hasTouch ? 'touchstart' : 'mousedown';
const eMove = hasTouch ? 'touchmove' : 'mousemove';
const eEnd = hasTouch ? 'touchend' : 'mouseup';
const eCancel = hasTouch ? 'touchcancel' : 'mouseup';

const options = {
    contentCallback: function (item) { return item.content || '' ? item.content : item.id; },
    listNodeName: 'ul',
    itemNodeName: 'li',
    handleNodeName: 'i',
    contentNodeName: 'span',
    rootClass: 'p-tree-node',
    rootContentClass: 'p-tree-node-content',
    childrenRootClass: 'p-tree-node-children',
    childrenItemClass: 'p-tree-node-leaf',
    dragClass: 'dd-dragel',
    handleClass: 'dd-handle',
    placeClass: 'dd-placeholder',
    noDragClass: 'dd-nodrag',
    noChildrenClass: 'dd-nochildren',
    emptyClass: 'dd-empty',
    group: 0,
    maxDepth: 3,
    threshold: 20,
    fixedDepth: false, //fixed item's depth
    fixed: false,
    includeContent: false,
    callback: function (l, e, p) { },
    onDragStart: function (l, e, p) { },
    listRenderer: function (children, options) {
        var html = '<' + options.listNodeName + ' class="' + options.listClass + '">';
        html += children;
        html += '</' + options.listNodeName + '>';

        return html;
    },
    draggingItemRenderer: function (item_attrs, content, children, options, item) {
        const item_attrs_string = Object.entries(item_attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');

        var html = '<' + options.itemNodeName + item_attrs_string + '>';
        html += '<' + options.handleNodeName + ' class="' + options.handleClass + '">';
        html += '<' + options.contentNodeName + ' class="' + options.contentClass + '">';
        html += content;
        html += '</' + options.contentNodeName + '>';
        html += '</' + options.handleNodeName + '>';
        html += children;
        html += '</' + options.itemNodeName + '>';

        return html;
    },
    placeElement: () => {
        const placeholder = document.createElement('div');
        placeholder.className = 'drag-image';
        placeholder.draggable = true;
        return placeholder;
    },
    placeholderTemplate: `
        <div class="p-tree-node-content" data-pc-section="nodecontent" data-p-selected="false" data-p-selectable="false">
            <button type="button" class="p-tree-node-toggle-button" tabindex="-1" data-p-leaf="true" data-pc-section="nodetogglebutton"></button>
            <span class="p-tree-node-icon" data-pc-section="nodeicon"></span>
            <span class="p-tree-node-label" data-pc-section="nodelabel">
                <div class="tree-node-wrapper" draggable="true">
                    
                </div>
            </span>
        </div>
    `
};

const placeEl = options.placeElement();

const draggingItem = ref(null);
const draggingItemNodeElement = ref(null);

const isDraggingUpLeft = ref(false);
const isDraggingUpRight = ref(false);
const isDraggingDownLeft = ref(false);
const isDraggingDownRight = ref(false);

const isDragging = ref(false);
const isDraggingUp = ref(false);
const isDraggingDown = ref(false);
const isDraggingLeft = ref(false);
const isDraggingRight = ref(false);


const isDraggingOver = ref(false);

const currentNodeElement = ref(null);
const currentItem = ref(null);
const currentItemIndex = ref(null);

const lastItem = ref(null);

const mouse = ref({
    lastX: 0,
    lastY: 0,
    nowX: 0,
    nowY: 0,
    distX: 0,
    distY: 0,
    lastDirX: 0,
    lastDirY: 0,
    dirX: 0,
    dirY: 0
});

const getIndex = (item) => {
    let index = categories.value.findIndex(item => item.id === item.id);
    let parentIndex = null;
    let parent = item.parent;
    if (parent) {
        categories.value.forEach((item, i) => {
            if (item.parent_id === parent.id) {
                parentIndex = i;
            }
        });
    }
    return { parentIndex, index };
}
const dragStart = (event, node) => {
    draggingItem.value = node;

    const liElement = event.currentTarget.closest('li');
    if (!liElement) return;

    draggingItemNodeElement.value = liElement;

    event.dataTransfer.effectAllowed = "move";
};
const dragging = (event) => {
    //STOP if no dragging element
    if (!draggingItemNodeElement.value) return;

    if (!event.pageX || !event.pageY) return;

    mouse.value.lastX = mouse.value.nowX;
    mouse.value.lastY = mouse.value.nowY;
    mouse.value.nowX = event.pageX;
    mouse.value.nowY = event.pageY;

    mouse.value.distX = mouse.value.nowX - mouse.value.lastX;
    mouse.value.distY = mouse.value.nowY - mouse.value.lastY;

    mouse.value.dirX = mouse.value.distX === 0 ? 0 : mouse.value.distX > 0 ? 1 : -1;
    mouse.value.dirY = mouse.value.distY === 0 ? 0 : mouse.value.distY > 0 ? 1 : -1;

    //Protect this line
    const draggingRect = draggingItemNodeElement.value?.getBoundingClientRect();
    if (!draggingRect) return;

    const target = event.target;
    if (!target || !target.getBoundingClientRect) return;

    const targetRect = target.getBoundingClientRect();

    // Persist direction when dirY !== 0, so we don't lose it when mouse momentarily stops
    if (mouse.value.dirY !== 0) {
        isDraggingUp.value = mouse.value.dirY < 0;
        isDraggingDown.value = mouse.value.dirY > 0;
    }
    isDraggingLeft.value = mouse.value.dirX < 0;
    isDraggingRight.value = mouse.value.dirX > 0;
    isDraggingUpLeft.value = isDraggingUp.value && isDraggingLeft.value;
    isDraggingUpRight.value = isDraggingUp.value && isDraggingRight.value;
    isDraggingDownLeft.value = isDraggingDown.value && isDraggingLeft.value;
    isDraggingDownRight.value = isDraggingDown.value && isDraggingRight.value;
};
// const createOrUpdatePlaceholder = (item, nodeElement, clientY) => {
//     if (!item || !nodeElement || !isValidDropTarget(draggingItem.value?.key, item.key)) return;
//     const nodeRect = nodeElement.getBoundingClientRect();
//     const mouseY = clientY ?? (typeof window !== 'undefined' ? mouse.value?.nowY : 0) ?? nodeRect.top;
//     const position = mouseY < nodeRect.top + nodeRect.height / 2 ? 'before' : 'after';

//     const existingPlaceholder = document.querySelector('.dd-placeholder');
//     if (existingPlaceholder) {
//         if (existingPlaceholder.dataset.targetKey === String(item.key) && existingPlaceholder.dataset.position === position) return;
//         existingPlaceholder.remove();
//     }

//     const placeholder = document.createElement('li');
//     placeholder.className = 'p-tree-node p-tree-node-leaf dd-placeholder';
//     placeholder.innerHTML = options.placeholderTemplate;
//     placeholder.addEventListener('dragover', (e) => e.preventDefault());
//     placeholder.dataset.targetKey = item.key;
//     placeholder.dataset.position = position;

//     const wrapper = placeholder.querySelector('.tree-node-wrapper');
//     if (wrapper && draggingItemNodeElement.value) {
//         wrapper.style.height = draggingItemNodeElement.value.clientHeight + 'px';
//     }

//     if (position === 'before') {
//         nodeElement.parentNode.insertBefore(placeholder, nodeElement);
//     } else {
//         nodeElement.parentNode.insertBefore(placeholder, nodeElement.nextSibling);
//     }
// };

const createOrUpdatePlaceholder = (item, nodeElement, position) => {
    if (!item || !nodeElement) return;

    const existingPlaceholder = document.querySelector('.dd-placeholder');


    if (
        existingPlaceholder &&
        existingPlaceholder.dataset.targetKey === String(item.key) &&
        existingPlaceholder.dataset.position === position
    ) {
        return;
    }

    if (existingPlaceholder) {
        existingPlaceholder.remove();
    }

    const placeholder = document.createElement('li');
    placeholder.className = 'p-tree-node p-tree-node-leaf dd-placeholder';
    placeholder.innerHTML = options.placeholderTemplate;

    placeholder.dataset.targetKey = item.key;
    placeholder.dataset.position = position;

    placeholder.addEventListener('dragover', (e) => e.preventDefault());

    const wrapper = placeholder.querySelector('.tree-node-wrapper');
    if (wrapper && draggingItemNodeElement.value) {
        wrapper.style.height = draggingItemNodeElement.value.clientHeight + 'px';
    }

    if (position === 'before') {
        nodeElement.parentNode.insertBefore(placeholder, nodeElement);
    } else {
        nodeElement.parentNode.insertBefore(placeholder, nodeElement.nextSibling);
    }
};

const removePlaceholder = () => {
    const placeholder = document.querySelector('.dd-placeholder');
    if (placeholder) placeholder.remove();
};

const dragEnter = (event, item) => {
    if (!item || !draggingItem.value) return;
    if (draggingItem.value?.key === item.key) return;
    if (!isValidDropTarget(draggingItem.value.key, item.key)) return;
    currentItem.value = item;
    currentNodeElement.value = event.target.closest('.tree-node-wrapper');
    const nodeElement = event.target.closest('li');
    lastItem.value = item;
    mouse.value.lastX = event.pageX;
    mouse.value.lastY = event.pageY;
};

const onDragOver = (event, item) => {
    if (!item || !draggingItem.value) return;
    if (draggingItem.value?.key === item.key) return;
    if (!isValidDropTarget(draggingItem.value.key, item.key)) return;

    const nodeElement = event.target.closest('li');
    if (!nodeElement || nodeElement.classList.contains('dd-placeholder')) return;

    const rect = nodeElement.getBoundingClientRect();
    const offsetY = event.clientY - rect.top;
    const EDGE_SIZE = 15; //px trigger area

    // Dragging DOWN → when cursor touches bottom of target, placeholder after (below)
    if (isDraggingDown.value && rect.height - offsetY < EDGE_SIZE) {
        createOrUpdatePlaceholder(item, nodeElement, 'after');
        return;
    }

    // Dragging UP → when cursor touches top of target, placeholder before (above)
    if (isDraggingUp.value && offsetY < EDGE_SIZE) {
        createOrUpdatePlaceholder(item, nodeElement, 'before');
        return;
    }

    // Fallback when direction unknown (e.g. at drag start): use center split
    if (!isDraggingUp.value && !isDraggingDown.value) {
        const position = offsetY < rect.height / 2 ? 'before' : 'after';
        createOrUpdatePlaceholder(item, nodeElement, position);
    }
};

const dragLeave = (event, item) => {
    if (!item) return;
    const relatedTarget = event.relatedTarget;
    const currentLi = event.target.closest?.('li');
    if (relatedTarget && currentLi?.contains(relatedTarget)) return;
    // Don't remove placeholder when moving into the placeholder (for drop)
    const placeholder = document.querySelector('.dd-placeholder');
    if (placeholder && relatedTarget && placeholder.contains(relatedTarget)) return;
    removePlaceholder();
    lastItem.value = item;
};
const dragEnd = () => {
    document.querySelectorAll('.drag-image').forEach(element => element.remove());
    removePlaceholder();
    draggingItem.value = null;
    draggingItemNodeElement.value = null;
    isDraggingUp.value = false;
    isDraggingDown.value = false;
}
/** Convert tree nodes back to categories format (excludes edit form nodes) */
const treeNodesToCategories = (nodes) => {
    if (!nodes || !Array.isArray(nodes)) return [];
    return nodes
        .filter(node => node && node.data && !node.data.isEditForm)
        .map(node => {
            const data = node.data || {};
            const cat = { ...data };
            // API may use id or category_id - ensure both exist for transformToTreeNodes
            const nodeId = cat.id ?? cat.category_id ?? node.key;
            cat.id = nodeId;
            cat.category_id = cat.category_id ?? nodeId;
            cat.label = cat.label ?? node.label;
            cat.children = (node.children?.length)
                ? treeNodesToCategories(node.children.filter(c => c && !c.data?.isEditForm))
                : [];
            return cat;
        });
};

const drop = async (event) => {
    event.preventDefault();

    const placeholder = document.querySelector('.dd-placeholder');
    if (!placeholder) return;
    if (!draggingItem.value) return;

    const targetKey = placeholder.dataset.targetKey;
    const position = placeholder.dataset.position;

    if (!isValidDropTarget(draggingItem.value.key, targetKey)) {
        removePlaceholder();
        draggingItem.value = null;
        draggingItemNodeElement.value = null;
        return;
    }

    // Remove dragged node from tree
    const draggedNode = findAndRemoveNode(treeNodes.value, draggingItem.value.key);
    if (!draggedNode) return;

    // Find target and parent
    const result = findNodeAndParent(treeNodes.value, targetKey);
    if (!result) return;

    const { parent } = result;
    const siblings = parent ? parent.children : treeNodes.value;
    console.log("siblings", siblings);

    // targetKey from dataset is always string; node.key may be number
    const targetIndex = siblings.findIndex(n => keyMatches(n.key, targetKey));
    if (targetIndex === -1) return;

    if (position === 'before') {
        siblings.splice(targetIndex, 0, draggedNode);
    } else {
        siblings.splice(targetIndex + 1, 0, draggedNode);
    }

    // Build new categories and update store + tree together
    const newCategories = treeNodesToCategories(treeNodes.value);
    isReordering.value = true;
    categoryStore.$patch({ categories: newCategories });
    // Update tree from new categories (ensures transform produces valid nodes)
    treeNodes.value = transformToTreeNodes(newCategories);
    isReordering.value = false;

    placeholder.remove();
    draggingItem.value = null;
    draggingItemNodeElement.value = null;

    // all ordered categories
    const orderedCategories = newCategories.map((category, index) => {
        return {
            taxonomy_item_id: category.id,
            taxonomy_id: 1,
            name: category.label,
            sort_order: index + 1,
        };
    });

    const subCategoriesOrdered = siblings.map((category, index) => {
        return {
            taxonomy_item_id: category.id,
            taxonomy_id: 1,
            name: category.label,
            sort_order: index + 1,
        };
    });

    let response = '';
    // both taxonomy_item_id are same then return
    if (orderedCategories.every(category => subCategoriesOrdered.some(subCategory => subCategory.taxonomy_item_id === category.taxonomy_item_id))) {
        response = await categoryStore.updateCategoryOrder(draggedNode.key, orderedCategories);
    } else {
        response = await categoryStore.updateCategoryOrder(draggedNode.key, subCategoriesOrdered);
    }

    //TODO: Call your API to update the backend
    if (response) {
        toast.add({ severity: 'success', summary: 'Success', detail: 'Category reordered successfully', life: 3000 });
    } else {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to reorder category', life: 5000 });
    }
};

// Add a new method to handle data-key attribute
const nodeTemplate = (node) => {
    return {
        'data-key': node.key,
        'data-parent-key': node.parent?.key || '',
        'data-has-children': node.children?.length > 0 ? 'true' : 'false',
        class: 'tree-node-wrapper',
        draggable: true,
        style: draggingItem.value?.key === node.key ? 'opacity: 0.5;' : ''
    };
};

const uploadCategoryImage = async (event, property) => {
    try {
        let files = event.files;
        const response = await categoryStore.uploadCategoryImage(files, property, formData.value.id);
        formData.value[property] = response;
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

const deleteCategoryImage = async (file, property) => {
    try {
        await categoryStore.deleteCategoryImage(file, property, formData.value.id);
        formData.value[property] = [];
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}
/** ---------------Drag and Drop Feature Ended --------------- */
</script>

<template>
    <div class="category-index">
        <div class="mb-4 flex justify-end">
            <Button icon="pi pi-plus" label="Add Category" severity="primary" @click="addCategory(null, false)" />
        </div>
        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
        </div>

        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Add parent category form -->
        <div v-if="showAddForm" class="mt-8 border-t pt-8">
            <Fluid class="mb-20">
                <h2 class="text-xl font-semibold mb-6">Add New Category</h2>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <!-- LEFT SIDE (First 4 fields) -->
                    <div class="flex flex-col gap-6">

                        <div>
                            <label class="text-lg">Parent Category</label>
                            <Select v-model="formParentKey" :options="parentCategoryOptions" optionLabel="label"
                                optionValue="key" placeholder="Select parent category" class="w-full mt-2" showClear />
                        </div>

                        <div>
                            <label class="text-lg">Title</label>
                            <InputText class="text-lg w-full mt-2" v-model="formData.name" placeholder="Name"
                            @input="makeSlug(formData.name);"
                            />
                        </div>

                        <div>
                            <label class="text-lg">Slug</label>
                            <InputText class="text-lg w-full mt-2" v-model="formData.slug" placeholder="Slug" disabled/>
                        </div>
                        <div>
                            <label class="text-lg">Product Link</label>
                            <InputText class="text-lg w-full mt-2" v-model="formData.products_link" placeholder="Product Link" disabled/>
                        </div>
                        <div>
                            <label class="text-lg">Label</label>
                            <InputText class="text-lg w-full mt-2" v-model="formData.label_name"
                                placeholder="Label" />
                        </div>
                        <div>
                            <label class="text-lg">Content</label>
                            <Textarea class="w-full mt-2" v-model="formData.content" placeholder="Content"
                                :autoResize="true" rows="3" />
                        </div>

                    </div>


                    <!-- RIGHT SIDE (Last 3 fields) -->
                    <div class="flex flex-col gap-6">
                        <div>
                            <label class="text-lg">Sort Order</label>
                            <InputNumber class="text-lg w-full mt-2" v-model="formData.sort_order"
                                placeholder="Sort Order" />
                        </div>
                        
                        <div>
                            <label class="text-lg">Meta Title</label>
                            <InputText class="text-lg w-full mt-2" v-model="formData.meta_title"
                                placeholder="Meta Title" />
                        </div>
                        <div>
                            <label class="text-lg">Meta Description</label>
                            <InputText class="text-lg w-full mt-2" v-model="formData.meta_description"
                                placeholder="Meta Description" />
                        </div>

                        <div>
                            <label class="text-lg">Meta Keywords</label>
                            <InputText class="text-lg w-full mt-2" v-model="formData.meta_keywords"
                                placeholder="Meta Keywords" />
                        </div>

                    </div>

                </div>

                <!-- BUTTONS CENTER -->
                <div class="flex justify-end gap-4 mt-10 w-2/6 mx-auto">
                    <Button label="Cancel" class="bg-gray-500" text @click="cancelAdd" />
                    <Button label="Save Changes" severity="primary" @click="saveCategory" />
                </div>

            </Fluid>
        </div>
        <!-- End add parent category form -->

        <!-- Tree Component - wrapper captures drop when releasing on placeholder -->
        <div class="tree-drop-zone" @dragover.prevent @drop="drop">
            <Tree v-model:expandedKeys="expandedKeys" :value="treeNodes" @node-select="onNodeSelect"
                class="category-tree">
                <template #default="{ node }">
                    <!-- showAddForm and parentNode is same  -->
                    <!-- ADD FORM -->
                    <div v-if="isSubCategory && selectedParentNode?.key === node.key && !node.data.isEditForm"
                        class="edit-form-wrapper p-4 bg-gray-50 rounded-lg mt-8 border-t pt-8">
                        <h2 class="text-xl font-semibold mb-6">Add New Sub Category</h2>
                        <div class="flex flex-col gap-6">
                            <!-- Parent Category -->
                            <div class="grid grid-cols-12 gap-2">
                                <label class="flex items-center col-span-12 md:col-span-2 text-lg">
                                    Parent
                                </label>
                                <div class="col-span-12 md:col-span-10">
                                    <Select v-model="formParentKey" :options="parentCategoryOptions" optionLabel="label"
                                        optionValue="key" placeholder="Select parent category" class="w-full"
                                        showClear />
                                </div>
                            </div>

                            <!-- Title -->
                            <div class="grid grid-cols-12 gap-2">
                                <label class="flex items-center col-span-12 md:col-span-2 text-lg">
                                    Title
                                </label>
                                <div class="col-span-12 md:col-span-10">
                                    <InputText class="text-lg w-full" v-model="formData.name" placeholder="Name"
                                    @input="makeSlug(formData.name);" />
                                </div>
                            </div>

                            <!-- Title -->
                            <div class="grid grid-cols-12 gap-2">
                                <label class="flex items-center col-span-12 md:col-span-2 text-lg">
                                    Label
                                </label>
                                <div class="col-span-12 md:col-span-10">
                                    <InputText class="text-lg w-full" v-model="formData.label_name" placeholder="Label" />
                                </div>
                            </div>

                            <!-- Slug -->
                            <div class="grid grid-cols-12 gap-2">
                                <label class="flex items-center col-span-12 md:col-span-2 text-lg">
                                    Slug
                                </label>
                                <div class="col-span-12 md:col-span-10">
                                    <InputText class="text-lg w-full" v-model="formData.slug" placeholder="Slug" @input="makeSlug(formData.slug)" disabled/>
                                </div>
                            </div>

                            <!-- Content -->
                            <div class="grid grid-cols-12 gap-2">
                                <label class="flex items-center col-span-12 md:col-span-2 text-lg">
                                    Content
                                </label>
                                <div class="col-span-12 md:col-span-10">
                                    <Textarea class="text-md w-full" v-model="formData.content"
                                        placeholder="Content" :autoResize="true" rows="3" />
                                </div>
                            </div>

                            <!-- Meta Title -->
                            <div class="grid grid-cols-12 gap-2">
                                <label class="flex items-center col-span-12 md:col-span-2 text-lg">
                                    Meta Title
                                </label>
                                <div class="col-span-12 md:col-span-10">
                                    <InputText class="text-lg w-full" v-model="formData.meta_title"
                                        placeholder="Meta Title" />
                                </div>
                            </div>

                            <!-- Meta Description -->
                            <div class="grid grid-cols-12 gap-2">
                                <label class="flex items-center col-span-12 md:col-span-2 text-lg">
                                    Meta Description
                                </label>
                                <div class="col-span-12 md:col-span-10">
                                    <InputText class="text-lg w-full" v-model="formData.meta_description"
                                        placeholder="Meta Description" />
                                </div>
                            </div>

                            <!-- Meta Keywords -->
                            <div class="grid grid-cols-12 gap-2">
                                <label class="flex items-center col-span-12 md:col-span-2 text-lg">
                                    Meta Keywords
                                </label>
                                <div class="col-span-12 md:col-span-10">
                                    <InputText class="text-lg w-full" v-model="formData.meta_keywords"
                                        placeholder="Meta Keywords" />
                                </div>
                            </div>

                        </div>

                        <!-- Buttons -->
                        <div class="flex justify-end gap-2 mt-6">
                            <Button label="Cancel" severity="secondary" text @click="cancelAdd" />
                            <Button label="Save Changes" severity="primary" @click="saveCategory" />
                        </div>

                    </div>
                    <!-- EDIT FORM -->
                    <div v-else-if="node.data.isEditForm && !isSubCategory"
                        class="edit-form-wrapper p-4 bg-gray-50 rounded-lg">
                        <h2 class="text-xl font-semibold mb-6">Edit Category</h2>
                        <div class="flex flex-col gap-6">
                            <div class="grid grid-cols-12 gap-2">
                                <label for="title"
                                    class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Title</label>
                                <div class="col-span-12 md:col-span-10">
                                    <InputText class="text-lg w-full" id="name" type="text" v-model="formData.name"
                                        placeholder="Name" @input="makeSlug(formData.name);" />
                                </div>
                            </div>


                            <div class="grid grid-cols-12 gap-2">
                                <label for="label_name"
                                    class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Label</label>
                                <div class="col-span-12 md:col-span-10">
                                    <InputText class="text-lg w-full" id="label_name" type="text" v-model="formData.label_name"
                                        placeholder="Label" />
                                </div>
                            </div>

                            <div class="grid grid-cols-12 gap-2">
                                <label for="slug"
                                    class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Slug</label>
                                <div class="col-span-12 md:col-span-10">
                                    <InputText class="text-lg w-full" id="slug" type="text" v-model="formData.slug"
                                        placeholder="Name" @input="makeSlug(formData.slug)" disabled/>
                                </div>
                            </div>

                            <!-- <div class="grid grid-cols-12 gap-2">
                                <label for="link"
                                    class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Link</label>
                                <div class="col-span-12 md:col-span-10">
                                    <InputText class="text-lg w-full" id="link" type="text" v-model="formData.link"
                                        placeholder="Link" disabled/>
                                </div>
                            </div> -->
                            <div class="grid grid-cols-12 gap-2">
                                <label for="products_link"
                                    class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Products link</label>
                                <div class="col-span-12 md:col-span-10">
                                    <InputText class="text-lg w-full" id="products_link" type="text" v-model="formData.products_link"
                                        placeholder="products_link" disabled/>
                                </div>
                            </div>


                            <div class="grid grid-cols-12 gap-2">
                                <label for="content"
                                    class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Content</label>
                                <div class="col-span-12 md:col-span-10">
                                    <Textarea class="text-md w-full" v-model="formData.content"
                                        placeholder="Content" :autoResize="true" rows="3" cols="30" />
                                </div>
                            </div>

                            <div class="grid grid-cols-12 gap-2">
                                <label for="meta_title"
                                    class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Meta
                                    Title</label>
                                <div class="col-span-12 md:col-span-10">
                                    <InputText class="text-lg w-full" id="meta_title" type="text"
                                        v-model="formData.meta_title" placeholder="Name" />
                                </div>
                            </div>
                            <div class="grid grid-cols-12 gap-2">
                                <label for="meta_description"
                                    class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Meta
                                    Description</label>
                                <div class="col-span-12 md:col-span-10">
                                    <InputText class="text-lg w-full" id="meta_description" type="text"
                                        v-model="formData.meta_description" placeholder="Name" />
                                </div>
                            </div>
                            <div class="grid grid-cols-12 gap-2">
                                <label for="meta_keywords"
                                    class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Meta
                                    Keywords</label>
                                <div class="col-span-12 md:col-span-10">
                                    <InputText class="text-lg w-full" id="meta_keywords" type="text"
                                        v-model="formData.meta_keywords" placeholder="Name" />
                                </div>
                            </div>

                            <div class="grid grid-cols-12 gap-2">
                                <label for="meta_keywords"
                                    class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Sort Order</label>
                                <div class="col-span-12 md:col-span-10">
                                    <InputNumber class="text-lg w-full" id="sort_order" type="number"
                                        v-model="formData.sort_order" placeholder="Sort Order" />
                                </div>
                            </div>

                            <div class="grid grid-cols-12">
                                <label
                                    class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Image</label>
                                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                                    <div class="flex gap-5">
                                        <UploadFileFeature v-model:uploadedFilesData="formData.image" :fb="fb"
                                            :property="'image'" @upload="uploadCategoryImage($event, 'image')"
                                            @removeUploadedFile="deleteCategoryImage($event, 'image')" />
                                        <div class="way-points-button">
                                            <Button v-if="formData.image && formData.image.length > 0"
                                                label="Setup Way-Points" @click="visible = true" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-12">
                                <label
                                    class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Slider Image</label>
                                <div class="col-span-12 md:col-span-8 lg:col-span-10">
                                    <div class="flex gap-5">
                                        <UploadFileFeature v-model:uploadedFilesData="formData.slider_image" :fb="fb"
                                            :property="'slider_image'" @upload="uploadCategoryImage($event, 'slider_image')"
                                            @removeUploadedFile="deleteCategoryImage($event, 'slider_image')" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end gap-2 mt-4">
                            <Button label="Cancel" severity="secondary" text @click="cancelAdd(formData.id)" />
                            <Button label="Save Changes" severity="primary" @click="saveCategory" />
                        </div>
                    </div>
                    <!-- DEFAULT NODE -->
                    <div v-else v-bind="nodeTemplate(node)" @dragstart="dragStart($event, node)"
                        @drag="dragging($event)" @dragenter="dragEnter($event, node)"
                        @dragover="onDragOver($event, node); $event.preventDefault()"
                        @dragleave="dragLeave($event, node)" @dragend="dragEnd">
                        <div class="flex items-center">
                            <i class="pi pi-bars handle cursor-move"></i>
                            <Checkbox v-model="selectedKeys[node.key]" :binary="true" />
                            <i class="pi pi-link" style="margin: 0 8px; color: #000;"></i>
                            <span class="node-content">{{ node.label }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <Button v-if="node.children?.length" icon="pi pi-plus" text size="small"
                                @click="addCategory(node, true)" class="p-button-secondary" />
                            <Button icon="pi pi-pencil" text size="small" @click="editCategory(node)"
                                class="p-button-secondary" />
                        </div>
                    </div>
                </template>
            </Tree>
        </div>


        <Dialog v-model:visible="visible" modal header="Setup Way-Points" maximizable :maximized="true"
            :style="{ width: '100vw', maxHeight: '100%', height: '100%' }">

            <div class="body-container">

                <WayPoint :wayPointSuggestions="wayPointSuggestions" :imageSrc="resolveMediaImage(formData.image)"
                    :wayPoints="bannerWayPointsData" :modelId="formData.id" :fb="fb" @update:wayPoints="updateWayPoints"
                    @search:way-points-suggestions="searchWayPointSuggestions" />

            </div>
        </Dialog>


    </div>
</template>


<style scoped>
.dd-placeholder {
    opacity: 0.6;
    transition: all 0.15s ease;
}

.p-tree-node {
    transition: transform 0.15s ease;
}

.way-points-button {
    display: flex;
    align-items: flex-end;
}

.node-content {
    color: #000;
}

:deep(.p-tree) {
    border: none;
    padding: 0;
}

/* :deep(.p-tree-node) {
    margin-bottom: 8px;
} */

:deep(.p-tree-node-content) {
    border: none !important;
    padding: 0 !important;
    background: transparent !important;
}

:deep(.p-tree-node-label) {
    width: 100%;
}

:deep(.p-tree-toggler) {
    width: 2rem;
    height: 2rem;
    margin-right: 0.5rem;
}

:deep(.p-checkbox) {
    width: 18px;
    height: 18px;
}

:deep(.p-button.p-button-icon-only) {
    width: 2rem;
    height: 2rem;
    padding: 0.5rem;
    border: 1px solid #dee2e6;
    background-color: #fff;
    color: #000;
    transition: all 0.2s;

    &:hover {
        background-color: #f8f9fa;
        border-color: #c8cccf;
        color: #495057;
    }

    &:focus {
        box-shadow: none;
    }

    .p-button-icon {
        font-size: 14px;
    }
}

:deep(.p-treenode-children) {
    padding-left: 2rem;
}

:deep(.p-tree-node-toggle-button) {
    margin-right: 0.5rem;
}

label {
    font-size: 1.2rem;
}

:deep(input::placeholder),
:deep(textarea::placeholder) {
    color: #767779 !important;
    opacity: 1;
    font-size: 1.2rem;
}

.edit-form-wrapper {
    margin-left: 2rem;
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
}

:deep(.p-treenode-children) {
    padding-left: 1rem;
}

:deep(.dragging) {
    opacity: 0.5;
}

:deep(.drag-over-top) {
    border-top: 2px solid #2196F3;
}

:deep(.drag-over-bottom) {
    border-bottom: 2px solid #2196F3;
}

:deep(.handle) {
    cursor: move;
    margin-right: 8px;
}


:deep(.dd-placeholder .tree-node-wrapper) {
    background-color: rgba(33, 150, 243, 0.1);
    border: 1px dashed #2196F3;
    transition: all 0.2s ease;
}

.tree-drop-zone {
    min-height: 200px;
}

.way-points-button > button {
    margin-left: -447px !important;
    margin-bottom: 14px;
    font-size: 0.85rem;
    padding: 2px 9px;
    border-radius: 8px;
    font-weight: 500;
}
</style>
