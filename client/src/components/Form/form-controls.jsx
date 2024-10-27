import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

const FormControls = ({ formControls = [], formData, setFormData }) => {
  const renderComponentByType = (getControlItem) => {
    let element = null;
    const currentItemValue =formData[getControlItem.name] || '';

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={currentItemValue}
            onChange={(e) => setFormData({...formData, [getControlItem.name]: e.target.value })}
          />
        );
        break;
      case "select":
        element = (
          <Select value={currentItemValue} onValueChange={(value) =>setFormData({...formData, [getControlItem.name]: value})}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea 
          id={getControlItem.name} name={getControlItem.name} 
          placeholder={getControlItem.placeholder} 
          value={currentItemValue}
          onChange={(e) =>setFormData({...formData, [getControlItem.name]: e.target.value})}
          />
        );
        break;
      default:
        element = (
          <Input
            id={getControlItem.name}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={currentItemValue}
            onChange={(e) =>setFormData({...formData, [getControlItem.name]: e.target.value})}
          />
        );
        break;
    }
    return element;
  };

  return (
    <div className="flex flex-col gap-3">
      {formControls.map((item) => (
        <div key={item.name}>
          <Label htmlFor={item.name}>{item.label}</Label>
          {renderComponentByType(item)}
        </div>
      ))}
    </div>
  );
};

export default FormControls;
