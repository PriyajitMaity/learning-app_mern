import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth";
import RouteGaurd from "./components/protect-Route/RouteGaurd";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import AdminDashboardPage from "./pages/Admin/Admin";
import StudentHomePage from "./pages/students/Home";
import StudentsCommonLayout from "./components/StudentsPortal/Layout";
import NotFound from "./pages/not-found/NotFound";
import AddNewCourse from "./pages/Admin/AddNewCourse";
import StudentCourses from "./pages/students/StudentCourses";
import StudentCourseDetails from "./pages/students/CourseDetails";
import PaymentReturn from "./pages/students/PaymentReturn";
import StudentCoursesViewPage from "./pages/students/StudentCoursesViewPage";

function App() {
  const { auth } = useContext(AuthContext);
  
  return (
    <Routes>
      <Route
        path="/auth"
        element={
        <RouteGaurd
          element={<AuthPage />}
          authenticated ={auth?.authenticate}
          user={auth?.user} 
        />}
      />
      <Route
        path="/admin"
        element={
        <RouteGaurd 
          element={<AdminDashboardPage />}
          authenticated={auth?.authenticate}
          user={auth?.user} 
        />}
      />
      <Route
        path="/admin/create-new-course"
        element={
        <RouteGaurd 
          element={<AddNewCourse />}
          authenticated={auth?.authenticate}
          user={auth?.user} 
        />}
      />
      <Route
        path="/admin/edit-course/:courseId"
        element={
        <RouteGaurd 
          element={<AddNewCourse />}
          authenticated={auth?.authenticate}
          user={auth?.user} 
        />}
      />
      <Route
        path="/"
        element={
          <RouteGaurd 
            element={<StudentsCommonLayout/>}
            authenticated={auth?.authenticate}
            user={auth?.user}
          />
        }
      >
        <Route path="" element={<StudentHomePage />} />
        <Route path="home" element={<StudentHomePage />} />
        <Route path="courses" element={<StudentCourses/>} />
        <Route path="courses/details/:id" element={<StudentCourseDetails/>} />
        <Route path="payment-return" element={<PaymentReturn />} />
        <Route path="student-courses" element={<StudentCoursesViewPage/>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
