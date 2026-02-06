import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

module {
  type PhaseStatus = {
    #planned;
    #inProgress;
    #completed;
  };

  type ReleaseStatus = {
    #planned;
    #inProgress;
    #released;
  };

  type UseCasePriority = {
    #p0;
    #p1;
    #p2;
    #p3;
  };

  type UseCaseStatus = {
    #proposed;
    #approved;
    #inBuild;
    #test;
    #done;
    #deferred;
  };

  type UseCaseValue = {
    #high;
    #med;
    #low;
  };

  type UseCaseEffort = {
    #s;
    #m;
    #l;
  };

  type Phase = {
    phaseId : Text;
    phaseName : Text;
    phaseGoal : Text;
    targetDate : Text;
    status : PhaseStatus;
    releaseId : Text;
  };

  type Release = {
    releaseId : Text;
    releaseName : Text;
    releaseGoal : Text;
    targetDate : Text;
    status : ReleaseStatus;
  };

  type UseCase = {
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

  type AppConfig = {
    isReleased : Bool;
    adminPasscode : Text;
    version : Text;
  };

  type UserProfile = {
    name : Text;
  };

  type OldActor = {
    phases : Map.Map<Text, Phase>;
    releases : Map.Map<Text, Release>;
    useCases : Map.Map<Text, UseCase>;
    userProfiles : Map.Map<Principal, UserProfile>;
    appConfig : ?AppConfig;
    nextUseCaseId : Nat;
  };

  type NewActor = {
    phases : Map.Map<Text, Phase>;
    releases : Map.Map<Text, Release>;
    useCases : Map.Map<Text, UseCase>;
    userProfiles : Map.Map<Principal, UserProfile>;
    appConfig : ?AppConfig;
    nextUseCaseId : Nat;
  };

  public func run(_old : OldActor) : NewActor {
    let phases = Map.fromIter<Text, Phase>(
      [
        (
          "New-Mother-Father",
          {
            phaseId = "New-Mother-Father";
            phaseName = "New Mother / Father";
            phaseGoal = "Phase-1 Rule: If it doesn't help a tired parent remember this week, it doesn't belong.";
            targetDate = "";
            status = #planned;
            releaseId = "Phase-1-UC";
          },
        ),
        (
          "Early-Growth",
          {
            phaseId = "Early-Growth";
            phaseName = "Early Growth (6–24 months)";
            phaseGoal = "Phase 2 explores shared media and gentle system prompts that sustain parents through early growth while enabling meaningful collaboration.";
            targetDate = "";
            status = #planned;
            releaseId = "Phase-2-UC";
          },
        ),
        (
          "Structure-Meaning",
          {
            phaseId = "Structure-Meaning";
            phaseName = "Structure & Meaning";
            phaseGoal = "Phase 3 introduces family-friendly structure and meaning layers — cultural, data, and multi-child views.";
            targetDate = "";
            status = #planned;
            releaseId = "Phase-3-UC";
          },
        ),
        (
          "Legacy-Scale",
          {
            phaseId = "Legacy-Scale";
            phaseName = "Legacy & Scale";
            phaseGoal = "Phase 4 extends the experience to legacy, data, and scale-oriented features for full lifecycle and generational continuity.";
            targetDate = "";
            status = #planned;
            releaseId = "Phase-4-UC";
          },
        ),
      ].values()
    );

    let releases = Map.fromIter<Text, Release>(
      [
        (
          "Phase-1-UC",
          {
            releaseId = "Phase-1-UC";
            releaseName = "Phase 1 Use Cases";
            releaseGoal = "";
            targetDate = "";
            status = #planned;
          },
        ),
        (
          "Phase-2-UC",
          {
            releaseId = "Phase-2-UC";
            releaseName = "Phase 2 Use Cases";
            releaseGoal = "";
            targetDate = "";
            status = #planned;
          },
        ),
        (
          "Phase-3-UC",
          {
            releaseId = "Phase-3-UC";
            releaseName = "Phase 3 Use Cases";
            releaseGoal = "";
            targetDate = "";
            status = #planned;
          },
        ),
        (
          "Phase-4-UC",
          {
            releaseId = "Phase-4-UC";
            releaseName = "Phase 4 Use Cases";
            releaseGoal = "";
            targetDate = "";
            status = #planned;
          },
        ),
      ].values()
    );

    let currentTime = Time.now();

    func createUseCase(
      id : Text,
      title : Text,
      desc : Text,
      phase : Text,
      release : Text,
      owner : Text,
      tags : Text,
      priority : UseCasePriority,
      status : UseCaseStatus,
      value : UseCaseValue,
      effort : UseCaseEffort,
      created : Time.Time,
      updated : Time.Time,
    ) : UseCase {
      {
        ucId = id;
        title;
        description = desc;
        phaseId = phase;
        mvpReleaseId = release;
        priority;
        status;
        value;
        effort;
        owner;
        tags;
        createdDate = created;
        lastUpdated = updated;
      };
    };

    let useCases = Map.fromIter<Text, UseCase>(
      [
        (
          "UC-1",
          createUseCase(
            "UC-1",
            "Create Baby Timeline",
            "Create a baby profile with name + DOB",
            "New-Mother-Father",
            "Phase-1-UC",
            "Parent",
            "Entry point, emotional anchor",
            #p1,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-2",
          createUseCase(
            "UC-2",
            "Add First Moment",
            "Add photo + short note ('First kick', 'First night home')",
            "New-Mother-Father",
            "Phase-1-UC",
            "Parent",
            "Instant value",
            #p1,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-3",
          createUseCase(
            "UC-3",
            "Auto-Chronological Placement",
            "Moment placed by date automatically",
            "New-Mother-Father",
            "Phase-1-UC",
            "System",
            "Reduces thinking",
            #p1,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-4",
          createUseCase(
            "UC-4",
            "View Timeline (Scroll)",
            "Horizontally scroll baby's life",
            "New-Mother-Father",
            "Phase-1-UC",
            "Parent",
            "Emotional payoff",
            #p1,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-5",
          createUseCase(
            "UC-5",
            "Add Thought Without Photo",
            "Capture feelings at 3am",
            "New-Mother-Father",
            "Phase-1-UC",
            "Parent",
            "Low friction journaling",
            #p1,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-6",
          createUseCase(
            "UC-6",
            "Edit Moment (basic)",
            "Fix date or caption",
            "New-Mother-Father",
            "Phase-1-UC",
            "Parent",
            "Trust in system",
            #p1,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-7",
          createUseCase(
            "UC-7",
            "Share Timeline (read-only link)",
            "Share baby timeline with grandparents",
            "New-Mother-Father",
            "Phase-1-UC",
            "Parent → Family",
            "Viral surface",
            #p1,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-8",
          createUseCase(
            "UC-8",
            "Today Prompt",
            "Gentle prompt: 'Want to remember today?'",
            "New-Mother-Father",
            "Phase-1-UC",
            "System → Parent",
            "Habit seed",
            #p1,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-9",
          createUseCase(
            "UC-9",
            "Private by Default",
            "No public sharing",
            "New-Mother-Father",
            "Phase-1-UC",
            "System",
            "Psychological safety",
            #p1,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-10",
          createUseCase(
            "UC-10",
            "Invite Editor (Grandparent)",
            "Allow others to add moments",
            "Early-Growth",
            "Phase-2-UC",
            "Parent",
            "Reduces burden",
            #p2,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-11",
          createUseCase(
            "UC-11",
            "Inbox for Shared Media",
            "Grandma uploads photos",
            "Early-Growth",
            "Phase-2-UC",
            "System",
            "Prevents clutter",
            #p2,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-12",
          createUseCase(
            "UC-12",
            "Milestone To‑Dos",
            "'First smile', 'First steps'",
            "Early-Growth",
            "Phase-2-UC",
            "System",
            "Guidance",
            #p2,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-13",
          createUseCase(
            "UC-13",
            "Notification Reminders",
            "'You haven't added in a while'",
            "Early-Growth",
            "Phase-2-UC",
            "System",
            "Retention",
            #p2,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-14",
          createUseCase(
            "UC-14",
            "Simple Categorization",
            "Tag as 'Firsts', 'Medical', etc.",
            "Early-Growth",
            "Phase-2-UC",
            "Parent",
            "Later retrieval",
            #p2,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-15",
          createUseCase(
            "UC-15",
            "Month / Year Markers",
            "Visual time segmentation",
            "Early-Growth",
            "Phase-2-UC",
            "System",
            "Cognitive clarity",
            #p2,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-16",
          createUseCase(
            "UC-16",
            "Religious / Cultural Overlays",
            "Baptism, holidays",
            "Structure-Meaning",
            "Phase-3-UC",
            "Parent",
            "",
            #p3,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-17",
          createUseCase(
            "UC-17",
            "Height / Weight Data",
            "Growth tracking",
            "Structure-Meaning",
            "Phase-3-UC",
            "Parent",
            "",
            #p3,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-18",
          createUseCase(
            "UC-18",
            "School Years",
            "Timeline chapters",
            "Structure-Meaning",
            "Phase-3-UC",
            "Parent",
            "",
            #p3,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-19",
          createUseCase(
            "UC-19",
            "Multi‑Child Views",
            "Compare timelines",
            "Structure-Meaning",
            "Phase-3-UC",
            "Parent",
            "",
            #p3,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-20",
          createUseCase(
            "UC-20",
            "Role Permissions",
            "Creator / Editor / Viewer",
            "Structure-Meaning",
            "Phase-3-UC",
            "System",
            "",
            #p3,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-21",
          createUseCase(
            "UC-21",
            "Analytics ('You captured 312 moments')",
            "Emotional stats",
            "Legacy-Scale",
            "Phase-4-UC",
            "Parent",
            "",
            #p3,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-22",
          createUseCase(
            "UC-22",
            "Export / Print",
            "Physical keepsakes",
            "Legacy-Scale",
            "Phase-4-UC",
            "Parent",
            "",
            #p3,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-23",
          createUseCase(
            "UC-23",
            "Child Access (Teen/Adult)",
            "Ownership transfer",
            "Legacy-Scale",
            "Phase-4-UC",
            "Child",
            "",
            #p3,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-24",
          createUseCase(
            "UC-24",
            "AI Summaries",
            "Year‑in‑review stories",
            "Legacy-Scale",
            "Phase-4-UC",
            "System",
            "",
            #p3,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
        (
          "UC-25",
          createUseCase(
            "UC-25",
            "Localization",
            "Global adoption",
            "Legacy-Scale",
            "Phase-4-UC",
            "System",
            "",
            #p3,
            #proposed,
            #med,
            #m,
            currentTime,
            currentTime,
          ),
        ),
      ].values()
    );

    {
      phases;
      releases;
      useCases;
      userProfiles = Map.empty<Principal, UserProfile>();
      appConfig = ?{
        isReleased = false;
        adminPasscode = "admin123";
        version = "0.1";
      };
      nextUseCaseId = 26;
    };
  };
};
