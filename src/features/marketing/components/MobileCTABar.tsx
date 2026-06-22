import React, { useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { COMPANY } from "../config/site";

/**
 * Fixed bottom CTA bar — visible on xs/sm only (hidden md+).
 * Gives mobile visitors a persistent demo request entry point
 * without requiring them to scroll back to the hero.
 */
export function MobileCTABar() {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    return (
        <Box
            sx={{
                display: { xs: "flex", md: "none" },
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1200,
                bgcolor: "background.paper",
                borderTop: "1px solid",
                borderColor: "divider",
                px: 2,
                py: 1.25,
                alignItems: "center",
                gap: 1,
                boxShadow: "0 -4px 16px rgba(15, 23, 42, 0.10)",
            }}
        >
            <Button
                variant="contained"
                size="medium"
                startIcon={<WhatsAppIcon />}
                href={COMPANY.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ flex: 1, fontWeight: 600 }}
            >
                Request Demo
            </Button>
            <IconButton
                size="small"
                onClick={() => setDismissed(true)}
                aria-label="Dismiss"
                sx={{ color: "text.disabled", flexShrink: 0 }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Box>
    );
}
