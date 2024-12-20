import { createContext, useState } from "react";

export const StudentContext = createContext(null);

const StudentProvider = ({ children }) => {
  const [studentCourseList, setStudentCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentCourseDetails, setStudentCourseDetails] = useState(null);
  const [courseEditedId, setCourseEditedId] = useState(null);
  const [studentBoughtCourseList, setStudentBoughtCourseList] = useState([]);
  const [studentCurrCourseProgress, setStudentCurrCourseProgress] = useState({});
  return (
    <StudentContext.Provider
      value={{
        studentCourseList,
        setStudentCourseList,
        loading,
        setLoading,
        studentCourseDetails,
        setStudentCourseDetails,
        courseEditedId,
        setCourseEditedId,
        studentBoughtCourseList,
        setStudentBoughtCourseList,
        studentCurrCourseProgress,
        setStudentCurrCourseProgress,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export default StudentProvider;
