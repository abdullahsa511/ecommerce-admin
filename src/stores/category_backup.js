import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import CategoryService from '../service/CategoryService';

export const useCategoryStore = defineStore('category', () => {
    const categories = ref([]);
    const loading = ref(false);
    const error = ref(null);

    async function fetchCategories() {
        loading.value = true;
        error.value = null;
        try {
            const rawCategories = await CategoryService.getAll();
            categories.value = buildCategoryTree(rawCategories);
        } catch (err) {
            error.value = 'Failed to fetch categories';
            console.error(err);
        } finally {
            loading.value = false;
        }
    }

    function buildCategoryTree(flatCategories) {
        const categoryMap = new Map();
        const rootCategories = [];

        // First pass: Create category objects and store in map
        flatCategories.forEach(category => {
            categoryMap.set(category.category_id, { ...category, children: [] });
        });

        // Second pass: Build tree structure
        flatCategories.forEach(category => {
            const categoryWithChildren = categoryMap.get(category.category_id);
            if (category.parent_id === null) {
                rootCategories.push(categoryWithChildren);
            } else {
                const parent = categoryMap.get(category.parent_id);
                if (parent) {
                    parent.children.push(categoryWithChildren);
                }
            }
        });

        return rootCategories;
    }

    async function addCategory(name, slug, parentId = null) {
        loading.value = true;
        error.value = null;
        try {
            const newCategory = await CategoryService.create({ name, slug, parent_id: parentId });
            await fetchCategories(); // Refresh the tree
            return newCategory;
        } catch (err) {
            error.value = 'Failed to add category';
            console.error(err);
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function updateCategory(categoryId, updates) {
        loading.value = true;
        error.value = null;
        try {
            const updated = await CategoryService.update(categoryId, updates);
            await fetchCategories(); // Refresh the tree
            return updated;
        } catch (err) {
            error.value = 'Failed to update category';
            console.error(err);
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function deleteCategory(categoryId) {
        loading.value = true;
        error.value = null;
        try {
            await CategoryService.delete(categoryId);
            await fetchCategories(); // Refresh the tree
            return true;
        } catch (err) {
            error.value = 'Failed to delete category';
            console.error(err);
            return false;
        } finally {
            loading.value = false;
        }
    }

    const reorderCategories = async (dragKey, targetKey) => {
        try {
            // Find the dragged and target categories
            const findCategory = (categories, key) => {
                for (const category of categories) {
                    if (category.category_id === key) {
                        return category;
                    }
                    if (category.children) {
                        const found = findCategory(category.children, key);
                        if (found) return found;
                    }
                }
                return null;
            };

            const draggedCategory = findCategory(categories.value, dragKey);
            const targetCategory = findCategory(categories.value, targetKey);

            if (!draggedCategory || !targetCategory) {
                throw new Error('Categories not found');
            }

            // Remove dragged category from its current position
            const removeFromParent = (parent, key) => {
                if (!parent.children) return;
                const index = parent.children.findIndex(c => c.category_id === key);
                if (index !== -1) {
                    parent.children.splice(index, 1);
                } else {
                    parent.children.forEach(child => removeFromParent(child, key));
                }
            };

            // Add dragged category to new position
            const addToParent = (parent, category) => {
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(category);
            };

            // Update the order in the backend
            await CategoryService.reorder({
                draggedId: dragKey,
                targetId: targetKey
            });

            // Update local state
            removeFromParent(draggedCategory.parent, dragKey);
            addToParent(targetCategory.parent, draggedCategory);

            // Refresh categories to ensure consistency
            await fetchCategories();
        } catch (error) {
            console.error('Error reordering categories:', error);
            throw error;
        }
    };

    return {
        categories,
        loading,
        error,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories
    };
}); 