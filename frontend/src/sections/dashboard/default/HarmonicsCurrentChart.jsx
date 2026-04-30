import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { LineChart } from "@mui/x-charts/LineChart";
import { getCurrentHarmonics } from "services/energyApi";

function Legend({ items, onToggle }) {
  return (
    <Stack
      direction="row"
      sx={{ gap: 2, alignItems: "center", justifyContent: "center", mt: 2.5, mb: 1.5 }}
    >
      {items.map((item) => (
        <Stack
          key={item.label}
          direction="row"
          sx={{ gap: 1.25, alignItems: "center", cursor: "pointer" }}
          onClick={() => onToggle(item.label)}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              bgcolor: item.visible ? item.color : "grey.500",
              borderRadius: "50%",
            }}
          />
          <Typography variant="body2" color="text.primary">
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

function toLocalTime(utcString) {
    return new Date(utcString).toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

export default function HarmonicsCurrentChart({ range }) {
  const theme = useTheme();
  const [data, setData] = useState([]);

  const [visibility, setVisibility] = useState({
    L1: true,
    L2: true,
    L3: true,
    Total: true,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getCurrentHarmonics(range);
        setData(result);
      } catch (err) {
        console.error("Error cargando potencia activa", err);
      }
    }
    fetchData();
    const id = setInterval(fetchData, 60000);
    return () => clearInterval(id);
  }, [range]);

  const times = data.map((d) => toLocalTime(d.time));
  const l1 = data.map((d) => d.l1);
  const l2 = data.map((d) => d.l2);
  const l3 = data.map((d) => d.l3);

  const toggleVisibility = (label) => {
    setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const series = [
    {
      data: l1,
      label: "L1",
      area: true,
      showMark: false,
      color: theme.palette.primary.dark,
      id: "L1",
      visible: visibility.L1,
    },
    {
      data: l2,
      label: "L2",
      area: true,
      showMark: false,
      color: theme.palette.success.dark,
      id: "L2",
      visible: visibility.L2,
    },
    {
      data: l3,
      label: "L3",
      area: true,
      showMark: false,
      color: theme.palette.error.dark,
      id: "L3",
      visible: visibility.L3,
    },
  ];

  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };
  const line = theme.palette.divider;

  return (
    <>
      <LineChart
        hideLegend
        grid={{ horizontal: true }}
        xAxis={[{ scaleType: "point", data: times, disableLine: true, tickLabelStyle: axisFonstyle }]}
        yAxis={[{ disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
        height={450}
        margin={{ top: 40, bottom: -5, right: 20, left: 5 }}
        series={series
          .filter((s) => s.visible)
          .map((s) => ({
            type: "line",
            data: s.data,
            label: s.label,
            showMark: s.showMark,
            area: s.area,
            id: s.id,
            color: s.color,
            stroke: s.color,
            strokeWidth: 2,
          }))}
        sx={{
          "& .MuiAreaElement-series-L1": {
            fill: "url('#gradientl1')",
            strokeWidth: 2,
            opacity: 0.8,
          },
          "& .MuiAreaElement-series-L2": {
            fill: "url('#gradientl2')",
            strokeWidth: 2,
            opacity: 0.8,
          },
          "& .MuiAreaElement-series-L3": {
            fill: "url('#gradientl3')",
            strokeWidth: 2,
            opacity: 0.8,
          },
          "& .MuiAreaElement-series-Total": {
            fill: "url('#gradientTotal')",
            strokeWidth: 2,
            opacity: 0.8,
          },
          "& .MuiChartsAxis-directionX .MuiChartsAxis-tick": { stroke: line },
        }}
      >
        <defs>
          <linearGradient id="gradientl1" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha(theme.palette.primary.darker, 0.4)} />
            <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
          </linearGradient>
          <linearGradient id="gradientl2" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha(theme.palette.success.dark, 0.4)} />
            <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
          </linearGradient>
          <linearGradient id="gradientl3" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha(theme.palette.error.dark, 0.4)} />
            <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
          </linearGradient>
        </defs>
      </LineChart>
      <Legend items={series} onToggle={toggleVisibility} />
    </>
  );
}

Legend.propTypes = { items: PropTypes.array, onToggle: PropTypes.func };
HarmonicsCurrentChart.propTypes = { range: PropTypes.string };
