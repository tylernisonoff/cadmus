interface Credentials {
    id: number;
    service: string;
    serviceId: string;
    accessToken: string;
    refreshToken: string;
    userId: number;
}

export = Credentials;
