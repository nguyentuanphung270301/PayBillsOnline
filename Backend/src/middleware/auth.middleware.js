const jwt = require('jsonwebtoken');

exports.authenticateToken = function (req, res, next) {
    // Lấy token từ header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Missing access token' });
    }
    // Xác minh token
    jwt.verify(token, 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid access token' });
        }
        // Lưu thông tin người dùng trong request để sử dụng cho các xử lý tiếp theo
        req.userId = user.userId;
        next();
    });
};