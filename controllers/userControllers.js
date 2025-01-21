import User from '../models/UsersModels.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
    const payload = {
        id: user._id,
        role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    return token;
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Les champs username et password sont requis.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Nom d’utilisateur ou mot de passe incorrect' });
        }

        const token = generateToken(user);
        res.status(200).json({ message: 'Connexion réussie', token });
    } catch (error) {
        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};




/* const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role)  {
        return res.status(400).json({ error: 'Nom d\'utilisateur et mot de passe sont requis.' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Utilisateur déjà existant' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            role 
        });

        await newUser.save();

        const token = generateToken(newUser);

        res.status(201).json({ token, user: { id: newUser._id, username: newUser.username, role: newUser.role } });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Données invalides', details: error.message });
        }
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Nom d\'utilisateur déjà pris' });
        }

        res.status(500).json({ error: 'Erreur du serveur', details: error.message });
    }
};  */







export { loginUser };


