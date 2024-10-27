import React, { useContext } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminContext } from "@/context/admin-context";
import { mediaUpload } from "@/services";
import ProgressBar from "@/components/progress-bar/ProgressBar";


const CourseSettings = () => {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    progressPercentage,
    setProgressPercentage,
  } = useContext(AdminContext);

  const handleImageUpload = async (e) => {
    const selectImage = e.target.files[0];

    if (selectImage) {
      const imageData = new FormData();
      imageData.append("file", selectImage);
      try {
        setMediaUploadProgress(true);
        const response = await mediaUpload(imageData, setProgressPercentage);
        if (response.success) {
          setCourseLandingFormData({ ...courseLandingFormData, image: response?.data?.url });
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Card>
      <CardHeader>Course Setting</CardHeader>
      <div className="p-4">
        {
          mediaUploadProgress ? (
            <ProgressBar isUploading ={mediaUploadProgress} progress ={progressPercentage}/>
          ): null
        }
      </div>
      <CardContent>
        {courseLandingFormData?.image ? (
          <img src={courseLandingFormData.image} className="w-full" />
        ) : (
          <div className="flex flex-col gap-3">
            <Label>upload courses image</Label>
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseSettings;
