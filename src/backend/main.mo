import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

actor {
  let messages = List.empty<(Text, Time.Time)>();

  public shared ({ caller }) func addMessage(message : Text) : async () {
    messages.add((message, Time.now()));
  };

  public query ({ caller }) func getMessages() : async [(Text, Time.Time)] {
    messages.toArray();
  };

  public query ({ caller }) func getMessagesByTimestamp() : async [(Text, Time.Time)] {
    messages.values().toArray();
  };
};
