import Category from '../models/Category';

export default class CategoryService {
    static baseUrl = '/data/categories.json';

    static async getAll() {
        try {
            const response = await fetch(this.baseUrl);
            const data = await response.json();
            return data.map(category => Category.fromJSON(category));
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    static async create(categoryData) {
        try {
            // TODO: Implement actual API call
            console.log('Creating category:', categoryData);
            return new Category(
                Date.now(), // Temporary ID
                categoryData.name,
                categoryData.slug,
                categoryData.parent_id
            );
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }

    static async update(categoryId, updates) {
        try {
            // Fetch current categories
            const response = await fetch(this.baseUrl);
            let categories = await response.json();
            
            // Find the category to update
            const categoryIndex = categories.findIndex(c => c.category_id === categoryId);
            if (categoryIndex === -1) {
                throw new Error('Category not found');
            }

            // Store the old parent ID for later use
            const oldParentId = categories[categoryIndex].parent_id;
            
            // Update the category
            categories[categoryIndex] = {
                ...categories[categoryIndex],
                ...updates
            };

            // If parent_id is being updated
            if (updates.parent_id !== undefined) {
                // If moving to a new parent
                if (updates.parent_id !== oldParentId) {
                    // Update all children of the moved category to maintain the tree structure
                    categories = categories.map(category => {
                        if (category.parent_id === categoryId) {
                            return {
                                ...category,
                                parent_id: updates.parent_id
                            };
                        }
                        return category;
                    });
                }
            }

            // TODO: In a real application, you would send this updated data to your backend
            // For now, we'll just return the updated category
            return categories[categoryIndex];
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    }

    static async delete(categoryId) {
        try {
            // TODO: Implement actual API call
            console.log('Deleting category:', categoryId);
            return true;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
} 