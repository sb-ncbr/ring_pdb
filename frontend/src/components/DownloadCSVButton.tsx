import { useState } from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Button, Typography } from '@mui/material';
import { MRT_ColumnFiltersState, MRT_SortingState } from 'material-react-table';
import axios from 'axios';

type DownloadPayload = {
  filters: MRT_ColumnFiltersState;
  sorting: MRT_SortingState;
};

export function DownloadCSVButton(payload: DownloadPayload) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload() {
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/export-data`,
        payload,
        { responseType: 'blob' },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ringPDB_export.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      startIcon={<FileDownloadIcon sx={{ color: '#7C7C7C' }} />}
      sx={{
        whiteSpace: 'nowrap',
        color: '#3A3A3A',
        justifyContent: 'start',
        order: { xs: -2, lg: 0 },
      }}
    >
      <Typography variant="body1">Download data</Typography>
    </Button>
  );
}
