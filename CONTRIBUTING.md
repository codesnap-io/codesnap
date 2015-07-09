/////////////////////////////////////////////////////////
/// 1. Branch Naming Convention
/////////////////////////////////////////////////////////

A) Name branches based on what you're working on:
  - bug/...
  - feat/...
  - test/...
  - doc/...
  - refactor/...


Creates your branch and brings you there
git checkout -b `your-branch-name`

/////////////////////////////////////////////////////////
/// 2. Commit Description Convention
/////////////////////////////////////////////////////////

A) Keep everything in present tense

B) Prefix each commit like so
  - (feat) Add a new feature
  - (fix) Fix inconsistent tests [Fixes #0]
  - (refactor) ...
  - (cleanup) ...
  - (test) ...
  - (doc) ...


/////////////////////////////////////////////////////////
/// 3. Squashing Commits
/////////////////////////////////////////////////////////

A) Minimize the number of commits so tha upstream master branch is as clean as possible
B) Use command git rebase -i HEAD~<# of commits>
C) Replace the word "pick" with "squash" on commits you want to merge with the commit above
D) For additional reference, check out this article
https://github.com/ginatrapani/todo.txt-android/wiki/Squash-All-Commits-Related-to-a-Single-Issue-into-a-Single-Commit


/////////////////////////////////////////////////////////
/// 4. GitHub Workflow
/////////////////////////////////////////////////////////

A) Set Up
  - Create Org Repo
  - Fork Repo
  - Clone Fork
B) Writing Code
  - Write Code
  - Branch
  - Commit
  - Squash commits
C) Pull Request Prep/Submission
  - Rebase from org repo
  - Deal with merge conflicts (with team, if possible)
  - Push to branch in forked repo
  - Pull request
  - Wait for CI to pass 
D) Merging Pull Requests
  - Merge pull request (try to find someone else to do it)
