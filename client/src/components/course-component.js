import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleTakeToLogIn = () => {
    navigate("/login");
  };
  const [courseData, setCourseData] = useState(null);
  useEffect(() => {
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
      if (currentUser.user.role === "Instructor") {
        CourseService.get(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (currentUser.user.role === "Student") {
        CourseService.getEnrolledCourses(_id)
          .then((data) => {
            setCourseData(data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }
  }, []);
  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login first before searching for courses.</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogIn}
          >
            Take me to login page.
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "Instructor" && (
        <div>
          <h1>歡迎來到講師的課程頁面</h1>
        </div>
      )}
      {currentUser && currentUser.user.role === "Student" && (
        <div>
          <h1>歡迎來到學生的課程頁面</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length !== 0 && (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {courseData.map((course) => {
            return (
              <div className="card" style={{ width: "18rem", margin: "1rem" }}>
                <div className="card-body">
                  <h5 className="card-title">
                    課程名稱:
                    <br />
                    {course.title}
                  </h5>
                  <p style={{ margin: "0.6rem 0rem" }}>
                    課程介紹:
                    <br />
                    {course.description}
                  </p>
                  <p style={{ margin: "0.6rem 0rem" }}>
                    參與人數:{course.students.length}
                  </p>
                  <p style={{ margin: "0.6rem 0rem" }}>
                    課程價格:{course.price}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
