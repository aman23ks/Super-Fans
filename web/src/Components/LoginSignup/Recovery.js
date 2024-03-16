import React from "react";
import { Link } from "react-router-dom";
import avatar from "../../Assets/LoginSignup/profile.png";
import styles from "../../styles/Username.module.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidate } from "../../helper/validate";
export default function Recovery() {
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => [console.log(values)],
  });

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div
        className="flex justify-center items-center"
        style={{ height: "55rem" }}
      >
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Recovery</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter OTP to recover password
            </span>
          </div>

          <form className="pt-20 ">

            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
              <span className="py-4 text-sm text-left text-gray-500"> Enter OTP sent at your email address</span>
              <input
                type="text"
                placeholder="OTP"
                className={styles.textbox}
              />
              </div>
              
              <button type="submit" className={styles.btn}>
                Lets Go
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Can't get OTP?
                <button className="text-red-500" to="/register">
                  Resend
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
