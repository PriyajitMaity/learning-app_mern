import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config/config";
import React, { createContext, useState } from "react";

export const AdminContext = createContext(null);
const AdminProvider = ({ children }) => {
  const [courseLandingFormData, setCourseLandingFormData] = useState(courseLandingInitialFormData);
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(courseCurriculumInitialFormData);
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [courseList, setCourseList] = useState([]);
  const [editedCourseId, setEditedCourseId] = useState(null);

  return (
    <AdminContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        progressPercentage,
        setProgressPercentage,
        courseList,
        setCourseList,
        editedCourseId,
        setEditedCourseId,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
