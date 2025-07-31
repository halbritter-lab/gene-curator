// config/userRolesConfig.js

export const userRolesConfig = {
    admin: {
      canCurate: true,
      canViewAllRecords: true,
      canEditAllRecords: true,
      canAccessAdminPanel: true,
      canManageUsers: true,
      description: "Admins have full access to all records, user management, and administrative settings."
    },
    curator: {
      canCurate: true,
      canViewAllRecords: true,
      canEditOwnRecords: true,
      canAccessAdminPanel: false,
      canManageUsers: false,
      description: "Curators can view all records, and curate or edit records they have created."
    },
    viewer: {
      canCurate: false,
      canViewAllRecords: true,
      canEditOwnRecords: false,
      canAccessAdminPanel: false,
      canManageUsers: false,
      description: "Viewers have read-only access to all records."
    }
  };
  