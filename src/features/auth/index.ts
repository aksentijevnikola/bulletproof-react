export { AuthProvider } from "./context/AuthProvider";
export { useAuth } from "./context/auth-context";
export {
  UserProvider,
  useUserContext,
  useUser,
  useUserRole,
  useUserPermissions,
  useIsAuthenticated,
} from "./context/user-context";
export type { User } from "./api/auth.contracts";
export {
  useUserHasPermission,
  useUserHasPermissions,
  useUserHasRole,
} from "./hooks/usePermissions";
export { useAuthorization } from "./hooks/useAuthorization";
export { ProtectedRoute } from "./ui/ProtectedRoute";
export { RoleGuard } from "./ui/RoleGuard";
export { PermissionGuard } from "./ui/PermissionGuard";
export { default as LoginPage } from "./ui/LoginPage";
export * from "./api";
