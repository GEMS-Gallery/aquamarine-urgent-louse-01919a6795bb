import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Time "mo:base/Time";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";

actor {
  type Project = {
    id: Nat;
    title: Text;
    category: Text;
    author: Text;
    image: Text;
    featured: Bool;
    starred: Bool;
  };

  type Comment = {
    id: Nat;
    projectId: Nat;
    author: Text;
    content: Text;
    timestamp: Int;
  };

  stable var projects : [Project] = [
    { id = 1; title = "Corporate Dashboard"; category = "Corporate"; author = "John Smith"; image = "C"; featured = true; starred = false },
    { id = 2; title = "Artist Portfolio"; category = "Creative"; author = "Emma Johnson"; image = "A"; featured = true; starred = true },
    { id = 3; title = "E-commerce Platform"; category = "Retail"; author = "Alex Brown"; image = "E"; featured = false; starred = false },
    { id = 4; title = "Mobile Game"; category = "Entertainment"; author = "Sarah Lee"; image = "M"; featured = false; starred = true },
  ];

  stable var comments : [Comment] = [];
  stable var nextCommentId : Nat = 1;

  public query func getProjects() : async [Project] {
    projects
  };

  public query func getProjectsByCategory(category: Text) : async [Project] {
    Array.filter(projects, func (p: Project) : Bool { p.category == category })
  };

  public query func getProjectsByTab(tab: Text) : async [Project] {
    switch (tab) {
      case ("Featured") Array.filter(projects, func (p: Project) : Bool { p.featured });
      case ("Latest") Array.reverse(projects);
      case ("Starred") Array.filter(projects, func (p: Project) : Bool { p.starred });
      case (_) projects;
    }
  };

  public query func getComments(projectId: Nat) : async [Comment] {
    Array.filter(comments, func (c: Comment) : Bool { c.projectId == projectId })
  };

  public func addComment(projectId: Nat, author: Text, content: Text) : async Nat {
    let comment : Comment = {
      id = nextCommentId;
      projectId = projectId;
      author = author;
      content = content;
      timestamp = Int.abs(Time.now());
    };
    comments := Array.append(comments, [comment]);
    nextCommentId += 1;
    comment.id
  };
}
