import { Permission, PermissionValue } from "../const/PermissionValue";

export function formatPerms(perms: PermissionValue): string {
  return (
    ((perms & Permission.Read) === Permission.Read ? "r" : "-") +
    ((perms & Permission.Write) === Permission.Write ? "w" : "-") +
    ((perms & Permission.Execute) === Permission.Execute ? "x" : "-")
  );
}
