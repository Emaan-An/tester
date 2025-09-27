// Task17
import express from 'express'// warna ye use karo
const app = express();
app.use(express.json());

// Dummy data
let students = [
  { id: 1, name: "Emaan", email: "emaan@example.com", age: 22 },
  { id: 2, name: "Insha", email: "insha@example.com", age: 22 },
];

// ✅ Validation helper
function validate({ name, email, age }) {
  if (!name) return "Name is required";
  if (!email.includes("@")) return "Invalid email";
  if (age <= 0) return "Age must be greater than 0";
  return null;
}

// 🔹 Show all students OR search by name
app.get("/students", (req, res) => {
  const name = req.query.name;

  if (name) {
    const result = students.filter(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json(result); // ✅ Sirf matched record(s)
  }

  res.json(students); // ✅ Agar query param nahi diya → pura array
});

// 🔹 Show single student by ID
app.get("/students/:id", (req, res) => {
  const s = students.find((x) => x.id == req.params.id);
  s ? res.json(s) : res.status(404).send("Not found");
});

// 🔹 Add new student
app.post("/students", (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).send(error);

  const newS = { id: students.length + 1, ...req.body };
  students.push(newS);
  res.status(201).json(newS);
});

// 🔹 Update student by ID
app.put("/students/:id", (req, res) => {
  const s = students.find((x) => x.id == req.params.id);
  if (!s) return res.status(404).send("Not found");

  const error = validate(req.body);
  if (error) return res.status(400).send(error);

  Object.assign(s, req.body);
  res.json(s);
});

// 🔹 Delete student by ID
app.delete("/students/:id", (req, res) => {
  const i = students.findIndex((x) => x.id == req.params.id);
  if (i === -1) return res.status(404).send("Not found");
  res.json(students.splice(i, 1));
});

// 🔹 Start server
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});