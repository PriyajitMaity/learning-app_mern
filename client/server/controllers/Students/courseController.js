const Course =require("../../models/Course");
const StudentCourse =require("../../models/StudentCourse");

const getViewCourses =async(req, res) =>{ 
    try {   
        const { category =[], level =[], primaryLanguage =[], sortBy="price-lowtohigh" } =req.query;

        let filters ={};
        if(category.length){
            filters.category ={ $in: category.split(',')}
        }
        if(level.length){
            filters.level ={$in: level.split(',')}
        }
        if(primaryLanguage.length){
            filters.primaryLanguage ={$in: primaryLanguage.split(',')}
        }

        let sortParam ={};
        switch (sortBy) {
            case "price-lowtohigh":
                sortParam.pricing = 1;
                break;
            case "price-hightolow":
                sortParam.pricing = -1;
                break;
            case "title-atoz":
                sortParam.title = 1;
                break;
            case "title-ztoa":
                sortParam.title = -1;
                break;
        
            default: sortParam.pricing =1;
                break;
        }

        const courseList =await Course.find(filters).sort(sortParam);
        
        res.status(200).json({
            success: true,
            message: 'Courses fetched successfully',
            data: courseList,
        })
        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'some error occcured'
        })
    }
}


const getViewCoursesDetails =async(req, res) =>{
    try {
        const {id} =req.params;
        const courseDetails =await Course.findById(id);
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: 'Course details not found',
                data: null,
            })
        }
        res.status(200).json({
            success: true,
            message: 'course details fetched successfully',
            data: courseDetails,
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'some error occcured'
        })
    }
}

const coursePurchaseInfo =async(req, res) =>{
    try {
       const {id, studentId} =req.params;
        
       const studentCourses = await StudentCourse.findOne({
        userId: studentId,
      });
      if (!studentCourses) {
        return res.status(200).json({
            success: true,
            data: false, // Student has not purchased any courses
        });
    }else{   
      const ifStudentAlreadyBoughtCurrentCourse =
        studentCourses.courses.findIndex((item) => item.courseId === id) > -1;
      res.status(200).json({
        success: true,
        data: ifStudentAlreadyBoughtCurrentCourse,
      });
    }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred'
        })
    }

}
module.exports ={ getViewCourses, getViewCoursesDetails, coursePurchaseInfo };