import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config/config";
import { AdminContext } from "@/context/admin-context";
import { Delete, Edit } from "lucide-react";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

const AdminCourses = ({ listOfCourses }) => {
  const { setEditedCourseId, setCourseLandingFormData, setCourseCurriculumFormData } =
    useContext(AdminContext);
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
        <Button
          onClick={() => {
            navigate("/admin/create-new-course");
            setEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
          }}
          className="p-6"
        >
          Create New Course
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listOfCourses.length > 0 &&
                listOfCourses.map((course, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.students.length}</TableCell>
                    <TableCell>₹{course.pricing}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => {
                          navigate(`/admin/edit-course/${course?._id}`);
                        }}
                        size="sm"
                        variant="ghost"
                      >
                        <Edit className="h-6 w-6" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Delete className="h-6 w-6" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCourses;
