import Category from '../models/categoryModels.js';




export const createCategory = async (req, res) => {
    const { name } = req.body; 

    try {
       
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'La catégorie existe déjà' });
        }

        
        const newCategory = new Category({ name });
        await newCategory.save();

        return res.status(201).json({ message: 'Catégorie créée avec succès', category: newCategory });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);
        if (!category) return res.status(404).json({ message: 'Catégorie non trouvée' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
        if (!category) return res.status(404).json({ message: 'Catégorie non trouvée' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};


export const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) return res.status(404).json({ message: 'Catégorie non trouvée' });
        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


