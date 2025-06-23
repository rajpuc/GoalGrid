import React, { useState } from "react";
import images from "../../assets/images";
import toast from "react-hot-toast";
import useAuthenticationStore from "../../store/useAuthenticationStore";
import { Link, useNavigate } from "react-router-dom";
import { Camera, Eye, EyeOff, LoaderCircle } from "lucide-react";
import {
  base64Converter,
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
} from "../../utils/formUtility";

const Registration = () => {
  const navigate = useNavigate();
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp,uploadFile } = useAuthenticationStore();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImageUrl: "",
  });
  const [formValidationError, setFormValidationError] = useState({
    fullName: [],
    email: [],
    password: [],
    confirmPassword: [],
  });

  const updateFormData = async (e) => {
    const { name, value } = e.target;
    if (name === "profileImageUrl") {
      setIsFileUploading(true);
      const base64 = await base64Converter(e);
      if (base64) {
        const url = await uploadFile(base64);
        if (url) {
          setFormData((prev) => ({
            ...prev,
            [name]: url,
          }));
        } else {
          toast.error("Image upload failed");
        }
      } else {
        toast.error("Invalid image file");
      }
      setIsFileUploading(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateFormData = (formData) => {
    return {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      ),
    };
  };

  function clearFormData() {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profileImageUrl: "",
    });
  }

  function clearFormValidationError() {
    setFormValidationError({
      fullName: [],
      email: [],
      password: [],
      confirmPassword: [],
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateFormData(formData);
    setFormValidationError(errors);

    const hasError = Object.values(errors).some((arr) => arr.length > 0);
    if (hasError) {
      toast.error("Please fix the highlighted errors.");
      return;
    }
    if (isFileUploading) {
      toast.error("Profile image is Uploading, Please wait..");
      return;
    }

    const isSuccess = await signUp(formData);
    
    if(isSuccess){
      clearFormData();
      clearFormValidationError();
      navigate('/login');
    } 
  };

  const FieldError = ({ errors }) => {
    if (!errors || errors.length === 0) return null;
    return (
      <ul>
        {errors.map((item, idx) => (
          <li key={idx} className="text-[11px] text-red-500">
            {item}
          </li>
        ))}
      </ul>
    );
  };
  return (
    <div className="w-full min-h-screen flex items-center justify-center py-3">
      <div className="bg-white rounded-2 h-fit p-2 max-w-lg w-full mx-3 sm:mx-0 shadow-lg rounded-md">
        <div className="relative ">
          <div className="flex justify-between bg-blue-100 rounded-tl-md rounded-tr-md ">
            <div className="flex flex-col justify-center pl-2.5">
              <h5 className="text-base font-bold text-blue-500">
                Free Register
              </h5>
              <p className="text-[10px]">Get your free GoalGrid account now.</p>
            </div>
            <div className="w-1/3">
              <img
                className="w-full"
                src={images.formBg}
                alt="Form's background image"
              />
            </div>
          </div>
          <div className="absolute top-4/5 left-5 w-20 h-20 rounded-full bg-gray-50 shadow-sm">
            <div className="p-1 flex items-center justify-center">
              <img
                className="w-full h-full "
                src={images.logo}
                alt="logo"
              />
            </div>
          </div>
        </div>
        <div className="mt-18">
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="max-w-md w-full  mx-auto"
            noValidate
          >
            <div className="size-25 mx-auto sm:size-25  self-center  rounded-full flex items-center justify-center relative border-[1px]">
              <label className="absolute z-[10] right-2 bottom-1 cursor-pointer">
                <Camera className="text-blue-700" fill="#fff" />
                <input
                  type="file"
                  onChange={updateFormData}
                  name="profileImageUrl"
                  className="hidden"
                  accept="image/*"
                />
              </label>
              <div className="w-full h-full overflow-hidden rounded-full flex items-center justify-center">
                {isFileUploading && (
                  <div className="absolute w-full h-full flex items-center justify-center">
                    <LoaderCircle size={28} className="text-blue-700 animate-spin" />
                  </div>
                )}
                <img
                  className="w-full h-full object-cover "
                  src={
                    formData.profileImageUrl
                      ? formData.profileImageUrl
                      : images.avatar
                  }
                  alt=""
                />
              </div>
            </div>
            <div className="mt-3">
              <label htmlFor="fullName" className="block text-sm mb-2">
                Full Name
              </label>
              <input
                name="fullName"
                onChange={(e) => updateFormData(e)}
                value={formData.fullName}
                className="w-full p-1  border border-gray-300 focus:outline-none focus:border-blue-500 focus:border-[1px] rounded-sm"
                id="fullName"
                type="text"
              />
              <FieldError errors={formValidationError.fullName} />
            </div>
            <div className="mt-3">
              <label htmlFor="email" className="block text-sm mb-2">
                Email
              </label>
              <input
                name="email"
                onChange={(e) => updateFormData(e)}
                value={formData.email}
                className="w-full p-1  border border-gray-300 focus:outline-none focus:border-blue-500 focus:border-[1px] rounded-sm"
                id="email"
                type="email"
              />
              <FieldError errors={formValidationError.email} />
            </div>
            <div className="mt-3">
              <label htmlFor="password" className="block text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  onChange={(e) => updateFormData(e)}
                  value={formData.password}
                  name="password"
                  className="w-full p-1 border border-gray-300 focus:outline-none focus:border-blue-500 focus:border-[1px] rounded-sm pr-6.5"
                  id="passwrod"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword((prev) => !prev);
                  }}
                >
                  {showPassword ? (
                    <Eye size={16} className="absolute top-2 right-2" />
                  ) : (
                    <EyeOff size={16} className="absolute top-2 right-2" />
                  )}
                </button>
              </div>
              <FieldError errors={formValidationError.password} />
            </div>
            <div className="mt-3">
              <label htmlFor="confirmPassword" className="block text-sm mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  onChange={(e) => updateFormData(e)}
                  value={formData.confirmPassword}
                  name="confirmPassword"
                  className="w-full p-1 border border-gray-300 focus:outline-none focus:border-blue-500 focus:border-[1px] rounded-sm pr-6.5"
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowConfirmPassword((prev) => !prev);
                  }}
                >
                  {showConfirmPassword ? (
                    <Eye size={16} className="absolute top-2 right-2" />
                  ) : (
                    <EyeOff size={16} className="absolute top-2 right-2" />
                  )}
                </button>
              </div>
              <FieldError errors={formValidationError.confirmPassword} />
            </div>
            <button
              type="submit"
              className="text-sm bg-blue-500 text-white p-2 w-full mt-7 mb-7 rounded-md"
            >
              Sign Up
            </button>
            <p className="text-center text-sm text-gray-500">Already have an account ? <Link to="/login" className="text-blue-500">Login</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
