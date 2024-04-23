import React, { useState } from 'react';
import { Box, TextField, InputLabel, Input, InputAdornment, IconButton, FormControl } from "@mui/material";
import { AccountCircle, VisibilityOff, Visibility } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Login = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const navi = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token);
      setIsLoggingIn(false);
      navi("/"); // Redirect to the desired page upon successful login
    } catch (error) {
      setIsLoggingIn(false);
      if (error?.response?.status === 401) {
        setError("Invalid Password !");
      } else if (error?.response?.status === 404) {
        setError("Email ID not Found Register First.");
      } else if (error?.response?.status === 422) {
        setError("One or more Fields are Wrong");
      } else {
        setError("Something Wrong at Our End, Try Again Later");
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values) => {
    setIsLoggingIn(true);
    const { email, password } = values;
    handleLogin(email, password);
  };

  return (
    <form
      className="flex flex-col justify-center items-center"
      onSubmit={handleSubmit}
    >
      <div className="font-raj font-bold md:text-2xl text-xl py-1 px-6 border-b-2 border-indigo-400 uppercase animate__animated animate__rubberBand animate__delay-1s animate__repeat-2 animate__slow select-none">
        Login
      </div>
      <div className="w-full flex flex-col items-center gap-3">
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyItems: "center",
            width: "100%",
          }}
        >
          <AccountCircle
            sx={{ color: "action.active", marginRight: 1, fontSize: 30 }}
          />
          <TextField
            id="emailinput"
            label="Email"
            variant="standard"
            type="email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{ width: "100%" }}
          />
        </Box>
        <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
          <InputLabel htmlFor="password">Enter Password</InputLabel>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            error={formik.touched.password && Boolean(formik.errors.password)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          {formik.touched.password && (
            <span className="text-red-600 text-xs font-serif mt-1">
              {formik.errors.password}
            </span>
          )}
        </FormControl>
        <Link to={"/forgot"} className="self-end font-ysb font-semibold -mt-5">
          <span className="text-indigo-600 hover:border-b-2 border-b-indigo-500">Forgot Password ?</span>
        </Link>
        {isLoggingIn ? (
          <PleaseWait />
        ) : (
          <button
            type="submit"
            name="submit"
            className="border-2 border-indigo-500 px-11 mt-2 rounded-lg py-2 font-meri text-sm hover:bg-indigo-500 hover:text-white transition-{bg} ease-in duration-150"
            disabled={isLoggingIn}
          >
            Login
          </button>
        )}
        {error && <span className="text-red-600 text-xs font-serif mt-1">{error}</span>}
      </div>
    </form>
  );
};
