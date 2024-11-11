export interface RoleType {
    roleId: number;
    roleName: string;
    description: string;
}

export interface ProfileType {
    userId: number | null;
    username: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    status: boolean;
    roles: RoleType[];
}
