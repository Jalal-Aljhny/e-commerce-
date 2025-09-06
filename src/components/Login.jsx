import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MainContext } from "../services/context/MainContext";
const Login = () => {
  const {
    logIn: login,
    validateEmail,
    loginError,
    clearLoginError,
  } = useContext(MainContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSumbit = (data) => {
    login(data.email, data.password, rememberMe);
  };
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  return (
    <form
      className={`form ${
        loginError?.length > 0 || Object.keys(errors).length > 0 ? "error" : ""
      }`}
      onSubmit={handleSubmit(onSumbit)}
    >
      <h2>Log IN</h2>

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
          className={errors.email ? "error" : null}
          onChange={() => {
            clearLoginError();
          }}
        />
        {errors.email?.type == "required" ? (
          <small className="error__message">Email cannot be empty.</small>
        ) : null}
        {errors.email?.type == "validate" ? (
          <small className="error__message">This is not a valid email.</small>
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
          })}
          className={errors.password ? "error" : null}
          onFocus={() => {
            setShowIcon(true);
          }}
          onChange={() => {
            clearLoginError();
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
                  ? { top: "27%" }
                  : errors.password?.type == "required"
                  ? { top: "54%" }
                  : loginError?.length > 0
                  ? { top: "62%" }
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
                  ? { top: "27%" }
                  : errors.password?.type == "required"
                  ? { top: "54%" }
                  : loginError?.length > 0
                  ? { top: "62%" }
                  : null
              }
            />
          )
        ) : null}
        {errors.password?.type == "required" ? (
          <small className="error__message">Password cannot be empty.</small>
        ) : null}
      </div>
      {loginError?.length > 0 ? (
        <small className="error">{loginError}</small>
      ) : null}
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
            console.log("remember:", event.target.checked);
          }}
          style={{
            width: "15px",
            height: "15px",
          }}
        />
      </div>
      <button className="submit" type="submit">
        Log In
      </button>
    </form>
  );
};
export default Login;
