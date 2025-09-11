import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { use, useState } from "react";
import { MainContext } from "../services/context/MainContext";
import { Box } from "@mui/material";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const {
    validateEmail,
    validatePassword,
    passwordErrors,
    validateUserName,
    register: SignUp,
    registerError,
    clearRegisterError,
  } = use(MainContext);

  const onSumbit = (data) => {
    SignUp(
      data.username,
      data.email,
      data.password,
      data.password2,
      rememberMe
      // image,
      // data.bio,
      // data.city,
      // data.country,
      // data.phone
    );
  };
  // const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  // const [password , setPassword] = useState()
  const validatePasswordConfirmation = (confirmValue) => {
    const password = watch("password");
    return password === confirmValue;
  };

  return (
    <form
      className={`form ${
        registerError?.length || Object.keys(errors).length > 0 ? "error" : ""
      }`}
      onSubmit={handleSubmit(onSumbit)}
    >
      <h2>Register</h2>
      <div className="form-group">
        <label htmlFor="username">User Name</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="User Name"
          {...register("username", {
            required: true,
            validate: validateUserName,
          })}
          className={errors.username ? "error" : null}
        />
        {errors.username?.type == "required" ? (
          <small className="error__message">User name cannot be empty.</small>
        ) : null}
        {errors.username?.type == "validate" ? (
          <small className="error__message">
            User name should started with letter.
          </small>
        ) : null}
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          placeholder="Your Email"
          {...register("email", {
            required: true,
            validate: validateEmail,
          })}
          className={registerError?.length > 0 || errors.email ? "error" : null}
          onChange={() => {
            clearRegisterError();
          }}
        />
        {errors.email?.type == "required" ? (
          <small className="error__message">Email cannot be empty.</small>
        ) : null}
        {errors.email?.type == "validate" ? (
          <small className="error__message">This is not a valid email.</small>
        ) : null}
        {registerError?.length > 0 ? (
          <small className="error__message">{registerError}</small>
        ) : null}
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          placeholder="Password"
          {...register("password", {
            required: true,
            validate: validatePassword,
          })}
          className={errors.password ? "error" : null}
          onFocus={() => {
            setShowIcon(true);
          }}
        />
        {showIcon ? (
          !showPassword ? (
            <FiEye
              className="show__icon"
              onClick={() => {
                setShowPassword(true);
              }}
              style={
                errors.password?.type == "validate"
                  ? { top: "35%" }
                  : errors.password?.type == "required"
                  ? { top: "52%" }
                  : null
              }
            />
          ) : (
            <FiEyeOff
              className="show__icon"
              onClick={() => {
                setShowPassword(false);
              }}
              style={
                errors.password?.type == "validate"
                  ? { top: "35%" }
                  : errors.password?.type == "required"
                  ? { top: "52%" }
                  : null
              }
            />
          )
        ) : null}
        {errors.password?.type == "required" ? (
          <small className="error__message">Password cannot be empty.</small>
        ) : null}
        {errors.password?.type == "validate" ? (
          <ul>
            {passwordErrors.length > 0
              ? passwordErrors.map((err) => {
                  return (
                    <li className="error" key={err}>
                      {err}
                    </li>
                  );
                })
              : null}
          </ul>
        ) : null}
      </div>
      <div className="form-group">
        <label htmlFor="password2">Password Confirm</label>
        <input
          type={showPassword2 ? "text" : "password"}
          name="password2"
          id="password2"
          placeholder="Password Confirm"
          {...register("password2", {
            required: true,
            validate: validatePasswordConfirmation,
          })}
          className={errors.password2 ? "error" : null}
          onFocus={() => {
            setShowIcon(true);
          }}
        />
        {showIcon ? (
          !showPassword2 ? (
            <FiEye
              className="show__icon"
              onClick={() => {
                setShowPassword2(true);
              }}
              style={errors.password2 ? { top: "52%" } : null}
            />
          ) : (
            <FiEyeOff
              className="show__icon"
              onClick={() => {
                setShowPassword2(false);
              }}
              style={errors.password2 ? { top: "52%" } : null}
            />
          )
        ) : null}
        {errors.password2?.type == "required" ? (
          <small className="error__message">
            Password confirm cannot be empty.
          </small>
        ) : null}
        {errors.password2?.type == "validate" ? (
          <small className="error__message">
            Does not match the password field
          </small>
        ) : null}
      </div>

      {/* <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          id="phone"
          placeholder="Phone number"
          {...register("phone")}
          defaultValue="" // example default
        />
      </div>
      <div className="form-group">
        <label htmlFor="country">Country</label>
        <input
          type="text"
          id="country"
          placeholder="Country"
          {...register("country")}
          defaultValue=""
        />
      </div>
      <div className="form-group">
        <label htmlFor="city">City</label>
        <input
          type="text"
          id="city"
          placeholder="City"
          {...register("city")}
          defaultValue=""
        />
      </div>
      <div className="form-group">
        <label htmlFor="image">ٍSelect Image </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setImage(e.target.files[0]);
          }}
        />
        {image && (
          <Box
            component="img"
            src={URL.createObjectURL(image)}
            alt="Preview"
            sx={{
              maxWidth: "100%",
              maxHeight: 200,
              borderRadius: 1,
              ml: 2,
            }}
          />
        )}
      </div> */}
      <div
        className="form-group"
        style={{
          flexDirection: "row",
          gap: "1rem",
          alignItems: "flex-end",
        }}
      >
        <label htmlFor="remember">Remember me</label>
        <input
          type="checkbox"
          id="remember"
          checked={rememberMe}
          onChange={(event) => {
            setRememberMe(event.target.checked);
            // console.log("remember:", event.target.checked);
          }}
          style={{
            width: "15px",
            height: "15px",
          }}
        />
      </div>
      {/* <div className="form-group">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          placeholder="Tell us about yourself"
          {...register("bio")}
          defaultValue={null}
          style={{ padding: "1rem" }}
        />
      </div> */}
      <button className="submit" type="submit">
        Register
      </button>
      <Link
        to={"/login"}
        style={{
          color: "#1565d8",
          fontSize: "0.7rem",
          fontWeight: "bold",
          marginTop: "-1rem",
        }}
      >
        Already have an account
      </Link>
    </form>
  );
};
export default SignUp;
