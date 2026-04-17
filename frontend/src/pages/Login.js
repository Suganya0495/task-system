import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const login = async () => {
  const cleanUser = username.trim().toLowerCase();  // ✅ FIX

  const res = await API.post("/login", { username: cleanUser });

  const role = res.data.role;

  localStorage.setItem("user", cleanUser); // ✅ store clean
  localStorage.setItem("role", role);

  if (role === "admin") {
    navigate("/admin");
  } else {
    navigate("/user");
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Task System Login</h2>

        <input
          style={styles.input}
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <button style={styles.button} onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #74ebd5, #ACB6E5)"
  },
  card: {
    padding: "40px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center",
    width: "300px"
  },
  title: {
    marginBottom: "20px",
    color: "#333"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }
};