const express = require('express');
const router = express.Router();

const Student = require('../models/students.model');
const multer = require('multer');
const path = require('path');
const fs = require("node:fs");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(new Error("Only Images are allowed"), false)
    }
}
const upload = multer({
    storage: storage, fileFilter: fileFilter, limits: {fileSize: 1024 * 1024 * 5}
})


// router.get('/', async (req, res) => {
//
//     try {
//         const students = await Student.find()
//         res.json(students);
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// });

router.get('/', async (req, res) => {
    try {
        const search = req.query.search?.trim() || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        // Build search query only if search exists
        const query = search
            ? {
                $or: [
                    { first_name: { $regex: search, $options: 'i' } },
                    { last_name:  { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        // Run both DB operations in parallel for higher performance
        const [total, students] = await Promise.all([
            Student.countDocuments(query),
            Student.find(query).skip(skip).limit(limit)
        ]);

        res.json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            students
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



router.get('/:id', async (req, res) => {
    try {
        const students = await Student.findOne({_id: req.params.id});

        if (!students) {
            return res.status(404).json({message: 'Student not found'});
        }
        res.json(students);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// POST route to handle adding a new student
router.post('/', upload.single('profile_pic'), async (req, res) => {
    try {
        const student = new Student(req.body);  // Create a new student from the form data

        if (req.file) {
            student.profile_pic = req.file.path;  // If there's a file, save its path in the database
        }

        const newStudent = await student.save();  // Save the student to the database
        res.status(201).json(newStudent);  // Respond with the newly created student data
    } catch (error) {
        res.status(400).json({message: error.message});  // Handle errors and return a response
    }
});

router.put('/:id', upload.single('profile_pic'), async (req, res) => {
    try {
        const existingStudent = await Student.findById(req.params.id);

        if (!existingStudent) {
            return res.status(404).json({message: 'Student not found'});
        }

        // If a new file is uploaded, delete the old one
        if (req.file) {
            if (existingStudent.profile_pic) {
                const filename = path.basename(existingStudent.profile_pic);
                const filepath = path.join('./uploads', filename);

                fs.unlink(filepath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    }
                });
            }
            // Set the new file path
            req.body.profile_pic = req.file.path;
        } else {
            // If no new file is uploaded, keep the existing profile_pic
            // Remove profile_pic from req.body to prevent overwriting with empty/string value
            delete req.body.profile_pic;
        }

        const updateStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        );

        if (!updateStudent) {
            return res.status(404).json({message: 'Student not found'});
        }

        res.json(updateStudent);

    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id)

        if (!student) {
            return res.status(404).json({message: 'Student not found'});
        }

        if (student.profile_pic) {
            // Extract just the filename from the stored path
            const filename = path.basename(student.profile_pic);
            const filepath = path.join('./uploads', filename);

            fs.unlink(filepath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                }
            });
        }

        res.json({message: 'Student deleted successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


module.exports = router;