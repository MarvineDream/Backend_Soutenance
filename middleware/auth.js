import jwt from 'jsonwebtoken';



export const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'En-tête d\'autorisation manquant' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token d\'autorisation manquant' });
    }

    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide' });
        }
        
        req.user = user; 
        next();
    });
};

export const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        const user = req.user;

        if (!user || (roles.length && !roles.includes(user.role))) {
            return res.status(403).json({ error: 'Accès interdit' });
        }

        next();
    };
};


export default { authenticate, authorize };