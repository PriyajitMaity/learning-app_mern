import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/videoPlayer/VideoPlayer";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { getStudentCurrentCourseProgress, markLectureAsView, resetCourseProgress } from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

const StudentViewCourseProgress = () => {
  const { studentCurrCourseProgress, setStudentCurrCourseProgress } = useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currLecture, setCurrLecture] = useState(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  const { auth } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchCurrCourseProgress = async () => {
    const response = await getStudentCurrentCourseProgress(auth?.user?._id, id);
    // console.log(response);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCompleteDialog(true);
          setShowConfetti(true);

          return;
        }
        if (response?.data?.progress?.length === 0) {
          setCurrLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          console.log("logging here");
          const lastIndexOfViewAsTrue = response?.data?.progress?.reduceRight((acc, obj, index) => {
            return acc === -1 && obj.viewed ? index : acc;
          }, -1);
          setCurrLecture(response?.data?.courseDetails?.curriculum[lastIndexOfViewAsTrue + 1]);
        }
      }
    }
  };

  const updateCourseProgress = async () => {
    if (currLecture) {
      const response = await markLectureAsView(
        auth?.user?._id,
        studentCurrCourseProgress?.courseDetails?._id,
        currLecture?._id
      );
      if (response.success) {
        fetchCurrCourseProgress();
      }
    }
  };

  const handleRewatchCourse = async () => {
    const response = await resetCourseProgress(auth?.user?._id, studentCurrCourseProgress?.courseDetails?._id);
    if (response?.success) {
      setCurrLecture(null);
      setShowConfetti(false);
      setShowCompleteDialog(false);
      fetchCurrCourseProgress();
    }
  };

  useEffect(() => {
    fetchCurrCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currLecture?.progressValue === 1) updateCourseProgress();
  }, [currLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setTimeout(false), 9000);
  }, [showConfetti]);

  // console.log(currLecture, "relalala");

  return (
    <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
      {showConfetti && <Confetti />}
      <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <Button
            className="text-black bg-white"
            variant="ghost"
            size="sm"
            onClick={() => navigate("/student-courses")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to my Courses page
          </Button>
          <h1 className="text-lg font-bold hidden md:block">{studentCurrCourseProgress?.courseDetails?.title}</h1>
        </div>
        <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
          {isSideBarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className={`flex-1 ${isSideBarOpen ? "mr-[400px]" : ""} transition-all duration-300`}>
          <VideoPlayer
            width="100%"
            height="500px"
            url={currLecture?.videoUrl}
            onProgressUpdate={setCurrLecture}
            progressData={currLecture}
          />
          <div className="p-6 bg-[#1c1d1f]">
            <h2 className="text-2xl font-bold mb-2">{currLecture?.title}</h2>
          </div>
        </div>
        <div
          className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-1 border-gray-700 transition-all duration-300 
            ${isSideBarOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid bg-[#1c1d1f] w-full grid-cols-2 p-0 h-14">
              <TabsTrigger value="content" className="text-black rounded-none h-full">
                Course Content
              </TabsTrigger>
              <TabsTrigger value="overview" className="text-black rounded-none h-full">
                Overview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {studentCurrCourseProgress?.courseDetails?.curriculum.map((item) => (
                    <div
                      className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer"
                      key={item?._id}
                    >
                      {studentCurrCourseProgress?.progress?.find((progressItem) => progressItem.lectureId === item._id)
                        ?.viewed ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      <span>{item?.title}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4">About This Course</h2>
                  <p className="text-gray-400">{studentCurrCourseProgress?.courseDetails?.description}</p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>You can't view this page !!</DialogTitle>
            <DialogDescription>Please purchase this course to get access</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={showCompleteDialog}>
        <DialogContent showOverlay={false} className="sm:w-[425px]">
          <DialogHeader>
            <DialogTitle>Congratulations!!!</DialogTitle>
            <DialogDescription className="flex flex-col gap-3">
              <Label>You have completed the course</Label>
              <div className="flex flex-row gap-3">
                <Button onClick={() => navigate("/student-courses")}>My Courses Page</Button>
                <Button onClick={handleRewatchCourse}>Rewatch Course</Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentViewCourseProgress;
