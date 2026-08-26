import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });

  // Lấy danh sách sinh viên từ Backend
  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Lỗi kết nối Backend:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Gửi request POST thêm sinh viên
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      setForm({ studentId: '', name: '', email: '' });
      fetchStudents(); // Chỉ reload danh sách khi thêm thành công
    } else {
      const errData = await res.json();
      alert("Lỗi thêm sinh viên: " + (errData.message || "Trùng mã/email hoặc thiếu thông tin!"));
    }
  } catch (err) {
    console.error("Lỗi gửi dữ liệu:", err);
  }
};

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Quản Lý Sinh Viên</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          placeholder="MSSV" 
          value={form.studentId} 
          onChange={(e) => setForm({ ...form, studentId: e.target.value })} 
          required 
        />
        <input 
          placeholder="Họ và tên" 
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
          required 
        />
        <input 
          placeholder="Email" 
          value={form.email} 
          onChange={(e) => setForm({ ...form, email: e.target.value })} 
          required 
        />
        <button type="submit">Thêm Sinh Viên</button>
      </form>

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ và Tên</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((std) => (
            <tr key={std._id}>
              <td>{std.studentId}</td>
              <td>{std.name}</td>
              <td>{std.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;