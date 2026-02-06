import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import InviteLinksModule "invite-links/invite-links-module";
import Random "mo:core/Random";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let inviteState = InviteLinksModule.initState();

  public type PhaseStatus = {
    #planned;
    #inProgress;
    #completed;
  };

  public type ReleaseStatus = {
    #planned;
    #inProgress;
    #released;
  };

  public type UseCasePriority = {
    #p0;
    #p1;
    #p2;
    #p3;
  };

  public type UseCaseStatus = {
    #proposed;
    #approved;
    #inBuild;
    #test;
    #done;
    #deferred;
  };

  public type UseCaseValue = {
    #high;
    #med;
    #low;
  };

  public type UseCaseEffort = {
    #s;
    #m;
    #l;
  };

  public type Phase = {
    phaseId : Text;
    phaseName : Text;
    phaseGoal : Text;
    targetDate : Text;
    status : PhaseStatus;
    releaseId : Text;
  };

  public type Release = {
    releaseId : Text;
    releaseName : Text;
    releaseGoal : Text;
    targetDate : Text;
    status : ReleaseStatus;
  };

  public type UseCase = {
    ucId : Text;
    title : Text;
    description : Text;
    phaseId : Text;
    mvpReleaseId : Text;
    priority : UseCasePriority;
    status : UseCaseStatus;
    value : UseCaseValue;
    effort : UseCaseEffort;
    owner : Text;
    tags : Text;
    createdDate : Time.Time;
    lastUpdated : Time.Time;
  };

  public type AppConfig = {
    isReleased : Bool;
    adminPasscode : Text;
    version : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let phases = Map.empty<Text, Phase>();
  let releases = Map.empty<Text, Release>();
  let useCases = Map.empty<Text, UseCase>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var appConfig : ?AppConfig = null;
  var nextUseCaseId = 58;

  public type MVPRelease = {
    useCases : [UseCase];
    phases : [Phase];
    releases : [Release];
  };

  public query func getAllMVPReleases() : async MVPRelease {
    let useCaseArray = useCases.values().toArray();
    let phaseArray = phases.values().toArray();
    let releaseArray = releases.values().toArray();

    {
      useCases = useCaseArray;
      phases = phaseArray;
      releases = releaseArray;
    };
  };

  // Invite functionality - Unrestricted access during testing phase

  // Generate invite code (unrestricted access)
  public shared ({ caller }) func generateInviteCode() : async Text {
    let blob = await Random.blob();
    let code = InviteLinksModule.generateUUID(blob);
    InviteLinksModule.generateInviteCode(inviteState, code);
    code;
  };

  // Submit RSVP (unrestricted access)
  public func submitRSVP(name : Text, attending : Bool, inviteCode : Text) : async () {
    InviteLinksModule.submitRSVP(inviteState, name, attending, inviteCode);
  };

  // Get all RSVPs (unrestricted access)
  public query ({ caller }) func getAllRSVPs() : async [InviteLinksModule.RSVP] {
    InviteLinksModule.getAllRSVPs(inviteState);
  };

  // Get all invite codes (unrestricted access)
  public query ({ caller }) func getInviteCodes() : async [InviteLinksModule.InviteCode] {
    InviteLinksModule.getInviteCodes(inviteState);
  };

  func digitToChar(digit : Nat) : Char {
    switch (digit) {
      case (0) { '0' };
      case (1) { '1' };
      case (2) { '2' };
      case (3) { '3' };
      case (4) { '4' };
      case (5) { '5' };
      case (6) { '6' };
      case (7) { '7' };
      case (8) { '8' };
      case (9) { '9' };
      case (_) { '0' };
    };
  };

  func natToText(n : Nat) : Text {
    if (n.toInt() == 0) { return "0" };
    var num = n;
    var result = "";
    while (num.toInt() > 0) {
      let digit = num % 10;
      let charArray = [digitToChar(digit)];
      result := charArray.toText() # result;
      num /= 10;
    };
    result;
  };

  func generateUseCaseId() : Text {
    let id = "UC-" # natToText(nextUseCaseId);
    nextUseCaseId += 1;
    id;
  };

  func validatePhaseId(phaseId : Text) {
    if (phases.get(phaseId) == null) {
      Runtime.trap("Phase does not exist");
    };
  };

  func validateReleaseId(releaseId : Text) {
    if (releases.get(releaseId) == null) {
      Runtime.trap("Release does not exist");
    };
  };

  func getAppConfigOrTrap() : AppConfig {
    switch (appConfig) {
      case (null) {
        let defaultConfig : AppConfig = {
          isReleased = false;
          adminPasscode = "admin123";
          version = "0.1";
        };
        appConfig := ?defaultConfig;
        defaultConfig;
      };
      case (?c) { c };
    };
  };

  module UseCase {
    public func compareByLastUpdated(a : UseCase, b : UseCase) : Order.Order {
      Int.compare(a.lastUpdated, b.lastUpdated);
    };
  };

  module Phase {
    public func compareByStatus(a : Phase, b : Phase) : Order.Order {
      switch (a.status, b.status) {
        case (#planned, #planned) { #equal };
        case (#planned, _) { #less };
        case (#inProgress, #planned) { #greater };
        case (#inProgress, #inProgress) { #equal };
        case (#inProgress, #completed) { #less };
        case (#completed, _) { #greater };
      };
    };
  };

  module Release {
    public func compareByStatus(a : Release, b : Release) : Order.Order {
      switch (a.status, b.status) {
        case (#planned, #planned) { #equal };
        case (#planned, _) { #less };
        case (#inProgress, #planned) { #greater };
        case (#inProgress, #inProgress) { #equal };
        case (#inProgress, #released) { #less };
        case (#released, _) { #greater };
      };
    };
  };

  // User Profile Management - Unrestricted access during testing phase
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // UseCase CRUD - Unrestricted access during testing phase
  public shared ({ caller }) func createUseCase(uc : UseCase) : async Text {
    validatePhaseId(uc.phaseId);
    validateReleaseId(uc.mvpReleaseId);

    let newUc = {
      uc with
      ucId = generateUseCaseId();
      createdDate = Time.now();
      lastUpdated = Time.now();
    };

    useCases.add(newUc.ucId, newUc);
    newUc.ucId;
  };

  public query func getUseCase(id : Text) : async UseCase {
    switch (useCases.get(id)) {
      case (null) { Runtime.trap("UseCase does not exist") };
      case (?uc) { uc };
    };
  };

  public query func getAllUseCases() : async [UseCase] {
    useCases.values().toArray();
  };

  public shared ({ caller }) func updateUseCase(uc : UseCase) : async () {
    validatePhaseId(uc.phaseId);
    validateReleaseId(uc.mvpReleaseId);

    let updatedUc = { uc with lastUpdated = Time.now() };
    useCases.add(uc.ucId, updatedUc);
  };

  public shared ({ caller }) func deleteUseCase(id : Text) : async () {
    useCases.remove(id);
  };

  // Phase CRUD - Unrestricted access during testing phase
  public shared ({ caller }) func createPhase(phase : Phase) : async () {
    validateReleaseId(phase.releaseId);
    phases.add(phase.phaseId, phase);
  };

  public query func getPhase(id : Text) : async Phase {
    switch (phases.get(id)) {
      case (null) { Runtime.trap("Phase does not exist") };
      case (?phase) { phase };
    };
  };

  public query func getAllPhases() : async [Phase] {
    phases.values().toArray();
  };

  public shared ({ caller }) func updatePhase(phase : Phase) : async () {
    validateReleaseId(phase.releaseId);
    phases.add(phase.phaseId, phase);
  };

  public shared ({ caller }) func deletePhase(id : Text) : async () {
    switch (phases.get(id)) {
      case (null) {
        Runtime.trap("Cannot delete phase. Phase with id " # id # " does not exist");
      };
      case (?_) {
        phases.remove(id);
        let toRemove = useCases.values().toArray().filter(
          func(uc) { uc.phaseId == id }
        );
        toRemove.forEach(func(uc) { useCases.remove(uc.ucId) });
      };
    };
  };

  // Release CRUD - Unrestricted access during testing phase
  public shared ({ caller }) func createRelease(release : Release) : async () {
    releases.add(release.releaseId, release);
  };

  public query func getRelease(id : Text) : async Release {
    switch (releases.get(id)) {
      case (null) { Runtime.trap("Release does not exist") };
      case (?release) { release };
    };
  };

  public query func getAllReleases() : async [Release] {
    releases.values().toArray();
  };

  public shared ({ caller }) func updateRelease(release : Release) : async () {
    releases.add(release.releaseId, release);
  };

  public shared ({ caller }) func deleteRelease(id : Text) : async () {
    switch (releases.get(id)) {
      case (null) {
        Runtime.trap("Cannot delete release. Release with id " # id # " does not exist");
      };
      case (?_) {
        releases.remove(id);
        let toRemove = useCases.values().toArray().filter(
          func(uc) { uc.mvpReleaseId == id }
        );
        toRemove.forEach(func(uc) { useCases.remove(uc.ucId) });
      };
    };
  };

  // AppConfig - Unrestricted access during testing phase
  public shared ({ caller }) func initializeAppConfig(config : AppConfig) : async () {
    if (appConfig != null) {
      Runtime.trap("AppConfig already initialized");
    };
    appConfig := ?config;
  };

  public shared ({ caller }) func updateAppConfig(config : AppConfig) : async () {
    appConfig := ?config;
  };

  public query func getAppConfig() : async AppConfig {
    getAppConfigOrTrap();
  };

  // Filtering & Sorting - Unrestricted access during testing phase
  public query func filterUseCasesByPriority(priority : UseCasePriority) : async [UseCase] {
    useCases.values().toArray().filter(
      func(uc) { uc.priority == priority }
    );
  };

  public query func filterUseCasesByStatus(status : UseCaseStatus) : async [UseCase] {
    useCases.values().toArray().filter(
      func(uc) { uc.status == status }
    );
  };

  public query func filterUseCasesByPhase(phaseId : Text) : async [UseCase] {
    useCases.values().toArray().filter(
      func(uc) { uc.phaseId == phaseId }
    );
  };

  public query func filterUseCasesByRelease(releaseId : Text) : async [UseCase] {
    useCases.values().toArray().filter(
      func(uc) { uc.mvpReleaseId == releaseId }
    );
  };

  public query func sortUseCasesByLastUpdated() : async [UseCase] {
    useCases.values().toArray().sort(UseCase.compareByLastUpdated);
  };

  public query func sortPhasesByStatus() : async [Phase] {
    phases.values().toArray().sort(Phase.compareByStatus);
  };

  public query func sortReleasesByStatus() : async [Release] {
    releases.values().toArray().sort(Release.compareByStatus);
  };

  // Change UseCase phase - Unrestricted access during testing phase
  public shared ({ caller }) func changeUseCasePhase(ucId : Text, newPhaseId : Text) : async () {
    switch (useCases.get(ucId)) {
      case (null) { Runtime.trap("UseCase with id: " # ucId # " does not exist") };
      case (?uc) {
        validatePhaseId(newPhaseId);
        let updatedUc = {
          uc with
          phaseId = newPhaseId;
          lastUpdated = Time.now();
        };
        useCases.add(ucId, updatedUc);
      };
    };
  };

  // Change Phase release - Unrestricted access during testing phase
  public shared ({ caller }) func changePhaseRelease(phaseId : Text, newReleaseId : Text) : async () {
    switch (phases.get(phaseId)) {
      case (null) { Runtime.trap("Phase with id: " # phaseId # " does not exist") };
      case (?phase) {
        validateReleaseId(newReleaseId);
        let updatedPhase = { phase with releaseId = newReleaseId };
        phases.add(phaseId, updatedPhase);
      };
    };
  };

  public query func getPhasesByReleaseId(releaseId : Text) : async [Phase] {
    let phasesForRelease = phases.values().toArray().filter(
      func(p) { p.releaseId == releaseId }
    );
    if (phasesForRelease.size() == 0) {
      Runtime.trap("No phases found for release: " # releaseId);
    };
    phasesForRelease;
  };
};

