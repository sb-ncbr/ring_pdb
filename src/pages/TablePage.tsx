import { Typography } from "@mui/material";
import React from "react";

export const TablePage: React.FC = () => {
    return (
        <div>
            <Typography variant="h4" component="div" sx={{
                width: '100%',
                margin: '24px',
                textAlign: 'left'
            }}>Table name</Typography>
        </div>
    );
};