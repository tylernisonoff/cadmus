interface Credentials {
    id: string;
    service: string;
    serviceId: string;
    accessToken: string;
    refreshToken: string;
    userId: number;
}

export = Credentials;
