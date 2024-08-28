export const idlFactory = ({ IDL }) => {
  const Comment = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Text,
    'author' : IDL.Text,
    'projectId' : IDL.Nat,
    'timestamp' : IDL.Int,
  });
  const Project = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'featured' : IDL.Bool,
    'starred' : IDL.Bool,
    'author' : IDL.Text,
    'category' : IDL.Text,
    'image' : IDL.Text,
  });
  return IDL.Service({
    'addComment' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [IDL.Nat], []),
    'getComments' : IDL.Func([IDL.Nat], [IDL.Vec(Comment)], ['query']),
    'getProjects' : IDL.Func([], [IDL.Vec(Project)], ['query']),
    'getProjectsByCategory' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Project)],
        ['query'],
      ),
    'getProjectsByTab' : IDL.Func([IDL.Text], [IDL.Vec(Project)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
