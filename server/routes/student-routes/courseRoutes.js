const express =require("express");
const {  getViewCourses, getViewCoursesDetails  } =require("../../controllers/Students/courseController");

const router =express.Router();

router.post("/get", getViewCourses);
router.post("/get/details/:id", getViewCoursesDetails);

module.exports = router;