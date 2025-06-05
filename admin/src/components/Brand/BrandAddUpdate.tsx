import { addBrand } from "@/redux/brand/BrandActions";
import { BrandInput } from "@/redux/brand/BrandTypes";
import { showNotification } from "@/redux/notification/notificationActions";
import { AppDispatch } from "@/redux/store";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { TextareaInput } from "../FormComponents/TextAreaInput";
import { TextInput } from "../FormComponents/TextInput";
import { Button } from "../ui/button";

const BrandAddUpdate = ({ update = false }: { update: boolean }) => {

  const dispatch = useDispatch<AppDispatch>()

  const [brandDetails, setBrandDetails] = useState<BrandInput>({
    title: "",
    description: "",
    metaTitle: "",
    metaDescription: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    metaTitle: "",
    description: "",
    metaDescription: "",
  });

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      setBrandDetails((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (name === "title") {
        setErrors((prev) => ({
          ...prev,
          [name]: value.trim() ? "" : `${name} is required`,
        }));
      }
    },
    []
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const requiredFields = ["title" as keyof BrandInput];
    const emptyField = requiredFields.find((field) => !brandDetails[field]);
    if (emptyField) {
      setErrors((prev) => ({ ...prev, [emptyField]: `${emptyField} is required` }));

      dispatch(showNotification({
        message: "Can't Add Brand",
        subMessage: `${emptyField} is required`,
        type: "warning",
      }))

      return;
    }

    const formData = new FormData();
    (Object.entries(brandDetails)).forEach(([key, value]) => {
      if (value.trim() !== "") {
        formData.append(key, value);
      }
    });
    try {
      await dispatch(addBrand(formData))

      setBrandDetails({
        title: "",
        description: "",
        metaTitle: "",
        metaDescription: "",
      });

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className="flex gap-3" onSubmit={(e) => handleSubmit(e)}>
      <div className="w-2/3">
        <div className="space-y-4 outer-box">
          <TextInput label="Title" name="title" id="brand-title" error={errors.title || ""} placeholder="Enter Brand Title" onChange={handleInputChange} labelClass="text-xs text-gray-600"></TextInput>
          <TextareaInput label="Description" name="description" id="brand-description" error={errors.description || ""} placeholder="Enter Brand Description" onChange={handleInputChange} labelClass="text-xs text-gray-800" rows={5}></TextareaInput>
        </div>

        <div className="space-y-4 outer-box">
          <TextInput label="Meta Title" name="metaTitle" id="brand-metatitle" error={errors.metaTitle || ""} placeholder="Enter Meta Title for SEO" onChange={handleInputChange} labelClass="text-xs text-gray-800"></TextInput>
          <TextareaInput label="Meta Description" name="metaDescription" id="brand-metadescription" error={errors.metaDescription || ""} placeholder="Enter Meta Description for SEO" onChange={handleInputChange} labelClass="text-xs text-gray-600" rows={4}></TextareaInput>
        </div>

      </div>
      <div className="w-1/3">
        <Button className="w-full" type="submit"> {update ? 'Update Brand' : 'Add Brand'}</Button>
      </div>
    </form>

  )
}

export default BrandAddUpdate
