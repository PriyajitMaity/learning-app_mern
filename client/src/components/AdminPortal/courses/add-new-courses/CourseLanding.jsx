import FormControls from "@/components/Form/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config/config";
import { AdminContext } from "@/context/admin-context";
import React, { useContext } from "react";

const CourseLanding = () => {
  const { courseLandingFormData, setCourseLandingFormData } = useContext(AdminContext);

  // console.log(courseLandingFormData);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Landing Page</CardTitle>
      </CardHeader>
      <CardContent>
        <FormControls
          formControls={courseLandingPageFormControls}
          formData={courseLandingFormData}
          setFormData={setCourseLandingFormData}
        />
      </CardContent>
    </Card>
  );
};

export default CourseLanding;
