import { useTheme } from '@mui/material/styles';

import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from "react";
import { getPowerFactor } from "services/energyApi";

const xLabels = ["L1", "L2", "L3", "Total"];

export default function PowerFactorBarChart() {
  const theme = useTheme();
  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  const [data, setData] = useState([0, 0, 0, 0]);

  useEffect(() => {
    async function fetchData() {
      try {
        const pf = await getPowerFactor();
        setData([pf.l1, pf.l2, pf.l3, pf.total]);
      } catch (err) {
        console.error("Error al cargar Power Factor", err);
      }
    }

    fetchData();
    const id = setInterval(fetchData, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <BarChart
      hideLegend
      height={280}
      series={[{ data, label: 'Factor de Potencia', animation: true }]}
      xAxis={[
        {
          data: xLabels,
          scaleType: 'band',
          disableLine: true,
          disableTicks: true,
          //tickLabelStyle: axisFonstyle
          tickLabelStyle: { fill: theme.palette.secondary[600] }
        }
      ]}
      yAxis={[{
        disableLine: true,
        disableTicks: true,
        disableLabels: true
        //lineStyle: { stroke: theme.palette.secondary.lighter, strokeWidth: 1, opacity: 0.3 }, // línea Y
        //tickStyle: { stroke: theme.palette.secondary.lighter }, // palitos de los ticks
        //tickLabelStyle: { fill: theme.palette.secondary.light, fontSize: 11, opacity: 0.6 }, // texto de ticks
      }]}
      barLabel="value"
      slotProps={{
        bar: { rx: 4, ry: 4 },
        barLabel: { style: { fill: 'white' } }
      }}
      axisHighlight={{ x: 'none' }}
      margin={{ left: -39, right: 10 }}
       //colors={['#4CAF50', '#F44336', '#FFC107', '#2196F3']}
      sx={{

        '& .MuiBarElement-root:nth-of-type(1)': { fill: theme.palette.primary.light }, // L1
        '& .MuiBarElement-root:nth-of-type(2)': { fill: theme.palette.primary[400] }, // L2
        '& .MuiBarElement-root:nth-of-type(3)': { fill: theme.palette.primary.main }, // L3
        '& .MuiBarElement-root:nth-of-type(4)': { fill: theme.palette.primary.dark }, // Total
        '& .MuiBarElement-root': { transition: 'opacity 0.3s' },
        '& .MuiBarElement-root:hover': { opacity: 0.6 },
       }}
    />
  );
}
