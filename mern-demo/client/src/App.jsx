import { useState, useEffect } from 'react';

const API_URL = `${import.meta.env.VITE_API_URL}/api/students`;

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentId: '',
    name: '',
    email: ''
  });

  const [editingId, setEditingId] = useState(null);

  // =========================
  // READ - Lấy danh sách
  // =========================
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Lỗi kết nối Backend:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================
  // CREATE / UPDATE
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (editingId) {
        // UPDATE
        res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        });
      } else {
        // CREATE
        res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(form)
        });
      }

      if (res.ok) {
        setForm({
          studentId: '',
          name: '',
          email: ''
        });

        setEditingId(null);

        fetchStudents();
      } else {
        const errData = await res.json();

        alert(
          "Lỗi: " +
          (errData.message || "Không thể thực hiện thao tác!")
        );
      }
    } catch (err) {
      console.error("Lỗi gửi dữ liệu:", err);
    }
  };

  // =========================
  // EDIT - Đưa dữ liệu lên form
  // =========================
  const handleEdit = (student) => {
    setEditingId(student._id);

    setForm({
      studentId: student.studentId,
      name: student.name,
      email: student.email
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancelEdit = () => {
    setEditingId(null);

    setForm({
      studentId: '',
      name: '',
      email: ''
    });
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sinh viên này không?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchStudents();
      } else {
        const errData = await res.json();

        alert(
          "Lỗi xóa sinh viên: " +
          (errData.message || "Không thể xóa!")
        );
      }
    } catch (err) {
      console.error("Lỗi xóa sinh viên:", err);
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h1>Hệ thống Quản Lý Sinh Viên</h1>

      {/* =========================
          FORM CREATE / UPDATE
      ========================= */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap'
        }}
      >
        <input
          placeholder="MSSV"
          value={form.studentId}
          onChange={(e) =>
            setForm({
              ...form,
              studentId: e.target.value
            })
          }
          required
        />

        <input
          placeholder="Họ và tên"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
          required
        />

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
          required
        />

        <button type="submit">
          {editingId ? 'Cập nhật' : 'Thêm Sinh Viên'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={handleCancelEdit}
          >
            Hủy
          </button>
        )}
      </form>

      {/* =========================
          STUDENT TABLE
      ========================= */}
      <table
        border="1"
        cellPadding="8"
        style={{
          borderCollapse: 'collapse',
          width: '100%'
        }}
      >
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ và Tên</th>
            <th>Email</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {students.map((std) => (
            <tr key={std._id || std.studentId}>
              <td>{std.studentId}</td>
              <td>{std.name}</td>
              <td>{std.email}</td>

              <td>
                <button
                  onClick={() => handleEdit(std)}
                  style={{ marginRight: '8px' }}
                >
                  Sửa
                </button>

                <button
                  onClick={() => handleDelete(std._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;