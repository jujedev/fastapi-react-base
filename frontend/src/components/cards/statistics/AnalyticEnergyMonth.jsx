import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { getActiveEnergyImportedMonth, getActiveEnergyImportedPreviousMonth } from "services/energyApi";
// material-ui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';

// assets
import RiseOutlined from '@ant-design/icons/RiseOutlined';
import FallOutlined from '@ant-design/icons/FallOutlined';

const iconSX = { fontSize: '0.75rem', color: 'inherit', marginLeft: 0, marginRight: 0 };

export default function AnalyticEnergyMonth({ color = 'primary', title, count, percentage, isLoss, extra }) {
  
  const [month, setMonth] = useState(0);
  const [previousMonth, setPreviousMonth] = useState(0);

  useEffect(() => {
      async function fetchData() {
        try {
          const monthValue = await getActiveEnergyImportedMonth();
          const previousMonthValue = await getActiveEnergyImportedPreviousMonth();
          setMonth(monthValue);
          setPreviousMonth(previousMonthValue)
        } catch (err) {
          console.error("Error cargando energía", err);
        }
      }
      fetchData();
    }, []);

  const variation = previousMonth > 0 ? ((month - previousMonth) / previousMonth) * 100 : 0;

  return (
    <>
    <MainCard contentSX={{ p: 2.25 }} sx={{border: 'none'}}>
      <Stack sx={{ gap: 1.5 }}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Grid container alignItems="center">
          <Grid>
            <Typography variant="h4" color="inherit">
              {`${month.toFixed(2)} kWh`}
            </Typography>
          </Grid>
          {percentage && (
            <Grid>
              <Chip
                variant="combined"
                color={variation < 0 ? "success" : "error"}
                icon={variation < 0 ? <FallOutlined style={iconSX} /> : <RiseOutlined style={iconSX} />}
                label={`Consumo: ${variation.toFixed(2)}%`}
                sx={{ ml: 1.25, pl: 1 }}
                size="small"
              />
            </Grid>
          )}
        </Grid>
      </Stack>
      <Box sx={{ pt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Su consumo el mes pasado: {' '}
          <Typography variant="caption" sx={{ color: `${color || 'primary'}.main` }}>
            {previousMonth.toFixed(2)}
          </Typography>{' '}
          kWh
        </Typography>
      </Box>
    </MainCard>
    </>
  );
}

AnalyticEnergyMonth.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.string,
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.string
};
