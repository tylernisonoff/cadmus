interface Profile {
    provider: string;
    id: string;
    displayName: string;
    emails: {value: string}[];
    _raw: string;
    _json: Object;
}
