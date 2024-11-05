import React, { useContext, useEffect } from "react";
import banner from "../../image/banner-img.png";
import { courseCategories } from "@/config/config";
import { Button } from "@/components/ui/button";
import { StudentContext } from "@/context/student-context";
import { checkCoursePurchaseInfo, fetchStudentCourseList } from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

const StudentHomePage = () => {
  const { studentCourseList, setStudentCourseList } = useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate =useNavigate();

  const fetchAllCourseList = async () => {
    const response = await fetchStudentCourseList();
    if (response?.success) setStudentCourseList(response?.data);
    // console.log(response)
  };

  useEffect(() => {
    fetchAllCourseList();
  }, []);

  const handleNavigateToCoursePage = (itemId) => {
    sessionStorage.removeItem("filters");
    const currFilter ={
      category: [itemId],
    };
    sessionStorage.setItem("filters", JSON.stringify(currFilter));
    navigate('/courses');
  };

  const handleCourseNavigate = async (getCourseId) => {
    const response = await checkCoursePurchaseInfo(getCourseId, auth?.user?._id);
    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCourseId}`);
      } else {
        navigate(`/courses/details/${getCourseId}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="flex flex-col items-center justify-between lg:flex-row py-8 px-4 lg:px-8">
        <div className="lg: w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4">Learning that get's you</h1>
          <p className="text-xl">Skills for your present and future. Get started wi US</p>
        </div>
        <div className="lg:w-full mb-8 lg:mb-0">
          <img className="w-full h-auto rounded-lg shadow-lg" src={banner} />
        </div>
      </section>
      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((item) => (
            <Button
              variant="outline"
              className="justify-start"
              key={item.id}
              onClick={() => handleNavigateToCoursePage(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentCourseList && studentCourseList.length > 0 ? (
            studentCourseList.map((ele) => (
              <div
                className="border rounded-lg overflow-hidden shadow cursor-pointer"
                key={ele?._id}
                onClick={() => handleCourseNavigate(ele?._id)}
              >
                <img src={ele?.image} alt={ele?.title} className="w-full h-40 object-cover" width={300} height={150} />
                <div className="p-4">
                  <h3 className="font-bold mb-2">{ele?.title}</h3>
                  <p className="text-sm mb-2 text-gray-700">{ele?.instructorName}</p>
                  <p className="font-bold text-[16px]">${ele?.pricing}</p>
                </div>
              </div>
            ))
          ) : (
            <h1>No Course Found</h1>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentHomePage;
