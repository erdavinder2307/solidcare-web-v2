/**
 * QueueBoardPage — TV/display board for the waiting room.
 *
 * Intended to be opened in a dedicated browser tab on a lobby screen.
 * No AppShell — full-screen, high-contrast, large font.
 * Auto-refreshes every 30 s via the query refetchInterval.
 */
import { useEffect } from "react";
import { Box, Chip, CircularProgress, Divider, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { appointmentsApi, type AppointmentStatus } from "../api/appointmentsApi";
import { patientsApi } from "@/features/patients/api/patientsApi";
import { useMemo } from "react";

// Statuses shown on the board
const BOARD_STATUSES: AppointmentStatus[] = [
    "checked_in",
    "in_consultation",
    "scheduled",
    "confirmed",
];

const STATUS_LABEL: Record<AppointmentStatus, string> = {
    checked_in: "Ready",
    in_consultation: "With Doctor",
    scheduled: "Waiting",
    confirmed: "Waiting",
    completed: "Done",
    cancelled: "Cancelled",
    no_show: "No Show",
};

const STATUS_COLOR: Partial<Record<AppointmentStatus, string>> = {
    in_consultation: "#22c55e",  // green
    checked_in: "#f59e0b",       // amber
    scheduled: "#94a3b8",        // slate
    confirmed: "#94a3b8",
};

function useQueueBoard() {
    const today = new Date().toISOString().slice(0, 10);

    const appointmentsQuery = useQuery({
        queryKey: ["queue-board", today],
        queryFn: () =>
            appointmentsApi.list({
                page: 1,
                page_size: 100,
                appointment_date: today,
            }),
        refetchInterval: 30_000,
        staleTime: 20_000,
    });

    const patientsQuery = useQuery({
        queryKey: ["patients", "board-lookup"],
        queryFn: () => patientsApi.list({ page: 1, page_size: 100 }),
        staleTime: 5 * 60_000,
    });

    const patientNames = useMemo(() => {
        const map = new Map<string, string>();
        for (const p of patientsQuery.data?.items ?? []) {
            const name = p.full_name ?? `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim();
            map.set(p.id, name || "Patient");
        }
        return map;
    }, [patientsQuery.data]);

    const queue = (appointmentsQuery.data?.items ?? [])
        .filter((a) => BOARD_STATUSES.includes(a.status))
        .sort((a, b) => {
            // in_consultation first, then by token
            if (a.status === "in_consultation") return -1;
            if (b.status === "in_consultation") return 1;
            return (a.token_number ?? 999) - (b.token_number ?? 999);
        });

    const current = queue.find((a) => a.status === "in_consultation");
    const waiting = queue.filter((a) => a.status !== "in_consultation");

    return {
        today,
        current,
        waiting,
        patientNames,
        isLoading: appointmentsQuery.isLoading,
        lastUpdated: appointmentsQuery.dataUpdatedAt,
    };
}

export default function QueueBoardPage() {
    const { today, current, waiting, patientNames, isLoading, lastUpdated } = useQueueBoard();

    // Keep the display awake (basic approach via page title cycling)
    useEffect(() => {
        document.title = "Queue Board – Solidcare";
        return () => {
            document.title = "Solidcare";
        };
    }, []);

    const updatedTime = lastUpdated
        ? new Date(lastUpdated).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
        : "—";

    const formattedDate = new Date(today + "T00:00:00").toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    if (isLoading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    bgcolor: "#0f172a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <CircularProgress sx={{ color: "white" }} size={64} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "#0f172a",
                color: "white",
                display: "flex",
                flexDirection: "column",
                p: 4,
                gap: 4,
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="h3" fontWeight={700} letterSpacing={-1}>
                        Waiting Room
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#94a3b8", mt: 0.5 }}>
                        {formattedDate}
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#475569", mt: 0.5 }}>
                    Updated {updatedTime}
                </Typography>
            </Box>

            {/* Currently with doctor */}
            <Box
                sx={{
                    bgcolor: "#14532d",
                    border: "2px solid #22c55e",
                    borderRadius: 3,
                    p: 4,
                    minHeight: 160,
                }}
            >
                <Typography variant="overline" sx={{ color: "#86efac", letterSpacing: 3 }}>
                    NOW CONSULTING
                </Typography>
                {current ? (
                    <Box mt={1} display="flex" alignItems="center" gap={4}>
                        <Typography
                            sx={{
                                fontSize: "clamp(5rem, 12vw, 10rem)",
                                fontWeight: 900,
                                lineHeight: 1,
                                color: "#22c55e",
                            }}
                        >
                            {current.token_number ?? "—"}
                        </Typography>
                        <Box>
                            <Typography variant="h4" fontWeight={600}>
                                {patientNames.get(current.patient_id) ?? "Patient"}
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#86efac" }}>
                                {current.start_time.slice(0, 5)}
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="h4" sx={{ color: "#4ade80", mt: 1 }}>
                        —
                    </Typography>
                )}
            </Box>

            {/* Next / waiting tokens */}
            <Box>
                <Typography variant="overline" sx={{ color: "#64748b", letterSpacing: 3, mb: 2, display: "block" }}>
                    QUEUE ({waiting.length})
                </Typography>

                {waiting.length === 0 ? (
                    <Typography variant="h5" sx={{ color: "#475569" }}>
                        No patients waiting
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: 2,
                        }}
                    >
                        {waiting.slice(0, 20).map((appt, idx) => {
                            const isNext = idx === 0;
                            return (
                                <Box
                                    key={appt.id}
                                    sx={{
                                        bgcolor: isNext ? "#1e3a5f" : "#1e293b",
                                        border: isNext ? "2px solid #3b82f6" : "1px solid #334155",
                                        borderRadius: 2,
                                        p: 3,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: "clamp(2.5rem, 6vw, 4rem)",
                                            fontWeight: 900,
                                            lineHeight: 1,
                                            color: isNext ? "#60a5fa" : "#94a3b8",
                                        }}
                                    >
                                        {appt.token_number ?? "—"}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        noWrap
                                        sx={{ color: isNext ? "#bfdbfe" : "#64748b" }}
                                    >
                                        {patientNames.get(appt.patient_id) ?? "Patient"}
                                    </Typography>
                                    <Chip
                                        label={STATUS_LABEL[appt.status] ?? appt.status}
                                        size="small"
                                        sx={{
                                            bgcolor: STATUS_COLOR[appt.status] ?? "#334155",
                                            color: "white",
                                            fontSize: "0.65rem",
                                            fontWeight: 600,
                                            letterSpacing: 0.5,
                                            alignSelf: "flex-start",
                                            height: 20,
                                        }}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </Box>

            <Divider sx={{ borderColor: "#1e293b" }} />

            {/* Footer */}
            <Typography variant="caption" sx={{ color: "#334155", textAlign: "center" }}>
                Auto-refreshes every 30 seconds · Solidcare
            </Typography>
        </Box>
    );
}
