import { test as base, expect } from "@playwright/test";
import {
  LoginPage,
  DashboardPage,
  PatientsPage,
  AppointmentsPage,
  WaitingRoomPage,
  EncountersPage,
  PrescriptionsPage,
  InvoicesPage,
  UsersPage,
  ClinicsPage,
  DoctorsPage,
  SettingsPage,
} from "../page-objects";
import { TEST_USERS, TestUser } from "../test-data/users";
import { ApiHelper } from "../helpers/api-helper";

type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  patientsPage: PatientsPage;
  appointmentsPage: AppointmentsPage;
  waitingRoomPage: WaitingRoomPage;
  encountersPage: EncountersPage;
  prescriptionsPage: PrescriptionsPage;
  invoicesPage: InvoicesPage;
  usersPage: UsersPage;
  clinicsPage: ClinicsPage;
  doctorsPage: DoctorsPage;
  settingsPage: SettingsPage;
  apiHelper: ApiHelper;
  authenticatedPage: void;
  adminUser: TestUser;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  patientsPage: async ({ page }, use) => {
    await use(new PatientsPage(page));
  },
  appointmentsPage: async ({ page }, use) => {
    await use(new AppointmentsPage(page));
  },
  waitingRoomPage: async ({ page }, use) => {
    await use(new WaitingRoomPage(page));
  },
  encountersPage: async ({ page }, use) => {
    await use(new EncountersPage(page));
  },
  prescriptionsPage: async ({ page }, use) => {
    await use(new PrescriptionsPage(page));
  },
  invoicesPage: async ({ page }, use) => {
    await use(new InvoicesPage(page));
  },
  usersPage: async ({ page }, use) => {
    await use(new UsersPage(page));
  },
  clinicsPage: async ({ page }, use) => {
    await use(new ClinicsPage(page));
  },
  doctorsPage: async ({ page }, use) => {
    await use(new DoctorsPage(page));
  },
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
  apiHelper: async ({}, use) => {
    const helper = await ApiHelper.create();
    await use(helper);
  },
  adminUser: async ({}, use) => {
    await use(TEST_USERS.superAdmin);
  },
  authenticatedPage: async ({ page, loginPage, adminUser }, use) => {
    await loginPage.goto();
    await loginPage.login(adminUser);
    await expect(page).toHaveURL(/\/dashboard/);
    await use();
  },
});

export { expect };

export async function loginAs(page: import("@playwright/test").Page, user: TestUser): Promise<void> {
  await page.context().clearCookies();
  await page.goto("/login");
  await page.evaluate(() => localStorage.clear());
  const loginPage = new LoginPage(page);
  await loginPage.login(user);
  await expect(page).toHaveURL(/\/(dashboard|mfa)/, { timeout: 30_000 });
}
