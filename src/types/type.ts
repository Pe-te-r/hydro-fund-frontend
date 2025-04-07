export interface SelectUser {
    id: string,
    username: string,
    email: string,
    phone: string,
    balance: string,
    vipTier: string
}


export interface RegisterRequest {
    username: string;
    email: string;
    phone: string;
    password: string;
    inviteCode?: string;
}

export interface LoginRequest {
    // identifier: string; // Can be email, username, or phone
    email?: string;
    username?: string
    phone?: string
    password: string;
}

export interface ErrorResponse{
    status: string,
    message: string,
}

export interface AuthResponse {
    status: string,
    message: string,
    data: {
        user: {
            id: string;
            username: string;
            email: string;
            phone: string;
        };
        token: string;
    }
}
