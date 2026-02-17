export function hasPermission(
  permissionSet: ReadonlySet<string>,
  permission: string,
): boolean {
  if (!permission) return false;
  return permissionSet.has(permission);
}

export function hasAllPermissions(
  permissionSet: ReadonlySet<string>,
  required: string[],
): boolean {
  if (!required || required.length === 0) return false;
  return required.every((permission) => permissionSet.has(permission));
}

export function hasAnyPermission(
  permissionSet: ReadonlySet<string>,
  required: string[],
): boolean {
  if (!required || required.length === 0) return false;
  return required.some((permission) => permissionSet.has(permission));
}
