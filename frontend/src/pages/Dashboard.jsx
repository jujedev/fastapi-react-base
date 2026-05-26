import { useAuth } from "../contexts/AuthContext";
import { Box, Typography, Paper } from "@mui/material";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Dashboard
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="h6">
          Bienvenido, {user?.nombre} 👋
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Rol: {user?.rol}
        </Typography>
      </Paper>
    </Box>
  );
}