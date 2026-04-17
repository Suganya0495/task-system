import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const user = localStorage.getItem("user");
  const role = localStorage.getItem("role");

  const fetchTasks = async () => {
    const res = await API.get(`/tasks?user=${user}&role=${role}`);
    setTasks(res.data);
  };

  const update = async (id, status) => {
    await API.put(`/tasks/${id}`, { status });
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
  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((t) => t.status === filter);

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h2>👤 User Dashboard</h2>
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

      {/* 🔍 FILTER */}
      <div style={styles.filterBox}>
        <select
          style={styles.select}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* TASK LIST */}
      <div style={styles.container}>
        {filteredTasks.length === 0 ? (
          <p style={{ color: "#666" }}>No tasks found</p>
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
              <p>Status: <b>{t.status}</b></p>

              <select
                value={t.status}
                style={styles.select}
                onChange={(e) => update(t.id, e.target.value)}
              >
                <option value="pending">pending</option>
                <option value="in_progress">in_progress</option>
                <option value="completed">completed</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 🎨 STATUS COLOR
const getColor = (status) => {
  switch (status) {
    case "pending": return "#facc15";
    case "in_progress": return "#60a5fa";
    case "completed": return "#4ade80";
    default: return "#ccc";
  }
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    padding: "20px",
    fontFamily: "Arial"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "white",
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
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold"
  },

  filterBox: {
    marginBottom: "20px",
    textAlign: "right"
  },

  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px"
  },

  card: {
    background: "white",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
  },

  select: {
    width: "100%",
    padding: "8px",
    marginTop: "10px",
    borderRadius: "6px"
  }
};