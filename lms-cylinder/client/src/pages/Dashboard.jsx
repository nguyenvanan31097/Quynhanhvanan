import { useEffect, useState } from "react"
import axios from "axios"

function Dashboard() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    axios.get("http://localhost:5000/api/courses").then((res) => {
      setCourses(res.data)
    })
  }, [])

  return (
    <div className="p-10">
      <h1>My Courses</h1>
      {courses.map((course) => (
        <div key={course.id} className="border p-5 mb-5 rounded">
          <h2>{course.title}</h2>
          <video controls width="500">
            <source src={"http://localhost:5000/" + course.video_url} />
          </video>
        </div>
      ))}
    </div>
  )
}

export default Dashboard
