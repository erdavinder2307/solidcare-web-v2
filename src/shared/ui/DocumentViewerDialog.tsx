import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

export interface DocumentViewerDialogProps {
  open: boolean;
  onClose: () => void;
  /** File display name shown in the header. */
  fileName: string;
  /** MIME type used to decide how to render (image / pdf / unsupported). */
  contentType: string | null;
  /** Direct (SAS) URL to the file. */
  url: string | null;
}

export function DocumentViewerDialog({
  open,
  onClose,
  fileName,
  contentType,
  url,
}: DocumentViewerDialogProps) {
  const isImage = !!contentType && contentType.startsWith("image/");
  const isPdf = contentType === "application/pdf";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { height: "90vh" } }}>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, pr: 1 }}>
        <InsertDriveFileOutlinedIcon fontSize="small" color="action" />
        <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ flex: 1 }}>
          {fileName}
        </Typography>
        {url && (
          <>
            <IconButton size="small" href={url} target="_blank" rel="noopener noreferrer" aria-label="Open in new tab">
              <OpenInNewIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" href={url} download aria-label="Download">
              <DownloadIcon fontSize="small" />
            </IconButton>
          </>
        )}
        <IconButton size="small" onClick={onClose} aria-label="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{ p: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "grey.100" }}
      >
        {!url ? (
          <Typography color="text.secondary" sx={{ p: 4 }}>
            No preview available for this document.
          </Typography>
        ) : isImage ? (
          <Box
            component="img"
            src={url}
            alt={fileName}
            sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        ) : isPdf ? (
          <Box
            component="iframe"
            src={url}
            title={fileName}
            sx={{ width: "100%", height: "100%", border: 0 }}
          />
        ) : (
          <Box sx={{ textAlign: "center", p: 4 }}>
            <InsertDriveFileOutlinedIcon sx={{ fontSize: 56, color: "text.disabled", mb: 1 }} />
            <Typography color="text.secondary" gutterBottom>
              Inline preview isn’t available for this file type
              {contentType ? ` (${contentType})` : ""}.
            </Typography>
            <Button variant="contained" startIcon={<DownloadIcon />} href={url} download sx={{ mt: 1 }}>
              Download file
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
