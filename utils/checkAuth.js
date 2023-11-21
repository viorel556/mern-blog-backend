import jwt from "jsonwebtoken";
// MIDDLEWARE 1:
export default (req, res, next) => {

    const token =
        (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret123');
            req.userId = decoded._id;
            next(); // - indicates that all OK you can proceed with the next func;
        } catch (err) {
            return res.status(403).json({
                message: "NO ACCESS! "
            });
        }
    } else {
        return res.status(403).json({
            message: "NO ACCESS!"
        });
    }
}