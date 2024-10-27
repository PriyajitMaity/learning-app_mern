import React, { useContext, useRef } from "react";
import ProgressBar from "@/components/progress-bar/ProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AdminContext } from "@/context/admin-context";
import { bulkMediaUpload, mediaDeleteVideo, mediaUpload } from "@/services";
import VideoPlayer from "@/components/videoPlayer/VideoPlayer";
import { courseCurriculumInitialFormData } from "@/config/config";
import { Upload } from "lucide-react";

const CourseCurriculum = () => {
  const bulkUploadInputRef = useRef(null);
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    progressPercentage,
    setProgressPercentage,
  } = useContext(AdminContext);

  const handleAddLecture = () => {
    setCourseCurriculumFormData([...courseCurriculumFormData, { ...courseCurriculumInitialFormData[0] }]);
  };

  const handleLectureTitle = (e, indexId) => {
    let copyData = [...courseCurriculumFormData];
    copyData[indexId] = { ...copyData[indexId], title: e.target.value };
    setCourseCurriculumFormData(copyData);
  };

  const handleFreePreview = (value, indexId) => {
    const copyData = [...courseCurriculumFormData];
    copyData[indexId] = { ...copyData[indexId], freePreview: value };
    setCourseCurriculumFormData(copyData);
  };

  const handleSingleLectureUpload = async (event, indexId) => {
    const selectFile = event.target.files[0];

    if (selectFile) {
      const videoData = new FormData();
      videoData.append("file", selectFile);
      try {
        setMediaUploadProgress(true);
        const response = await mediaUpload(videoData, setProgressPercentage);
        // console.log(response, "response");
        if (response.success) {
          let copyData = [...courseCurriculumFormData];
          copyData[indexId] = {
            ...copyData[indexId],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(copyData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error, "error");
      }
    }
  };

  const isCourseDataValid = () => {
    return courseCurriculumFormData.every((item) => {
      return item && typeof item === "object" && item.title.trim() !== "" && item.videoUrl.trim() !== "";
    });
  };
  const handleReplaceVideo = async (indexId) => {
    let copyData = [...courseCurriculumFormData];
    const currentVideoId = copyData[indexId].public_id;
    const deleteReplaceVideo = await mediaDeleteVideo(currentVideoId);
    console.log(deleteReplaceVideo, "lalalalalla");

    if (deleteReplaceVideo.success) {
      copyData[indexId] = { ...copyData[indexId], videoUrl: "", public_id: "" };
      setCourseCurriculumFormData(copyData);
    }
  };
  const handleDeleteVideo = async (indexId) => {
    let copyData = [...courseCurriculumFormData];
    const currentVideoId = copyData[indexId].public_id;
    const deleteVideo = await mediaDeleteVideo(currentVideoId);
    console.log(deleteVideo, "lalalalalla");

    if (deleteVideo.success) {
      copyData = copyData.filter((_, index) => index !== indexId);
    }
    setCourseCurriculumFormData(copyData);
  };
  // console.log(courseCurriculumFormData);
  const handleOpenBulkUploadDialog = () => {
    bulkUploadInputRef.current?.click();
  };

  const areCourseDataEmpty = (arr) => {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  };

  const handleMediaBulkUpload = async (e) => {
    const selectFiles = Array.from(e.target.files);
    const videoData = new FormData();

    selectFiles.forEach((item) => videoData.append("file", item));

    try {
      setMediaUploadProgress(true);
      const response = await bulkMediaUpload(videoData, setProgressPercentage);
      // console.log(response, 'bulk');
      if (response.success) {
        let copyData = areCourseDataEmpty(courseCurriculumFormData) ? [] : [...courseCurriculumFormData];
        copyData = [
          ...copyData,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${copyData.length + (index + 1)}`,
            freePreview: false,
          })),
        ];
        setCourseCurriculumFormData(copyData);
        setMediaUploadProgress(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
          <Input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUploadDialog}
          >
            <Upload className="w-4 h-5 mr-2" />
            Bulk upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button disabled={!isCourseDataValid() || mediaUploadProgress} onClick={handleAddLecture}>
          Add Lecture
        </Button>
        {mediaUploadProgress ? <ProgressBar isUploading={mediaUploadProgress} progress={progressPercentage} /> : null}
        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((curriculumData, index) => (
            <div className="border p-5 rounded-md">
              <div className="flex gap-5 items-center">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title"
                  className="max-w-96"
                  onChange={(e) => handleLectureTitle(e, index)}
                  value={courseCurriculumFormData[index]?.title}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) => handleFreePreview(value, index)}
                    checked={courseCurriculumFormData[index]?.freePreview}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>Free Preview</Label>
                </div>
              </div>
              <div className="mt-6">
                {courseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex gap-3">
                    <VideoPlayer url={courseCurriculumFormData[index].videoUrl} width="550px" height="200px" />
                    <Button onClick={() => handleReplaceVideo(index)}>Replace Video</Button>
                    <Button onClick={() => handleDeleteVideo(index)} className="bg-red-800">
                      Delete Video
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    className="mb-4"
                    onChange={(event) => handleSingleLectureUpload(event, index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCurriculum;
