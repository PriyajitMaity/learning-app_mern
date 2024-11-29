const express =require("express");
const { getCourseByStudentId } =require("../../controllers/Students/studentCoursesController");

const router =express.Router();

router.get("/get/:studentId", getCourseByStudentId);

module.exports = router;