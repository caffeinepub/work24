import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type Message = {
    id : Nat;
    text : Text;
    timestamp : Time.Time;
  };

  type Worker = {
    id : Nat;
    name : Text;
    skill : Text;
    category : Text;
    location : Text;
    profileImage : Storage.ExternalBlob;
    workImages : [Storage.ExternalBlob];
    timestamp : Time.Time;
  };

  type Material = {
    id : Nat;
    name : Text;
    category : Text;
    description : Text;
    location : Text;
    images : [Storage.ExternalBlob];
    timestamp : Time.Time;
  };

  type CareerApplication = {
    id : Nat;
    name : Text;
    mobile : Text;
    skills : Text;
    experience : Text;
    message : Text;
    timestamp : Time.Time;
  };

  type ArchitectProject = {
    id : Nat;
    name : Text;
    projectType : Text;
    location : Text;
    budget : Text;
    message : Text;
    files : [Storage.ExternalBlob];
    timestamp : Time.Time;
  };

  type ContactRequest = {
    id : Nat;
    customerName : Text;
    mobile : Text;
    requirements : Text;
    targetId : Nat;
    targetType : Text;
    timestamp : Time.Time;
  };

  type UserProfile = {
    name : Text;
  };

  // Old Actor type for migration compatibility
  type OldActor = {
    nextMessageId : Nat;
    nextWorkerId : Nat;
    nextMaterialId : Nat;
    nextCareerApplicationId : Nat;
    nextArchitectProjectId : Nat;
    nextContactRequestId : Nat;
    messages : Map.Map<Nat, Message>;
    workers : Map.Map<Nat, Worker>;
    materials : Map.Map<Nat, Material>;
    careerApplications : Map.Map<Nat, CareerApplication>;
    architectProjects : Map.Map<Nat, ArchitectProject>;
    contactRequests : Map.Map<Nat, ContactRequest>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  // New Actor type for migration compatibility
  type NewActor = {
    nextMessageId : Nat;
    nextWorkerId : Nat;
    nextMaterialId : Nat;
    nextCareerApplicationId : Nat;
    nextArchitectProjectId : Nat;
    nextContactRequestId : Nat;
    messages : Map.Map<Nat, Message>;
    workers : Map.Map<Nat, Worker>;
    materials : Map.Map<Nat, Material>;
    careerApplications : Map.Map<Nat, CareerApplication>;
    architectProjects : Map.Map<Nat, ArchitectProject>;
    contactRequests : Map.Map<Nat, ContactRequest>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
