import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface AppConfig {
    version: string;
    adminPasscode: string;
    isReleased: boolean;
}
export interface MVPRelease {
    useCases: Array<UseCase>;
    releases: Array<Release>;
    phases: Array<Phase>;
}
export interface UseCase {
    status: UseCaseStatus;
    title: string;
    value: UseCaseValue;
    owner: string;
    tags: string;
    ucId: string;
    lastUpdated: Time;
    createdDate: Time;
    description: string;
    effort: UseCaseEffort;
    mvpReleaseId: string;
    priority: UseCasePriority;
    phaseId: string;
}
export interface Phase {
    status: PhaseStatus;
    releaseId: string;
    phaseGoal: string;
    targetDate: string;
    phaseName: string;
    phaseId: string;
}
export interface RSVP {
    name: string;
    inviteCode: string;
    timestamp: Time;
    attending: boolean;
}
export interface InviteCode {
    created: Time;
    code: string;
    used: boolean;
}
export interface Release {
    status: ReleaseStatus;
    releaseId: string;
    targetDate: string;
    releaseGoal: string;
    releaseName: string;
}
export interface UserProfile {
    name: string;
}
export enum PhaseStatus {
    completed = "completed",
    planned = "planned",
    inProgress = "inProgress"
}
export enum ReleaseStatus {
    released = "released",
    planned = "planned",
    inProgress = "inProgress"
}
export enum UseCaseEffort {
    l = "l",
    m = "m",
    s = "s"
}
export enum UseCasePriority {
    p0 = "p0",
    p1 = "p1",
    p2 = "p2",
    p3 = "p3"
}
export enum UseCaseStatus {
    done = "done",
    test = "test",
    inBuild = "inBuild",
    approved = "approved",
    proposed = "proposed",
    deferred = "deferred"
}
export enum UseCaseValue {
    low = "low",
    med = "med",
    high = "high"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    changePhaseRelease(phaseId: string, newReleaseId: string): Promise<void>;
    changeUseCasePhase(ucId: string, newPhaseId: string): Promise<void>;
    createPhase(phase: Phase): Promise<void>;
    createRelease(release: Release): Promise<void>;
    createUseCase(uc: UseCase): Promise<string>;
    deletePhase(id: string): Promise<void>;
    deleteRelease(id: string): Promise<void>;
    deleteUseCase(id: string): Promise<void>;
    filterUseCasesByPhase(phaseId: string): Promise<Array<UseCase>>;
    filterUseCasesByPriority(priority: UseCasePriority): Promise<Array<UseCase>>;
    filterUseCasesByRelease(releaseId: string): Promise<Array<UseCase>>;
    filterUseCasesByStatus(status: UseCaseStatus): Promise<Array<UseCase>>;
    generateInviteCode(): Promise<string>;
    getAllMVPReleases(): Promise<MVPRelease>;
    getAllPhases(): Promise<Array<Phase>>;
    getAllRSVPs(): Promise<Array<RSVP>>;
    getAllReleases(): Promise<Array<Release>>;
    getAllUseCases(): Promise<Array<UseCase>>;
    getAppConfig(): Promise<AppConfig>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInviteCodes(): Promise<Array<InviteCode>>;
    getPhase(id: string): Promise<Phase>;
    getPhasesByReleaseId(releaseId: string): Promise<Array<Phase>>;
    getRelease(id: string): Promise<Release>;
    getUseCase(id: string): Promise<UseCase>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAppConfig(config: AppConfig): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sortPhasesByStatus(): Promise<Array<Phase>>;
    sortReleasesByStatus(): Promise<Array<Release>>;
    sortUseCasesByLastUpdated(): Promise<Array<UseCase>>;
    submitRSVP(name: string, attending: boolean, inviteCode: string): Promise<void>;
    updateAppConfig(config: AppConfig): Promise<void>;
    updatePhase(phase: Phase): Promise<void>;
    updateRelease(release: Release): Promise<void>;
    updateUseCase(uc: UseCase): Promise<void>;
}
