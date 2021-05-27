import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { GlobalDispatchContext } from "./Context/GlobalContext";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import logo from "./Images/logo512.png";
import { AlternateEmail, Visibility, VisibilityOff } from "@material-ui/icons";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
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
    color: "rgba(0, 0, 0, 0.54)",
  },
  eye: {
    padding: "0px",
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
}));

const SignIn = () => {
  const classes = useStyles();
  const dispatch = useContext(GlobalDispatchContext);
  const [redirect, setRedirect] = useState(false);

  const [values, setValues] = useState({
    email:
      process.env.REACT_APP_MODE.toLowerCase() === "guest"
        ? process.env.REACT_APP_GUEST_EMAIL
        : "",
    password:
      process.env.REACT_APP_MODE.toLowerCase() === "guest"
        ? process.env.REACT_APP_GUEST_PASSWORD
        : "",
    showPassword: false,
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    if (prop === "password") {
      if (event.target.value === "") {
        setFieldErrors({ ...fieldErrors, password: true });
      } else {
        setFieldErrors({ ...fieldErrors, password: false });
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

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = values;
    if (email !== "" && password !== "") {
      const { email, confirmPassword } = fieldErrors;
      if (!email && !confirmPassword) {
        //submit req
        console.log("submit req");
        fetch("/.netlify/functions/auth", {
          method: "POST",
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        })
          .then((res) => res.json())
          .then(({ token, user: { name } }) => {
            dispatch({
              type: "SIGN_IN_COMPLETE",
              payload: {
                token,
                name,
              },
            });
            setRedirect(true);
          });
      } else {
        // validation error
        console.log(" validation error");
      }
    } else {
      console.log("somthing is empty");
    }
  };

  return (
    <>
      {redirect ? <Redirect push to="/" /> : ""}
      <div className={classes.root}>
        <Container maxWidth="sm" className={classes.center}>
          <img className="signORligin-logo" src={logo} alt="logo" />
          <h2>Todo Task</h2>
          <h3>Welcome back, let's sign you in...</h3>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  error={fieldErrors.email}
                  helperText="email not valid"
                  FormHelperTextProps={{ hidden: !fieldErrors.email }}
                  label="Email"
                  value={values.email}
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
                  error={fieldErrors.password}
                  helperText="password can not be empty"
                  FormHelperTextProps={{ hidden: !fieldErrors.password }}
                  label="Password"
                  value={values.password}
                  type={values.showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          aria-label="toggle password visibility"
                          className={classes.eye}
                          onClick={handleClickShowPassword}
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
              <Grid item xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="allowExtraEmails"
                      color="primary"
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
              Sign In
            </Button>
            <Grid container justify="flex-end">
              <Grid item>
                <Link to="/sign-up" variant="body2">
                  Don't have an account? Sign up
                </Link>
              </Grid>
            </Grid>
          </form>
        </Container>
      </div>
    </>
  );
};

export default SignIn;
