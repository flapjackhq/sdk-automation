export type GuidesToPush = {
  // the type of changes to push to the repository (post-processing of files will be performed)
  type: 'guides';

  // the name of the guides to push in this pull request, when empty, every guides are pushed
  names?: string[];

  // the name of the JSON file output that will contain every guides in `names`
  output: string;

  // a key-value of the variable in guides to replace, with the name you'd like to use instead
  placeholderVariables?: Record<string, string>;
};

export type SpecsToPush = {
  // the type of changes to push to the repository
  type: 'specs';

  // the ext of the specs to be pushed to the repository
  ext: 'json' | 'yml';

  // whether we should include code snippets or not
  includeSnippets?: boolean;

  // whether we should include SLA related informations or not
  includeSLA?: boolean;

  // the name of the directory to push the files to
  output: string;

  // a key-value of the fields to replace, with the name you'd like to use instead
  placeholderVariables?: Record<string, string>;

  // the name of the clients to push in this pull request, when empty, every clients are pushed
  clients?: string[];
};

type RepositoryTask = {
  // the name of the pull request branch
  prBranch: string;

  // the commit message of the pull request (will also be used as the title)
  commitMessage: string;

  files: GuidesToPush | SpecsToPush;
};

export type RepositoryConfiguration = {
  // the name of the branch to base the pull request on
  baseBranch: string;

  // the pull requests tasks to create for this repository
  tasks: Array<RepositoryTask>;
};

// Flapjack: External repository push configs (placeholder — add as needed)
export const pushToRepositoryConfiguration: {
  [k in 'docs']: RepositoryConfiguration;
} = {
  docs: {
    baseBranch: 'main',
    tasks: [
      {
        prBranch: 'feat/automated-update-for-specs',
        commitMessage: 'feat: update specs and supported versions',
        files: {
          type: 'specs',
          ext: 'yml',
          output: 'specs',
          includeSnippets: true,
          includeSLA: true,
          placeholderVariables: { 'openapi: 3.0.2': 'openapi: 3.1.0' },
        },
      },
    ],
  },
};
