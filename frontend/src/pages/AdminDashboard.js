import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [user, setUser] = useState("");
  const [tasks, setTasks] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  const fetchTasks = async () => {
    const res = await API.get("/tasks?role=admin");
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title || !user) return;

    await API.post("/tasks", {
      title,
      assigned_to: user.trim().toLowerCase(),
      status: "pending"
    });

    setTitle("");
    setUser("");
    fetchTasks();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 📊 COUNTS
  const count = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    progress: tasks.filter(t => t.status === "in_progress").length,
    completed: tasks.filter(t => t.status === "completed").length
  };

  // 🔍 FILTER LOGIC
  const filteredTasks = tasks.filter((t) => {
    return (
      (statusFilter === "all" || t.status === statusFilter) &&
      (userFilter === "all" || t.assigned_to === userFilter)
    );
  });

  // 🎨 STATUS COLOR
  const getColor = (status) => {
    switch (status) {
      case "pending": return "#facc15";
      case "in_progress": return "#60a5fa";
      case "completed": return "#4ade80";
      default: return "#ccc";
    }
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h2>🛠 Admin Dashboard</h2>
        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>

      {/* 📊 DASHBOARD CARDS */}
      <div style={styles.cards}>
        <div style={styles.cardBox}>Total: {count.total}</div>
        <div style={{ ...styles.cardBox, background: "#facc15" }}>
          Pending: {count.pending}
        </div>
        <div style={{ ...styles.cardBox, background: "#60a5fa" }}>
          In Progress: {count.progress}
        </div>
        <div style={{ ...styles.cardBox, background: "#4ade80" }}>
          Completed: {count.completed}
        </div>
      </div>

      {/* 🔍 FILTERS */}
      <div style={styles.filterBox}>
        <select
          style={styles.select}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          style={styles.select}
          onChange={(e) => setUserFilter(e.target.value)}
        >
          <option value="all">All Users</option>
          {[...new Set(tasks.map(t => t.assigned_to))].map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>

      {/* ➕ ADD TASK */}
      <div style={styles.form}>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Assign user"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={styles.input}
        />

        <button style={styles.addBtn} onClick={addTask}>
          ➕ Add Task
        </button>
      </div>

      {/* TASK LIST */}
      <div style={styles.container}>
        {filteredTasks.length === 0 ? (
          <p style={{ color: "#ccc" }}>No tasks found</p>
        ) : (
          filteredTasks.map((t) => (
            <div
              key={t.id}
              style={{
                ...styles.card,
                borderLeft: `6px solid ${getColor(t.status)}`
              }}
            >
              <h3>{t.title}</h3>
              <p>👤 {t.assigned_to}</p>
              <p>Status: <b>{t.status}</b></p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    padding: "20px",
    color: "white"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "white",
    color: "black",
    padding: "15px 20px",
    borderRadius: "10px",
    marginBottom: "20px"
  },

  logoutBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "10px",
    marginBottom: "20px"
  },

  cardBox: {
    background: "white",
    color: "black",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold"
  },

  filterBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },

  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "none"
  },

  addBtn: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px"
  },

  card: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "10px"
  },

  select: {
    padding: "8px",
    borderRadius: "6px"
  }
};