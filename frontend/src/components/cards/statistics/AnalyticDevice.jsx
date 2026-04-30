import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

export default function AnalyticDevice({ title, data }) {
  return (
    <Card sx={{ p: 0.35, boxShadow: 'none', border: 1, borderWidth: 1, borderColor: '#e9e9e9ff' }}>
      <Box sx={{ pl: 2, pr: 2, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {data}
        </Typography>
      </Box>
    </Card>
  );
}

AnalyticDevice.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.string
};
