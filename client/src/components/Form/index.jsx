import React from "react";
import { Button } from "../ui/button";
import FormControls from "./form-controls";

const CommonForm = ({handleSubmit, buttonText, formControls = [], formData, setFormData, isSubmitDisable =false}) => {
  return (
    <form onSubmit={handleSubmit}>
        <FormControls formControls={formControls} formData={formData} setFormData={setFormData}/>
        <Button disabled={isSubmitDisable} type="submit" className="mt-5 w-full">{buttonText || "Submit" }</Button>
    </form>
  );
};

export default CommonForm;
