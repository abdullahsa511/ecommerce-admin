<script setup>
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
const editingNode = ref(null);
const formData = ref({
    id: null,
    name: '',
    slug: '',
    content: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    description: '',
    status: { name: 'Enabled', code: 'E' },
    banner_image: null,
    banner_way_points: []
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
            meta_description: category.meta_description,
            meta_keywords: category.meta_keywords,
            banner_image: category.image,
            banner_way_points: category.banner_way_points,
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
                meta_description: '',
                meta_keywords: '',
                banner_image: null,
                banner_way_points: [],
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

// Watch for changes in categories
watch(categories, () => {
    updateTreeNodes();
}, { deep: true });

const onNodeSelect = (node) => {

};

const addCategory = (parentNode = null) => {
    showAddForm.value = true;
    editingNode.value = null;
    formData.value = {
        name: '',
        slug: '',
        description: '',
        status: statusOptions.value[0]
    };
};

const cancelAdd = (id) => {
    const cancelNodeId = id ?? null;
    showAddForm.value = false;
    editingNode.value = null;
    formData.value = {
        name: '',
        slug: '',
        description: '',
        status: statusOptions.value[0]
    };
    updateTreeNodes({ collapseNodeId: cancelNodeId });
};

const saveCategory = () => {
    // TODO: Implement save logic here
    console.log('Save category:', formData.value);
    const wasEditingNodeId = editingNode.value?.key ?? null;
    showAddForm.value = false;
    editingNode.value = null;
    formData.value = {
        name: '',
        slug: '',
        content: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        description: '',
        status: statusOptions.value[0],
        banner_image: null,
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
        content: node.data.content,
        meta_title: node.data.meta_title,
        meta_description: node.data.meta_description,
        meta_keywords: node.data.meta_keywords,
        description: node.data.description,
        status: statusOptions.value.find(opt => opt.code === node.data.status) || statusOptions.value[0],
        banner_image: node.data.image,
        banner_way_points: node.data.banner_way_points
    };

    updateTreeNodes();
};

const deleteCategory = (node) => {
    console.log('Delete category:', node);
};

/** ---------------Drag and Drop Feature Started --------------- */
const hasTouch = 'ontouchstart' in window;
const hasPointerEvents = () => {
    let el = document.createElement('div'),
        docEl = document.documentElement;
    if(!('pointerEvents' in el.style)) {
        return false;
    }
    el.style.pointerEvents = 'auto';
    el.style.pointerEvents = 'x';
    docEl.appendChild(el);
    var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
    docEl.removeChild(el);
    return !!supports;
};
const eStart = hasTouch ? 'touchstart' : 'mousedown';
const eMove = hasTouch ? 'touchmove' : 'mousemove';
const eEnd = hasTouch ? 'touchend' : 'mouseup';
const eCancel = hasTouch ? 'touchcancel' : 'mouseup';

const options = {
    contentCallback: function(item) {return item.content || '' ? item.content : item.id;},
    listNodeName: 'ul',
    itemNodeName: 'li',
    handleNodeName: 'i',
    contentNodeName: 'span',
    rootClass: 'p-tree-node',
    rootContentClass: 'p-tree-node-content',
    childrenRootClass:'p-tree-node-children',
    childrenItemClass:'p-tree-node-leaf',
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
    callback: function(l, e, p) {},
    onDragStart: function(l, e, p) {},
    listRenderer: function(children, options) {
        var html = '<' + options.listNodeName + ' class="' + options.listClass + '">';
        html += children;
        html += '</' + options.listNodeName + '>';

        return html;
    },
    draggingItemRenderer: function(item_attrs, content, children, options, item) {
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
    if(parent){
        categories.value.forEach((item, i) => {
            if(item.parent_id === parent.id) {
                parentIndex = i;
            }
        });
    }
    return {parentIndex, index};
}
const dragStart = (event, item) => {

    //Get parrent li 
    //Put the parrent li in the placeEl
    //Set the height and width of the placeEl to the parrent li
    //Append the parrent li to the placeEl
    //Append the placeEl to the body
    //Set the z-index of the placeEl to 1000
    //Set the position of the placeEl to absolute
    //Set the left and top of the placeEl to the mouse position
    //Set the offsetX and offsetY of the mouse to the mouse position
    //Set the lastX and lastY of the mouse to the mouse position
    //Finally make sure original draggingItemNodeElement is removed from the DOM
    draggingItemNodeElement.value = event.target.closest('li');
    // placeEl.style.height = draggingItemNodeElement.value.clientHeight + 'px';
    // placeEl.style.width = draggingItemNodeElement.value.clientWidth + 'px';
    // placeEl.appendChild(draggingItemNodeElement.value.cloneNode(true));

    // document.body.appendChild(placeEl);
    // placeEl.style.zIndex = '1000';
    // placeEl.style.position = 'absolute';
    // placeEl.querySelectorAll('.p-tree-node-label').forEach(label => {
    //     label.style.width = '100%';
    // });

    // // Set the initial position of the drag element
    // placeEl.style.left = event.pageX - mouse.value.offsetX + 'px';
    // placeEl.style.top = event.pageY - mouse.value.offsetY + 'px';

    mouse.value.offsetX = event.pageX - draggingItemNodeElement.value.getBoundingClientRect().left;
    mouse.value.offsetY = event.pageY - draggingItemNodeElement.value.getBoundingClientRect().top;


    mouse.value.offsetY = event.pageY - placeEl.offsetTop;

    draggingItem.value = item;
    draggingItemNodeElement.value = event.target.closest('.tree-node-wrapper');
    
    // Initialize mouse position
    mouse.value.nowX = event.pageX;
    mouse.value.nowY = event.pageY;
    mouse.value.lastX = event.pageX;
    mouse.value.lastY = event.pageY;
    mouse.value.distX = 0;
    mouse.value.distY = 0;
    mouse.value.lastDirX = 0;
    mouse.value.lastDirY = 0;
    mouse.value.dirX = 0;
    mouse.value.dirY = 0;
}
const dragging = (event, action, item) => {
    // Update mouse position
    mouse.value.lastX = mouse.value.nowX;
    mouse.value.lastY = mouse.value.nowY;
    mouse.value.nowX = event.pageX;
    mouse.value.nowY = event.pageY;
    mouse.value.distX = mouse.value.nowX - mouse.value.lastX;
    mouse.value.distY = mouse.value.nowY - mouse.value.lastY;
    mouse.value.lastDirX = mouse.value.dirX;
    mouse.value.lastDirY = mouse.value.dirY;
    mouse.value.dirX = mouse.value.distX === 0 ? 0 : mouse.value.distX > 0 ? 1 : -1;
    mouse.value.dirY = mouse.value.distY === 0 ? 0 : mouse.value.distY > 0 ? 1 : -1;

    // Get the dragging item's node element position
    const draggingRect = draggingItemNodeElement.value.getBoundingClientRect();
    const targetRect = event.target.getBoundingClientRect();

    // // Compare the horizontal position of the dragging item to the current node
    // const isInLeftHalf = draggingRect.left > event.clientX;
    // const isInRightHalf = !isInLeftHalf;
    
    // Calculate position based on mouse movement
    const isInTopHalf = mouse.value.dirY < 0;
    const isInBottomHalf = mouse.value.dirY > 0;
    const isInLeftHalf = mouse.value.dirX < 0;
    const isInRightHalf = mouse.value.dirX > 0;

    isDraggingUp.value = isInTopHalf;
    isDraggingDown.value = isInBottomHalf;
    isDraggingLeft.value = isInLeftHalf;
    isDraggingRight.value = isInRightHalf;

    isDraggingUpLeft.value = isDraggingUp.value && isDraggingLeft.value;
    isDraggingUpRight.value = isDraggingUp.value && isDraggingRight.value;
    isDraggingDownLeft.value = isDraggingDown.value && isDraggingLeft.value;
    isDraggingDownRight.value = isDraggingDown.value && isDraggingRight.value;

    console.log("Is dragging up: ", isDraggingUp.value);
    console.log("Is dragging down: ", isDraggingDown.value);
    console.log("Is dragging left: ", isDraggingLeft.value);
    console.log("Is dragging right: ", isDraggingRight.value);
}
const dragEnter = (event, action, item) => {
    if(draggingItem.value?.key  !== item.key){
        currentItem.value = item;
        currentItemIndex.value = getIndex(item);
        currentNodeElement.value = event.target.closest('.tree-node-wrapper');
    }
  if(currentItem.value?.key !== lastItem.value?.key) {
    mouse.value.lastX = event.pageX;
    mouse.value.lastY = event.pageY;
  }
}
const dragLeave = (event, action, item) => {
    // Check if we're not dragging over the same item we're dragging
   lastItem.value = item;
    
    if(draggingItem.value?.key !== item.key) {
        // Get the current node element that we're dragging over
        const nodeElement = event.target.closest('li');
        if (!nodeElement) return;  // Exit if no valid node found

        // Get the dimensions of the node we're dragging over
        const nodeRect = nodeElement.getBoundingClientRect();
        const mouseY = event.clientY;  // Current mouse Y position

        // Create placeholder element
        const placeholder = document.createElement('li');
        placeholder.className = 'p-tree-node p-tree-node-leaf dd-placeholder';
        placeholder.innerHTML = options.placeholderTemplate;

        // Remove any existing placeholder to avoid duplicates
        const existingPlaceholder = document.querySelector('.dd-placeholder');
        if (existingPlaceholder) {
            existingPlaceholder.remove();
        }
        
        // Store important data in the placeholder for use during drop
        placeholder.dataset.targetKey = item.key;  // Store the target node's key
        // Store whether we should place item before or after the target
        placeholder.dataset.position = (isDraggingUpLeft.value || isDraggingUpRight.value) ? 'before' : 'after';
        placeholder.querySelector('.tree-node-wrapper').style.height = draggingItemNodeElement.value.clientHeight + 'px';

        // Insert the placeholder in the correct position
        if  (isDraggingUpLeft.value || isDraggingUpRight.value) {
            // If dragging from top, insert placeholder before the current node
            nodeElement.parentNode.insertBefore(placeholder, nodeElement);
        } else {
            // If dragging from bottom, insert placeholder after the current node
            nodeElement.parentNode.insertBefore(placeholder, nodeElement.nextSibling);
        }
    }
}
const dragEnd = (event, action, node) => {
    document.querySelectorAll('.drag-image').forEach(element => {
        element.remove();
    });
    // console.log(action, event, node);
    // Remove the placeholder
    // const placeholder = document.querySelector('.dd-placeholder');
    // if (placeholder) {
    //     placeholder.remove();
    // }
    
    // // Reset dragging state
    // draggingItem.value = null;
}
const drop = (event, action) => {
    // event.preventDefault();
    document.querySelectorAll('.drag-image').forEach(element => {
        element.remove();
    });
    
    // // Get the placeholder and its stored information
    // const placeholder = document.querySelector('.dd-placeholder');
    // if (!placeholder || !draggingItem.value) return;

    // // Get the target key and position from the placeholder
    // const targetKey = placeholder.dataset.targetKey;
    // const position = placeholder.dataset.position;
    
    // // Find the source and target nodes in the tree
    // const findNodeAndParent = (nodes, key, parent = null, index = null) => {
    //     for (let i = 0; i < nodes.length; i++) {
    //         if (nodes[i].key === key) {
    //             return { node: nodes[i], parent, index: i };
    //         }
    //         if (nodes[i].children) {
    //             const result = findNodeAndParent(nodes[i].children, key, nodes[i], i);
    //             if (result) return result;
    //         }
    //     }
    //     return null;
    // };

    // // Get source and target information
    // const sourceInfo = findNodeAndParent(categories.value, draggingItem.value.key);
    // const targetInfo = findNodeAndParent(categories.value, parseInt(targetKey));

    // if (!sourceInfo || !targetInfo) {
    //     placeholder.remove();
    //     draggingItem.value = null;
    //     return;
    // }

    // // Get the arrays containing source and target
    // const sourceParent = sourceInfo.parent || { children: categories.value };
    // const targetParent = targetInfo.parent || { children: categories.value };

    // // Remove the node from its current position
    // const [movedNode] = sourceParent.children.splice(sourceInfo.index, 1);

    // // Calculate the target index
    // let targetIndex = targetParent.children.indexOf(targetInfo.node);
    // if (position === 'after') {
    //     targetIndex++;
    // }
    
    // // If moving within the same parent and moving forward, adjust the index
    // if (sourceParent === targetParent && sourceInfo.index < targetIndex) {
    //     targetIndex--;
    // }

    // // Insert at the new position
    // targetParent.children.splice(targetIndex, 0, movedNode);

    // // Update the tree
    // updateTreeNodes();

    // // Clean up
    // placeholder.remove();
    // draggingItem.value = null;

    // // TODO: Call your API to update the backend
    // // categoryStore.updateCategoryOrder({
    // //     categoryId: movedNode.key,
    // //     newParentId: targetParent.key || null,
    // //     position: targetIndex
    // // });
}

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

const uploadBannerImage = (event, property) => {
    // try {
    //     const response: any = await postStore.uploadFiles(event.files, property, post.value.post_id);
    //     console.log(response);
    // } catch (error) {
    //     console.error('Error uploading site logo:', error);
    // }
}
const deleteBannerImage = (event, property) => {
    // try {
    //     await postStore.deletePostImageByProperty(post.value.post_id, property);
    //     // post.value.image = new FileModel({});
    //     post.value.image = [];
    //     toast.add({
    //         severity: 'success',
    //         summary: 'Success',
    //         detail: 'Image deleted successfully',
    //         life: 3000
    //     });
    // } catch (error) {
    //     console.error('Error deleting site logo:', error);
    // }
}
/** ---------------Drag and Drop Feature Ended --------------- */


</script>

<template>
    <div class="category-index">
        <div class="mb-4 flex justify-end">
            <Button 
                icon="pi pi-plus" 
                label="Add Category" 
                severity="primary" 
                @click="addCategory"
            />
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

        <!-- Tree Component -->
        <Tree
            v-model:expandedKeys="expandedKeys"
            :value="treeNodes"
            @node-select="onNodeSelect"
            class="category-tree"
        >
            <template #default="{ node }">
                <div v-if="node.data.isEditForm" class="edit-form-wrapper p-4 bg-gray-50 rounded-lg">
                    <h2 class="text-xl font-semibold mb-6">Edit Category</h2>
                    <div class="flex flex-col gap-6">
                        <div class="grid grid-cols-12 gap-2">
                            <label for="title" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Title</label>
                            <div class="col-span-12 md:col-span-10">
                                <InputText class="text-lg w-full" id="name" type="text" v-model="formData.name" placeholder="Name" />
                            </div>
                        </div>

                        <div class="grid grid-cols-12 gap-2">
                            <label for="slug" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Slug</label>
                            <div class="col-span-12 md:col-span-10">
                                <InputText class="text-lg w-full" id="slug" type="text" v-model="formData.slug" placeholder="Name" />
                            </div>
                        </div>

                        <div class="grid grid-cols-12 gap-2">
                            <label for="content" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Content</label>
                            <div class="col-span-12 md:col-span-10">
                                <Textarea class="text-md w-full" v-model="formData.description" placeholder="Content" :autoResize="true" rows="3" cols="30" />
                            </div>
                        </div>

                        <div class="grid grid-cols-12 gap-2">
                            <label for="meta_title" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Meta Title</label>
                            <div class="col-span-12 md:col-span-10">
                                <InputText class="text-lg w-full" id="meta_title" type="text" v-model="formData.meta_title" placeholder="Name" />
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label for="meta_description" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Meta Description</label>
                            <div class="col-span-12 md:col-span-10">
                                <InputText class="text-lg w-full" id="meta_description" type="text" v-model="formData.meta_description" placeholder="Name" />
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label for="meta_keywords" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Meta Keywords</label>
                            <div class="col-span-12 md:col-span-10">
                                <InputText class="text-lg w-full" id="meta_keywords" type="text" v-model="formData.meta_keywords" placeholder="Name" />
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-12">
                            <label class="flex items-center col-span-12 mb-2 md:col-span-4 lg:col-span-2 md:mb-0 text-lg">Image</label>
                            <div class="col-span-12 md:col-span-8 lg:col-span-10">
                                <div class="flex gap-4">  
                                    <UploadFile 
                                    v-model:uploadedFilesData="formData.banner_image"
                                    :fb="fb"
                                    @upload="uploadBannerImage($event, 'banner_image')"
                                    @removeUploadedFile="deleteBannerImage($event, 'image')"
                                    />
                                    <div class="way-points-button">
                                        <Button v-if="formData.banner_image && formData.banner_image.length > 0" label="Setup Way-Points" @click="visible = true" />
                                    </div>
                                    <!-- <h1>{{ formData.id }}</h1> -->
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="flex justify-end gap-2 mt-4">
                        <Button 
                            label="Cancel" 
                            severity="secondary" 
                            text 
                            @click="cancelAdd(formData.id)"
                        />
                        <Button 
                            label="Save Changes" 
                            severity="primary" 
                            @click="saveCategory"
                        />
                    </div>
                </div>
                <div v-else v-bind="nodeTemplate(node)"
                    @dragstart="dragStart($event, node)"
                    @drag="dragging($event)"
                    @dragenter="dragEnter($event, 'dragEnter', node)"
                    @dragleave="dragLeave($event, 'dragLeave', node)"
                    @drop="drop($event, 'drop')"
                    @dragend="dragEnd($event, 'dragEnd', node)"
                >
                    <div class="flex items-center">
                        <i class="pi pi-bars handle cursor-move"></i>
                        <Checkbox v-model="selectedKeys[node.key]" :binary="true" />
                        <i class="pi pi-link" style="margin: 0 8px; color: #000;"></i>
                        <span class="node-content">{{ node.label }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Button
                            icon="pi pi-plus"
                            text
                            size="small"
                            @click="addCategory(node)"
                            class="p-button-secondary"
                        />
                        <Button
                            icon="pi pi-pencil"
                            text
                            size="small"
                            @click="editCategory(node)"
                            class="p-button-secondary"
                        />
                    </div>
                </div>
            </template>
        </Tree>

        <!-- Add Category Form -->
        <div v-if="showAddForm" class="mt-8 border-t pt-8">
            <Fluid class="flex flex-col md:flex-row gap-8 mb-20">
                <div class="w-full">
                    <h2 class="text-xl font-semibold mb-6">Add New Category</h2>
                    <div class="flex flex-col gap-6">
                        <div class="grid grid-cols-12 gap-2">
                            <label for="title" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Title</label>
                            <div class="col-span-12 md:col-span-10">
                                <InputText class="text-lg w-full" id="name" type="text" v-model="formData.name" placeholder="Name" />
                            </div>
                        </div>

                        <div class="grid grid-cols-12 gap-2">
                            <label for="slug" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Slug</label>
                            <div class="col-span-12 md:col-span-10">
                                <InputText class="text-lg w-full" id="slug" type="text" v-model="formData.slug" placeholder="Name" />
                            </div>
                        </div>

                        <div class="grid grid-cols-12 gap-2">
                            <label for="content" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Content</label>
                            <div class="col-span-12 md:col-span-10">
                                <Textarea class="text-md w-full" v-model="formData.description" placeholder="Content" :autoResize="true" rows="3" cols="30" />
                            </div>
                        </div>

                        <div class="grid grid-cols-12 gap-2">
                            <label for="meta_title" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Meta Title</label>
                            <div class="col-span-12 md:col-span-10">
                                <InputText class="text-lg w-full" id="meta_title" type="text" v-model="formData.meta_title" placeholder="Name" />
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label for="meta_description" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Meta Description</label>
                            <div class="col-span-12 md:col-span-10">
                                <InputText class="text-lg w-full" id="meta_description" type="text" v-model="formData.meta_description" placeholder="Name" />
                            </div>
                        </div>
                        <div class="grid grid-cols-12 gap-2">
                            <label for="meta_keywords" class="flex items-center col-span-12 mb-2 md:col-span-2 md:mb-0 text-lg">Meta Keywords</label>
                            <div class="col-span-12 md:col-span-10">
                                <InputText class="text-lg w-full" id="meta_keywords" type="text" v-model="formData.meta_keywords" placeholder="Name" />
                            </div>
                        </div>
                    </div>
                </div>
            </Fluid>

            <div class="flex justify-end gap-2 mt-4">
                <Button 
                    label="Cancel" 
                    severity="secondary" 
                    text 
                    @click="cancelAdd"
                />
                <Button 
                    label="Save Changes" 
                    severity="primary" 
                    @click="saveCategory"
                />
            </div>
        </div>



        <Dialog v-model:visible="visible" modal header="Setup Way-Points" maximizable :maximized="true"
        :style="{ width: '100vw', maxHeight: '100%', height: '100%' }">

        <div class="body-container">

                <WayPoint 
                :wayPointSuggestions="wayPointSuggestions"
                :imageSrc="formData.banner_image[0].objectURL"
                :wayPoints="bannerWayPointsData"
                :modelId="formData.id"
                :fb="fb"
                @update:wayPoints="updateWayPoints"
                @search:way-points-suggestions="searchWayPointSuggestions"     
                />

        </div>
    </Dialog>


    </div>
</template>


<style scoped>
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

:deep(.p-tree-node) {
    margin-bottom: 8px;
}

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

</style>
