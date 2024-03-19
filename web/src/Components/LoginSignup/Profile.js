import React, { useState } from "react";
import { Link } from "react-router-dom";
import avatar from "../../Assets/LoginSignup/profile.png";
import styles from "../../styles/Username.module.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidation } from "../../helper/validate";
import convertToBase64 from "../../helper/convert";
export default function Profile() {

  const [file, setFile] = useState()

  const formik = useFormik({
    initialValues: {
      firstName: "",
    },
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => [
      values = await Object.assign(values, {profile : file || ''}),
      console.log(values)],
  });

  /** img upload event handler */
  const onUpload = async e => {
    if(e.target.files && e.target.files.length === 0) {
      return;
    }
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div
        className="flex justify-center items-center"
        style={{ height: "68rem" }}
      >
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Profile</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Complete your registeration!
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">                
              <img src={file || avatar} className={styles.profile_img} alt="avatar" />
              </label>
              <input onChange={onUpload} id="profile" type="file" name="profile"/>
            </div>

            <div className="textbox flex flex-col items-center gap-6">

              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("First Name")}
                  type="text"
                  placeholder="First Name"
                  className={styles.textbox}
                />
                <input
                  {...formik.getFieldProps("Last Name")}
                  type="text"
                  placeholder="Last Name"
                  className={styles.textbox}
                />
              </div>
              
              <button type="submit" className={styles.btn}>
                Register
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                come back later?{" "}
                <Link className="text-red-500" to="/">
                  Logout
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
