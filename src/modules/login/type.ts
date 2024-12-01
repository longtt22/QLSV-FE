export interface tokenResponse {
    username: string,
    authorities: [string],
    refreshToken: string,
    token: string,
    isAuthenticated: boolean
}