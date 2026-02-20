import Map "mo:core/Map";
import Nat "mo:core/Nat";

module {
  type OldMessage = {
    id : Nat;
    text : Text;
    timestamp : Int;
  };

  type OldActor = {
    nextMessageId : Nat;
    messages : Map.Map<Nat, OldMessage>;
  };

  type NewMessage = {
    id : Nat;
    personName : Text;
    text : Text;
    timestamp : Int;
  };

  type NewActor = {
    nextMessageId : Nat;
    messages : Map.Map<Nat, NewMessage>;
  };

  public func run(old : OldActor) : NewActor {
    let newMessages = old.messages.map<Nat, OldMessage, NewMessage>(
      func(_id, oldMessage) {
        { oldMessage with personName = "" };
      }
    );
    { old with messages = newMessages };
  };
};
