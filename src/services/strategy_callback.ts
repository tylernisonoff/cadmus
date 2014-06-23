/// <reference path="./profile.ts" />

interface StrategyCallback {
    (accessToken: string, refreshToken: string, profile: Profile, done: (err: Error, profile: Profile) => void): void;
}
