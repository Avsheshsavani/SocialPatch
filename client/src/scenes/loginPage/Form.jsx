import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { GlobalVariable } from "util/globleVariable";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const main_url = GlobalVariable.apiUrl.mailUrl;

const registerSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  location: yup.string().required("Location is required"),
  occupation: yup.string().required("Occupation is required"),
  picture: yup.mixed().required("Profile picture is required")
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required")
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: ""
};

const initialValuesLogin = {
  email: "",
  password: ""
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [loading, setLoading] = useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    try {
      setLoading(true);
      // this allows us to send form info with image
      const formData = new FormData();
      formData.append("file", values.picture);
      formData.append("upload_preset", "social123");

      let url = await axios
        .post(
          "https://api.cloudinary.com/v1_1/dcoypacf9/image/upload",
          formData
        )
        .then((res) => res.data.url)
        .catch((error) => {
          console.log(error);
          throw new Error("Image upload failed. Please try again.");
        });

      delete values["picture"];
      formData.delete("file");
      formData.delete("upload_preset");
      for (const value in values) {
        formData.append(value, values[value]);
      }
      formData.append("picturePath", url);

      const savedUserResponse = await fetch(`${main_url}/auth/register`, {
        method: "POST",
        body: formData
      });

      const savedUser = await savedUserResponse.json();

      if (savedUserResponse.status === 201) {
        setLoading(false);
        toast.success("Successfully Created! Please login.", {
          autoClose: 3000
        });
        onSubmitProps.resetForm();
        setPageType("login");
      } else {
        setLoading(false);
        const errorMessage =
          savedUser.message ||
          savedUser.msg ||
          "Registration failed. Please try again.";
        toast.error(errorMessage, { autoClose: 4000 });
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Registration failed. Please try again.", {
        autoClose: 4000
      });
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      setLoading(true);
      const loggedInResponse = await fetch(`${main_url}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      const loggedIn = await loggedInResponse.json();

      if (loggedInResponse.ok && loggedIn.token) {
        setLoading(false);
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token
          })
        );
        onSubmitProps.resetForm();
        toast.success("Login successful!", { autoClose: 2000 });
        navigate("/home");
      } else {
        setLoading(false);
        const errorMessage =
          loggedIn.message ||
          loggedIn.msg ||
          "Invalid credentials. Please try again.";
        toast.error(errorMessage, { autoClose: 4000 });
      }
    } catch (error) {
      setLoading(false);
      toast.error("Login failed. Please check your connection and try again.", {
        autoClose: 4000
      });
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
      validateOnChange={true}
      validateOnBlur={true}
      validateOnMount={false}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
        setTouched
      }) => {
        const handleFormValidation = (e) => {
          e.preventDefault();
          // Mark all fields as touched to show validation errors
          if (isRegister) {
            setTouched({
              firstName: true,
              lastName: true,
              email: true,
              password: true,
              location: true,
              occupation: true,
              picture: true
            });
          } else {
            setTouched({
              email: true,
              password: true
            });
          }
          handleSubmit(e);
        };

        return (
          <form onSubmit={handleFormValidation}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }
              }}
            >
              {isRegister && (
                <>
                  <TextField
                    label="First Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={
                      Boolean(touched.firstName) && Boolean(errors.firstName)
                    }
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Last Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={
                      Boolean(touched.lastName) && Boolean(errors.lastName)
                    }
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    label="Location"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.location}
                    name="location"
                    error={
                      Boolean(touched.location) && Boolean(errors.location)
                    }
                    helperText={touched.location && errors.location}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <TextField
                    label="Occupation"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.occupation}
                    name="occupation"
                    error={
                      Boolean(touched.occupation) && Boolean(errors.occupation)
                    }
                    helperText={touched.occupation && errors.occupation}
                    sx={{ gridColumn: "span 4" }}
                  />
                  <Box
                    gridColumn="span 4"
                    border={`1px solid ${palette.neutral.medium}`}
                    borderRadius="5px"
                    p="1rem"
                  >
                    <Dropzone
                      acceptedFiles=".jpg,.jpeg,.png"
                      multiple={false}
                      onDrop={(acceptedFiles) =>
                        setFieldValue("picture", acceptedFiles[0])
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <Box
                          {...getRootProps()}
                          border={`2px dashed ${
                            Boolean(touched.picture) && Boolean(errors.picture)
                              ? "#f44336"
                              : palette.primary.main
                          }`}
                          p="1rem"
                          sx={{ "&:hover": { cursor: "pointer" } }}
                        >
                          <input {...getInputProps()} />
                          {!values.picture ? (
                            <p>Add Picture Here</p>
                          ) : (
                            <FlexBetween>
                              <Typography>{values.picture.name}</Typography>
                              <EditOutlinedIcon />
                            </FlexBetween>
                          )}
                        </Box>
                      )}
                    </Dropzone>
                    {Boolean(touched.picture) && Boolean(errors.picture) && (
                      <Typography
                        color="#f44336"
                        fontSize="0.75rem"
                        sx={{ mt: "4px", ml: "14px" }}
                      >
                        {errors.picture}
                      </Typography>
                    )}
                  </Box>
                </>
              )}

              <TextField
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="Password"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>

            {/* BUTTONS */}
            <Box>
              <Button
                fullWidth
                disabled={loading}
                type="submit"
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": {
                    backgroundColor: palette.primary.dark,
                    color: palette.background.alt
                  }
                }}
              >
                {isLogin ? "LOGIN" : "REGISTER"}
              </Button>
              <Typography
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light
                  }
                }}
              >
                {isLogin
                  ? "Don't have an account? Sign Up here."
                  : "Already have an account? Login here."}
              </Typography>
            </Box>
            <ToastContainer />
          </form>
        );
      }}
    </Formik>
  );
};

export default Form;
