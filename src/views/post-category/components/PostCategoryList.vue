<script setup>
    import { ref, onMounted, watch } from 'vue';
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
    
    const router = useRouter();
    const toast = useToast();
    
    const categoryStore = useCategoryStore();
    const { categories, loading, error } = storeToRefs(categoryStore);
    const selectedKeys = ref({});
    const expandedKeys = ref({});
    const showAddForm = ref(false);
    const editingNode = ref(null);
    const formData = ref({
        id: null,
        name: '',
        slug: '',
        description: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        status: { name: 'Enabled', code: 'E' }
    });

    const getCategoryId = (category) => category?.category_id ?? category?.id;

    const sameCategoryId = (a, b) => String(a ?? '') === String(b ?? '');

    const getCategoryDisplayLabel = (category) =>
        category?.name || category?.label_name || category?.label || '';

    const patchCategoryInTree = (items, categoryId, updates) => {
        for (const category of items) {
            if (sameCategoryId(getCategoryId(category), categoryId)) {
                Object.assign(category, updates);
                return true;
            }
            if (category.children?.length && patchCategoryInTree(category.children, categoryId, updates)) {
                return true;
            }
        }
        return false;
    };

    const treeRefreshKey = ref(0);

    const statusOptions = ref([
        { name: 'Enabled', code: 'E' },
        { name: 'Disabled', code: 'D' }
    ]);

    const getEmptyFormData = () => ({
        id: null,
        name: '',
        slug: '',
        description: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        status: statusOptions.value[0]
    });
    
    onMounted(() => {
        categoryStore.fetchProductCategories();
    });
    
    const transformToTreeNodes = (categories) => {
        return categories.map(category => {
            // Set expanded key for this node
            expandedKeys.value[getCategoryId(category)] = true;
            
            const node = {
                key: getCategoryId(category),
                label: getCategoryDisplayLabel(category),
                data: category,
                children: category.children ? transformToTreeNodes(category.children) : [],
                selectable: true,
                draggable: true,
                droppable: true
            };
    
            // If this is the node being edited, add the edit form as a child
            if (editingNode.value && editingNode.value.key === getCategoryId(category)) {
                node.children = [{
                    key: 'edit-form-' + getCategoryId(category),
                    label: 'Edit Form',
                    data: { isEditForm: true },
                    selectable: false,
                    draggable: false,
                    droppable: false
                }];
                expandedKeys.value[getCategoryId(category)] = true;
            }
    
            return node;
        });
    };
    
    const treeNodes = ref([]);
    
    const updateTreeNodes = (options = {}) => {
        const { collapseNodeId } = options;
        let newExpandedKeys;

        if (editingNode.value) {
            newExpandedKeys = { [editingNode.value.key]: true };
        } else {
            newExpandedKeys = { ...expandedKeys.value };
            if (collapseNodeId != null) {
                delete newExpandedKeys[collapseNodeId];
            }
        }

        expandedKeys.value = newExpandedKeys;
        treeNodes.value = transformToTreeNodes(categories.value);
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
        formData.value = getEmptyFormData();
    };
    
    const cancelAdd = () => {
        const cancelNodeId = editingNode.value?.key ?? null;
        showAddForm.value = false;
        editingNode.value = null;
        formData.value = getEmptyFormData();
        updateTreeNodes({ collapseNodeId: cancelNodeId });
    };
    
    const saveCategory = async () => {
        const wasEditingNodeId = editingNode.value?.key ?? null;
        const isEditMode = !!editingNode.value;
        const categoryId = formData.value.id ?? wasEditingNodeId;
        const parentId = editingNode.value?.data?.parent_id ?? null;
        const savedValues = { ...formData.value };

        try {
            if (isEditMode) {
                const payload = {
                    category_id: categoryId,
                    id: categoryId,
                    name: savedValues.name,
                    slug: savedValues.slug,
                    label: savedValues.name,
                    label_name: savedValues.name,
                    parent_id: parentId,
                    description: savedValues.description,
                    meta_title: savedValues.meta_title,
                    meta_description: savedValues.meta_description,
                    meta_keywords: savedValues.meta_keywords,
                    status: 1
                };
                const response = await categoryStore.updateCategory(payload);
                if (!response) {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to update category', life: 5000 });
                    return;
                }

                const displayName = savedValues.name;
                const localUpdates = {
                    name: displayName,
                    label: displayName,
                    label_name: displayName,
                    slug: savedValues.slug,
                    description: savedValues.description,
                    meta_title: savedValues.meta_title,
                    meta_description: savedValues.meta_description,
                    meta_keywords: savedValues.meta_keywords
                };
                patchCategoryInTree(categories.value, categoryId, localUpdates);
                await categoryStore.fetchProductCategories();

                showAddForm.value = false;
                editingNode.value = null;
                formData.value = getEmptyFormData();
                treeRefreshKey.value += 1;
                updateTreeNodes({ collapseNodeId: wasEditingNodeId });
                toast.add({ severity: 'success', summary: 'Success', detail: 'Category updated successfully', life: 3000 });
                return;
            } else {
                const payload = {
                    name: savedValues.name,
                    slug: savedValues.slug,
                    label: savedValues.name,
                    label_name: savedValues.name,
                    parent_id: parentId,
                    description: savedValues.description,
                    meta_title: savedValues.meta_title,
                    meta_description: savedValues.meta_description,
                    meta_keywords: savedValues.meta_keywords,
                    status: 1
                };
                const response = await categoryStore.createCategory(payload);
                if (!response) {
                    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to create category', life: 5000 });
                    return;
                }
                await categoryStore.fetchProductCategories();
                toast.add({ severity: 'success', summary: 'Success', detail: 'Category created successfully', life: 3000 });
            }
        } catch (err) {
            console.error('Error saving category:', err);
            toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while saving the category', life: 5000 });
            return;
        }

        showAddForm.value = false;
        editingNode.value = null;
        formData.value = getEmptyFormData();
        treeRefreshKey.value += 1;
        updateTreeNodes({ collapseNodeId: wasEditingNodeId });
    };
    
    const editCategory = (node) => {
        editingNode.value = node;
        formData.value = {
            id: getCategoryId(node.data),
            name: getCategoryDisplayLabel(node.data),
            slug: node.data.slug || '',
            description: node.data.description || '',
            meta_title: node.data.meta_title || '',
            meta_description: node.data.meta_description || '',
            meta_keywords: node.data.meta_keywords || '',
            status: statusOptions.value.find(opt => opt.code === node.data.status) || statusOptions.value[0]
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
        let index = categories.value.findIndex(item => item.category_id === item.category_id);
        let parentIndex = null;
        let parent = item.parent;
        if(parent){
            categories.value.forEach((item, i) => {
                if(item.parent_id === parent.category_id) {
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
                :key="treeRefreshKey"
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
                        </div>
    
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
        </div>
    </template>
    