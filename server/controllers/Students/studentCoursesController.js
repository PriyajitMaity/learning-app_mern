const StudentCourse = require("../../models/StudentCourse");

const getCourseByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentBoughtCourses = await StudentCourse.findOne({
      userId: studentId,
    });

    if (!studentBoughtCourses) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    } else {
      res.status(200).json({
        success: true,
        data: studentBoughtCourses.courses,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to get course by student id",
    });
  }
};
module.exports = { getCourseByStudentId };
