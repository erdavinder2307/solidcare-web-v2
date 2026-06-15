import React, { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { patientDocumentsApi, DocumentType } from "../../api/patientsApi";
import { useAuthStore } from "@/app/store/authStore";
import { formatDateTime } from "@/shared/utils/formatters";
import { EmptyState } from "@/shared/ui";

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  aadhaar: "Aadhaar",
  pan: "PAN",
  passport: "Passport",
  driving_license: "Driving Licence",
  voter_id: "Voter ID",
  other: "Other",
};

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PatientDocumentsTab() {
  const { patientId } = useParams<{ patientId: string }>();
  const queryClient = useQueryClient();
  const can = useAuthStore((s) => s.can);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<DocumentType>("other");
  const [notes, setNotes] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);

  const { data: docs = [], isLoading } = useQuery({
    queryKey: ["patient-documents", patientId],
    queryFn: () => patientDocumentsApi.list(patientId!),
    enabled: !!patientId,
  });

  const uploadMutation = useMutation({
    mutationFn: () => patientDocumentsApi.upload(patientId!, selectedFile!, docType, notes || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-documents", patientId] });
      setUploadDialog(false);
      setSelectedFile(null);
      setNotes("");
      setDocType("other");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (docId: string) => patientDocumentsApi.delete(patientId!, docId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["patient-documents", patientId] }),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFileError(null);
    if (file && file.size > MAX_FILE_BYTES) {
      setFileError("File is too large. Maximum size is 10 MB.");
      return;
    }
    setSelectedFile(file);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={600}>Documents</Typography>
        {can("patient:update") && (
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={() => setUploadDialog(true)}
            size="small"
          >
            Upload document
          </Button>
        )}
      </Box>

      {isLoading && <LinearProgress sx={{ mb: 2 }} />}

      {!isLoading && docs.length === 0 && (
        <EmptyState
          icon={<InsertDriveFileOutlinedIcon sx={{ fontSize: 48 }} />}
          title="No documents uploaded"
          description="Upload ID documents, lab reports, imaging records, or consent forms."
        />
      )}

      {docs.length > 0 && (
        <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>File</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Uploaded</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {docs.map((doc) => (
                <TableRow key={doc.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <InsertDriveFileOutlinedIcon fontSize="small" color="action" />
                      <Typography variant="body2" noWrap sx={{ maxWidth: 220 }}>{doc.file_name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={DOC_TYPE_LABELS[doc.document_type] ?? doc.document_type}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatBytes(doc.file_size_bytes)}</TableCell>
                  <TableCell>{formatDateTime(doc.created_at)}</TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">{doc.notes ?? "—"}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    {doc.download_url && (
                      <Tooltip title="Download">
                        <IconButton size="small" href={doc.download_url} target="_blank" rel="noopener noreferrer">
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {can("patient:update") && (
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteMutation.mutate(doc.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Upload dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Upload document</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Box>
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => fileInputRef.current?.click()}
              fullWidth
            >
              {selectedFile ? selectedFile.name : "Choose file"}
            </Button>
            {fileError && <Alert severity="error" sx={{ mt: 1 }}>{fileError}</Alert>}
            <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
              PDF, images, Word — max 10 MB
            </Typography>
          </Box>
          <TextField
            select
            label="Document type"
            value={docType}
            onChange={(e) => setDocType(e.target.value as DocumentType)}
            fullWidth
            size="small"
          >
            {(Object.entries(DOC_TYPE_LABELS) as [DocumentType, string][]).map(([val, label]) => (
              <MenuItem key={val} value={val}>{label}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={2}
            fullWidth
            size="small"
          />
          {uploadMutation.isError && (
            <Alert severity="error">Upload failed. Please try again.</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => uploadMutation.mutate()}
            disabled={!selectedFile || !!fileError || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Uploading…" : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
