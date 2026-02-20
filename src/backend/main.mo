import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type Message = {
    id : Nat;
    personName : Text;
    text : Text;
    timestamp : Time.Time;
  };

  public type Worker = {
    id : Nat;
    name : Text;
    skill : Text;
    category : Text;
    location : Text;
    profileImage : Storage.ExternalBlob;
    workImages : [Storage.ExternalBlob];
    timestamp : Time.Time;
  };

  public type Material = {
    id : Nat;
    name : Text;
    category : Text;
    description : Text;
    location : Text;
    images : [Storage.ExternalBlob];
    timestamp : Time.Time;
  };

  public type CareerApplication = {
    id : Nat;
    name : Text;
    mobile : Text;
    skills : Text;
    experience : Text;
    message : Text;
    timestamp : Time.Time;
  };

  public type ArchitectProject = {
    id : Nat;
    name : Text;
    projectType : Text;
    location : Text;
    budget : Text;
    message : Text;
    files : [Storage.ExternalBlob];
    timestamp : Time.Time;
  };

  public type ContactRequest = {
    id : Nat;
    customerName : Text;
    mobile : Text;
    requirements : Text;
    targetId : Nat;
    targetType : Text;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
  };

  var nextMessageId = 0;
  var nextWorkerId = 0;
  var nextMaterialId = 0;
  var nextCareerApplicationId = 0;
  var nextArchitectProjectId = 0;
  var nextContactRequestId = 0;

  var messages = Map.empty<Nat, Message>();
  var workers = Map.empty<Nat, Worker>();
  var materials = Map.empty<Nat, Material>();
  var careerApplications = Map.empty<Nat, CareerApplication>();
  var architectProjects = Map.empty<Nat, ArchitectProject>();
  var contactRequests = Map.empty<Nat, ContactRequest>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Message functions
  public shared ({ caller }) func addMessage(message : Text, name : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add messages directly");
    };

    let newMessage : Message = {
      id = nextMessageId;
      text = message;
      personName = name;
      timestamp = Time.now();
    };
    messages.add(nextMessageId, newMessage);
    nextMessageId += 1;
  };

  public query ({ caller }) func getAdminMessages() : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access messages");
    };
    messages.values().toArray();
  };

  public query func getAllMessages() : async [Message] {
    messages.values().toArray();
  };

  public shared ({ caller }) func deleteMessage(messageId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete messages");
    };

    switch (messages.get(messageId)) {
      case null { false };
      case (?_) {
        messages.remove(messageId);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteAllMessages() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete all messages");
    };

    let count = messages.size();
    messages := Map.empty<Nat, Message>();
    count;
  };

  func createSystemMessage(message : Text, name : Text) {
    let newMessage : Message = {
      id = nextMessageId;
      text = message;
      personName = name;
      timestamp = Time.now();
    };
    messages.add(nextMessageId, newMessage);
    nextMessageId += 1;
  };

  // Worker functions
  public shared ({ caller }) func addWorker(name : Text, skill : Text, category : Text, location : Text, profileImage : Storage.ExternalBlob, workImages : [Storage.ExternalBlob]) : async () {
    if (workImages.size() < 3) {
      Runtime.trap("At least 3 work images are required");
    };

    let newWorker : Worker = {
      id = nextWorkerId;
      name;
      skill;
      category;
      location;
      profileImage;
      workImages;
      timestamp = Time.now();
    };
    workers.add(nextWorkerId, newWorker);
    createSystemMessage("New worker registered: " # name # " - " # skill, "System");
    nextWorkerId += 1;
  };

  public query ({ caller }) func getWorkersByCategory(category : Text) : async [Worker] {
    let filteredWorkers = List.empty<Worker>();
    for ((_, worker) in workers.entries()) {
      if (worker.category == category) {
        filteredWorkers.add(worker);
      };
    };
    filteredWorkers.toArray();
  };

  public query ({ caller }) func getAllWorkers() : async [Worker] {
    workers.values().toArray();
  };

  // Material functions
  public shared ({ caller }) func addMaterial(name : Text, category : Text, description : Text, location : Text, images : [Storage.ExternalBlob]) : async () {
    let newMaterial : Material = {
      id = nextMaterialId;
      name;
      category;
      description;
      location;
      images;
      timestamp = Time.now();
    };
    materials.add(nextMaterialId, newMaterial);
    createSystemMessage("New material submitted for sale: " # name # " - " # category, "System");
    nextMaterialId += 1;
  };

  public query ({ caller }) func getAllMaterials() : async [Material] {
    materials.values().toArray();
  };

  // Career application functions
  public shared ({ caller }) func submitCareerApplication(name : Text, mobile : Text, skills : Text, experience : Text, message : Text) : async () {
    let newApplication : CareerApplication = {
      id = nextCareerApplicationId;
      name;
      mobile;
      skills;
      experience;
      message;
      timestamp = Time.now();
    };
    careerApplications.add(nextCareerApplicationId, newApplication);
    nextCareerApplicationId += 1;
  };

  public query ({ caller }) func getAllCareerApplications() : async [CareerApplication] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view career applications");
    };
    careerApplications.values().toArray();
  };

  // Architect project functions
  public shared ({ caller }) func submitArchitectProject(name : Text, projectType : Text, location : Text, budget : Text, message : Text, files : [Storage.ExternalBlob]) : async () {
    let newProject : ArchitectProject = {
      id = nextArchitectProjectId;
      name;
      projectType;
      location;
      budget;
      message;
      files;
      timestamp = Time.now();
    };
    architectProjects.add(nextArchitectProjectId, newProject);
    nextArchitectProjectId += 1;
  };

  public query ({ caller }) func getAllArchitectProjects() : async [ArchitectProject] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view architect projects");
    };
    architectProjects.values().toArray();
  };

  // Contact request functions
  public shared ({ caller }) func submitContactRequest(customerName : Text, mobile : Text, requirements : Text, targetId : Nat, targetType : Text) : async () {
    let newRequest : ContactRequest = {
      id = nextContactRequestId;
      customerName;
      mobile;
      requirements;
      targetId;
      targetType;
      timestamp = Time.now();
    };
    contactRequests.add(nextContactRequestId, newRequest);
    nextContactRequestId += 1;
  };

  public query ({ caller }) func getAllContactRequests() : async [ContactRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view contact requests");
    };
    contactRequests.values().toArray();
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
