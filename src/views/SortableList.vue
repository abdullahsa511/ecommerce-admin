<script setup>
import { ref, reactive } from 'vue';

const items = reactive([
  {
    id: 1,
    text: 'Item 1',
    children: [
      { id: 2, text: 'Item 1.1' },
      { id: 3, text: 'Item 1.2' }
    ]
  },
  {
    id: 4,
    text: 'Item 2',
    children: [
      { id: 5, text: 'Item 2.1' },
      { id: 6, text: 'Item 2.2' }
    ]
  },
  { id: 7, text: 'Item 3' }
]);

const draggedItemIndex = ref(null);
const activeDropZoneIndex = ref(null);
const draggedLevel = ref(null);
const draggedItem = ref(null);
const draggedParentIndex = ref(null);
const hoveredParentIndex = ref(null);
const sortableList = ref(null);

const dragStart = (event, index, level = 0, parentIndex = null) => {
  draggedItemIndex.value = index;
  draggedLevel.value = level;
  draggedParentIndex.value = parentIndex;
  
  // Store the dragged item for the drag image
  if (level === 0) {
    draggedItem.value = items[index];
  } else {
    const parentIdx = parentIndex !== null ? parentIndex : Math.floor(index / 1000);
    const childIndex = index % 1000;
    draggedItem.value = items[parentIdx].children[childIndex];
  }

  // Create custom drag image for parent items with children
  if (level === 0 && draggedItem.value.children) {
    const dragImage = document.createElement('div');
    dragImage.className = 'drag-image';
    dragImage.style.width = event.target.offsetWidth + 'px';
    
    // Create container for parent and children
    const container = document.createElement('div');
    container.className = 'drag-container';
    container.style.width = '100%';
    
    // Add parent
    const parent = document.createElement('div');
    parent.className = 'sortable-item';
    parent.textContent = draggedItem.value.text;
    container.appendChild(parent);
    
    // Create children container
    const childrenContainer = document.createElement('div');
    childrenContainer.className = 'children-container';
    childrenContainer.style.marginLeft = '15px';
    
    // Add children
    draggedItem.value.children.forEach(child => {
      const childElement = document.createElement('div');
      childElement.className = 'sortable-item child-item';
      childElement.style.marginLeft = '15px';
      childElement.textContent = child.text;
      childrenContainer.appendChild(childElement);
    });
    
    container.appendChild(childrenContainer);
    dragImage.appendChild(container);

    // Add drag image to document temporarily
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);

    // Copy computed styles from actual elements to drag image
    const computedStyle = window.getComputedStyle(event.target);
    const dragElements = dragImage.getElementsByClassName('sortable-item');
    Array.from(dragElements).forEach(el => {
      el.style.backgroundColor = computedStyle.backgroundColor;
      el.style.padding = computedStyle.padding;
      el.style.border = '2px solid #eee';
      el.style.borderRadius = computedStyle.borderRadius;
      el.style.boxShadow = computedStyle.boxShadow;
      el.style.opacity = '0.9';
      
      if (el.classList.contains('child-item')) {
        el.style.backgroundColor = '#fafafa';
        el.style.borderLeft = '2px solid #e0e0e0';
      }
    });
    
    // Set custom drag image
    event.dataTransfer.setDragImage(dragImage, 10, 10);
    
    // Remove the temporary element after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  }
  
  event.target.classList.add('dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', JSON.stringify({ index, level, parentIndex }));
}

const dragEnd = () => {
  activeDropZoneIndex.value = null;
  draggedLevel.value = null;
  draggedItem.value = null;
  draggedParentIndex.value = null;
  hoveredParentIndex.value = null;
  const items = sortableList.value.getElementsByClassName('sortable-item');
  Array.from(items).forEach(item => item.classList.remove('dragging'));
}

const dragOver = (event, index, level = 0, parentIndex = null) => {
  event.preventDefault();
  const rect = event.target.getBoundingClientRect();
  const mouseY = event.clientY;
  const middleY = rect.top + rect.height / 2;

  // Update hovered parent index for child items
  if (level === 0 && draggedLevel.value === 1) {
    hoveredParentIndex.value = index;
  }
  
  // Allow dropping child items into different parents
  if (draggedLevel.value === 1) {
    if (level === 0) {
      // When hovering over a parent item
      const targetIndex = items[index].children?.length || 0;
      activeDropZoneIndex.value = index * 1000 + targetIndex;
      hoveredParentIndex.value = index;
    } else if (level === 1) {
      // When hovering over child items
      const targetParentIndex = parentIndex !== null ? parentIndex : Math.floor(index / 1000);
      const currentChildIndex = index % 1000;
      
      // Show drop zone above or below the current child item
      if (mouseY < middleY) {
        activeDropZoneIndex.value = targetParentIndex * 1000 + currentChildIndex;
      } else {
        activeDropZoneIndex.value = targetParentIndex * 1000 + currentChildIndex + 1;
      }
      
      // Update the hovered parent index
      hoveredParentIndex.value = targetParentIndex;
    }
  } else if (level === draggedLevel.value) {
    // Normal parent-to-parent dragging
    if (mouseY < middleY) {
      activeDropZoneIndex.value = index;
    } else {
      activeDropZoneIndex.value = index + 1;
    }
  }
}

