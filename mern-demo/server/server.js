const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();

// Middleware xử lý CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/studentdb";

mongoose.connect(MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

// 1. GET: Lấy danh sách sinh viên
app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello from MERN Backend!"
  });
});
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Lỗi lấy danh sách sinh viên", error: error.message });
    }
});

// 2. POST: Thêm sinh viên mới (Câu 91 & 105)
app.post("/api/students", async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ message: "Lỗi thêm sinh viên", error: error.message });
    }
});

// 3. PUT: Cập nhật sinh viên theo ID (Câu 106)
app.put("/api/students/:id", async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: "Không tìm thấy sinh viên" });
        }
        res.json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: "Lỗi cập nhật sinh viên", error: error.message });
    }
});

// 4. DELETE: Xóa sinh viên theo ID (Câu 107)
app.delete("/api/students/:id", async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) {
            return res.status(404).json({ message: "Không tìm thấy sinh viên" });
        }
        res.json({ message: "Xóa sinh viên thành công" });
    } catch (error) {
        res.status(400).json({ message: "Lỗi xóa sinh viên", error: error.message });
    }
});

app.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});