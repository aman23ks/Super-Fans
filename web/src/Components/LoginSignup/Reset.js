import React from "react";
import { Link } from "react-router-dom";
import avatar from "../../Assets/LoginSignup/profile.png";
import styles from "../../styles/Username.module.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { resetPasswordValidation } from "../../helper/validate";
export default function Reset() {
  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_pwd: ""
    },
    validate: resetPasswordValidation,
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
            <h4 className="text-5xl font-bold">Reset</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter new password.
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                type="password"
                placeholder="Password"
                className={styles.textbox}
              />
              <input
                {...formik.getFieldProps("confirm_pwd")}
                type="password"
                placeholder="Confirm Password"
                className={styles.textbox}
              />
              <button type="submit" className={styles.btn}>
                Lets Go
              </button>
            </div>

            
          </form>
        </div>
      </div>
    </div>
  );
}
