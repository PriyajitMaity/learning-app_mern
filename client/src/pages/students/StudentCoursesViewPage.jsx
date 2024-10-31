import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBuyingCourses } from "@/services";
import { Watch } from "lucide-react";
import React, { useContext, useEffect } from "react";

const StudentCoursesViewPage = () => {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCourseList, setStudentBoughtCourseList } = useContext(StudentContext);

  const fetchBoughtCourses = async () => {
    const response = await fetchStudentBuyingCourses(auth?.user?._id);
    // console.log(response);

    if (response?.success) {
      setStudentBoughtCourseList(response?.data);
    } else {
      console.log("Failed to fetch bought courses");
    }
  };

  useEffect(() => {
    fetchBoughtCourses();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {studentBoughtCourseList && studentBoughtCourseList.length > 0 ? (
          studentBoughtCourseList.map((course) => (
            <Card key={course?.id} className="flex flex-col">
              <CardContent className="p-4 flex-grow">
                <img
                  src={course?.courseImage}
                  alt={course?.title}
                  className="h-52 w-full object-cover rounded-md mb-4"
                />
                <h3 className="font-bold mb-1">{course?.title}</h3>
                <p className="text-small text-gray-700 mb-2">{course?.instructorName}</p>
              </CardContent>
              <CardFooter>
                <Button className="flex-1">
                  <Watch className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <h1>Not Found</h1>
        )}
      </div>
    </div>
  );
};

export default StudentCoursesViewPage;
