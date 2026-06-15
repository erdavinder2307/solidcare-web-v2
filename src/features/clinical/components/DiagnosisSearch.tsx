import React, { useState } from "react";
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { icd10Api, ICD10Result } from "../api/icd10Api";

export interface SelectedDiagnosis {
  icd10_code: string;
  icd10_description: string;
  diagnosis_type: "primary" | "secondary" | "differential" | "provisional";
}

interface DiagnosisSearchProps {
  value: SelectedDiagnosis[];
  onChange: (diagnoses: SelectedDiagnosis[]) => void;
  disabled?: boolean;
}

export function DiagnosisSearch({ value, onChange, disabled }: DiagnosisSearchProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const { data: options = [], isFetching } = useQuery({
    queryKey: ["icd10", inputValue],
    queryFn: () => icd10Api.search(inputValue),
    enabled: open && inputValue.trim().length >= 1,
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });

  const handleSelect = (_: unknown, selected: ICD10Result | null) => {
    if (!selected) return;
    // Avoid duplicates
    if (value.some((d) => d.icd10_code === selected.code)) return;
    const isFirst = value.length === 0;
    onChange([
      ...value,
      {
        icd10_code: selected.code,
        icd10_description: selected.description,
        diagnosis_type: isFirst ? "primary" : "secondary",
      },
    ]);
    setInputValue("");
  };

  const handleRemove = (code: string) => {
    onChange(value.filter((d) => d.icd10_code !== code));
  };

  const handleTypeToggle = (code: string) => {
    onChange(
      value.map((d) =>
        d.icd10_code === code
          ? {
              ...d,
              diagnosis_type:
                d.diagnosis_type === "primary" ? "secondary" : "primary",
            }
          : d
      )
    );
  };

  return (
    <Box>
      <Autocomplete<ICD10Result>
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        loading={isFetching}
        inputValue={inputValue}
        onInputChange={(_, v) => setInputValue(v)}
        onChange={handleSelect}
        value={null}
        disabled={disabled}
        filterOptions={(x) => x} // server-side filtering
        getOptionLabel={(o) => `${o.code} — ${o.description}`}
        isOptionEqualToValue={(a, b) => a.code === b.code}
        renderOption={(props, option) => (
          <li {...props} key={option.code}>
            <Box>
              <Typography variant="body2" fontWeight={600} component="span">
                {option.code}
              </Typography>
              <Typography variant="body2" color="text.secondary" component="span" ml={1}>
                {option.description}
              </Typography>
            </Box>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search ICD-10 diagnosis"
            placeholder="Type code or keyword (e.g. J45, diabetes)"
            size="small"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isFetching && <CircularProgress color="inherit" size={16} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {value.length > 0 && (
        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
          {value.map((dx) => (
            <Chip
              key={dx.icd10_code}
              label={`${dx.icd10_code} · ${dx.icd10_description.length > 40 ? dx.icd10_description.slice(0, 40) + "…" : dx.icd10_description}`}
              size="small"
              color={dx.diagnosis_type === "primary" ? "primary" : "default"}
              variant={dx.diagnosis_type === "primary" ? "filled" : "outlined"}
              onClick={() => handleTypeToggle(dx.icd10_code)}
              onDelete={() => handleRemove(dx.icd10_code)}
              title={`${dx.icd10_description} (click to toggle primary/secondary)`}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
