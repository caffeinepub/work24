import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldActor = {
    messages : Map.Map<Nat, Message>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextMessageId : Nat;
  };

  type Message = {
    id : Nat;
    text : Text;
    timestamp : Time.Time;
  };

  type UserProfile = {
    name : Text;
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

  type NewActor = {
    messages : Map.Map<Nat, Message>;
    userProfiles : Map.Map<Principal, UserProfile>;
    workers : Map.Map<Nat, Worker>;
    materials : Map.Map<Nat, Material>;
    careerApplications : Map.Map<Nat, CareerApplication>;
    architectProjects : Map.Map<Nat, ArchitectProject>;
    contactRequests : Map.Map<Nat, ContactRequest>;
    nextMessageId : Nat;
    nextWorkerId : Nat;
    nextMaterialId : Nat;
    nextCareerApplicationId : Nat;
    nextArchitectProjectId : Nat;
    nextContactRequestId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      workers = Map.empty<Nat, Worker>();
      materials = Map.empty<Nat, Material>();
      careerApplications = Map.empty<Nat, CareerApplication>();
      architectProjects = Map.empty<Nat, ArchitectProject>();
      contactRequests = Map.empty<Nat, ContactRequest>();
      nextWorkerId = 0;
      nextMaterialId = 0;
      nextCareerApplicationId = 0;
      nextArchitectProjectId = 0;
      nextContactRequestId = 0;
    };
  };
};
