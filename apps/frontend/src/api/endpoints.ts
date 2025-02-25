

export const endpoints = {
  auth: {
    user: '/auth/user',
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    resetPassword: '/auth/reset-password',
    changePassword: (token: string) => `/auth/change-password/${token}`,
    activate: (token: string) => `/auth/activate/${token}`,
  },
  stock: {},
  warehouse: {
    list: '/warehouse/',
    detail: (id: number) => `/warehouse/${id}`,
    tags: (id: number) => `/warehouse/${id}/tags`,
    createTag: (id: number) => `/warehouse/${id}/tags`,
    deleteTag: (id: number, tagId: number) => `/warehouse/${id}/tags/${tagId}`,
    create: '/warehouse/',
  },
};