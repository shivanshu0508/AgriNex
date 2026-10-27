export function getDashboardPath(user) {
  return user?.role === "owner" ? "/owner/dashboard" : "/farmer/dashboard";
}
