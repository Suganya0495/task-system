from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ---------------- USERS ----------------
users = [
    {"username": "admin", "role": "admin"},
    {"username": "john", "role": "user"}
]

# ---------------- TASKS ----------------
tasks = [
    {"id": 1, "title": "Initial Task", "assigned_to": "john", "status": "pending"}
]

# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data["username"].lower()

    user = next((u for u in users if u["username"] == username), None)

    if not user:
        # ✅ create new user automatically
        role = "admin" if username == "admin" else "user"
        new_user = {"username": username, "role": role}
        users.append(new_user)
        return jsonify(new_user)

    return jsonify(user)

# ---------------- GET TASKS ----------------
tasks = []

@app.route("/tasks", methods=["GET"])
def get_tasks():
    role = request.args.get("role")
    user = request.args.get("user")

    if role == "admin":
        return jsonify(tasks)

    if role == "user":
        return jsonify([
            t for t in tasks 
            if t["assigned_to"].lower() == user.lower()
        ])

    return jsonify({"error": "Unauthorized"}), 403

# ---------------- CREATE TASK (ADMIN) ----------------
@app.route("/tasks", methods=["POST"])
def create_task():
    data = request.json

    task = {
        "id": len(tasks) + 1,
        "title": data["title"],
        "assigned_to": data["assigned_to"],
        "status": "pending"
    }

    tasks.append(task)
    return jsonify(task)

# ---------------- UPDATE TASK (USER) ----------------
@app.route("/tasks/<int:id>", methods=["PUT"])
def update_task(id):
    data = request.json

    for task in tasks:
        if task["id"] == id:
            task["status"] = data["status"]

    return jsonify({"message": "updated"})

if __name__ == "__main__":
    app.run(debug=True)