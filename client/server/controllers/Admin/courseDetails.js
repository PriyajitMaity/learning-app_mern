const Course =require("../../models/Course");

const addNewCourse =async(req, res) =>{
    try{
        const courseData =req.body;
        const newCourse = new Course(courseData);
        const saveCourse =await newCourse.save();
        if(saveCourse){
            res.status(201).json({
                success: true,
                message: "course added successfully",
                data: saveCourse,
            })
        }
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            messase: "some error occured",
        })
    }
}

const getAllCourse =async(req, res) =>{
    try{
        const courseList =await Course.find({});
        res.status(200).json({
            success: true,
            message: "course list fetched successfully",
            data: courseList,
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            messase: "some error occured",
        })
    }
}

const getCourseDetails =async(req, res) =>{
    try{
        const {id} =req.params;
        const courseDetails =await Course.findById(id);
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "course not found",
            })
        }
        res.status(200).json({
            success: true,
            data: courseDetails,
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            messase: "some error occured",
        })
    }
}

const updateCourse =async(req, res) =>{
    try{
        const id =req.params.id;
        const updatedCourse =req.body;
        const result =await Course.findByIdAndUpdate(
            id,
            updatedCourse,
            {new: true}
        )
        if(!result){
           return res.status(404).json({
                success: false,
                message: "course not found",
            })
        }
        res.status(200).json({
            success: true,
            message: "course updated successfully",
            data: result,
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            messase: "some error occured",
        })
    }
}

module.exports ={ addNewCourse, getAllCourse, getCourseDetails, updateCourse};