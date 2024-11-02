const express =require("express");
const {  getViewCourses, getViewCoursesDetails, coursePurchaseInfo  } =require("../../controllers/Students/courseController");

const router =express.Router();

router.get("/get", getViewCourses);
router.get("/get/details/:id", getViewCoursesDetails);
router.get("/purchase-info/:id/:studentId", coursePurchaseInfo)

module.exports = router;