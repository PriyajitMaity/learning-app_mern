const mongoose =require("mongoose");
const StudentCourse =new mongoose.Schema({
    userID: String,
    courses: [
        {
            courseId: String,
            title: String,
            instructorId: String,
            instructorName: String,
            dateOfPurchase: Date,
            courseImage: String,
        }
    ]
})
module.exports =mongoose.model("StudentCourse", StudentCourse);