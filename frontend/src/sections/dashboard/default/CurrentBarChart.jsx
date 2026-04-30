import { useTheme } from '@mui/material/styles';

import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from "react";
import { getCurrents } from "services/energyApi";

const xLabels = ["L1", "L2", "L3"];

export default function CurrentBarChart() {
  const theme = useTheme();
  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  const [data, setData] = useState([0, 0, 0, 0]);

  useEffect(() => {
    async function fetchData() {
      try {
        const c = await getCurrents();
        setData([c.l1, c.l2, c.l3]);
        /*setData([
          {
            value: c.l1,
            phase: 'L1',
          },
          {
            value: c.l2,
            phase: 'L2',
          },
          {
            value: c.l3,
            phase: 'L3',
          }
        ]);*/
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
            height={240}
            series={[{ data, animation: true }]}
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
            margin={{ left: -40, right: 0 }}
            sx={{
              '& .MuiBarElement-root:nth-of-type(1)': { fill: theme.palette.warning.main }, // L1
              '& .MuiBarElement-root:nth-of-type(2)': { fill: theme.palette.warning.dark }, // L2
              '& .MuiBarElement-root:nth-of-type(3)': { fill: theme.palette.warning.darker }, // L3
              '& .MuiBarElement-root': { transition: 'opacity 0.3s' },
              '& .MuiBarElement-root:hover': { opacity: 0.6 },
             }}
          />
  );
  
}
