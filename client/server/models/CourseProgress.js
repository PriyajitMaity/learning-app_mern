const { Schema, model } =require("mongoose");

const LectureProgress =new Schema({
    lectureId: String,
    viewed: Boolean,
    dateViewed: Date,
});

const CourseProgress =new Schema({
    userId: String,
    courseId: String,
    completed: Boolean,
    completionDate: Date,
    lectureProgress: [LectureProgress],
});

module.exports =model("CourseProgress", CourseProgress)