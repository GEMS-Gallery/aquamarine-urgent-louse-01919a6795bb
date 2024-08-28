import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Project {
  'id' : bigint,
  'title' : string,
  'featured' : boolean,
  'starred' : boolean,
  'author' : string,
  'category' : string,
  'image' : string,
}
export interface _SERVICE {
  'getProjects' : ActorMethod<[], Array<Project>>,
  'getProjectsByCategory' : ActorMethod<[string], Array<Project>>,
  'getProjectsByTab' : ActorMethod<[string], Array<Project>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
