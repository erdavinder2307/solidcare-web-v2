export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(dateStr: string | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", options ?? { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function formatAge(dob: string | null | undefined): string {
  if (!dob) return "—";
  const birth = new Date(dob);
  const today = new Date();
  const years = today.getFullYear() - birth.getFullYear();
  const months = today.getMonth() - birth.getMonth();
  if (years === 0) return `${months} months`;
  return `${years} yrs`;
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "—";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  return phone;
}
