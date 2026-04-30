import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { api } from '../../api/client';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// TODO: cambiar la ruta de redirección post-login según el proyecto
const POST_LOGIN_ROUTE = '/dashboard';

function TransitionRight(props) {
  return <Slide {...props} direction="left" />;
}

export default function AuthLogin() {
  const navigate = useNavigate();
  const [checked, setChecked] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <>
      <Formik
        initialValues={{ email: '', password: '', submit: null }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Debe ser un email válido').max(255).required('El email es requerido'),
          password: Yup.string()
            .required('La contraseña es requerida')
            .test('no-spaces', 'No puede comenzar o terminar con espacios', (v) => v === v?.trim())
            .max(50, 'Máximo 50 caracteres')
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await api.post('/auth/login', {
              email: values.email,
              password: values.password
            });

            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);

            setSuccessOpen(true);
            setTimeout(() => navigate(POST_LOGIN_ROUTE), 1000);
          } catch (err) {
            const msg = err.response?.data?.detail || 'Error al iniciar sesión';
            setSnackbarMessage(msg);
            setSnackbarOpen(true);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="email-login">Email</InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="ejemplo@email.com"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error>{errors.email}</FormHelperText>
                )}
              </Grid>

              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="password-login">Contraseña</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Ingresá tu contraseña"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error>{errors.password}</FormHelperText>
                )}
              </Grid>

              <Grid sx={{ mt: -1 }} size={12}>
                <Stack direction="row" sx={{ gap: 2, alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="h6">Mantener sesión</Typography>}
                  />
                  <Link variant="h6" component={RouterLink} to="#" color="text.primary">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Stack>
              </Grid>

              <Grid size={12}>
                <AnimateButton>
                  <Button fullWidth type="submit" size="large" variant="contained" color="primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Ingresando...' : 'Ingresar'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      <Snackbar open={snackbarOpen} autoHideDuration={3500} onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} TransitionComponent={TransitionRight}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar open={successOpen} autoHideDuration={1500} onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} TransitionComponent={TransitionRight}>
        <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
          ¡Bienvenido! Redirigiendo...
        </Alert>
      </Snackbar>
    </>
  );
}

AuthLogin.propTypes = { isDemo: PropTypes.bool };