const drop = (event, dropIndex, level = 0, parentIndex = null) => {
  event.preventDefault();
  activeDropZoneIndex.value = null;
  
  // Remove dragging class from all items
  const items = sortableList.value.getElementsByClassName('sortable-item');
  Array.from(items).forEach(item => item.classList.remove('dragging'));
  
  // Use level to determine if we're dropping at the root or child level
  if (draggedLevel.value === 1 || level === 1) {
    // Handle child item dropping
    const sourceParentIndex = draggedParentIndex.value;
    const targetParentIndex = hoveredParentIndex.value !== null ? hoveredParentIndex.value : parentIndex;
    
    if (targetParentIndex === undefined || targetParentIndex === null) return;
    
    // Get the source and target arrays
    const sourceParent = items[sourceParentIndex];
    const targetParent = items[targetParentIndex];
    
    // Ensure children arrays are initialized
    if (!sourceParent.children) {
      sourceParent.children = [];
    }
    if (!targetParent.children) {
      targetParent.children = [];
    }
    
    // Calculate indices
    const childIndex = draggedItemIndex.value % 1000;
    let newIndex = dropIndex % 1000;
    
    // Move the item
    const itemToMove = sourceParent.children[childIndex];
    sourceParent.children.splice(childIndex, 1);
    
    // If dropping into a new parent, add at the end
    if (sourceParentIndex !== targetParentIndex) {
      targetParent.children.push(itemToMove);
    } else {
      // If same parent, handle position
      if (childIndex < newIndex) {
        newIndex--;
      }
      targetParent.children.splice(newIndex, 0, itemToMove);
    }
    
    // Clean up empty children arrays
    if (sourceParent.children.length === 0) {
      delete sourceParent.children;
    }
  } else {
    // Handle parent item dropping
    let newIndex = dropIndex;
    if (draggedItemIndex.value < dropIndex) {
      newIndex--;
    }
    
    const itemToMove = items[draggedItemIndex.value];
    items.splice(draggedItemIndex.value, 1);
    items.splice(newIndex, 0, itemToMove);
  }
  
  draggedItemIndex.value = null;
  draggedLevel.value = null;
  draggedItem.value = null;
  draggedParentIndex.value = null;
  hoveredParentIndex.value = null;
}
</script>

<template>
  <div class="sortable-container">
    <h2>Draggable List</h2>
    <div ref="sortableList" class="sortable-list">
      <template v-for="(item, index) in items" :key="item.id">
        <div 
          class="drop-zone"
          :class="{ 'show': activeDropZoneIndex === index && draggedLevel === 0 }"
          data-level="0"
          @dragover.prevent
          @dragenter.prevent
          @drop="drop($event, index)"
        ></div>
        <div 
          class="sortable-item"
          :draggable="true"
          @dragstart="dragStart($event, index)"
          @dragend="dragEnd"
          @dragover="dragOver($event, index)"
        >
          {{ item.text }}
        </div>
        <template v-if="item.children">
          <template v-for="(child, childIndex) in item.children" :key="child.id">
            <div 
              class="drop-zone"
              :class="{ 'show': activeDropZoneIndex === (childIndex + 1000) && draggedLevel === 1 && hoveredParentIndex === index }"
              data-level="1"
              @dragover.prevent
              @dragenter.prevent
              @drop="drop($event, childIndex + 1000, 1, index)"
            ></div>
            <div 
              class="sortable-item child-item"
              :draggable="true"
              @dragstart="dragStart($event, childIndex + 1000, 1, index)"
              @dragend="dragEnd"
              @dragover="dragOver($event, childIndex + 1000, 1, index)"
            >
              {{ child.text }}
            </div>
          </template>
        </template>
      </template>
      <div 
        class="drop-zone"
        :class="{ 'show': activeDropZoneIndex === items.length && draggedLevel === 0 }"
        data-level="0"
        @dragover.prevent
        @dragenter.prevent
        @drop="drop($event, items.length)"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.sortable-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.sortable-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.children-container {
  margin-left: 30px;
  position: relative;
}

.sortable-item {
  background-color: #ffffff;
  padding: 15px 20px;
  margin: 0;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: move;
  user-select: none;
  transition: all 0.2s ease;
  border: 2px solid #eee;
}

.sortable-item.child-item {
  margin-left: 30px;
  background-color: #fafafa;
  border-left: 2px solid #e0e0e0;
}

.sortable-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #ddd;
}

.sortable-item.dragging {
  opacity: 0.5;
  background-color: #f5f5f5;
  border-style: dashed;
}

.drop-zone {
  height: 0;
  transition: height 0.2s ease;
  background-color: #f0f0f0;
  border-radius: 4px;
  opacity: 0;
}

.drop-zone.show {
  height: 53px;
  margin: 4px 0;
  opacity: 0.6;
  border: 2px dashed #ccc;
}

/* Drop zone for child items */
.drop-zone.show[data-level="1"] {
  margin-left: 30px;
  width: calc(100% - 30px);
}

/* Updated drag image styles */
.drag-image {
  padding: 0;
  background: transparent;
  width: 100%;
}

.drag-image .drag-container {
  width: 100%;
}

.drag-image .sortable-item {
  margin: 0 0 2px 0;
  box-sizing: border-box;
  width: 100%;
  height: 53px;
}

.drag-image .children-container {
  margin-left: 30px;
  width: calc(100% - 30px);
}

.drag-image .child-item {
  margin-left: 30px !important;
  background-color: #fafafa;
  border-left: 2px solid #e0e0e0;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}
</style>
