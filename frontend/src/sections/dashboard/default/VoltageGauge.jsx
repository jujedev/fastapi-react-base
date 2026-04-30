import { useTheme } from "@mui/material/styles";
import { Gauge } from "@mui/x-charts/Gauge";
import { useEffect, useState } from "react";
import { getVoltages } from "services/energyApi";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function VoltageGauge() {
  const theme = useTheme();
  const [data, setData] = useState({ l1: 0, l2: 0, l3: 0, l12: 0, l23: 0, l31: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        const v = await getVoltages();
        setData(v);
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
    { key: "l1n", label: "L1-N" },
    { key: "l2n", label: "L2-N" },
    { key: "l3n", label: "L3-N" },
  ];

  return (
    <>
    <Grid container spacing={1} justifyContent="space-around">
      {/* 🔹 Primera fila: L1-N, L2-N, L3-N */}
      {renderGauge("L1-N", data.l1n)}
      {renderGauge("L2-N", data.l2n)}
      {renderGauge("L3-N", data.l3n)}
    </Grid>
    <Grid container spacing={1} justifyContent="space-around">
      {/* 🔹 Segunda fila: L1-L2, L2-L3, L3-L1 */}
      {renderGauge("L1-L2", data.l1l2, 450)} {/* máx. 450 V aprox */}
      {renderGauge("L2-L3", data.l2l3, 450)}
      {renderGauge("L3-L1", data.l3l1, 450)}
    </Grid>
    </>
  );
}
