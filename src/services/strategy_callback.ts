/// <reference path="./profile.ts" />

interface StrategyCallback {
    (accessToken: string, refeshToken: string, profile: Profile, done: (err: Error, profile: Profile) => void): void;
}
