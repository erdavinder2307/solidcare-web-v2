import { Box, Typography } from "@mui/material";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { useQuery } from "@tanstack/react-query";
import { usersApi, type UserListItem } from "@/features/users/api/usersApi";
import { PageHeader, PageLayout } from "@/shared/layout";
import { DataTable, EmptyState, EntityStatusBadge, StatusBadge } from "@/shared/ui";
import { formatDateTime } from "@/shared/utils/formatters";

export default function UsersListPage() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.list(),
  });

  return (
    <PageLayout maxWidth="none">
      <PageHeader
        title="Users"
        subtitle={`${users.length} accounts in your organization`}
        breadcrumbs={[
          { label: "Administration" },
          { label: "Users" },
        ]}
      />

      <DataTable<UserListItem>
        columns={[
          {
            id: "name",
            header: "Name",
            render: (user) => (
              <Typography variant="body2" fontWeight={500}>
                {user.first_name} {user.last_name}
              </Typography>
            ),
          },
          { id: "email", header: "Email", render: (user) => user.email },
          { id: "phone", header: "Phone", render: (user) => user.phone ?? "—" },
          {
            id: "roles",
            header: "Roles",
            render: (user) =>
              user.roles.length > 0 ? (
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {user.roles.map((role) => (
                    <StatusBadge key={role} label={role.replace(/_/g, " ")} tone="neutral" />
                  ))}
                </Box>
              ) : (
                "—"
              ),
          },
          {
            id: "status",
            header: "Status",
            render: (user) => <EntityStatusBadge status={user.status} />,
          },
          {
            id: "created",
            header: "Created",
            render: (user) => formatDateTime(user.created_at),
          },
        ]}
        rows={users}
        getRowId={(user) => user.id}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={<GroupOutlinedIcon sx={{ fontSize: 48 }} />}
            title="No users found"
            description="User accounts for your organization will appear here."
          />
        }
      />
    </PageLayout>
  );
}
