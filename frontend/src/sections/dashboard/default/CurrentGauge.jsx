import { useTheme } from "@mui/material/styles";
import { Gauge } from "@mui/x-charts/Gauge";
import { useEffect, useState } from "react";
import { getCurrents } from "services/energyApi";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function VoltageGauge() {
  const theme = useTheme();
  const [data, setData] = useState({ l1: 0, l2: 0, l3: 0});

  useEffect(() => {
    async function fetchData() {
      try {
        const c = await getCurrents();
        setData(c);
      } catch (err) {
        console.error("Error al cargar voltajes", err);
      }
    }
    fetchData();
    const id = setInterval(fetchData, 60000);
    return () => clearInterval(id);
  }, []);

  const renderGauge = (label, value, max=260) => (
    <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
      <Typography variant="subtitle2" gutterBottom sx={{ fontSize: 12, color: "text.secondary", mb: 0}}>
        {label}
      </Typography>
      <Gauge
        value={value}
        outerRadius={28}
        innerRadius={45}
        cornerRadius={1}
        valueMax={max}
        startAngle={-110}
        endAngle={110}
        width={100}
        height={100}
        sx={{
          [`& .MuiGauge-valueText`]: {
            fontSize: 12,
            fontWeight: "bold",
          },
          [`& .MuiGauge-valueArc`]: {
            fill: theme.palette.primary.main, // 🔵 Azul (puede ser cualquier color HEX o del theme)
          },
          [`& .MuiGauge-referenceArc`]: {
            fill: "#e0e0e0", // ⚪ color de fondo del gauge
          }
        }}
        text={({ value }) => `${value} V`}
      />
    </Grid>
  );

  const phases = [
    { key: "l1", label: "I-L1" },
    { key: "l2", label: "I-L2" },
    { key: "l3", label: "I-L3" },
  ];

  return (
    <>
    <Grid container spacing={4} justifyContent="center">
      {/* 🔹 Primera fila: L1-N, L2-N, L3-N */}
      {renderGauge("I-L1", data.l1, 10)}
      {renderGauge("I-L2", data.l2, 10)}
      {renderGauge("I-L3", data.l3, 10)}
    </Grid>
    </>
  );
}
