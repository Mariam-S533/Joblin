


export interface successLoginResponse {
    id: string,
    displayName: string,
    email: string,
    roles: string[],
    token: string
}

export interface failLoginResponse {
    error: string
}