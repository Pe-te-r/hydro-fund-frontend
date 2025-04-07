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

export interface ReferredUser {
    bonusAmount: string;
    bonusStatus: string;
    referred: {
        email: string;
        id:string
    };
}

export interface Referrer {
    referrer: {
        email: string;
    };
}

export interface LocalStorageUser {
    token: string;
    email: string;
    id: string;
}


export interface BonusClaimResponse {
    status: 'success' | 'error';
    message: string;
    data: boolean;
}

export interface BonusClaimRequest {
    id: string;
}

export interface UserData {
    id: string;
    username: string;
    email: string;
    phone: string;
    status: string;
    balance: string;
    twoFactorSecret: string | null;
    vipTier: string;
    totalInvested: string;
    totalWithdrawn: string;
    createdAt: string;
    lastLogin: string;
    profileComplete: boolean;
    referredUsers: ReferredUser[];
    referredBy: Referrer[];
    referralCode: string
    bonus: {
        status: string;
        bonusAmount:string
    }
}

export interface UserResponse {
    status: string;
    message: string;
    data: UserData;
}