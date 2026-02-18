import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Nat "mo:core/Nat";
import migration "migration";

(with migration = migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Message = {
    id : Nat;
    text : Text;
    timestamp : Time.Time;
  };

  var nextMessageId = 0;

  var messages = Map.empty<Nat, Message>();

  public shared ({ caller }) func addMessage(message : Text) : async () {
    // Allow any authenticated caller (users and guests) to submit messages
    // This ensures anonymous principals can submit, which is typical for public submission forms
    let newMessage : Message = {
      id = nextMessageId;
      text = message;
      timestamp = Time.now();
    };
    messages.add(nextMessageId, newMessage);
    nextMessageId += 1;
  };

  public shared ({ caller }) func getAdminMessages(adminId : Text, password : Text) : async [(Nat, Text, Time.Time)] {
    if (adminId != "Bharat1213" or password != "bharatranjan1213") {
      Runtime.trap("Unauthorized: Only admins can access messages");
    };

    let messagesArray = messages.toArray();
    messagesArray.map(
      func((id, message)) {
        (id, message.text, message.timestamp);
      }
    );
  };

  public shared ({ caller }) func deleteMessage(adminId : Text, password : Text, messageId : Nat) : async Bool {
    if (adminId != "Bharat1213" or password != "bharatranjan1213") {
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

  public shared ({ caller }) func deleteAllMessages(adminId : Text, password : Text) : async Nat {
    if (adminId != "Bharat1213" or password != "bharatranjan1213") {
      Runtime.trap("Unauthorized: Only admins can delete all messages");
    };

    let count = messages.size();
    messages := Map.empty<Nat, Message>();
    count;
  };

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

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

