import React, { useState, useContext } from "react";
import { useSnackbar } from "notistack";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { GlobalDispatchContext } from "./Context/GlobalContext";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import logo from "./Images/logo512.png";
import {
  AccountCircle,
  AlternateEmail,
  Visibility,
  VisibilityOff,
} from "@material-ui/icons";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import SnackBarContent from "./Components/SnackBarContent";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    color: theme.palette.text.primary,
  },
  center: {
    textAlign: "center",
  },
  margin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  fieldIcon: {
    color: theme.palette.text.hint,
  },
  eye: {
    padding: "0px",
    color: theme.palette.text.hint,
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  secondaryActon: {
    color: theme.palette.secondary.main,
    textDecoration: "none",
  },
}));

const SignUp = () => {
  const classes = useStyles();
  const dispatch = useContext(GlobalDispatchContext);
  const { enqueueSnackbar } = useSnackbar();
  const [redirect, setRedirect] = useState(false);

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    confirmPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    if (prop === "confirmPassword") {
      if (values.password === event.target.value) {
        setFieldErrors({ ...fieldErrors, confirmPassword: false });
      } else {
        setFieldErrors({ ...fieldErrors, confirmPassword: true });
      }
    } else if (prop === "email") {
      var re = /\S+@\S+\.\S+/;
      if (re.test(event.target.value)) {
        setFieldErrors({ ...fieldErrors, email: false });
      } else {
        setFieldErrors({ ...fieldErrors, email: true });
      }
    }
  };

  const handleClickShowPassword = (which) => () => {
    setValues({ ...values, [which]: !values[which] });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = values;
    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword !== ""
    ) {
      const { email, confirmPassword } = fieldErrors;
      if (!email && !confirmPassword) {
        //submit req
        console.log("submit req");
        fetch("/.netlify/functions/signup", {
          method: "POST",
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        })
          .then((res) => res.json())
          .then((parsedRes) => {
            if (parsedRes.err) {
              enqueueSnackbar(parsedRes.err, {
                content: (
                  <SnackBarContent
                    id={Math.random}
                    message={parsedRes.err}
                    variant="error"
                  />
                ),
              });
            } else {
              const {
                token,
                user: { name },
              } = parsedRes;
              dispatch({
                type: "SIGN_UP_COMPLETE",
                payload: {
                  token,
                  name,
                },
              });
              setRedirect(true);
            }
          });
      } else {
        // validation error
        enqueueSnackbar("Validation error", {
          content: (
            <SnackBarContent
              id={Math.random}
              message="Validation error"
              variant="error"
            />
          ),
        });
      }
    } else {
      enqueueSnackbar("Somthing is empty", {
        content: (
          <SnackBarContent
            id={Math.random}
            message="Somthing is empty"
            variant="error"
          />
        ),
      });
    }
  };
  return (
    <>
      {redirect ? <Redirect push to="/" /> : ""}
      <div className={classes.root}>
        <Container maxWidth="sm" className={classes.center}>
          <img className="signORligin-logo" src={logo} alt="logo" />
          <h2>Todo Task</h2>
          <h3>Welcome, let's sign you up...</h3>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Name"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle className={classes.fieldIcon} />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleChange("name")}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  error={fieldErrors.email}
                  helperText="email not valid"
                  FormHelperTextProps={{ hidden: !fieldErrors.email }}
                  type="email"
                  label="Email"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmail className={classes.fieldIcon} />
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleChange("email")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Password"
                  type={values.showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          aria-label="toggle password visibility"
                          className={classes.eye}
                          onClick={handleClickShowPassword("showPassword")}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleChange("password")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  error={fieldErrors.confirmPassword}
                  helperText="password not matched"
                  FormHelperTextProps={{ hidden: !fieldErrors.confirmPassword }}
                  label="Confirm Password"
                  type={values.showConfirmPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          aria-label="toggle password visibility"
                          className={classes.eye}
                          onClick={handleClickShowPassword(
                            "showConfirmPassword"
                          )}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onChange={handleChange("confirmPassword")}
                />
              </Grid>
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="allowExtraEmails"
                      color="secondary"
                      checked
                    />
                  }
                  label="Remember me"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign Up
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link
                  to="/sign-in"
                  variant="body2"
                  className={classes.secondaryActon}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </form>
        </Container>
      </div>
    </>
  );
};

export default SignUp;
