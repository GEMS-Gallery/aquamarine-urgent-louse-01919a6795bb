export const idlFactory = ({ IDL }) => {
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
