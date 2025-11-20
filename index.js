const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const connectDb = require('./config/databse');
const auth = require('./middleware/auth');
const userRoutes = require('./routes/user.routes');
connectDb()
const PORT = process.env.PORT || 5000;

const studentRoutes = require('./routes/students.routes');
const multer = require("multer"); // ✅ correc

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use('/api/users', userRoutes);

// 🔹 NEW: serve JS files
app.use('/js', express.static(path.join(__dirname, 'front-crud-api', 'js')));

app.use('/api/students',auth, studentRoutes)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front-crud-api/login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'front-crud-api/register.html'));
});

// Serve students.html on root route
app.get('/students', (req, res) => {
    res.sendFile(path.join(__dirname, 'front-crud-api/students.html'));
});


app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: 'Image upload error',
            message: err.message,
            code: err.code
        });
    }

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'Invalid JSON format',
            message: err.message
        });
    }

    console.error('Server Error:', err);

    return res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));