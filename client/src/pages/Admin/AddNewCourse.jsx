import CourseCurriculum from "@/components/AdminPortal/courses/add-new-courses/CourseCurriculum";
import CourseLanding from "@/components/AdminPortal/courses/add-new-courses/CourseLanding";
import CourseSettings from "@/components/AdminPortal/courses/add-new-courses/CourseSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config/config";
import { AdminContext } from "@/context/admin-context";
import { AuthContext } from "@/context/auth-context";
import { addNewCourse, courseDetailsById, updateCourseById } from "@/services";
import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddNewCourse = () => {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    editedCourseId,
    setEditedCourseId,
  } = useContext(AdminContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  //   console.log(params);

  const isEmpty = (value) => {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return value === "" || value === null || value === undefined;
  };

  const validFormData = () => {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }
    let hasPreview = false;
    for (const item of courseCurriculumFormData) {
      if (isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id)) {
        return false;
      }
      if (item.freePreview) {
        hasPreview = true;
      }
    }
    return hasPreview;
  };
  const handleCreateCourse = async () => {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };
    const response =
      editedCourseId !== null
        ? await updateCourseById(editedCourseId, courseFinalFormData)
        : await addNewCourse(courseFinalFormData);

    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      navigate(-1);
      setEditedCourseId(null);
    }
  };
  const fetchCurrentCourseDetails = async () => {
    const response = await courseDetailsById(editedCourseId);
    // console.log(response, 'responseeeam')
    if (response.success) {
      const formData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];
        return acc;
      }, {});
      // console.log(formData,response.data, 'formdata');
      setCourseLandingFormData(formData);
      setCourseCurriculumFormData(response?.data?.curriculum);
    }
  };

  useEffect(() => {
    if (editedCourseId !== null) fetchCurrentCourseDetails();
  }, [editedCourseId]);

  useEffect(() => {
    if (params?.courseId) setEditedCourseId(params?.courseId);
  }, [params?.courseId]);
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="font-extrabold text-3xl mb-5">Create New Courese</h1>
        <Button
          disabled={!validFormData()}
          className="text-sm font-bold px-8 tracking-wider"
          onClick={handleCreateCourse}
        >
          Submit
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">Course Landing Page</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNewCourse;
