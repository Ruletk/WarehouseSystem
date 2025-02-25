

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
    stock: {

    },
    warehouse: {

    }
}