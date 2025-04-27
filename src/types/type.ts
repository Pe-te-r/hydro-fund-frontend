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
            role: string;
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
export interface AdminUserServiceResponse {
    userInfo: {
        id: string;
        username: string;
        email: string;
        phone: string;
        status: string;
        balance: string;
        deposit: string;
        role: string;
        vipTier: string;
        code: string | null;
        totalInvested: string;
        totalWithdrawn: string;
        createdAt: Date | string;
        lastLogin: Date | string | null;
        profileComplete: boolean;
        twoFactorEnabled: boolean;
    };
    security: {
        passwordLastChanged: Date | string | null;
        twoFactorSecret: string | null;
    };
    financial: {
        bonus: {
            userId?: string;
            status: string;
            bonusAmount: string;
            createdAt?: Date | string;
        } | null;
        withdrawals: Array<{
            amount: string | number;
            netAmount: string | number;
            fee: string | number;
            admin_info?: string;
            status: string;
            createdAt: Date | string;
            processedAt: Date | string | null;
        }>;
        totalWithdrawnAmount: number;
        pendingWithdrawals: Array<{
            amount: string | number;
            netAmount: string | number;
            fee: string | number;
            admin_info?: string;
            status: string;
            createdAt: Date | string;
            processedAt: Date | string | null;
        }>;
        completedWithdrawals: Array<{
            amount: string | number;
            netAmount: string | number;
            fee: string | number;
            admin_info?: string;
            status: string;
            createdAt: Date | string;
            processedAt: Date | string | null;
        }>;
    };
    investments: {
        orders: Array<{
            id: string;
            totalAmount: string | number;
            status: string;
            claimed: boolean;
            createdAt: Date | string;
            items: Array<{
                id: string;
                orderId: string;
                productId: number;
                productName: string;
                quantity: number;
                price: string;
                dailyIncome: string;
                totalIncome: string;
                cycle: number;
                createdAt: Date | string;
            }>;
        }>;
        totalInvested: number;
        activeInvestments: Array<{
            id: string;
            totalAmount: string | number;
            status: string;
            claimed: boolean;
            createdAt: Date | string;
            items: Array<{
                id: string;
                orderId: string;
                productId: number;
                productName: string;
                quantity: number;
                price: string;
                dailyIncome: string;
                totalIncome: string;
                cycle: number;
                createdAt: Date | string;
            }>;
        }>;
        completedInvestments: Array<{
            id: string;
            totalAmount: string | number;
            status: string;
            claimed: boolean;
            createdAt: Date | string;
            items: Array<{
                id: string;
                orderId: string;
                productId: number;
                productName: string;
                quantity: number;
                price: string;
                dailyIncome: string;
                totalIncome: string;
                cycle: number;
                createdAt: Date | string;
            }>;
        }>;
    };
    referrals: {
        referredBy: Array<{
            referrer: {
                email: string;
            };
        }>;
        referredUsers: Array<{
            referred: {
                email: string;
                id: string;
            };
            bonusAmount: string;
            bonusStatus: string;
        }>;
        totalReferrals: number;
        potentialBonus: number;
    };
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
    twoFactorEnabled: boolean;
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

type TransactionStatus = 'pending' | 'completed' | 'rejected' | 'failed';

export interface Transaction {
    id: string;
    userId: string;
    amount: string;
    netAmount: string;
    fee: string;
    phone: string;
    admin_info: string | null;
    status: TransactionStatus;
    createdAt: string;
    processedAt?: string | null;
    user?: {
        balance: string;
        email: string;
        vipTier: string;
    }
}


export interface ApiResponse<T> {
    status: 'success' | 'error';
    message: string;
    data: T  ;
}

export interface ApiResponseType{
    status: 'success' | 'error';
    message: string;
    data?: unknown;
}

export type HistoryType = ApiResponse<Transaction>;


export interface ApiErrorType{
    status: number;
    data:{status:string,message:string}
}

export interface initialRequestPassword{
    email?: string;
    phone?: string;
    username?: string;
}

export interface changePasswordRequest {
    email?: string;
    phone?: string;
    username?: string;
}