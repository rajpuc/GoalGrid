import React, { useState } from "react";
import images from "../../assets/images";
import toast from "react-hot-toast";
import useAuthenticationStore from "../../store/useAuthenticationStore";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword,setShowPassword] = useState(false);
  const { signIn } = useAuthenticationStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function updateFormData(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function clearFormData() {
    setFormData({
      email: "",
      password: "",
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Enter your email.");
      return;
    } else if (!formData.password) {
      toast.error("Enter password");
      return;
    }

    const isSuccess = await signIn(formData);

    if (isSuccess) {
      clearFormData();
      navigate("/");
    }
  }
  return (
    <div className="w-screen min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2 h-fit p-2 max-w-lg w-full mx-3 sm:mx-0 shadow-lg rounded-md">
        <div className="relative ">
          <div className="flex justify-between bg-blue-100 rounded-tl-md rounded-tr-md ">
            <div className="flex flex-col justify-center pl-2.5">
              <h5 className="text-base font-bold text-blue-500">
                Welcome Back !
              </h5>
              <p className="text-[10px]">Sign in to continue to Rafid-Seeds</p>
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
                className="w-full h-full mt-2 ml-1.5"
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
          >
            <div>
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
            </div>
            <button
              type="submit"
              className="text-sm bg-blue-500 text-white p-2 w-full mt-7 mb-7 rounded-md"
            >
              Sign In
            </button>
            <p className="text-center text-sm text-gray-500">Don't have an account ?<Link to="/registration" className="text-blue-500"> Signup now</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
