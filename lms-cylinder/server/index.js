const express = require("express")
const cors = require("cors")
const mysql = require("mysql2")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const multer = require("multer")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")))

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "lms"
})

db.connect((err) => {
  if (err) {
    console.log(err)
  } else {
    console.log("MYSQL CONNECTED")
  }
})

app.post("/api/login", (req, res) => {
  const { username, password } = req.body

  db.query("SELECT * FROM users WHERE username=?", [username], async (err, result) => {
    if (err) {
      return res.status(500).json("Server error")
    }

    if (result.length === 0) {
      return res.status(401).json("User not found")
    }

    const user = result[0]

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      return res.status(401).json("Wrong password")
    }

    const token = jwt.sign({ id: user.id }, "SECRET_KEY", { expiresIn: "1d" })

    res.json({
      token,
      user
    })
  })
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads", "videos"))
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

app.post("/api/upload/video", upload.single("video"), (req, res) => {
  res.json({
    path: req.file.path
  })
})

app.get("/api/courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, result) => {
    if (err) {
      return res.status(500).json("Server error")
    }
    res.json(result)
  })
})

app.post("/api/progress", (req, res) => {
  const { user_id, course_id, progress } = req.body

  db.query(
    `
        INSERT INTO progress
        (user_id,course_id,progress)

        VALUES (?,?,?)
        `,
    [user_id, course_id, progress],
    (err) => {
      if (err) {
        return res.status(500).json("Server error")
      }
      res.json("UPDATED")
    }
  )
})

app.post("/api/quiz/submit", (req, res) => {
  const { course_id, answers } = req.body

  db.query("SELECT * FROM quizzes WHERE course_id=?", [course_id], (err, result) => {
    if (err) {
      return res.status(500).json("Server error")
    }

    let score = 0

    result.forEach((q, index) => {
      if (q.answer === answers[index]) {
        score++
      }
    })

    res.json({
      score,
      total: result.length
    })
  })
})

app.listen(5000, () => {
  console.log("SERVER RUNNING")
})
