const {  addNewCourse, getAllCourse, getCourseDetails,updateCourse } =require("../../controllers/Admin/courseDetails");
const express =require('express');
const router =express.Router();

router.post('/add', addNewCourse);
router.get('/get', getAllCourse);
router.get('/get/details/:id', getCourseDetails);
router.put('/update/:id', updateCourse);

module.exports = router;