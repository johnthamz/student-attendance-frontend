import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminClasses() {
  const [classes, setClasses] = useState([]);
  const [level, setLevel] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  // ================= FETCH CLASSES =================
  const fetchClasses = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const response = await axios.get(
        'http://127.0.0.1:8000/api/classrooms/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error.response?.data);
    }
  };

  // ================= CREATE CLASS =================
  const handleCreateClass = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('accessToken');

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/classrooms/',
        {
          level,
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLevel('');
      setName('');
      fetchClasses();

    } catch (error) {
      console.error("Error creating class:", error.response?.data);
    }
  };

  // ================= DELETE CLASS =================
  const handleDeleteClass = async (id) => {
    const token = localStorage.getItem('accessToken');

    if (!window.confirm("Are you sure you want to delete this class?")) {
      return;
    }

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/classrooms/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchClasses();

    } catch (error) {
      console.error("Error deleting class:", error.response?.data);
    }
  };

  return (
    <>
      <h3>Classes</h3>

      <h4>Create New Class</h4>

      <form onSubmit={handleCreateClass} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Level (e.g Form 1)"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Class Name / Stream (e.g East)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginLeft: '10px' }}
        />

        <button type="submit" style={{ marginLeft: '10px' }}>
          Create
        </button>
      </form>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Level</th>
            <th>Class Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {classes.map((classItem) => (
            <tr key={classItem.id}>
              <td>{classItem.id}</td>
              <td>{classItem.level}</td>
              <td>{classItem.name}</td>
              <td>
                <button
                  onClick={() => handleDeleteClass(classItem.id)}
                  style={{ color: 'red' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default AdminClasses;