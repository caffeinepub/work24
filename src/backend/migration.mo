import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";

module {
  type OldActor = {
    messages : List.List<(Text, Time.Time)>;
  };

  type NewActor = {
    messages : Map.Map<Nat, { id : Nat; text : Text; timestamp : Time.Time }>;
    nextMessageId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    var id = 0;
    let newMessages = old.messages.foldLeft(
      Map.empty<Nat, { id : Nat; text : Text; timestamp : Time.Time }>(),
      func(acc, (text, timestamp)) {
        let message = {
          id;
          text;
          timestamp;
        };
        id += 1;
        acc.add(message.id, message);
        acc;
      },
    );
    { messages = newMessages; nextMessageId = 0 };
  };
};
