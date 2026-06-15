import { Box, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { PageLayout } from "@/shared/layout";
import { Surface } from "@/shared/ui";

export function PatientWorkspaceSkeleton() {
  return (
    <PageLayout maxWidth="none">
      <Skeleton variant="text" width={280} height={28} sx={{ mb: 2 }} />
      <Surface sx={{ p: 3, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid>
            <Skeleton variant="circular" width={72} height={72} />
          </Grid>
          <Grid size="grow">
            <Skeleton width="40%" height={32} />
            <Skeleton width="60%" height={20} sx={{ mt: 1 }} />
          </Grid>
        </Grid>
      </Surface>
      <Box display="flex" gap={2} mb={3}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} width={100} height={36} />
        ))}
      </Box>
      <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 2 }} />
    </PageLayout>
  );
}
