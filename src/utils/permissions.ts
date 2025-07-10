import { Action, Role } from "../types/role.type";

export const rolePermissions: Record<
  Role,
  { can: Partial<Record<Action, string[]>> }
> = {
  superadmin: {
    can: {
      manage: ["users", "videos", "questions"],
      view: ["dashboard"],
    },
  },
  admin: {
    can: {
      manage: ["videos", "questions"],
      view: ["dashboard"],
    },
  },
  user: {
    can: {
      view: ["dashboard"],
    },
  },
};
