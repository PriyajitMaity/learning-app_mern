import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentContext } from "@/context/student-context";
import { courseDetailsById, createPayment } from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import VideoPlayer from "@/components/videoPlayer/VideoPlayer";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AuthContext } from "@/context/auth-context";

const StudentCourseDetails = () => {
  const { courseEditedId, setCourseEditedId, studentCourseDetails, setStudentCourseDetails, loading, setLoading } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoPreview, setDisplayCurrentVideoPreview] = useState(null);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [approveUrl, setApproveUrl] = useState("");

  const { id } = useParams();

  const fetchStudentCourseDetails = async () => {
    const response = await courseDetailsById(courseEditedId);
    if (response?.success) {
      setStudentCourseDetails(response.data);
      setLoading(false);
        // console.log(response.data);
    } else {
      setStudentCourseDetails(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseEditedId !== null) fetchStudentCourseDetails();
    return () => {
      setCourseEditedId(null);
      setStudentCourseDetails(null);
    };
  }, [courseEditedId]);

  useEffect(() => {
    if (id) setCourseEditedId(id);
  }, [id]);

  const getIndexOfFreePreviewUrl =
    studentCourseDetails !== null ? studentCourseDetails?.curriculum?.findIndex((ele) => ele.freePreview) : -1;

  const handleSetPreview = (currVdoInfo) => {
    // console.log(currVdoInfo, "vdo");
    setDisplayCurrentVideoPreview(currVdoInfo?.videoUrl);
    setDisplayDialog(true);
  };

  const handleCreatePayment = async () => {
    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentCourseDetails?.instructorId,
      instructorName: studentCourseDetails?.instructorName,
      courseImage: studentCourseDetails?.image,
      courseTitle: studentCourseDetails?.title,
      courseId: studentCourseDetails?._id,
      coursePricing: studentCourseDetails?.pricing,
    };
    // console.log(paymentPayload, "payment");
    const response = await createPayment(paymentPayload);

    if (response.success) {
      sessionStorage.setItem("currOrderID", JSON.stringify(response?.data?.orderId));
      setApproveUrl(response?.data?.approveUrl);
      // console.log(approveUrl);
    }
  };

  if (loading) return <Skeleton />;
  if (approveUrl !== "") {
    window.location.href = approveUrl;
  }
  return (
    <div className="mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">{studentCourseDetails?.title}</h1>
        <p className="text-xl mb-4">{studentCourseDetails?.subtitle}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span className="">Created by {studentCourseDetails?.instructorName}</span>
          <span className="">Created on {studentCourseDetails?.date.split("T")[0]}</span>
          <span className="flex items-center">
            <Globe className="mr-1 h-4 w-4" />
            {studentCourseDetails?.primaryLanguage}
          </span>
          <span>
            {studentCourseDetails?.students.length}{" "}
            {studentCourseDetails?.students.length <= 1 ? "student" : "students"}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What you'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-col-1 md:grid-cols-2 gap-2">
                {studentCourseDetails?.objectives.split(",").map((objective, index) => (
                  <li className="flex items-start" key={index}>
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>{studentCourseDetails?.description}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {studentCourseDetails?.curriculum?.map((item, index) => (
                <li
                  className={`${item?.freePreview ? "cursor-pointer" : "cursor-not-allowed"} flex items-center mb-4`}
                  onClick={item?.freePreview ? () => handleSetPreview(item) : null}
                  key={index}
                >
                  {item?.freePreview ? <PlayCircle className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                  <span>{item?.title}</span>
                </li>
              ))}
            </CardContent>
          </Card>
        </main>
        <aside className="w-full md:w-[500px]">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentCourseDetails?.curriculum[getIndexOfFreePreviewUrl].videoUrl
                      : ""
                  }
                  width="450px"
                  height="200px"
                />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">${studentCourseDetails?.pricing}</span>
              </div>
              <Button className="w-full" onClick={handleCreatePayment}>
                Buy now
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <Dialog
        open={displayDialog}
        onOpenChange={() => {
          setDisplayDialog(false);
          setDisplayCurrentVideoPreview(null);
        }}
      >
        <DialogContent className="w-[800px]">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg flex items-center justify-center">
            <VideoPlayer url={displayCurrentVideoPreview} width="450px" height="200px" />
          </div>
          <div className="flex flex-col gap-2">
            {studentCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filterItem) => (
                <p className="cursor-pointer text-[16px] font-medium" onClick={() => handleSetPreview(filterItem)}>
                  {filterItem?.title}
                </p>
              ))}
          </div>
          {/* <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentCourseDetails;
