import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";

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

  stable var projects : [Project] = [
    { id = 1; title = "Corporate Dashboard"; category = "Corporate"; author = "John Smith"; image = "C"; featured = true; starred = false },
    { id = 2; title = "Artist Portfolio"; category = "Creative"; author = "Emma Johnson"; image = "A"; featured = true; starred = true },
    { id = 3; title = "E-commerce Platform"; category = "Retail"; author = "Alex Brown"; image = "E"; featured = false; starred = false },
    { id = 4; title = "Mobile Game"; category = "Entertainment"; author = "Sarah Lee"; image = "M"; featured = false; starred = true },
  ];

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
}
