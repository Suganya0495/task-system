from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ---------------- USERS ----------------
users = [
    {"username": "admin", "password": "admin123", "role": "admin"},
    {"username": "john", "password": "john123", "role": "user"}
]

# ---------------- TASKS ----------------
tasks = [
    {"id": 1, "title": "Initial Task", "assigned_to": "john", "status": "pending"}
]

@app.after_request
def after_request(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    return response

# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data["username"].lower()
    password = data.get("password")

    user = next((u for u in users if u["username"] == username), None)

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user["password"] != password:
        return jsonify({"error": "Invalid password"}), 401

    return jsonify({"username": user["username"], "role": user["role"]})

# ---------------- GET TASKS ----------------
@app.route("/tasks", methods=["GET"])
def get_tasks():
    role = request.args.get("role")
    user = request.args.get("user")
    status = request.args.get("status")  # ✅ added

    filtered_tasks = tasks

    # Role-based filtering
    if role == "admin":
        filtered_tasks = tasks
    elif role == "user":
        filtered_tasks = [
            t for t in tasks
            if t["assigned_to"].lower() == user.lower()
        ]
    else:
        return jsonify({"error": "Unauthorized"}), 403

    # Status filtering
    if status:
        filtered_tasks = [
            t for t in filtered_tasks
            if t["status"].lower() == status.lower()
        ]

    return jsonify(filtered_tasks)

# ---------------- CREATE TASK (ADMIN ONLY) ----------------
@app.route("/tasks", methods=["POST"])
def create_task():
    data = request.json

    # ✅ Role validation
    if data.get("role") != "admin":
        return jsonify({"error": "Only admin can create tasks"}), 403

    task = {
        "id": len(tasks) + 1,
        "title": data["title"],
        "assigned_to": data["assigned_to"],
        "status": "pending"
    }

    tasks.append(task)
    return jsonify(task)

# ---------------- UPDATE TASK (USER ONLY, OWN TASK) ----------------
@app.route("/tasks/<int:id>", methods=["PUT"])
def update_task(id):
    data = request.json

    # ✅ Role validation
    if data.get("role") != "user":
        return jsonify({"error": "Only users can update tasks"}), 403

    for task in tasks:
        if task["id"] == id:
            # ✅ Ownership check
            if task["assigned_to"].lower() != data.get("user").lower():
                return jsonify({"error": "Not allowed"}), 403

            task["status"] = data["status"]
            return jsonify({"message": "updated"})

    return jsonify({"error": "Task not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)