const CourseProgress = require("../../models/CourseProgress");
const Course = require("../../models/Course");
const StudentCourse = require("../../models/StudentCourse");

const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lectureProgress: [
          {
            lectureId,
            viewed: true,
            dateViewed: new Date(),
          },
        ],
      });
      await progress.save();
    } else {
      const lectureProgress = progress.lectureProgress.find((item) => item.lectureId === lectureId);

      if (lectureProgress) {
        lectureProgress.viewed = true;
        lectureProgress.dateViewed = new Date();
      } else {
        progress.lectureProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      }
      await progress.save();
    }
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const allLectureViewed =
      progress.lectureProgress.length === course.curriculum.length &&
      progress.lectureProgress.every((item) => item.viewed);

    if (allLectureViewed) {
      progress.completed = true;
      progress.completionDate = new Date();

      await progress.save();
    }
    res.status(200).json({
      success: true,
      message: "Lecture marked as viewed",
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};

const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const studentPurchasedCourse = await StudentCourse.findOne({ userId });

    const isPurchasedCourseByCurrentUserOrNot =
      studentPurchasedCourse?.courses?.findIndex((item) => item.courseId === courseId) > -1;
    if (!isPurchasedCourseByCurrentUserOrNot) {
      return res.status(200).json({
        success: true,
        data: {
          isPurchased: false,
        },
        message: "You need to purchase this course to use it",
      });
    }

    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });
    if (!currentUserCourseProgress || currentUserCourseProgress?.lectureProgress?.length === 0) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "No course progress found",
        data: {
          isPurchased: true,
          courseDetails: course,
          progress: [],
        },
      });
    }

    const courseDetails = await Course.findById(courseId);

    res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: currentUserCourseProgress.lectureProgress,
        completed: currentUserCourseProgress.completed,
        completionDate: currentUserCourseProgress.completionDate,
        isPurchased: true,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};

const resetCurrentCourseProgress = async (req, res) => {
  try {
    const {userId, courseId} =req.body;

    const progress = await CourseProgress.findOne({ userId, courseId });

    if(!progress){
      return res.status(404).json({
        success: false,
        message: "Course progress not found",
      });
    }
    progress.lectureProgress = [];
    progress.completed = false;
    progress.completionDate = null;

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Course progress has been reset",
      data: progress,
    });


  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "some error occured",
    });
  }
};

module.exports = { markCurrentLectureAsViewed, getCurrentCourseProgress, resetCurrentCourseProgress };
