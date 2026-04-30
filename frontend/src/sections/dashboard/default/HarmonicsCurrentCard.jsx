import { useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import MainCard from "components/MainCard";
import HarmonicsCurrentChart from "./HarmonicsCurrentChart";

export default function HarmonicsCurrentCard() {
  const [range, setRange] = useState("1h"); // puede ser "1h", "24h", "7d"

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between" > 
        <Grid>
          <Typography variant="h5">Armónicos de Corriente</Typography>
        </Grid>
        <Grid>
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <Button
              size="small"
              onClick={() => setRange("1h")}
              color={range === "1h" ? "primary" : "secondary"}
              variant={range === "1h" ? "outlined" : "text"}
            >
              Hora
            </Button>
            <Button
              size="small"
              onClick={() => setRange("24h")}
              color={range === "24h" ? "primary" : "secondary"}
              variant={range === "24h" ? "outlined" : "text"}
            >
              Día
            </Button>
            <Button
              size="small"
              onClick={() => setRange("7d")}
              color={range === "7d" ? "primary" : "secondary"}
              variant={range === "7d" ? "outlined" : "text"}
            >
              Semana
            </Button>
          </Stack>
        </Grid>
      </Grid>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <HarmonicsCurrentChart range={range} />
        </Box>
      </MainCard>
    </>
  );
}
