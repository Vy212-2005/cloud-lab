const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Import model Student 
const Student = require("../models/Student");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/api/hello", (req, res) => {
    res.json({
        message: "Backend Node.js + Express đang hoạt động!"
    });
});

//Xây dựng API GET /api/students
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Xây dựng API POST /api/students
app.post("/api/students",async(req,res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});
// Xây dựng API PUT /api/students/:id
app.put("/api/students/:id",async(req,res) => {
    try {
        const updatedSudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        );
        if (!updatedSudent) {
            return res.status(404).json({message: "Không tìm thấy sinh viên" });
        }
        res.status(200).json(updatedSudent);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});
// Xây dựng API DELETE /api/students/:
app.delete("/api/students/:id",async(req,res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if(!deletedStudent) {
            return res.status(404).json({message: "Không tìm thấy sinh viên"});
        }
        res.status(200).json({message: "Xóa sinh viên thành công"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Atlas connected successfully!");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

app.listen(PORT, () => {
    console.log(`Backend đang chạy tại http://localhost:${PORT}`);
});