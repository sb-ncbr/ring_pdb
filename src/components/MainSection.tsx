import React from "react";
import { Typography } from "@mui/material";

export const MainSection: React.FC<{ section: { header: string; body: string } }> = ({ section }) => {
    const { header, body } = section;
    return (
        <>
            <Typography variant="h4" component="div" sx={{
                width: '100%',
                margin: '16px 0',
                textAlign: 'left'
            }}
            >
                {header}
            </Typography>

            <Typography variant="body2" component="div" sx={{
                width: '100%',
                margin: '16px 0',
                textAlign: 'left'
            }}
            >
                {body}
            </Typography>
        </>
    )
}

export default MainSection;