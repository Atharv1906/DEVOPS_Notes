import type { Track } from "./types";

export const gitTrack: Track = {
  id: "git",
  title: "Git",
  description: "Master version control from internals to enterprise workflows. Zero to hero.",
  longDescription:
    "Go beyond basic commands. Understand Git object model, the DAG, merge algorithms, rebase internals, and the workflows that power the world's largest engineering teams.",
  icon: "GitBranch",
  color: "#f05033",
  gradient: "track-git-gradient",
  tags: ["version-control", "collaboration", "workflow"],
  modules: [
    {
      id: "intro-to-git",
      title: "Introduction to Git",
      description: "Understand what Git really is under the hood, not just what it does.",
      level: "beginner",
      lessons: [
        {
          id: "what-is-git",
          title: "What Git Really Is — The Object Model",
          description: "Git is a content-addressable filesystem. Understanding this changes everything.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Describe Git's four object types: blob, tree, commit, tag",
            "Explain content-addressable storage and SHA-1 hashing",
            "Navigate the .git directory and understand each component",
            "Explain why Git is a Directed Acyclic Graph (DAG)",
          ],
          content: `## What Git Really Is

Most tutorials teach Git as a list of commands. That leaves you confused when things go wrong because you don't understand what the commands actually do. Let's fix that.

> **Key insight:** Git is a **content-addressable key-value store** with a version control interface built on top. Every piece of data is stored and retrieved by the SHA-1 hash of its content. This single fact explains all of Git's behaviour.

---

## The Four Object Types

Every piece of data Git ever stores is one of exactly four object types:

| Object | What it stores | Analogy |
|---|---|---|
| **blob** | Raw file content (no name, no permissions) | A file without a label |
| **tree** | Directory listing: filenames + modes + SHA refs | A folder structure |
| **commit** | Snapshot metadata: tree + parent(s) + author + message | A labelled snapshot |
| **tag** | Annotated pointer to another object | A post-it on a commit |

### Blobs — Content Without Context

A blob stores ONLY file content. No filename, no permissions. If two files have identical content, Git stores ONE blob and both tree entries point to it.

\`\`\`bash
# See what SHA a file would get
git hash-object README.md
# 8ab686eafeb1f44702738c8b0f24f2567c36da6d

# Git stores it at .git/objects/8a/b686eafeb1f...
# (first 2 chars = directory, remaining 38 = filename)

# Inspect any object
git cat-file -t 8ab686ea   # prints type: "blob"
git cat-file -p 8ab686ea   # prints raw content
\`\`\`

### Trees — Directory Snapshots

\`\`\`bash
git cat-file -p HEAD^{tree}
# 100644 blob a8b3f9... .gitignore
# 100644 blob 3c4def... README.md
# 040000 tree 7e8fab... src/
\`\`\`

Mode: \`100644\` = regular file, \`100755\` = executable, \`120000\` = symlink, \`040000\` = directory (sub-tree).

### Commits — Snapshots with Context

\`\`\`bash
git cat-file -p HEAD
# tree   4b825dc...       <- root tree SHA (full project snapshot)
# parent a1b2c3d4...      <- previous commit SHA (absent on first commit)
# author  Alice Chen <alice@co.com> 1700000000 +0530
# committer Alice Chen <alice@co.com> 1700000000 +0530
#
# feat: add OAuth2 login
\`\`\`

**author** = person who wrote the change. **committer** = person who applied it to the repo. These differ in patch-email workflows and after rebasing.

---

## The Directed Acyclic Graph (DAG)

Commits form a DAG — each commit points to its parent(s). The graph is:
- **Directed**: parent pointers flow backwards in time
- **Acyclic**: circular references are physically impossible (a commit's SHA depends on its parent's SHA — a loop would require knowing a SHA before it exists)

\`\`\`
A <- B <- C <- D  (main)
          ^
          E <- F  (feature)
\`\`\`

Branches are simply **named files** containing a 40-char SHA. Creating a branch writes a 41-byte file — O(1), instant, regardless of repo size.

---

## The .git Directory

\`\`\`
.git/
├── HEAD              <- current branch ("ref: refs/heads/main")
├── config            <- repo-local git config
├── index             <- staging area (binary file)
├── objects/          <- the object store
│   ├── 8a/b686...    <- loose objects (one file per object)
│   └── pack/         <- packed objects (after garbage collection)
├── refs/
│   ├── heads/main    <- contains SHA of main's latest commit
│   ├── remotes/      <- remote-tracking refs
│   └── tags/         <- tag refs
└── logs/HEAD         <- reflog: every HEAD position (your safety net)
\`\`\`

---

## Content Addressing in Practice

Because SHA-1 hashes content, identical content always gets the same hash:

\`\`\`bash
echo "hello" > file1.txt
echo "hello" > file2.txt
git add file1.txt file2.txt
git ls-files -s
# 100644 ce013625030ba8dba906f756967f9e9ca394464a 0 file1.txt
# 100644 ce013625030ba8dba906f756967f9e9ca394464a 0 file2.txt
# One blob stored, referenced twice in the tree
\`\`\`

Git's superpowers from content addressing:
1. **Deduplication** — identical content stored once
2. **Integrity** — any corruption changes the SHA (Git detects this)
3. **Efficient transfers** — only objects the remote lacks are transmitted

> **Tip:** Run \`git cat-file -p HEAD\` and \`git cat-file -p HEAD^{tree}\` right now on any repo. Seeing the raw objects makes everything else in Git click.`,
          interviewQuestions: [
            {
              question: "What happens internally when you run `git commit`? Walk through every step.",
              difficulty: "mid",
              answer: `1. **Compute blobs**: For each file in the staging area, Git checks if a blob with its SHA already exists. If so, it reuses it (deduplication). Otherwise, it writes a new blob object.
2. **Build tree objects**: Git recursively constructs tree objects from the index. Each directory becomes a tree pointing to blobs and sub-trees.
3. **Create the commit object**: Contains the root tree SHA, parent commit SHA(s), author name/email/timestamp, committer name/email/timestamp, and commit message.
4. **Compute the commit SHA**: SHA-1 of all the above. This is why amending a commit produces a new SHA — even changing one character of the message changes the hash.
5. **Update the branch ref**: The current branch file (e.g., .git/refs/heads/main) is overwritten with the new commit SHA.
6. **Write reflog entry**: .git/logs/HEAD records the transition for recovery.

Everything in Git is just reading and writing objects identified by SHA.`,
            },
            {
              question: "Why is circular reference in a Git commit graph physically impossible?",
              difficulty: "mid",
              answer: `A commit's SHA-1 hash is computed from its content, which includes the SHA-1 hash of its parent commit. To create a circular reference where commit B references C and C references B, you would need to know C's SHA before C exists — which requires running the hash function on content that includes C's own SHA. This is a preimage problem: finding x such that SHA1(x) = x is computationally infeasible (would require breaking SHA-1). The acyclic property is mathematically guaranteed by the hash function itself, not enforced by policy.`,
            },
            {
              question: "Two files in a repo have identical content. How many blob objects does Git store? What implications does this have?",
              difficulty: "junior",
              answer: `**One blob.** Content-addressable storage means the blob SHA is derived from file content only (not filename or path). Identical content produces identical SHA, so Git stores the blob once regardless of how many files reference it.

Implications:
- **Efficient storage**: Large codebases with repeated content (config templates, boilerplate) use much less disk than naive systems
- **Copy detection**: When you rename a file, Git sees the same blob in a different tree entry. \`git diff --find-renames\` uses this to report renames instead of delete+add
- **Cross-repo efficiency**: Server-side deduplication becomes possible since objects are content-identified globally`,
            },
            {
              question: "Your colleague says 'Git stores diffs between commits.' How do you correct this?",
              difficulty: "senior",
              answer: `**Incorrect — Git's conceptual model is snapshot-based, not diff-based.**

Each commit points to a complete tree object representing the full repository state. There are no diffs stored in Git's object model. When you run \`git diff\`, Git computes it on-demand by comparing two trees — it's not retrieving a stored diff.

**The confusion:** Git's storage layer (packfiles) uses delta compression for efficiency — similar blobs are stored as deltas to save space. But this is a hidden storage optimization, not the data model. The logical model is always: commit = complete snapshot.

**Why snapshot model matters:** Branching, checkout, and comparing arbitrary commits are all fast O(1) pointer operations. Systems storing diffs must replay history to reconstruct state — exponentially slower as history grows. This is why Git can instantly switch between branches that differ by thousands of files.`,
            },
            {
              question: "What is the difference between `author` and `committer` in a Git commit? When do they differ?",
              difficulty: "mid",
              answer: `**Author**: person who originally wrote the code change.
**Committer**: person who applied it to the repository.

They differ in several scenarios:
1. **Email-patch workflows** (Linux kernel): Linus Torvalds applies contributor patches — he's the committer, the patch writer is the author
2. **\`git cherry-pick\`**: Original author preserved, you become the committer
3. **\`git rebase\`**: Author preserved, committer becomes the rebaser with current timestamp
4. **\`git am\`** (apply mailbox): Same as cherry-pick

This matters for: \`git log --author\` filtering, contribution graphs, and audit trails where you need to distinguish who wrote code from who approved and applied it.`,
            },
          ],
        },
        {
          id: "git-installation",
          title: "Git Configuration & Setup",
          description: "Global config, aliases, SSH keys, GPG signing, and the config hierarchy.",
          type: "lesson",
          duration: 14,
          objectives: [
            "Configure identity, editor, and core settings at the appropriate level",
            "Create powerful aliases that speed up daily work",
            "Set up SSH keys and GPG commit signing",
            "Understand the config file hierarchy and precedence rules",
          ],
          content: `## Config Hierarchy

Three levels, each overrides the one above:

\`\`\`
/etc/gitconfig        system  (all users)         <- lowest priority
~/.gitconfig          global  (your user account)
.git/config           local   (this repo only)    <- highest priority
\`\`\`

\`\`\`bash
git config --list --show-origin   # see all settings + which file they came from
\`\`\`

---

## Essential Global Configuration

\`\`\`bash
git config --global user.name "Alice Chen"
git config --global user.email "alice@company.com"

# Editor (choose yours)
git config --global core.editor "vim"
# VS Code: "code --wait"  |  Neovim: "nvim"

# Modern defaults
git config --global init.defaultBranch main
git config --global diff.algorithm histogram    # better diff, finds block moves
git config --global pull.rebase true            # pull with rebase (linear history)
git config --global push.autoSetupRemote true   # auto-set tracking on new branches
git config --global push.default current        # push to same-named remote branch
git config --global commit.verbose true         # show full diff when writing message

# Line endings (commit LF, checkout platform-native)
git config --global core.autocrlf input         # Linux/macOS
\`\`\`

---

## Power Aliases

\`\`\`bash
git config --global alias.st "status -sb"
git config --global alias.lg "log --oneline --decorate --graph --all"
git config --global alias.lp "log -p --follow"
git config --global alias.br "branch -vv"
git config --global alias.last "log -1 HEAD --stat"
git config --global alias.undo "reset --soft HEAD~1"
git config --global alias.amend "commit --amend --no-edit"
git config --global alias.unstage "reset HEAD --"
git config --global alias.changed "diff --name-only HEAD~1 HEAD"
git config --global alias.fpush "push --force-with-lease"
git config --global alias.contributors "shortlog -sn --all"
\`\`\`

---

## SSH Key Setup

\`\`\`bash
# Generate Ed25519 key (preferred over RSA)
ssh-keygen -t ed25519 -C "alice@company.com" -f ~/.ssh/id_ed25519_github

# Add to agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_github

# ~/.ssh/config
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  AddKeysToAgent yes

# Copy public key -> GitHub Settings -> SSH Keys
cat ~/.ssh/id_ed25519_github.pub

# Test
ssh -T git@github.com
# Hi alice! You've successfully authenticated...
\`\`\`

---

## GPG Commit Signing

\`\`\`bash
gpg --full-generate-key           # RSA 4096

gpg --list-secret-keys --keyid-format=long
# sec rsa4096/3AA5C34371567BD2 ...

git config --global user.signingkey 3AA5C34371567BD2
git config --global commit.gpgSign true

# Export to GitHub Settings -> GPG Keys
gpg --armor --export 3AA5C34371567BD2

# Verify
git log --show-signature -1
\`\`\`

> **Tip:** Configure \`push.autoSetupRemote true\` — this eliminates the \`git push --set-upstream origin feature/xyz\` ceremony every time you push a new branch. One setting, saves thousands of keystrokes over a career.`,
          interviewQuestions: [
            {
              question: "What is the difference between `git config --global` and `git config --local`? Give a real scenario where you'd use --local.",
              difficulty: "junior",
              answer: `**\`--global\`** modifies \`~/.gitconfig\` — applies to all repos on your machine.
**\`--local\`** modifies \`.git/config\` in the current repo only — overrides global for this repo.

**Real scenario:** Your global config has your personal email \`alice@gmail.com\`. You start working on a client project. You run:
\`\`\`
cd client-project
git config --local user.email alice@clientcorp.com
git config --local user.signingkey CLIENT_GPG_KEY_ID
\`\`\`
Now commits in that repo use the client email and key, while all personal repos still use your personal identity. No global change needed.

Other uses: repo-specific merge strategies, different core.autocrlf settings, per-repo hooks directory.`,
            },
            {
              question: "A developer's commits show up as 'unknown' on GitHub with no avatar. What's the cause and fix?",
              difficulty: "junior",
              answer: `GitHub matches commits to user accounts by email address. If \`git config user.email\` doesn't match any email on the developer's GitHub account, the commit appears unattributed.

**Fix:**
1. Check current config: \`git config user.email\`
2. Ensure it matches an email added to GitHub account (Settings -> Emails)
3. Update: \`git config --global user.email correct@email.com\`

**For already-pushed commits:** The commits can't be re-associated without rewriting history. Going forward, new commits will correctly attribute. If attribution matters (open source contributor count, company audit), rewrite with \`git filter-repo --commit-callback\` to update the author email throughout history.

**Prevention:** Add a company-wide git config template that sets the email to \`user@company.com\` via \`init.templateDir\`.`,
            },
          ],
        },
      ],
      exam: [
        { question: "You join a team and your first commit shows up unattributed on GitHub. What do you check and fix?", answer: "Run `git config user.email` to check the configured email. If it doesn't match an email registered on your GitHub account, run `git config --global user.email your@github-email.com`. For the already-pushed commit, re-attribution isn't possible without rewriting history, but future commits will be correctly attributed.", difficulty: "junior" },
        { question: "A teammate claims 'Git saves diffs between versions.' How do you correct them, and what does Git actually store?", answer: "Git stores complete snapshots, not diffs. Each commit points to a full tree object representing the entire repository state at that moment. When you run `git diff`, Git computes it on-demand by comparing two tree objects — it's not retrieving a stored diff. The storage layer uses delta compression in packfiles as an optimization, but the logical data model is always snapshot-based.", difficulty: "junior" },
        { question: "You run `git init` on a new project. What files and directories are created inside `.git/`, and what is each one's purpose?", answer: "Key entries: `HEAD` (symbolic ref pointing to the current branch), `config` (repo-local git settings), `index` (the staging area — binary file), `objects/` (the content-addressable object store for blobs, trees, commits, and tags), `refs/heads/` (local branch refs), `refs/remotes/` (remote-tracking refs), `refs/tags/` (tag refs), and `logs/HEAD` (the reflog — every HEAD position for recovery).", difficulty: "junior" },
        { question: "Two separate files in your repo have identical content. How many blob objects does Git store, and why?", answer: "Git stores exactly one blob. Because blobs are identified by a SHA-1 hash of their content (not filename or path), identical content produces the same SHA. Both files' tree entries point to the single blob. This deduplication reduces storage and enables efficient transfers — only unique objects are sent over the network.", difficulty: "junior" },
        { question: "You need to configure your work laptop to sign commits with GPG for your company repo but keep your personal repos unsigned. How do you achieve this without changing your global config?", answer: "Use `git config --local` inside the company repo: `git config --local user.signingkey COMPANY_KEY_ID` and `git config --local commit.gpgSign true`. Local config in `.git/config` overrides global `~/.gitconfig`. Personal repos remain unaffected because they use the global settings.", difficulty: "mid" },
        { question: "Your team uses a monorepo and developers frequently clone it fresh. `npm install` after cloning takes 4 minutes. You notice `node_modules` content rarely changes between commits. What Git-level concept explains the inefficiency, and what would you investigate?", answer: "Git's object model stores the full snapshot on every commit regardless of what changed. For clones, all objects are transferred. The issue isn't Git itself — it's the post-clone setup. Investigation points: check if a `.gitignore` is correctly excluding `node_modules` (it should be), ensure the team uses `npm ci` with a lockfile, and consider Git LFS or a caching proxy (like Verdaccio) for npm packages. Also check if `git sparse-checkout` can help developers who only need part of the monorepo.", difficulty: "mid" },
        { question: "You accidentally committed your AWS credentials to git and pushed to a public GitHub repo. What are your immediate steps?", answer: "1. Immediately rotate/revoke the compromised credentials in AWS IAM — assume they are already compromised. 2. Remove the secret from the repo: use `git filter-repo --path credentials.txt --invert-paths` to rewrite history, then force-push. 3. Ask GitHub Support to clear cached views of the old commits. 4. Add the credentials file to `.gitignore`. 5. Audit AWS CloudTrail logs for any unauthorized access. Rotating credentials must happen before history rewriting — someone may have already scraped the public repo.", difficulty: "mid" },
        { question: "Explain why it is mathematically impossible to create a circular reference in a Git commit graph.", answer: "A commit's SHA-1 hash is computed from its content, which includes its parent's SHA-1. To create commit B pointing to C and C pointing back to B, you would need to know C's SHA before C exists — which requires running SHA-1 on content that includes C's own hash. This is a preimage problem: finding x such that SHA1(content_including_x) = x is computationally infeasible. The acyclic property is enforced by the hash function itself, not by policy or runtime checks.", difficulty: "senior" },
        { question: "A new developer set up their SSH key but `git push` still asks for a password. Walk through the debugging steps.", answer: "1. Check the remote URL: `git remote -v` — if it shows `https://`, the SSH key is irrelevant; change to SSH: `git remote set-url origin git@github.com:org/repo.git`. 2. Test SSH connectivity: `ssh -T git@github.com` — a successful auth prints 'Hi username!'. 3. Check the SSH agent: `ssh-add -l` — if the key isn't listed, run `ssh-add ~/.ssh/id_ed25519_github`. 4. Verify `~/.ssh/config` has the correct `IdentityFile` entry for `github.com`. 5. Confirm the public key is added to GitHub Settings → SSH Keys.", difficulty: "mid" },
        { question: "Your organization wants all developers to automatically use the company email in new repos without manual configuration. How do you enforce this with Git?", answer: "Use Git's `init.templateDir` setting. Create a template directory with a `hooks/` folder containing a `post-checkout` or `post-init` hook that runs `git config user.email $USER@company.com` if no local email is set. Configure `git config --global init.templateDir ~/.git-templates`. Alternatively, use a company-wide `.gitconfig` snippet distributed via onboarding scripts or configuration management (Ansible/Chef) that sets `user.email` and optionally uses a `includeIf` directive to apply company identity only in repos under a specific directory path.", difficulty: "senior" },
      ],
    },
    {
      id: "core-concepts",
      title: "Core Git Concepts",
      description: "Commits, branches, and merging — with internals exposed.",
      level: "beginner",
      lessons: [
        {
          id: "commits-and-history",
          title: "Commits, HEAD & History Navigation",
          description: "Commit anatomy, HEAD mechanics, detached HEAD, amending, and git log mastery.",
          type: "lesson",
          duration: 18,
          objectives: [
            "Describe every field in a commit object",
            "Explain HEAD and detached HEAD — and safely recover",
            "Navigate history with relative refs and git log filters",
            "Use git blame and git log -L for deep code archaeology",
          ],
          content: `## Commit Anatomy

\`\`\`bash
git cat-file -p HEAD
# tree   4b825dc...       <- root tree SHA (full project snapshot)
# parent a1b2c3d4...      <- previous commit (absent on first commit)
# author  Alice <a@co.com> 1700000000 +0530
# committer Alice <a@co.com> 1700000000 +0530
#
# feat: add OAuth2 login
#
# Implements Google + GitHub OAuth2 providers.
# Closes #142
\`\`\`

The commit message has a **subject line** (≤72 chars, imperative mood) and optional **body** separated by a blank line. Tools like \`git log --oneline\`, GitHub, and changelog generators all parse this format.

---

## HEAD — The Current Position

HEAD is almost always a symbolic ref pointing to a branch:

\`\`\`bash
cat .git/HEAD
# ref: refs/heads/main    <- attached HEAD (normal state)

cat .git/refs/heads/main
# a1b2c3d4...              <- commit SHA main points to
\`\`\`

When you commit, the branch pointer advances. HEAD indirectly follows.

---

## Detached HEAD State

HEAD points directly to a commit SHA instead of a branch:

\`\`\`bash
git checkout a1b2c3d4
cat .git/HEAD
# a1b2c3d4...   <- detached — no branch label!
\`\`\`

Safe for exploration. Danger: commits made in detached HEAD have no branch anchoring them. Switch away and they're orphaned (garbage-collected after 30 days).

\`\`\`bash
# Safe workflow
git checkout abc123         # explore
# Make commits if needed...
git checkout -b save-this   # CREATE A BRANCH before leaving!

# Recovery: orphaned commits via reflog
git reflog                  # find the SHA
git branch rescued abc123   # recreate
\`\`\`

---

## Amending Commits

\`\`\`bash
# Change the last commit message
git commit --amend -m "feat: add OAuth2 (Google + GitHub) (#142)"

# Add a forgotten file
git add forgotten.py
git commit --amend --no-edit    # same message

# Amend creates a NEW commit object. Old one stays in reflog 30 days.
# Never amend commits already pushed to shared branches.
\`\`\`

---

## Navigating History

\`\`\`bash
# Relative refs
HEAD~1       # one commit back
HEAD~3       # three commits back
HEAD^        # same as HEAD~1
HEAD^2       # second parent (merge commits only)
main~5       # five back from main tip

# Log views
git log --oneline --decorate --graph --all   # visual DAG
git log -p --follow src/auth.py              # full diffs + follow renames
git log -S "authenticate"                    # commits that added/removed this string
git log -G "regex.*pattern"                  # diff matches regex
git log --author="Alice" --since="1 week ago"

# Inspect
git show HEAD
git show HEAD~2:src/auth.py    # content of file at that commit

# Code archaeology
git blame -w -C src/auth.py                    # who changed each line
git log -L :authenticate:src/auth.py           # full history of a function
git log --diff-filter=D -- deleted-file.py     # find when file was deleted
\`\`\`

> **Tip:** \`git log -L :functionName:file.py\` (capital L, colon-function-colon-file) shows the complete evolution of a function through all time. Far more useful than blame for understanding WHY code looks the way it does.`,
          interviewQuestions: [
            {
              question: "What is a detached HEAD state? How do you safely work in it and preserve any commits you make?",
              difficulty: "mid",
              answer: `**Detached HEAD** = HEAD points to a commit SHA directly, not a branch name. Git's commit mechanism works normally, but commits have no branch anchoring them — they're "floating."

**Safe workflow:**
1. \`git checkout abc123\` — enter detached HEAD (e.g., to test an old version)
2. Explore, make changes, even commit
3. **BEFORE switching branches**: \`git checkout -b experiment\` — creates a branch at current HEAD, anchoring your commits
4. Now safely switch: \`git switch main\`

**If you forgot to create a branch:**
\`\`\`
git reflog
# abc123 HEAD@{3}: commit: my experimental fix
git branch rescue abc123   # recreate branch from that SHA
\`\`\`
Orphaned commits live in the object store for 30 days before \`git gc\` removes them.`,
            },
            {
              question: "How would you find which commit introduced a bug that appeared 3 months ago among 400+ commits?",
              difficulty: "mid",
              answer: `**Use \`git bisect\`** — binary search through history:
\`\`\`
git bisect start
git bisect bad HEAD           # current: has bug
git bisect good v3.1.0        # this release was clean

# Git checks out commit #200 (midpoint)
# Test the app...
git bisect good / git bisect bad
# Repeat ~9 times (log2(400) = ~9 checks)
# Git reports: "abc123 is the first bad commit"
git bisect reset
\`\`\`

**For automated bisect** (if you have a reproducing test):
\`\`\`
git bisect run ./reproduce-bug-test.sh
# Exits 0=good, non-zero=bad. Git runs automatically.
\`\`\`

**Also useful:**
\`\`\`
git log -S "suspectedFunction"   # find when a string appeared/disappeared
git log -G "regex"               # find commits where diff matches pattern
\`\`\``,
            },
          ],
        },
        {
          id: "branching",
          title: "Branching — Lightweight Pointers",
          description: "Branch internals, the ref system, tracking branches, and naming conventions.",
          type: "lesson",
          duration: 16,
          objectives: [
            "Explain why branch creation is O(1) in Git",
            "Use git switch for branch operations",
            "Understand remote-tracking branches and ahead/behind",
            "Design and enforce a branch naming convention",
          ],
          content: `## What Is a Branch?

A branch is a file in \`.git/refs/heads/\` containing a 40-char SHA:

\`\`\`bash
cat .git/refs/heads/main
# a1b2c3d4e5f6789abcdef0123456789abcdef01

# Creating a branch = writing one 41-byte file
git branch feature/auth
cat .git/refs/heads/feature/auth
# a1b2c3d4...   <- same commit — branches start at the same place
\`\`\`

**Branch creation is O(1).** No files copied, no history duplicated. SVN branches copy entire directory trees (O(n)). Git's O(1) branching is why short-lived feature branches are the norm.

---

## Branch Operations

\`\`\`bash
# List
git branch                  # local
git branch -r               # remote-tracking
git branch -vv              # with tracking + ahead/behind

# Create & switch (modern syntax)
git switch -c feature/login
git switch main

# From a specific point
git switch -c hotfix/bug main
git switch -c release/v2.4 v2.3.0   # from a tag

# Rename
git branch -m old-name new-name

# Delete
git branch -d feature/done          # safe (warns if unmerged)
git branch -D abandoned-work        # force (data loss risk)
git push origin --delete old-branch # delete on remote
\`\`\`

---

## Remote-Tracking Branches

Read-only local mirrors of the remote's branches as of last fetch:

\`\`\`bash
git branch -r
# origin/main
# origin/feature/auth

git branch -vv
# * feature/auth a1b2c3 [origin/feature/auth: ahead 2] Add JWT
#   main         d4e5f6 [origin/main] Initial commit
# "ahead 2" = 2 local commits not yet pushed

# Create local branch tracking remote
git switch -c feature/auth origin/feature/auth

# Fetch + prune dead remote branches
git fetch --prune
\`\`\`

---

## Branch Naming Convention

\`\`\`
feature/142-oauth-login         <- ticket # + description
bugfix/fix-session-expiry
hotfix/critical-xss-patch
chore/upgrade-to-node-20
release/v2.4.0
experiment/try-redis-caching
\`\`\`

Enforce with a pre-push hook or CI rule that rejects non-conforming names. Branch names should communicate who should care, not who wrote it.

> **Tip:** Use \`git switch\` instead of \`git checkout\` for branches — \`checkout\` is overloaded (it also restores files). \`switch\` is unambiguous. \`git switch -\` goes to the previous branch (like \`cd -\` in shell).`,
          interviewQuestions: [
            {
              question: "Why is branch creation O(1) in Git? Why does this matter for developer workflow?",
              difficulty: "junior",
              answer: `Creating a branch writes one file: \`.git/refs/heads/<name>\` containing a 40-char SHA. Constant time, constant space — 41 bytes regardless of repo size, number of commits, or number of files.

**Why it matters:** This makes branching essentially free, which unlocks:
- Short-lived feature branches (create-use-delete in hours)
- Experimental branches with zero risk (branch from main, experiment, delete if it fails)
- One branch per PR/ticket as standard practice
- Parallel work on multiple features simultaneously

Teams with expensive branching (SVN) develop habits of committing directly to trunk. This is riskier and makes code review harder. Git's O(1) branching is a key reason modern teams ship faster.`,
            },
            {
              question: "What is the difference between `origin/main` and local `main`? When do they diverge?",
              difficulty: "mid",
              answer: `**Local \`main\`**: your editable branch pointer. Advances when you commit locally.
**\`origin/main\`**: read-only local mirror of the remote's \`main\` as of your last \`git fetch\`. Cannot be committed to directly.

**When they diverge:**
- **You're ahead**: committed locally, not yet pushed → \`main\` is ahead of \`origin/main\`
- **You're behind**: someone else pushed to remote → \`origin/main\` advances after \`git fetch\`
- **Both ahead**: you and others both committed → branches diverged, need rebase or merge

\`git status\` reads this gap: "Your branch is 3 commits ahead of 'origin/main'."

**Key insight:** \`git fetch\` updates \`origin/main\` without touching local \`main\`. This lets you inspect remote changes before integrating them.`,
            },
            {
              question: "15 developers commit directly to main. Propose a branching strategy and justify it.",
              difficulty: "senior",
              answer: `**Recommendation: Trunk-Based Development with short-lived feature branches.**

**Branch protection rules on \`main\`:**
- Require PR + ≥1 approval + green CI to merge
- Disable force push
- Auto-delete merged branches
- Require up-to-date branch before merge (prevents stale merges)

**Developer workflow:**
\`\`\`
git switch -c feature/TICKET-123-add-auth main
# work 1-2 days max
# open PR, get reviewed, CI passes
# merge to main (squash or merge commit — pick one and enforce it)
# branch auto-deletes
\`\`\`

**Feature flags** for unfinished work shipped to prod but hidden from users.

**Why not GitFlow:** GitFlow's long-lived \`develop\` branch creates large, painful merges. Companies shipping daily (Google, Netflix, Shopify) use TBD. The shorter the branch lifetime, the smaller the merge conflict.

**Metrics to target:** PR open time <24h, branch lifetime <48h, CI duration <10min.`,
            },
          ],
        },
        {
          id: "merging",
          title: "Merging — The Three-Way Algorithm",
          description: "Merge internals, fast-forward vs recursive, conflict resolution, and merge strategies.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Explain three-way merge and what the merge base is",
            "Distinguish fast-forward from true merges",
            "Resolve merge conflicts systematically with context",
            "Apply squash, --no-ff, and other merge strategies",
          ],
          content: `## The Three-Way Merge Algorithm

Git uses three snapshots to compute a merge: **ours** (current branch), **theirs** (branch being merged), and the **merge base** (most recent common ancestor):

\`\`\`
       A (merge base)
      / \\
     B   C   <- each branch tip
      \\ /
       D   <- merge result
\`\`\`

**For each hunk:**
- Only ours changed from base → take ours
- Only theirs changed from base → take theirs
- Both changed identically → take the common result
- Both changed differently → **CONFLICT** (human resolves)

\`\`\`bash
# Find the merge base
git merge-base main feature/auth
# a1b2c3...

# See what each side changed relative to the base
git diff $(git merge-base main feature/auth) main
git diff $(git merge-base main feature/auth) feature/auth
\`\`\`

---

## Fast-Forward vs True Merge

**Fast-forward** (branch hasn't diverged):
\`\`\`
Before:  main: A-B   feature: A-B-C-D
After:   main: A-B-C-D  (pointer moved, no merge commit)
\`\`\`

**True merge** (branches diverged):
\`\`\`
Before:  main: A-B-E   feature: A-B-C-D
After:   main: A-B-E-M  (M has two parents: E and D)
\`\`\`

\`\`\`bash
git merge feature/auth              # fast-forward if possible
git merge --no-ff feature/auth      # always create merge commit
git merge --ff-only feature/auth    # fail if not fast-forwardable
git merge --squash feature/auth     # collapse to one staged change
\`\`\`

---

## Resolving Conflicts

\`\`\`bash
git merge feature/auth
# CONFLICT (content): Merge conflict in src/auth.py

# Conflicted file contains markers:
<<<<<<< HEAD
def authenticate(user, password):
    return bcrypt.check(password, user.hash)
=======
def authenticate(user, token):
    return jwt.verify(token, SECRET)
>>>>>>> feature/auth

# Resolution process:
# 1. Read git log to understand INTENT of each change
# 2. Edit file to the correct combined result (delete ALL markers)
# 3. git add src/auth.py
# 4. git commit

git merge --abort   # bail out entirely, return to pre-merge state

# Or use a visual tool:
git config --global merge.tool vscode
git mergetool   # shows base | ours | theirs | result panes
\`\`\`

---

## ORIG_HEAD Safety Net

Git saves HEAD before every merge/rebase/reset to ORIG_HEAD:

\`\`\`bash
git merge feature/auth
# Something went wrong:
git reset --hard ORIG_HEAD   # undo the entire merge
\`\`\`

> **Tip:** Before resolving a complex conflict, run \`git log --oneline main..feature/auth\` to understand what the feature was trying to accomplish. Mechanical conflict resolution (blindly picking one side) often introduces logic bugs worse than the original conflict.`,
          interviewQuestions: [
            {
              question: "Explain the three-way merge algorithm. Why does Git need the merge base?",
              difficulty: "senior",
              answer: `Three-way merge uses: **ours** (current branch), **theirs** (merging branch), and **merge base** (most recent common ancestor).

**Why the merge base is essential:** Without it, Git can't determine who changed what. Example: if line 42 says \`timeout = 30\` in ours and \`timeout = 60\` in theirs, is this a conflict? It depends entirely on the base:
- Base says \`timeout = 30\` → only they changed it → auto-accept theirs (no conflict)
- Base says \`timeout = 10\` → both changed it differently → **conflict, human decides**
- Base says \`timeout = 60\` → only we changed it → auto-accept ours (no conflict)

The merge base is the "before" reference that makes it possible to attribute each change to one side. Without it, every difference would require manual resolution — making automated merges impossible.`,
            },
            {
              question: "What is the difference between `git merge --no-ff` and `git merge --squash`?",
              difficulty: "mid",
              answer: `**\`--no-ff\`**: Always creates a merge commit even when fast-forward is possible. Full feature branch history preserved in main. \`git log --graph\` shows branch structure. You can \`git revert <merge-sha>\` to undo the entire feature atomically.

**\`--squash\`**: Condenses all feature commits into one staged change. You then create one commit. No merge commit created. Feature branch history is NOT in main — only the final state diff.

**When to use each:**
- \`--no-ff\`: Commits are meaningful and well-crafted, team cares about history, branch structure important for releases
- \`--squash\`: Feature branch has WIP/fixup noise, want clean linear history on main, GitHub "Squash and merge" button uses this

**Key difference in practice:** With \`--no-ff\`, \`git blame\` on main shows individual commit authors. With \`--squash\`, blame shows only the squash commit. Pick one strategy and enforce it consistently via branch protection.`,
            },
            {
              question: "Walk me through the complete conflict resolution process for a database schema migration conflict.",
              difficulty: "senior",
              answer: `This is high-stakes because database migrations often can't be mechanically merged.

**Step 1: Gather context**
\`\`\`
git log --merge        # which commits created the conflict
git show HEAD:db/migrations/003.sql        # our version
git show feature/auth:db/migrations/003.sql  # their version
\`\`\`

**Step 2: Understand intent** — don't look at diffs, look at purpose:
- Did both branches add columns? → Both sets of columns likely needed
- Did one rename a table the other is modifying? → Serious semantic conflict
- Are they independent changes to the same file? → Combine both

**Step 3: Resolve semantically**
\`\`\`sql
-- Correct merged migration includes BOTH changes:
ALTER TABLE users ADD COLUMN oauth_provider VARCHAR(50);   -- ours
ALTER TABLE users ADD COLUMN oauth_token TEXT;             -- theirs
\`\`\`

**Step 4: Mark resolved and test**
\`\`\`
git add db/migrations/003.sql
# Run migration against test DB to verify it works!
git commit
\`\`\`

**Prevention:** Use timestamped migration filenames (20240115143000_add_oauth.sql). Two developers creating migrations simultaneously get different filenames → no merge conflict at file level (only potential schema conflicts that tests catch).`,
            },
          ],
        },
      ],
      exam: [
        { question: "You run `git log --oneline` and see 400 commits. A bug was introduced somewhere in the last 3 months. How do you find the exact commit that caused it?", answer: "Use `git bisect`: run `git bisect start`, mark current commit as bad with `git bisect bad HEAD`, mark a known-good older commit with `git bisect good <sha>`. Git checks out the midpoint. Test and mark good/bad. Repeat ~9 times (log2(400)). Git reports the first bad commit. For automated testing, use `git bisect run ./test-script.sh` where exit 0 = good and non-zero = bad.", difficulty: "mid" },
        { question: "You made a commit with the wrong email address. The commit hasn't been pushed yet. How do you fix it?", answer: "Run `git commit --amend --reset-author` after correcting the email with `git config user.email correct@email.com`. This rewrites the commit object with the correct author and committer info. Since it hasn't been pushed, rewriting local history is safe. The old commit SHA is orphaned but accessible via reflog for 30 days.", difficulty: "junior" },
        { question: "What is a detached HEAD state? You've been experimenting in it and made 3 commits. How do you preserve that work?", answer: "Detached HEAD means HEAD points directly to a commit SHA rather than a branch name. Any commits made have no branch anchoring them and will be orphaned when you switch away. To preserve the work: run `git checkout -b experiment-branch` (or `git switch -c experiment-branch`) BEFORE switching back. This creates a branch at your current position, anchoring all 3 commits. If you've already switched away, find the SHA in `git reflog` and run `git branch rescue <sha>`.", difficulty: "mid" },
        { question: "A teammate force-pushed to `main` and your local `main` is now ahead with commits that don't exist on the remote. What happened and how do you reconcile?", answer: "The teammate rewrote the shared branch history (via rebase or reset --hard + force push), creating new commit SHAs. Your local `main` still has the old SHAs. Running `git pull` will try to merge two diverged histories. The correct recovery (if you have no local-only work to save) is `git fetch origin && git reset --hard origin/main`. If you have unique local commits, cherry-pick them onto the new history. Going forward, enforce branch protection to prevent force pushes to main.", difficulty: "senior" },
        { question: "Explain what `git merge --ff-only` does and when you would use it.", answer: "`--ff-only` performs the merge only if it can be done as a fast-forward (i.e., the current branch is a direct ancestor of the branch being merged). If the branches have diverged, the command fails with an error instead of creating a merge commit. Use it when you want to enforce linear history on a branch — for example, in a CI step that validates feature branches are rebased on top of main before merging, or in automated release scripts where you only want to advance a pointer.", difficulty: "mid" },
        { question: "15 developers are committing directly to `main` without PRs. Propose a branching strategy and the specific GitHub settings to enforce it.", answer: "Implement Trunk-Based Development with short-lived feature branches. GitHub settings: enable branch protection on `main` — require pull request with at least 1 approval, require status checks to pass, require branches to be up to date before merging, disable force push, enable auto-delete of merged branches. Developer workflow: branch from main, work 1-2 days max, open PR, get reviewed, merge via squash or merge commit (pick one and enforce). Use feature flags for long-running changes. Target: PR lifetime < 24 hours, CI < 10 minutes.", difficulty: "senior" },
        { question: "You need to understand who changed a specific function over the past year and why. What Git commands give you the most context?", answer: "Use `git log -L :functionName:file.py` to see the complete history of just that function across all commits. Use `git blame -w -C file.py` to see which commit last changed each line (-w ignores whitespace, -C detects moves from other files). For each interesting commit SHA, use `git show <sha>` to see the full diff and commit message. `git log -S 'function signature'` finds commits where that string was added or removed.", difficulty: "mid" },
        { question: "A merge conflict occurred in `src/config.py`. Walk through the systematic process of resolving it correctly.", answer: "1. Read the conflict markers: `<<<<< HEAD` is your version, `=======` divides them, `>>>>> branch-name` is theirs. 2. Run `git log --merge` to see which commits on each side created the conflict. 3. Run `git show HEAD:src/config.py` and `git show branch-name:src/config.py` to understand the full context of each side. 4. Edit the file to the semantically correct combined result — don't just pick one side blindly. 5. Remove all conflict markers. 6. Run tests to verify the resolved code works. 7. `git add src/config.py` and `git commit`. Use `git merge --abort` at any point to bail out entirely.", difficulty: "mid" },
        { question: "What is the merge base, and why is it essential for Git's three-way merge algorithm?", answer: "The merge base is the most recent common ancestor commit of the two branches being merged. It serves as the 'before' reference. Without it, Git cannot determine which side made each change. Example: if line 10 reads `timeout=60` in ours and `timeout=30` in theirs, the merge base tells Git who changed it: if the base says `timeout=60`, only they changed it (auto-accept); if base says `timeout=10`, both changed it differently (conflict). Without the merge base, every difference would require manual resolution. Find it with `git merge-base branch1 branch2`.", difficulty: "senior" },
        { question: "You are asked to do a code review and notice the PR has 23 commits with messages like 'WIP', 'fix', 'oops'. How do you ask the developer to clean this up, and what commands would they use?", answer: "Ask them to use interactive rebase to clean up before review: `git rebase -i origin/main`. In the editor, they can: use `reword` to fix commit messages, `squash` or `fixup` to combine related commits (e.g., 'WIP' + 'fix' + 'oops' into one meaningful commit), and `drop` to remove accidental commits. The result should be a small number of well-described commits, each representing a logical unit of change. After cleaning up, they force-push with `git push --force-with-lease`. Review the rebased commits via `git log --oneline origin/main..HEAD`.", difficulty: "mid" },
      ],
    },
    {
      id: "advanced-git",
      title: "Advanced Git",
      description: "Rebase internals, undoing changes, bisect, and workflow mastery.",
      level: "intermediate",
      lessons: [
        {
          id: "rebasing",
          title: "Rebasing — Rewriting History",
          description: "Rebase internals, interactive rebase, golden rule, and rebase vs merge.",
          type: "lesson",
          duration: 22,
          objectives: [
            "Explain step-by-step what git rebase does internally",
            "Use interactive rebase to squash, fixup, reorder, and split commits",
            "State and apply the golden rule of rebasing",
            "Choose between rebase and merge for different scenarios",
          ],
          content: `## How Rebase Works Internally

Rebase **replays** commits as new commits on a new base. It does NOT move commits:

\`\`\`
Before:  main: A-B-C
         feature:     D-E-F

git rebase main (from feature branch)

After:   main: A-B-C
         feature:     D'-E'-F'
\`\`\`

D', E', F' are NEW commit objects with new SHAs. The original D, E, F are orphaned (reflog holds them 30 days).

**Step-by-step algorithm:**
1. Find merge base of feature and main (common ancestor)
2. Save the diff of each commit from the merge base forward
3. Checkout main's tip (C)
4. Apply each saved diff as a new commit
5. If conflict → pause, you resolve, \`git rebase --continue\`
6. Move feature branch pointer to the new tip

---

## Interactive Rebase

\`\`\`bash
git rebase -i HEAD~5
# Editor opens:

pick a1b2c3 Fix login bug
pick d4e5f6 WIP: start oauth
pick 7g8h9i WIP: oauth almost done
pick 1j2k3l Fix typo
pick 3m4n5o Add oauth tests

# Clean up to:
pick   a1b2c3 Fix login bug
reword d4e5f6 feat: add OAuth2 (Google + GitHub)
squash 7g8h9i WIP: oauth almost done
fixup  1j2k3l Fix typo
pick   3m4n5o test: add OAuth2 integration tests
\`\`\`

**Commands:**
- \`pick\` — use unchanged
- \`reword\` — edit the message (pauses editor)
- \`edit\` — pause to amend, add files, or split
- \`squash\` — combine with previous, merge messages
- \`fixup\` — combine with previous, discard message
- \`drop\` — delete entirely (dangerous if later commits depend on it)
- Reorder lines to reorder commits

---

## Splitting a Commit

\`\`\`bash
git rebase -i HEAD~3
# Mark target commit as "edit"

# Git pauses at that commit
git reset HEAD~1             # uncommit, keep as staged
git add -p                   # stage only part 1
git commit -m "Part 1: add login form"
git add -p                   # stage part 2
git commit -m "Part 2: add form validation"
git rebase --continue
\`\`\`

---

## The Golden Rule of Rebasing

> **Never rebase commits that have been pushed to a shared branch that others have pulled from.**

Rebase creates new SHAs. If others pulled the old SHAs, their next pull sees both the old AND new history — orphaned duplicates, confusing divergence, broken \`git log --graph\`.

\`\`\`bash
# SAFE: your own feature branch
git rebase main
git push --force-with-lease   # ok, only you use this branch

# DANGEROUS: public shared branch
git rebase -i main            # rewrites public history
git push --force              # BREAKS all teammates
\`\`\`

---

## Rebase vs Merge Guide

| Scenario | Recommendation |
|---|---|
| Update feature from main | Rebase (keeps linear history) |
| Long-lived shared branches | Merge (safe) |
| Before PR review (cleanup) | Rebase + squash |
| After PR reviewed | Don't rebase (reviewers checked specific SHAs) |

> **Tip:** \`git rebase --autostash --autosquash origin/main\` — automatically stashes uncommitted changes, rebases, applies autosquash fixup commits in order, then restores stash. One command to clean up and rebase.`,
          interviewQuestions: [
            {
              question: "What is the golden rule of rebasing? What happens if you break it?",
              difficulty: "mid",
              answer: `**Rule:** Never rebase commits that have been pushed to a branch other people have pulled from.

**What happens if broken:**
1. Rebase creates new commits (D', E', F') with new SHAs on remote
2. Other developers have the old commits (D, E, F) locally
3. Their next \`git pull\` sees two divergent histories (old SHAs + new SHAs with no common ancestor after the rebase point)
4. They get a confusing "diverged" state and accidentally create merge commits re-introducing the "old" commits
5. Result: history has both old and new versions of commits — the repo is a mess

**Recovery for the victims:** \`git fetch && git reset --hard origin/main\` — but they lose any unpushed local work.

**Safe force push:** At minimum use \`--force-with-lease\` to protect against overwriting others' commits on the branch.`,
            },
            {
              question: "Walk through what `git rebase -i HEAD~3` does when you squash two commits into one.",
              difficulty: "senior",
              answer: `1. Git identifies the 3 commits and the commit just before them (HEAD~3 = new rebase target)
2. Editor opens showing 3 commits as \`pick\`
3. You change second to \`squash\`, save, close editor
4. Git starts replaying: picks first commit (C1) by applying its diff onto HEAD~3 — new commit C1' created with new SHA
5. For \`squash\`: Git applies C2's diff on top, then opens editor to combine the two commit messages into one
6. Result: one new commit C1' containing both C1 and C2's changes
7. Third commit (originally C3) is replayed as C3' on top of C1'
8. Branch pointer moves to C3'

**Net result:** 3 original commits → 2 new commits (one squashed, one normal). All have new SHAs. The original 3 commits are orphaned in the object store, accessible via reflog for 30 days.`,
            },
            {
              question: "Your team runs `git rebase origin/main` in CI before allowing merges. A developer's branch has 20 commits and fails with 12 conflicts. What are your recommendations?",
              difficulty: "senior",
              answer: `**Root cause:** The developer's branch has diverged significantly from main — long-lived branch with many commits touching the same areas as others.

**Immediate solutions:**

1. **Squash first, then rebase:** 20 commits → 1 commit → only one conflict point to resolve
\`\`\`
git rebase -i origin/main~20   # squash all to 1
git rebase origin/main         # now only 1 patch to apply
\`\`\`

2. **Merge instead for this PR:** \`git merge origin/main\` resolves conflicts once rather than 20 times. Less clean history but pragmatic.

3. **Identify independent conflict layers:** Some conflicts may be simple (formatting), others semantic. Prioritize understanding the semantic ones.

**Prevention (the real fix):**
- Developers should rebase on \`origin/main\` daily
- PRs should be smaller (max 400 LOC, 1-2 days of work)
- Short-lived branches = trivial merges
- Assign clear ownership of modules to reduce simultaneous editing of same files`,
            },
          ],
        },
        {
          id: "undoing-changes",
          title: "Undoing Changes & Disaster Recovery",
          description: "reset, revert, stash, the reflog, and recovering from any local disaster.",
          type: "lesson",
          duration: 20,
          objectives: [
            "Choose the right undo tool for each scenario",
            "Use the reflog to recover from any local disaster",
            "Distinguish revert from reset for shared branches",
            "Use git stash for quick context switches",
          ],
          content: `## Undo Decision Framework

\`\`\`
Has the commit been pushed to a shared branch?
├── NO  -> git reset (rewrite local history freely)
└── YES -> git revert (add an inverse commit — safe)

Is the mistake in uncommitted changes?
├── Staged  -> git restore --staged <file>
└── Unstaged -> git restore <file>  [DESTRUCTIVE — no recovery!]
\`\`\`

---

## git reset — Three Modes

\`\`\`bash
# --soft: move HEAD only. Index and working dir unchanged.
git reset --soft HEAD~1
# When: "I committed too early, want to add more to this commit"
# Effect: changes stay staged, ready to commit again

# --mixed (default): move HEAD + reset index. Working dir unchanged.
git reset HEAD~1
# When: "Uncommit and unstage — I'll re-stage selectively"
# Effect: changes appear as unstaged modifications

# --hard: move HEAD + reset index + reset working dir
git reset --hard HEAD~1
# When: "Throw away the last commit AND its changes completely"
# WARNING: working dir changes are gone (but reflog saves past commits)
\`\`\`

---

## git revert — Safe Undo for Shared History

\`\`\`bash
git revert HEAD              # undo last commit
git revert a1b2c3d4          # undo a specific commit
git revert HEAD~3..HEAD      # undo last 3 commits (3 revert commits)
git revert -n a1b2c3d4       # stage revert without committing

# Reverting a merge commit (specify which parent to keep)
git revert -m 1 <merge-sha>  # -m 1 = keep main parent, undo merged branch
\`\`\`

**The rule:** reset for local/unpushed, revert for shared branches.

---

## The Reflog — 30-Day Safety Net

\`\`\`bash
git reflog
# a1b2c3 HEAD@{0}: commit: Add OAuth
# d4e5f6 HEAD@{1}: rebase (finish)
# 7g8h9i HEAD@{2}: reset: moving to HEAD~1

# Recover from any local disaster:
git reset --hard HEAD@{2}         # go back to any reflog position
git checkout -b rescue HEAD@{5}   # branch off any past position
\`\`\`

Reflog retains entries for 30 days (\`gc.reflogExpire\`). This window lets you recover from accidental \`reset --hard\`, deleted branches, bad rebases — any local disaster.

---

## git stash

\`\`\`bash
git stash push -m "WIP: auth middleware"
git stash list
git stash pop                    # apply + remove from list
git stash apply stash@{0}        # apply + keep in list
git stash -u                     # include untracked files
git stash push -p                # interactive partial stash
git stash branch new-branch      # create branch from stash context
\`\`\`

---

## Disaster Recovery Scenarios

\`\`\`bash
# "git reset --hard lost my work"
git reflog
git reset --hard HEAD@{1}     # go back to before the reset

# "I deleted a branch with commits"
git reflog | grep "feature/deleted"
git branch rescue <SHA>

# "Bad merge"
git reset --hard ORIG_HEAD    # ORIG_HEAD saved before merge/rebase

# "Orphaned commits after rebase"
git fsck --lost-found         # finds ALL unreachable objects
\`\`\`

> **Tip:** Before any risky operation, run \`git branch backup\` to create a branch at current HEAD. If anything goes wrong, that branch still points to where you were. It costs nothing (41 bytes) and has saved many developers.`,
          interviewQuestions: [
            {
              question: "Explain `git reset --soft`, `--mixed`, and `--hard` with a concrete example of when you'd use each.",
              difficulty: "mid",
              answer: `All three move the branch pointer (HEAD). What differs is how far the change propagates through Git's three trees.

**\`--soft\`:** Move HEAD only. Index and working dir unchanged.
*When:* "I committed too soon — forgot to add a file." \`git reset --soft HEAD~1\` uncommits but keeps everything staged. Add the forgotten file, then commit again.

**\`--mixed\` (default):** Move HEAD + reset index. Working dir unchanged.
*When:* "I committed unrelated changes together." \`git reset HEAD~1\` unstages everything. Now use \`git add -p\` to carefully re-stage only the first logical change, commit, then stage and commit the rest.

**\`--hard\`:** Move HEAD + reset index + reset working dir.
*When:* "This entire experiment failed — throw everything away." \`git reset --hard origin/main\` discards local commits AND uncommitted changes, returning you to remote state.

**Recovery safety net:** All three are recoverable via \`git reflog\` as long as the changes were previously committed. Uncommitted working dir changes lost by \`--hard\` are gone forever.`,
            },
            {
              question: "A critical commit was pushed to `main` 2 weeks ago and 40 developers have pulled it. How do you undo it?",
              difficulty: "senior",
              answer: `**Use \`git revert\`** — never \`git reset\` + force push. Rewriting 40 developers' shared history would break everyone.

\`\`\`
git revert abc123
git push origin main
\`\`\`

If abc123 was a merge commit:
\`\`\`
git revert -m 1 abc123   # -m 1: keep main parent, revert the feature
git push origin main
\`\`\`

**Complications to handle:**
- If later commits depend on abc123's changes, the revert will conflict with them. Resolve carefully — understand the dependency chain.
- The reverted changes may need to be re-introduced later (after a fix): \`git revert <revert-commit-sha>\` un-reverts.
- If abc123 introduced a security vulnerability: also audit logs to see who accessed what, rotate affected credentials, notify security team.

**Why not force push:** All 40 developers would need to \`git reset --hard origin/main\` (losing local work) or face complex divergence. Never worth it for a fix that can be done with revert.`,
            },
            {
              question: "What is the reflog? When would you use it over other recovery methods?",
              difficulty: "mid",
              answer: `The reflog (\`.git/logs/HEAD\`) records every position HEAD has been in — every commit, checkout, merge, rebase, reset. It's Git's local audit log.

\`\`\`
git reflog
# a1b2c3 HEAD@{0}: commit: latest change
# d4e5f6 HEAD@{1}: rebase (finish)
# 7g8h9i HEAD@{2}: reset: moving to HEAD~3
\`\`\`

**Use reflog when:**
- \`git reset --hard\` accidentally discarded commits — find the SHA before the reset and \`git reset --hard HEAD@{N}\`
- A branch was accidentally deleted — find the last commit on that branch and \`git branch recovered <sha>\`
- After a bad rebase — find where HEAD was before the rebase and \`git reset --hard HEAD@{N}\`
- Any time you need to undo a Git operation that changed HEAD

**Limitations:** Reflog is local only (not shared with remotes), and entries expire after 30 days. For remote-side recovery, \`git push --force\` by someone else, check if other developers still have the commits locally.`,
            },
          ],
        },
      ],
      exam: [
        { question: "Your feature branch has 15 WIP commits. Before opening a PR, you want to squash them into 3 logical commits. What is the exact process?", answer: "Run `git rebase -i origin/main` (or `git rebase -i HEAD~15`). In the editor, keep the first commit of each logical group as `pick`, change the rest in each group to `fixup` (discard their messages) or `squash` (merge messages). Use `reword` on the `pick` commits to write clean messages. Save and close. Resolve any conflicts that arise, running `git rebase --continue` after each. Force-push with `git push --force-with-lease`.", difficulty: "mid" },
        { question: "You ran `git reset --hard HEAD~3` to undo three commits but realize you needed the second one. How do you recover it?", answer: "Use `git reflog` to find the SHA of the commit you want to recover. The reflog records every HEAD position, so the three discarded commits will appear as entries shortly before the reset operation. Once you have the SHA, either: `git cherry-pick <sha>` to apply that commit's changes onto the current HEAD, or `git branch recovered-work <sha>` to create a branch preserving that exact state. Commits stay in the reflog for 30 days before garbage collection.", difficulty: "mid" },
        { question: "What is the golden rule of rebasing? A colleague breaks it on a shared branch — what happens to the rest of the team, and how do they recover?", answer: "The golden rule: never rebase commits that have been pushed to a branch others have already pulled from. When broken: the remote gets new commit SHAs (D', E', F'). Other developers still have the old SHAs (D, E, F) locally. Their next `git pull` sees two divergent histories — `git log --graph` shows duplicated commits. Recovery for victims: `git fetch origin && git reset --hard origin/main` (discards any local-only work). Going forward, enforce `--force-with-lease` at minimum and disallow force-pushes to shared branches via branch protection.", difficulty: "senior" },
        { question: "Explain the difference between `git revert` and `git reset` for undoing a commit. When should you use each?", answer: "**`git reset`** moves the branch pointer backward, rewriting history. Use it only for local/unpushed commits. `--soft` keeps changes staged, `--mixed` unstages them, `--hard` discards them entirely. **`git revert`** creates a new commit that applies the inverse diff of the target commit — history is preserved, not rewritten. Use it whenever the commit has been pushed to a shared branch (anyone could have pulled it). Revert is always safe for shared branches; reset on shared branches breaks teammates' history.", difficulty: "mid" },
        { question: "A critical commit was pushed to `main` 2 weeks ago and all 30 developers have pulled it. You need to undo its changes. What is the safest approach?", answer: "Use `git revert <commit-sha>` — this creates a new commit that undoes the changes, leaving all prior history intact. For a merge commit, use `git revert -m 1 <sha>` to specify which parent to keep. Push the revert commit to main normally (no force push needed). All 30 developers will pull the revert commit cleanly on their next `git pull`. Never use `git reset` + force push in this scenario — it would break everyone's local history and force each developer to manually recover.", difficulty: "senior" },
        { question: "What is interactive rebase's `edit` command used for, and walk through splitting one large commit into two smaller ones.", answer: "The `edit` command pauses the rebase at that commit so you can amend it. To split: run `git rebase -i HEAD~N`, mark the target commit as `edit`. When Git pauses there, run `git reset HEAD~1` to uncommit but keep the changes as unstaged. Use `git add -p` to interactively stage only the first logical chunk, then `git commit -m 'Part 1: description'`. Stage the remaining changes and `git commit -m 'Part 2: description'`. Then run `git rebase --continue` to finish replaying the remaining commits.", difficulty: "senior" },
        { question: "Your team's CI runs `git rebase origin/main` before merging. A developer's branch has 20 commits and fails with 15 conflicts. What are your tactical and strategic recommendations?", answer: "**Tactical (fix this PR now):** Squash the 20 commits into 1 first (`git rebase -i origin/main~20`), then rebase onto origin/main — one patch, one set of conflicts to resolve instead of 15. Alternatively, `git merge origin/main` to resolve all conflicts at once and move on. **Strategic (prevent recurrence):** Set a policy that branches are rebased on origin/main daily. Keep PRs small — max 1-2 days of work, < 400 lines changed. Assign module ownership to reduce different developers editing the same files simultaneously. Set a branch age warning in CI.", difficulty: "senior" },
        { question: "You accidentally deleted a local branch that had 5 commits not yet pushed. How do you recover it?", answer: "Run `git reflog` and look for the last commit that was on the deleted branch — it will appear in the log as the tip before the branch was deleted. Note its SHA. Then run `git branch recovered-branch <sha>` to recreate the branch pointing at that commit. All 5 commits are still in the object store (for 30 days). If unsure which SHA, `git reflog --all` shows refs for all branches including recently deleted ones. Also try `git fsck --lost-found` which collects all unreachable objects.", difficulty: "mid" },
        { question: "Explain the three modes of `git stash` — when do you use `stash push`, `stash pop`, and `stash apply`?", answer: "`git stash push -m 'description'` saves all tracked modified files (and optionally untracked with `-u`) onto a stack, restoring the working directory to a clean state. Use it when you need to urgently switch context (e.g., hotfix on another branch) without committing incomplete work. `git stash pop` re-applies the most recent stash and removes it from the stack — use when you're returning to the stashed work and don't need to keep the stash entry. `git stash apply stash@{N}` applies a specific stash but keeps it on the stack — use when you want to apply the same stash multiple times or on multiple branches.", difficulty: "junior" },
        { question: "Before a risky `git rebase -i` that will restructure 10 commits, what safety steps should you take, and how do you recover if the rebase goes wrong?", answer: "**Before:** Create a backup branch: `git branch backup-before-rebase` — costs nothing (41 bytes) and preserves your current state. Note the current HEAD SHA from `git log --oneline -1`. **During:** If a conflict looks complex, `git rebase --abort` immediately returns to the pre-rebase state. **After (if something went wrong):** Check `git reflog` for the state just before the rebase started. Run `git reset --hard HEAD@{N}` where N is the reflog entry prior to the rebase. Or simply: `git reset --hard backup-before-rebase` to restore from the backup branch. Delete the backup branch once the rebase is confirmed good.", difficulty: "mid" },
      ],
    },
  ],
};
