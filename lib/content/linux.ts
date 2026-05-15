import type { Track } from "./types";

export const linuxTrack: Track = {
  id: "linux",
  title: "Linux",
  description: "Master the Linux operating system from the ground up",
  longDescription:
    "Linux powers 96% of the world's servers. This course takes you from the shell basics through process management, storage, networking, scripting, and security hardening — everything a DevOps engineer needs.",
  icon: "Terminal",
  color: "#f97316",
  gradient: "track-linux-os-gradient",
  tags: ["linux", "shell", "bash", "sysadmin", "devops"],
  modules: [
    {
      id: "linux-fundamentals",
      title: "Linux Fundamentals",
      level: "beginner",
      description: "Understand the Linux architecture, navigate the shell, and manage files and users.",
      lessons: [
        {
          id: "what-is-linux",
          title: "What is Linux?",
          duration: 12,
          type: "lesson",
          description: "Understand the Linux kernel, popular distributions, and why Linux dominates DevOps.",
          objectives: [
            "Explain the Linux kernel and its role",
            "Identify major Linux distributions and their use cases",
            "Understand the Linux file system and user space",
          ],
          content: `# What is Linux?

Linux is an open-source, Unix-like operating system kernel created by **Linus Torvalds** in 1991. It powers everything from smartphones (Android) to the world's top 500 supercomputers, cloud infrastructure, and embedded devices.

## The Linux Architecture

\`\`\`
┌─────────────────────────────────┐
│         User Applications        │
├─────────────────────────────────┤
│     Shell (bash, zsh, fish)      │
├─────────────────────────────────┤
│        System Libraries          │
│         (glibc, musl)            │
├─────────────────────────────────┤
│        Linux Kernel              │
│  Process │ Memory │ File System  │
│  Network │ Device Drivers        │
├─────────────────────────────────┤
│           Hardware               │
└─────────────────────────────────┘
\`\`\`

The **kernel** manages hardware resources. The **shell** is your interface to the kernel. Everything else is user space.

## Major Distributions

| Distribution | Base | Use Case |
|-------------|------|----------|
| Ubuntu 24.04 LTS | Debian | General purpose, cloud, desktop |
| Debian 12 | Independent | Servers, stability-focused |
| RHEL / Rocky Linux | RPM | Enterprise, regulated industries |
| Alpine Linux | Independent | Containers (tiny: ~5MB) |
| Arch Linux | Independent | Advanced users, bleeding edge |
| Amazon Linux 2023 | RHEL-based | AWS EC2 workloads |

## Linux in DevOps

- **98% of containers** run on Linux
- All major cloud providers run Linux hypervisors
- CI/CD runners, Kubernetes nodes, and Docker hosts are Linux
- Bash scripting is the glue of automation

## Key Concepts

**Everything is a file** — devices (/dev/sda), processes (/proc/1234), sockets, pipes — all represented as files.

**Processes** — every running program is a process with a PID. The first process is **systemd** (PID 1).

**Users and permissions** — multi-user system with fine-grained permission model (owner/group/other).

> **Tip:** Use \`uname -a\` to see your kernel version, and \`lsb_release -a\` or \`cat /etc/os-release\` to identify the distribution.

\`\`\`bash
uname -a
# Linux myserver 6.5.0-1022-aws #22-Ubuntu SMP x86_64 GNU/Linux

cat /etc/os-release
# NAME="Ubuntu"
# VERSION="24.04 LTS (Noble Numbat)"

hostnamectl
# Static hostname: myserver
# Operating System: Ubuntu 24.04 LTS
# Kernel: Linux 6.5.0-1022-aws
\`\`\`
`,
        },
        {
          id: "shell-basics",
          title: "Shell Basics & Navigation",
          duration: 16,
          type: "lesson",
          description: "Navigate the Linux filesystem, manage files, and become productive in the terminal.",
          objectives: [
            "Navigate the filesystem with pwd, ls, cd",
            "Create, copy, move and delete files and directories",
            "View file contents with cat, less, head, tail",
            "Use tab completion, history, and aliases",
          ],
          content: `# Shell Basics & Navigation

The shell is your command-line interface to Linux. **Bash** (Bourne Again Shell) is the default on most systems.

## The Prompt

\`\`\`bash
sooraj@server:~\$         # regular user
root@server:/etc#        # root user (# = root)
# user@hostname:cwd prompt/symbol
\`\`\`

## Navigation

\`\`\`bash
pwd                      # print working directory
ls                       # list files
ls -la                   # long format + hidden files
ls -lh                   # human-readable sizes
ls -lt                   # sort by modification time

cd /var/log              # absolute path
cd ..                    # parent directory
cd ~                     # home directory
cd -                     # previous directory
\`\`\`

## Working with Files and Directories

\`\`\`bash
# Create
mkdir mydir
mkdir -p a/b/c           # create nested dirs

touch file.txt           # create empty file
echo "hello" > file.txt  # create with content
echo "more" >> file.txt  # append

# Copy & Move
cp file.txt backup.txt
cp -r mydir/ mydir-copy/ # recursive copy
mv file.txt newname.txt  # rename
mv file.txt /tmp/        # move to /tmp

# Delete
rm file.txt
rm -r mydir/             # recursive (careful!)
rm -rf mydir/            # force (no prompt — dangerous)
rmdir emptydir           # only works if empty
\`\`\`

## Viewing File Contents

\`\`\`bash
cat /etc/hostname         # print entire file
less /var/log/syslog      # pager (q to quit, / to search)
head -20 /var/log/auth.log   # first 20 lines
tail -20 /var/log/auth.log   # last 20 lines
tail -f /var/log/syslog      # follow in real-time (Ctrl+C to stop)
wc -l file.txt               # count lines
\`\`\`

## Finding Things

\`\`\`bash
find /etc -name "*.conf"           # find by name
find /var/log -mtime -1            # modified in last 24h
find / -size +100M 2>/dev/null     # files > 100MB
find /home -user sooraj            # owned by user

which python3                       # path of executable
type ls                             # is it alias/builtin/file?
locate nginx.conf                   # fast (uses database: updatedb)
\`\`\`

## Productivity Tips

\`\`\`bash
# Tab completion — press Tab to autocomplete paths and commands
ls /var/lo[TAB]    →  ls /var/log/

# Command history
history            # show all commands
!!                 # repeat last command
!ssh               # repeat last ssh command
Ctrl+R             # reverse search history

# Aliases (add to ~/.bashrc)
alias ll='ls -la'
alias ..='cd ..'
alias grep='grep --color=auto'

# Useful shortcuts
Ctrl+C   # kill current process
Ctrl+Z   # suspend process (fg to resume)
Ctrl+D   # exit shell / EOF
Ctrl+L   # clear screen (same as 'clear')
Ctrl+A   # move to start of line
Ctrl+E   # move to end of line
\`\`\`

> **Tip:** Run \`man ls\` to read the manual for any command. Press \`q\` to exit. \`tldr ls\` (install tldr) shows practical examples.
`,
        },
        {
          id: "file-permissions",
          title: "File Permissions & Ownership",
          duration: 14,
          type: "lesson",
          description: "Master Linux's rwx permission model, chmod, chown, and special bits.",
          objectives: [
            "Read and interpret permission strings",
            "Use chmod with symbolic and octal notation",
            "Change file ownership with chown and chgrp",
            "Understand setuid, setgid, and sticky bit",
          ],
          content: `# File Permissions & Ownership

Linux controls access to files through a permission system based on **owner**, **group**, and **others**.

## Reading Permissions

\`\`\`bash
ls -la /etc/passwd
# -rw-r--r-- 1 root root 2847 Jan 15 09:12 /etc/passwd
# ↑ ↑↑↑↑↑↑↑↑↑
# │ ││││││││└─ others: r-- (read only)
# │ ││││││└── group:  r-- (read only)
# │ ││││└──── owner:  rw- (read + write)
# │ └──────── file type: - (regular), d (dir), l (link)
# └────────── permissions
\`\`\`

## Permission Values

| Symbol | Octal | Meaning |
|--------|-------|---------|
| r | 4 | Read |
| w | 2 | Write |
| x | 1 | Execute |
| - | 0 | No permission |

**Common combinations:**
- \`rwx\` = 7 (full access)
- \`rw-\` = 6 (read/write)
- \`r-x\` = 5 (read/execute)
- \`r--\` = 4 (read only)

## chmod — Change Permissions

\`\`\`bash
# Octal notation
chmod 755 script.sh      # rwxr-xr-x (owner: all, group+others: r+x)
chmod 644 config.txt     # rw-r--r-- (owner: r+w, others: read)
chmod 600 ~/.ssh/id_rsa  # rw------- (owner only)
chmod 700 ~/.ssh/        # rwx------ (dir: owner only)

# Symbolic notation
chmod u+x script.sh      # add execute for owner (u=user)
chmod g-w file.txt       # remove write from group
chmod o-r secret.txt     # remove read from others
chmod a+r public.txt     # add read for all (a=all)
chmod u=rwx,g=rx,o=r file.sh  # set explicitly

# Recursive
chmod -R 755 /var/www/html/
\`\`\`

## chown — Change Ownership

\`\`\`bash
chown alice file.txt          # change owner
chown alice:developers file.txt  # change owner and group
chown :developers file.txt    # change group only
chgrp developers file.txt     # change group (alternative)

chown -R www-data:www-data /var/www/  # recursive
\`\`\`

## umask — Default Permissions

\`\`\`bash
umask            # show current umask (usually 022)
# Files created with 666 - 022 = 644 (rw-r--r--)
# Dirs created with  777 - 022 = 755 (rwxr-xr-x)

umask 027        # tighten: files=640, dirs=750
\`\`\`

## Special Bits

\`\`\`bash
# Setuid (4): run executable as owner (not caller)
chmod u+s /usr/bin/passwd   # passwd runs as root regardless of who calls
ls -la /usr/bin/passwd
# -rwsr-xr-x  (s in owner execute position)

# Setgid (2): on dir, new files inherit group
chmod g+s /shared/
# New files in /shared get the group of the directory

# Sticky bit (1): on dir, only owner can delete their files
chmod +t /tmp
ls -ld /tmp
# drwxrwxrwt (t in others execute position)
# /tmp: anyone can write, only owner can delete their own files
\`\`\`

> **Security rule:** World-writable files (chmod 777) are dangerous on servers. Always use the minimum permissions needed.
`,
        },
        {
          id: "users-and-groups",
          title: "Users, Groups & sudo",
          duration: 12,
          type: "lesson",
          description: "Manage Linux users and groups, configure sudo, and understand /etc/passwd.",
          objectives: [
            "Create, modify, and delete users and groups",
            "Configure sudo access securely",
            "Understand /etc/passwd, /etc/shadow, /etc/group",
          ],
          content: `# Users, Groups & sudo

## Key Files

\`\`\`bash
cat /etc/passwd   # user accounts
# root:x:0:0:root:/root:/bin/bash
# sooraj:x:1000:1000:Sooraj:/home/sooraj:/bin/bash
# nginx:x:33:33::/var/cache/nginx:/sbin/nologin
# Format: username:password:UID:GID:comment:home:shell

cat /etc/shadow   # hashed passwords (root only)
# sooraj:\$6\$salt\$hashed_password:19000:0:99999:7:::

cat /etc/group    # groups
# sudo:x:27:sooraj,alice
# docker:x:999:sooraj
# Format: groupname:password:GID:members
\`\`\`

## Managing Users

\`\`\`bash
# Create user
useradd -m -s /bin/bash -c "Alice Smith" alice
# -m: create home dir  -s: shell  -c: comment/full name

passwd alice                    # set password
useradd -m -G sudo,docker alice # add to supplementary groups

# Modify user
usermod -aG docker alice        # append to docker group (-a = append)
usermod -s /bin/zsh alice       # change shell
usermod -L alice                # lock account
usermod -U alice                # unlock account

# Delete user
userdel alice                   # keep home dir
userdel -r alice                # delete home dir too

# View user info
id alice                        # uid=1001(alice) gid=1001(alice) groups=...
who                             # who is logged in
w                               # who + what they're doing
last                            # login history
\`\`\`

## Managing Groups

\`\`\`bash
groupadd developers
groupdel developers
groupmod -n devs developers     # rename group

groups sooraj                   # list user's groups
\`\`\`

## sudo Configuration

\`\`\`bash
# Edit sudoers safely
visudo                          # validates syntax before saving

# /etc/sudoers format:
# user  host=(runas)  commands
root    ALL=(ALL:ALL) ALL
alice   ALL=(ALL)     ALL              # full sudo
bob     ALL=(ALL)     NOPASSWD: ALL    # no password prompt
deploy  ALL=(root)    /usr/bin/systemctl restart nginx  # specific command only

# Group-based (preferred)
%sudo   ALL=(ALL:ALL) ALL
%wheel  ALL=(ALL)     ALL

# Drop-in files (safer than editing sudoers directly)
echo "alice ALL=(ALL) NOPASSWD: /usr/bin/apt" > /etc/sudoers.d/alice
chmod 440 /etc/sudoers.d/alice
\`\`\`

## Switching Users

\`\`\`bash
su - alice                      # switch to alice (- loads full env)
sudo -i                         # root shell
sudo -u alice command           # run as alice
sudo !!                         # run last command as root
\`\`\`

> **Security:** Never use \`root\` for daily work. Create a regular user with sudo access. Disable root SSH login.
`,
        },
      ],
      exam: [
        { question: "You type `ls -la /etc` and see a file with permissions `-rw-r-----`. Who can read this file?", answer: "The owner (read/write) and members of the file's group (read-only). Others have no access.", difficulty: "junior" },
        { question: "A new developer asks why their home directory is `/home/alice` and not `/root`. What do you explain?", answer: "`/root` is the home directory for the root superuser only. Regular users get home directories under `/home/<username>`. This separation limits the blast radius of mistakes made under a regular account.", difficulty: "junior" },
        { question: "You run `chmod 755 deploy.sh`. What exact permissions does this set, and why is it a common choice for scripts?", answer: "Owner gets rwx (7), group gets r-x (5), others get r-x (5). This lets the owner edit and run the script while everyone else can only read and execute it — appropriate for shared scripts that shouldn't be modified by others.", difficulty: "junior" },
        { question: "A colleague runs `sudo cat /etc/shadow` and gets 'command not found'. The `sudo` binary is at `/usr/bin/sudo`. What's the likely issue?", answer: "The PATH environment variable used by sudo may not include `/usr/bin`, or the shell being used doesn't have it in PATH. Check with `echo $PATH` and ensure `/usr/bin` is listed. Alternatively, use the full path: `sudo /bin/cat /etc/shadow`.", difficulty: "mid" },
        { question: "You need to create a service account `deploy` that cannot log in interactively. What command do you use?", answer: "`useradd --system --no-create-home --shell /usr/sbin/nologin deploy`. The `--system` flag creates a system account, `--shell /usr/sbin/nologin` prevents interactive login.", difficulty: "mid" },
        { question: "Running `id` shows `uid=1001(alice) gid=1001(alice) groups=1001(alice),27(sudo)`. A file is owned by root:root with permissions `rwxr-xr-x`. Can alice execute it?", answer: "Yes. The 'others' permission (last `r-x`) allows any user to read and execute the file. Alice is not root and not in the root group, so she falls under 'others' and can execute it.", difficulty: "mid" },
        { question: "You see a file with permissions `-rwsr-xr-x root root`. What does the 's' in the owner execute position mean, and why is it a security concern?", answer: "The 's' is the setuid bit — when any user executes this file, it runs with the file owner's privileges (root). This is dangerous because a vulnerability in the program could allow privilege escalation to root.", difficulty: "mid" },
        { question: "After adding a user to the `docker` group with `usermod -aG docker alice`, alice still gets 'permission denied' running docker commands. What's wrong?", answer: "Group membership changes don't apply to existing sessions. Alice needs to log out and log back in (or run `newgrp docker`) for the new group to take effect in her current shell.", difficulty: "mid" },
        { question: "A junior sysadmin accidentally ran `chmod -R 777 /var/www`. Walk through the security implications and how you'd fix it.", answer: "This gives all users full read/write/execute on the web root, allowing anyone to modify web files, upload malicious content, or read sensitive config files. Fix: restore correct permissions with `chmod -R 755 /var/www` for directories and `chmod -R 644 /var/www/html` for files. Then restore ownership with `chown -R www-data:www-data /var/www`.", difficulty: "senior" },
        { question: "You need to give a script the ability to bind to port 80 without running as root. How do you achieve this on Linux?", answer: "Use `setcap 'cap_net_bind_service=+ep' /path/to/binary` to grant the specific Linux capability to bind privileged ports (below 1024) without full root access. Verify with `getcap /path/to/binary`.", difficulty: "senior" },
      ],
    },
    {
      id: "text-processing",
      title: "Text Processing & Shell Tools",
      level: "beginner",
      description: "Process logs and data with grep, sed, awk, cut, sort, and pipes.",
      lessons: [
        {
          id: "grep-sed-awk",
          title: "grep, sed & awk",
          duration: 18,
          type: "lesson",
          description: "Master the three power tools for text processing in Linux.",
          objectives: [
            "Search files with grep and regular expressions",
            "Transform text streams with sed",
            "Process structured data with awk",
            "Combine tools with pipes",
          ],
          content: `# grep, sed & awk

These three tools are the Swiss Army knife of Linux text processing.

## grep — Search

\`\`\`bash
grep "error" /var/log/syslog              # search for pattern
grep -i "error" /var/log/syslog           # case-insensitive
grep -n "error" file.txt                  # show line numbers
grep -c "error" file.txt                  # count matches
grep -v "error" file.txt                  # invert: lines NOT matching
grep -r "password" /etc/                  # recursive search
grep -l "nginx" /etc/                     # only filenames, not content
grep -A 3 "ERROR" app.log                 # 3 lines after match
grep -B 2 "FATAL" app.log                 # 2 lines before match
grep -E "error|warn|fatal" app.log        # extended regex (alternation)
grep -P "\\d{3}-\\d{4}" contacts.txt       # Perl regex

# Real-world examples
grep "Failed password" /var/log/auth.log  # failed SSH attempts
grep -c "GET /api" access.log             # count API hits
grep "404" access.log | awk '{print \$1}' # IPs getting 404s
\`\`\`

## sed — Stream Editor

\`\`\`bash
# Substitution: s/find/replace/flags
sed 's/foo/bar/' file.txt           # replace first occurrence per line
sed 's/foo/bar/g' file.txt          # replace all (g=global)
sed 's/foo/bar/gi' file.txt         # case-insensitive + global
sed -i 's/foo/bar/g' file.txt       # edit file in-place
sed -i.bak 's/foo/bar/g' file.txt   # in-place with backup

# Delete lines
sed '/^#/d' config.conf             # delete comment lines
sed '/^$/d' file.txt                # delete blank lines
sed '5d' file.txt                   # delete line 5
sed '5,10d' file.txt                # delete lines 5-10

# Print specific lines
sed -n '5,10p' file.txt             # print lines 5-10
sed -n '/start/,/end/p' file.txt    # print between patterns

# Real-world
sed -i 's/localhost/db.prod.internal/g' config.yaml
sed '/^#/d; /^$/d' nginx.conf | less  # view config without comments
\`\`\`

## awk — Data Processing

\`\`\`bash
# awk 'pattern { action }' file
# Fields: \$1, \$2, ... \$NF (last), NR (row number), NF (field count)

awk '{print \$1}' file.txt           # print first field
awk '{print \$1, \$3}' file.txt       # print fields 1 and 3
awk -F: '{print \$1}' /etc/passwd    # colon delimiter → print usernames
awk -F, '{print \$2}' data.csv       # CSV second column

# Patterns and conditions
awk 'NR > 1' file.txt               # skip header (first line)
awk '\$3 > 100' data.txt             # rows where field 3 > 100
awk '/error/ {print NR, \$0}' app.log  # print line number + line

# Calculations
awk '{sum += \$1} END {print sum}' numbers.txt
awk '{sum += \$5} END {print "Total:", sum, "Average:", sum/NR}' data.txt

# Real-world: parse nginx access log
# Format: IP - - [date] "METHOD /path HTTP" status bytes
awk '{print \$9}' access.log | sort | uniq -c | sort -rn | head
# Count HTTP status codes

awk '\$9 == 200 {bytes += \$10} END {print "Total bytes:", bytes}' access.log
\`\`\`

## Combining Tools with Pipes

\`\`\`bash
# Find top 10 IPs hitting your server
grep "GET" access.log | awk '{print \$1}' | sort | uniq -c | sort -rn | head -10

# Count failed SSH attempts by IP
grep "Failed password" /var/log/auth.log | awk '{print \$11}' | sort | uniq -c | sort -rn

# Find largest files in /var
du -sh /var/* 2>/dev/null | sort -rh | head -10

# Extract emails from a file
grep -Eo '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' contacts.txt | sort -u
\`\`\`
`,
        },
        {
          id: "archives-pipes",
          title: "Archives, Compression & I/O Redirection",
          duration: 12,
          type: "lesson",
          description: "Compress files, create archives, and master stdin/stdout/stderr redirection.",
          objectives: [
            "Create and extract tar archives",
            "Use gzip, bzip2, and xz compression",
            "Redirect stdin, stdout, and stderr",
            "Use xargs and process substitution",
          ],
          content: `# Archives, Compression & I/O Redirection

## tar — Tape Archive

\`\`\`bash
# Create archives
tar czf backup.tar.gz /etc/           # create gzip-compressed archive
tar cjf backup.tar.bz2 /var/www/      # bzip2 (better compression, slower)
tar cJf backup.tar.xz /home/          # xz (best compression, slowest)

# Extract
tar xzf backup.tar.gz                 # extract in current dir
tar xzf backup.tar.gz -C /restore/    # extract to specific dir

# List contents
tar tzf backup.tar.gz                 # list files without extracting

# Add to existing archive
tar rzf backup.tar.gz newfile.txt

# Common flags: c=create x=extract t=list z=gzip j=bzip2 J=xz f=file v=verbose
\`\`\`

## Compression Tools

\`\`\`bash
gzip file.txt              # creates file.txt.gz (deletes original)
gzip -k file.txt           # keep original
gunzip file.txt.gz         # decompress
gzip -d file.txt.gz        # same as gunzip

bzip2 file.txt             # better compression than gzip
bunzip2 file.txt.bz2

xz file.txt                # best compression ratio
unxz file.txt.xz

zip archive.zip file1 file2 dir/   # zip (cross-platform)
unzip archive.zip
unzip -l archive.zip               # list contents
\`\`\`

## I/O Redirection

\`\`\`bash
# stdout (1) redirection
ls > filelist.txt          # overwrite
ls >> filelist.txt         # append
echo "line" > /dev/null    # discard output

# stderr (2) redirection
find / -name "*.conf" 2>/dev/null       # discard errors
find / -name "*.conf" 2>errors.txt      # errors to file
command > output.txt 2>&1              # both stdout+stderr to file
command &> output.txt                  # shorthand for both

# stdin (0) redirection
wc -l < file.txt           # count lines using file as input
mysql db < dump.sql        # feed SQL file to MySQL

# Pipes
cat /etc/passwd | grep bash | wc -l
\`\`\`

## Useful Utilities

\`\`\`bash
# xargs — build command from stdin
find /tmp -name "*.tmp" | xargs rm        # delete found files
echo "file1 file2 file3" | xargs -n1 echo # one per line
cat urls.txt | xargs -P 4 curl -O         # parallel downloads

# tee — write to file AND stdout
command | tee output.txt                  # see output and save it
command | tee -a output.txt               # append

# sort and uniq
sort file.txt               # alphabetical
sort -n numbers.txt          # numeric
sort -rn numbers.txt         # reverse numeric
sort -k2 data.txt            # sort by field 2
sort -t: -k3 -n /etc/passwd  # sort passwd by UID

sort file.txt | uniq         # remove duplicates (requires sorted input)
sort file.txt | uniq -c      # count occurrences
sort file.txt | uniq -d      # only show duplicates
\`\`\`
`,
        },
      ],
      exam: [
        { question: "You run `grep 'ERROR' app.log` but see no output even though you know errors exist. What's a likely cause?", answer: "The error messages may use a different case ('error', 'Error'). Re-run with `grep -i 'ERROR' app.log` for case-insensitive matching. Also check that you're searching the right file and it's not empty.", difficulty: "junior" },
        { question: "You want to extract all IP addresses from a log file. Which grep command would you use?", answer: "`grep -oE '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}' access.log` — `-o` prints only the matching part, `-E` enables extended regex.", difficulty: "junior" },
        { question: "A log file is too large to open in an editor. You need the last 50 lines. What command do you use?", answer: "`tail -n 50 /var/log/syslog` — or to follow new lines in real time: `tail -f /var/log/syslog`.", difficulty: "junior" },
        { question: "You need to replace every occurrence of `http://old-domain.com` with `https://new-domain.com` in a config file. What sed command does this in-place?", answer: "`sed -i 's|http://old-domain.com|https://new-domain.com|g' config.conf` — using `|` as delimiter avoids escaping forward slashes; `-i` edits in-place; `g` flag replaces all occurrences per line.", difficulty: "mid" },
        { question: "You run `cat /etc/passwd | awk -F: '{print $1, $3}'` and want to filter to only show users with UID >= 1000. How do you modify the command?", answer: "`awk -F: '$3 >= 1000 {print $1, $3}' /etc/passwd` — add a condition before the action block. Also, drop the useless `cat` pipe; awk can read files directly.", difficulty: "mid" },
        { question: "You need to count how many unique IP addresses appear in an nginx access log. Write the pipeline.", answer: "`awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -20` — extract the first field (IP), sort, count unique occurrences, then sort by frequency.", difficulty: "mid" },
        { question: "You have a gzipped log file from yesterday. You need to search for 'FATAL' errors without decompressing it to disk. How?", answer: "`zcat yesterday.log.gz | grep 'FATAL'` or `zgrep 'FATAL' yesterday.log.gz` — both decompress on-the-fly to stdout and pipe through grep.", difficulty: "mid" },
        { question: "You need to archive `/var/www` and compress it, then verify the archive is not corrupted. What commands do you use?", answer: "`tar -czf www_backup.tar.gz /var/www` to create, then `tar -tzf www_backup.tar.gz > /dev/null && echo OK` to verify the archive can be listed without errors.", difficulty: "mid" },
        { question: "A pipeline `cmd1 | cmd2 | cmd3` fails silently. How do you find which stage produced an error?", answer: "Use `set -o pipefail` in bash so the pipeline returns the exit code of the first failing command. Also use `${PIPESTATUS[@]}` after the pipeline to see each command's exit code. Run each stage individually to isolate the failure.", difficulty: "senior" },
        { question: "You need to parse a multi-line JSON log file where each line is a JSON object and extract the `message` field from lines where `level` is `error`. How would you approach this?", answer: "Use `jq` for proper JSON parsing: `cat app.log | jq -r 'select(.level == \"error\") | .message'`. Avoid sed/awk for JSON as they can't handle nested structures correctly.", difficulty: "senior" },
      ],
    },
    {
      id: "process-management",
      title: "Process Management",
      level: "intermediate",
      description: "Control running processes, manage system services, and automate with cron.",
      lessons: [
        {
          id: "processes-signals",
          title: "Processes & Signals",
          duration: 14,
          type: "lesson",
          description: "Understand Linux processes, send signals, and manage foreground/background jobs.",
          objectives: [
            "List and inspect processes with ps, top, htop",
            "Send signals with kill and killall",
            "Manage background and foreground jobs",
            "Use nice and renice for priority",
          ],
          content: `# Processes & Signals

## Viewing Processes

\`\`\`bash
ps aux                    # all processes, user-oriented format
# USER  PID %CPU %MEM VSZ RSS TTY STAT START TIME COMMAND

ps aux | grep nginx       # find nginx processes
ps -ef                    # full format (PPID visible)
ps --forest               # show process tree
pstree                    # process tree (install: apt install psmisc)

pgrep nginx               # find PID by name
pgrep -u root             # processes owned by root
pidof nginx               # PIDs of nginx

top                       # interactive process viewer
# Keys: q=quit, k=kill, r=renice, M=sort by memory, P=sort by CPU
htop                      # enhanced top (apt install htop)
\`\`\`

## Process States

| State | Symbol | Meaning |
|-------|--------|---------|
| Running | R | Currently executing |
| Sleeping | S | Waiting (interruptible) |
| Disk sleep | D | Waiting for I/O (uninterruptible) |
| Stopped | T | Paused (Ctrl+Z) |
| Zombie | Z | Dead but not reaped |

## Signals

\`\`\`bash
# Common signals
kill -l                   # list all signals

kill -15 <PID>            # SIGTERM — graceful shutdown (default)
kill    <PID>             # same as -15
kill -9 <PID>             # SIGKILL — force kill (no cleanup possible)
kill -1 <PID>             # SIGHUP  — reload config (nginx, sshd)
kill -2 <PID>             # SIGINT  — same as Ctrl+C
kill -19 <PID>            # SIGSTOP — pause process
kill -18 <PID>            # SIGCONT — continue paused process

killall nginx             # kill all processes named nginx
killall -9 python3        # force kill all python3 processes
pkill -u alice            # kill all processes by user alice

# Always try SIGTERM before SIGKILL — give process time to clean up
\`\`\`

## Background Jobs

\`\`\`bash
sleep 100 &               # run in background (&)
jobs                      # list background jobs
# [1]+ Running    sleep 100 &
# [2]- Stopped    vim file.txt

fg                        # bring last job to foreground
fg %1                     # bring job 1 to foreground
bg %2                     # resume job 2 in background

Ctrl+Z                    # suspend current job
Ctrl+C                    # terminate current job

# Survive terminal close
nohup ./script.sh &       # run detached from terminal
nohup ./script.sh > out.log 2>&1 &

disown %1                 # remove job from shell's job list
\`\`\`

## Process Priority

\`\`\`bash
# Nice value: -20 (highest priority) to 19 (lowest)
nice -n 10 ./backup.sh    # start with lower priority
nice -n -5 ./critical.sh  # start with higher priority (root only for negative)

renice 15 -p 1234         # change priority of running process
renice -n 5 -u alice      # change all of alice's processes
\`\`\`

## System Resources

\`\`\`bash
free -h                   # memory usage
vmstat 2 5                # virtual memory stats (every 2s, 5 times)
iostat -x 2               # I/O stats per disk
uptime                    # load averages (1min, 5min, 15min)
# Load avg > number of CPU cores = system overloaded
nproc                     # number of CPU cores
lscpu                     # CPU details
\`\`\`
`,
          interviewQuestions: [
            {
              question: "A process is consuming 100% CPU on a production server. How do you find it and deal with it?",
              difficulty: "mid" as const,
              answer: `**Step 1 — Identify the process:**
\`\`\`bash
# Real-time process view:
top          # press P to sort by CPU
htop         # more visual, easier to navigate

# Quick snapshot:
ps aux --sort=-%cpu | head -20  # top CPU consumers

# If it's a Java process, find what it's doing:
PID=$(ps aux --sort=-%cpu | awk 'NR==2{print $2}')
\`\`\`

**Step 2 — Investigate what it's doing:**
\`\`\`bash
# What system calls is it making?
strace -p $PID -c -f 2>&1 | head -30
# -c: count syscalls (summary), -f: follow threads

# What files does it have open?
lsof -p $PID | head -30

# What's in its stack trace? (for compiled code)
gdb -p $PID -batch -ex "thread apply all bt" 2>/dev/null

# For Java: get thread dump
kill -3 $PID  # prints thread dump to stdout
jstack $PID   # Java thread dump tool

# Check if it's in a spin loop:
watch -n 1 'ps aux --sort=-%cpu | head -5'
# If CPU stays at 100% without drops → likely infinite loop, not I/O wait
\`\`\`

**Step 3 — Assess and respond:**
\`\`\`bash
# Is it a critical production process?
# YES: investigate first, kill only if it's causing broader outage

# Reduce priority without killing (buy time):
renice +15 -p $PID  # lower priority so other processes get CPU

# Graceful shutdown:
kill -15 $PID  # SIGTERM — ask process to shut down
# If it doesn't respond after 30s:
kill -9 $PID   # SIGKILL — force kill (no cleanup)
\`\`\`

**Common root causes:**
- Infinite loop in application code (check recent deployments)
- Runaway query without proper index (database query consuming CPU)
- Log rotation causing massive file processing
- Crypto mining malware (check if process name is unusual)`,
            },
            {
              question: "Explain the Linux process lifecycle: fork(), exec(), wait(), and zombie processes.",
              difficulty: "senior" as const,
              answer: `**The fork-exec model:**

Every process (except init/PID 1) is created by \`fork()\`:
\`\`\`
fork() → creates an EXACT COPY of the parent process
         child gets a new PID, parent's PID becomes child's PPID
         copy-on-write: shares parent's memory pages until written

exec() → replaces the child's memory with a new program
         the child is now a completely different program
         PID remains the same

Example: bash running 'ls':
1. bash fork()s → new process, PID 12345, exact copy of bash
2. child exec()s ls → PID 12345 is now the ls program
3. ls runs, outputs, exits
4. bash wait()s → collects exit status, child entry cleaned from process table
\`\`\`

**Zombie processes:**
\`\`\`bash
# A zombie is a process that exited but parent hasn't called wait():
# The child is dead but still in the process table (PID kept for parent to collect status)

ps aux | grep Z  # Z = zombie state

# How zombies happen:
# Parent creates child, child exits
# Parent is too busy (or has a bug) and never calls wait()
# Child lingers as zombie

# Fix:
# 1. Kill the PARENT (zombie children are adopted by init/PID 1, which calls wait())
kill -9 <parent_PID>

# 2. Fix the parent's code to call waitpid() properly
# 3. If parent can't be killed: reboot (last resort)
\`\`\`

**Signals and process control:**
\`\`\`bash
# Common signals:
SIGTERM (15) = graceful shutdown request (can be caught and handled)
SIGKILL (9)  = immediate kill (cannot be caught, always works)
SIGINT (2)   = Ctrl+C
SIGHUP (1)   = terminal hangup (many daemons reload config on SIGHUP)
SIGSTOP (19) = pause (cannot be caught)
SIGCONT (18) = resume paused process

# Rule: always try SIGTERM first, wait 30s, then SIGKILL
kill -15 $PID && sleep 30 && kill -9 $PID 2>/dev/null
\`\`\``,
            },
          ],
        },
        {
          id: "systemd-services",
          title: "Systemd & Service Management",
          duration: 16,
          type: "lesson",
          description: "Manage Linux services with systemd, write unit files, and use journald logging.",
          objectives: [
            "Start, stop, and enable services with systemctl",
            "Read logs with journalctl",
            "Write a custom systemd service unit",
            "Understand systemd targets (runlevels)",
          ],
          content: `# Systemd & Service Management

Systemd is the init system for most modern Linux distributions. It starts and manages all system services.

## systemctl — Service Control

\`\`\`bash
# Service lifecycle
systemctl start nginx          # start service
systemctl stop nginx           # stop service
systemctl restart nginx        # stop + start
systemctl reload nginx         # reload config without restart (if supported)
systemctl status nginx         # detailed status

# Persistence across reboots
systemctl enable nginx         # start at boot
systemctl disable nginx        # don't start at boot
systemctl enable --now nginx   # enable + start immediately

# Query
systemctl is-active nginx      # active or inactive
systemctl is-enabled nginx     # enabled or disabled
systemctl list-units --type=service --state=running
systemctl list-unit-files --type=service
\`\`\`

## journalctl — Log Viewer

\`\`\`bash
journalctl                          # all logs (oldest first)
journalctl -r                       # reverse (newest first)
journalctl -f                       # follow (like tail -f)
journalctl -n 50                    # last 50 lines
journalctl -u nginx                 # logs for nginx service
journalctl -u nginx -f              # follow nginx logs
journalctl --since "2024-01-15"     # logs since date
journalctl --since "1 hour ago"     # relative time
journalctl -p err                   # only errors (emerg,alert,crit,err)
journalctl -p warning..err          # warnings to errors
journalctl --no-pager | grep "Out of memory"
\`\`\`

## Writing a Custom Service

Create \`/etc/systemd/system/myapp.service\`:

\`\`\`ini
[Unit]
Description=My Application Server
Documentation=https://myapp.example.com/docs
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=myapp
Group=myapp
WorkingDirectory=/opt/myapp
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/etc/myapp/config.env

ExecStart=/usr/bin/node /opt/myapp/server.js
ExecReload=/bin/kill -HUP \$MAINPID
Restart=on-failure
RestartSec=5s
StandardOutput=journal
StandardError=journal

# Security hardening
NoNewPrivileges=true
ProtectSystem=strict
PrivateTmp=true

[Install]
WantedBy=multi-user.target
\`\`\`

\`\`\`bash
systemctl daemon-reload           # reload unit files after changes
systemctl enable --now myapp
systemctl status myapp
journalctl -u myapp -f
\`\`\`

## Systemd Targets (Runlevels)

\`\`\`bash
systemctl get-default             # current default target
systemctl set-default multi-user.target  # no GUI on boot

# Common targets:
# poweroff.target  — shutdown
# rescue.target    — single-user (recovery)
# multi-user.target — normal (no GUI)
# graphical.target  — normal + GUI
\`\`\`

## Timers (Cron Alternative)

\`\`\`bash
# /etc/systemd/system/backup.timer
# [Unit]
# Description=Daily Backup Timer
# [Timer]
# OnCalendar=daily
# Persistent=true
# [Install]
# WantedBy=timers.target

systemctl enable --now backup.timer
systemctl list-timers
\`\`\`
`,
          interviewQuestions: [
            {
              question: "How do you create a systemd service for a custom application? What are the key unit file directives?",
              difficulty: "mid" as const,
              answer: `**Create a unit file at \`/etc/systemd/system/myapp.service\`:**
\`\`\`ini
[Unit]
Description=My Application Server
Documentation=https://github.com/myorg/myapp
# Start after network is up and any dependencies:
After=network-online.target postgresql.service
Requires=postgresql.service    # hard dependency (fail if postgres fails)
Wants=redis.service            # soft dependency (continue if redis is absent)

[Service]
Type=simple                    # process stays in foreground
User=myapp                     # run as non-root
Group=myapp
WorkingDirectory=/opt/myapp

# Environment:
Environment=NODE_ENV=production
EnvironmentFile=-/etc/myapp/env  # load env file (-prefix = ignore if missing)

# Startup:
ExecStartPre=/opt/myapp/check-deps.sh   # pre-start check
ExecStart=/opt/myapp/server --port 3000
ExecStop=/opt/myapp/shutdown.sh          # graceful shutdown script
ExecReload=/bin/kill -HUP \$MAINPID      # reload config without restart

# Restart policy:
Restart=on-failure             # restart if exits with non-zero code
RestartSec=5s                  # wait 5s before restart
StartLimitIntervalSec=300      # window for start limit tracking
StartLimitBurst=5              # max 5 restarts in 300s window

# Resource limits:
MemoryLimit=512M
CPUQuota=50%                   # max 50% of one CPU

# Security hardening:
NoNewPrivileges=true
ProtectSystem=strict           # read-only system directories
PrivateTmp=true                # isolated /tmp

[Install]
WantedBy=multi-user.target
\`\`\`

\`\`\`bash
# Enable and start:
systemctl daemon-reload          # load new unit file
systemctl enable myapp           # start on boot
systemctl start myapp

# Verify:
systemctl status myapp
journalctl -u myapp -f           # follow logs
\`\`\``,
            },
            {
              question: "A systemd service keeps failing and restarting. How do you debug it?",
              difficulty: "junior" as const,
              answer: `\`\`\`bash
# Step 1 — See current status:
systemctl status myapp
# Shows: active/failed, exit code, last log lines

# Step 2 — Read the full logs:
journalctl -u myapp --since "1 hour ago"
journalctl -u myapp -n 100 --no-pager

# Filter to errors only:
journalctl -u myapp -p err

# Step 3 — Check the exit code:
systemctl status myapp | grep "Main PID"
# ExitCode=1 → application error
# ExitCode=203 → ExecStart path not found
# ExitCode=217 → User not found (User= in unit file doesn't exist)

# Step 4 — Manual test run (outside systemd):
sudo -u myapp /opt/myapp/server --port 3000
# Run as the service user to reproduce permission issues

# Step 5 — Check dependencies:
systemctl list-dependencies myapp
systemctl status postgresql.service  # if myapp Requires postgres

# Step 6 — Check start limit:
journalctl -u myapp | grep "Start request repeated"
# If hitting the start limit, service stops restarting
# Reset the limit: systemctl reset-failed myapp

# Step 7 — Check resource limits:
systemctl show myapp | grep -E "Memory|CPU|LimitNOFILE"
journalctl -k | grep "oom" | grep myapp  # OOM kills
\`\`\`

**Common causes:**
- Wrong User/Group in unit file (user doesn't exist)
- ExecStart path wrong or not executable
- Missing environment variables
- Port already in use (another process on same port)
- Database not ready when service starts (fix: add \`After=postgresql.service\`)`,
            },
          ],
        },
      ],
      exam: [
        { question: "You run `ps aux` and see a process with 99% CPU. What's your next step to investigate without killing it?", answer: "Run `top -p <PID>` to watch resource usage in real time, then `strace -p <PID>` to see what system calls it's making, and `lsof -p <PID>` to see open files. Check `cat /proc/<PID>/status` for detailed state.", difficulty: "junior" },
        { question: "A process is stuck and not responding to `kill <PID>`. What signal should you send next and why?", answer: "Send `kill -9 <PID>` (SIGKILL). Unlike SIGTERM (15) which asks the process to terminate gracefully, SIGKILL is sent directly to the kernel and cannot be caught, blocked, or ignored by the process.", difficulty: "junior" },
        { question: "You start a long-running command and want to detach it from your terminal so it continues after you log out. How do you do this?", answer: "Either prefix with `nohup`: `nohup ./longscript.sh &`, or use a terminal multiplexer like `tmux` or `screen`. With nohup, output goes to `nohup.out` by default.", difficulty: "junior" },
        { question: "After deploying a new version of your app, the systemd service fails to start. What's your diagnostic sequence?", answer: "Run `systemctl status myapp.service` for a quick summary, then `journalctl -u myapp.service -n 50 --no-pager` for the last 50 log lines. Check the ExecStart path, environment files, and any dependency services listed in the unit file.", difficulty: "mid" },
        { question: "You need to run a database backup every day at 2:30 AM. How do you set this up with cron?", answer: "Run `crontab -e` and add: `30 2 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1`. The format is minute hour day month weekday. Redirect stderr to the log so failures are captured.", difficulty: "mid" },
        { question: "A systemd service keeps entering a 'failed' state and restarting. How do you prevent it from restarting while you debug?", answer: "Run `systemctl stop myapp.service` to stop it immediately, then `systemctl mask myapp.service` to prevent it from being started at all (even by other units) while you debug. Unmask with `systemctl unmask myapp.service` when done.", difficulty: "mid" },
        { question: "You need a service to start only after both `postgresql.service` and `redis.service` are running. How do you configure this?", answer: "In the `[Unit]` section of the service file, add `After=postgresql.service redis.service` and `Requires=postgresql.service redis.service` (or `Wants=` for optional dependencies). `After` controls ordering; `Requires`/`Wants` controls dependency.", difficulty: "mid" },
        { question: "You run `jobs` in a bash session and see `[1]+ Running sleep 300 &`. How do you bring it to the foreground, and how do you send it to the background if it's currently in the foreground?", answer: "`fg %1` brings job 1 to the foreground. To send a foreground process to the background: press Ctrl+Z to suspend it, then run `bg %1` to resume it in the background.", difficulty: "mid" },
        { question: "A production server has a zombie process. What causes it and how do you clean it up?", answer: "Zombie processes occur when a child process exits but the parent hasn't called `wait()` to collect its exit status. You cannot kill a zombie directly. Find the parent with `ps -o ppid= -p <zombie_pid>` and send SIGCHLD to it: `kill -CHLD <parent_pid>`. If the parent is broken, killing the parent will let init (PID 1) adopt and reap the zombie.", difficulty: "senior" },
        { question: "Your systemd service needs to be restarted only on failure, with a 5-second delay between attempts, but not more than 3 times in 1 minute. How do you configure this?", answer: "In the `[Service]` section: `Restart=on-failure`, `RestartSec=5s`. In `[Unit]`: `StartLimitBurst=3` and `StartLimitIntervalSec=60`. This prevents a broken service from hammering the system with rapid restart loops.", difficulty: "senior" },
      ],
    },
    {
      id: "shell-scripting",
      title: "Shell Scripting",
      level: "intermediate",
      description: "Automate tasks with Bash scripting from fundamentals to production-ready scripts.",
      lessons: [
        {
          id: "bash-fundamentals",
          title: "Bash Scripting Fundamentals",
          duration: 20,
          type: "lesson",
          description: "Learn variables, conditionals, loops, functions, and best practices.",
          objectives: [
            "Write scripts with variables, conditionals, and loops",
            "Handle arguments and user input",
            "Use functions and return values",
            "Apply error handling with set -euo pipefail",
          ],
          content: `# Bash Scripting Fundamentals

## Script Structure

\`\`\`bash
#!/usr/bin/env bash
# ^^^ Shebang: always use env to find bash portably
set -euo pipefail
# -e: exit on error  -u: error on undefined var  -o pipefail: catch pipe errors

# Script: deploy.sh
# Usage: ./deploy.sh <environment> <version>
\`\`\`

## Variables

\`\`\`bash
name="Alice"                    # no spaces around =
echo "\$name"                    # variable reference
echo "\${name}_backup"           # brace syntax (required for adjacent text)
readonly PI=3.14                # constant (cannot be changed)
unset name                      # delete variable

# Command output
today=\$(date +%Y-%m-%d)
files=\$(ls -1 | wc -l)
echo "Today: \$today, Files: \$files"

# Arithmetic
x=10
y=3
echo \$((x + y))                 # 13
echo \$((x * y))                 # 30
echo \$((x / y))                 # 3 (integer division)
echo \$((x % y))                 # 1 (modulo)
((x++))                         # increment

# Special variables
echo "\$0"    # script name
echo "\$1"    # first argument
echo "\$2"    # second argument
echo "\$@"    # all arguments (as list)
echo "\$#"    # number of arguments
echo "\$?"    # exit code of last command
echo "\$\$"    # current script PID
\`\`\`

## Strings

\`\`\`bash
str="Hello, World!"
echo "\${#str}"                  # length: 13
echo "\${str:0:5}"               # substring: Hello
echo "\${str/World/Linux}"       # replace: Hello, Linux!
echo "\${str,,}"                 # lowercase
echo "\${str^^}"                 # uppercase
echo "\${str%!}"                 # remove suffix
\`\`\`

## Conditionals

\`\`\`bash
# if/elif/else
if [[ "\$1" == "prod" ]]; then
  echo "Production mode"
elif [[ "\$1" == "staging" ]]; then
  echo "Staging mode"
else
  echo "Unknown environment"
  exit 1
fi

# Test operators
[[ -f file.txt ]]     # file exists
[[ -d /etc ]]         # directory exists
[[ -z "\$var" ]]       # string is empty
[[ -n "\$var" ]]       # string is non-empty
[[ "\$a" == "\$b" ]]   # strings equal
[[ "\$a" != "\$b" ]]   # strings not equal
[[ \$x -gt 10 ]]      # numeric greater than
[[ \$x -le 5 ]]       # numeric less than or equal
[[ -r file ]]         # file is readable
[[ -w file ]]         # file is writable
[[ -x file ]]         # file is executable

# Combining
[[ -f "\$file" && -r "\$file" ]]    # AND
[[ "\$env" == "prod" || "\$env" == "staging" ]]  # OR
[[ ! -d "\$dir" ]]                  # NOT
\`\`\`

## Loops

\`\`\`bash
# For loop
for i in 1 2 3 4 5; do
  echo "Item: \$i"
done

for file in /etc/*.conf; do
  echo "Config: \$file"
done

for ((i=0; i<10; i++)); do
  echo "Count: \$i"
done

# While loop
count=0
while [[ \$count -lt 5 ]]; do
  echo "Count: \$count"
  ((count++))
done

# Read from file
while IFS= read -r line; do
  echo "Processing: \$line"
done < input.txt

# Read from command output
while IFS= read -r server; do
  ping -c1 "\$server" && echo "\$server is up"
done < servers.txt
\`\`\`

## Functions

\`\`\`bash
log() {
  local level="\$1"   # local = scoped to function
  local message="\$2"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [\$level] \$message"
}

deploy() {
  local env="\$1"
  local version="\$2"

  log "INFO" "Deploying version \$version to \$env"
  # ... deployment logic ...
  return 0   # success (non-zero = failure)
}

deploy "staging" "v1.2.3"

# Functions with return values via echo
get_ip() {
  hostname -I | awk '{print \$1}'
}
my_ip=\$(get_ip)
\`\`\`

## Error Handling

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

# Trap for cleanup
cleanup() {
  echo "Cleaning up..."
  rm -f /tmp/work.$$
}
trap cleanup EXIT           # always runs on exit
trap 'echo "Error on line \$LINENO"' ERR

# Check command success
if ! aws s3 cp file.txt s3://my-bucket/; then
  echo "Upload failed" >&2   # write to stderr
  exit 1
fi

# Provide defaults
ENV="\${1:-development}"     # default to "development" if \$1 unset
\`\`\`

## Production Script Example

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_FILE="/var/log/deploy.log"

log() { echo "[$(date -Iseconds)] \$*" | tee -a "\$LOG_FILE"; }
die() { log "ERROR: \$*" >&2; exit 1; }

[[ \$# -lt 2 ]] && die "Usage: \$0 <env> <version>"

ENV="\$1"
VERSION="\$2"

[[ "\$ENV" =~ ^(dev|staging|prod)\$ ]] || die "Invalid env: \$ENV"

log "Starting deployment of \$VERSION to \$ENV"
# ... rest of script
log "Deployment complete"
\`\`\`
`,
        },
      ],
      exam: [
        { question: "You write a bash script and run it, but get 'Permission denied'. The file exists. What's wrong and how do you fix it?", answer: "The script file doesn't have execute permission. Fix with `chmod +x script.sh` or `chmod 755 script.sh`. Alternatively, you can run it directly with `bash script.sh` without needing execute permission.", difficulty: "junior" },
        { question: "Your script runs fine interactively but fails in cron with 'command not found'. What's the most common cause?", answer: "Cron runs with a minimal PATH that doesn't include `/usr/local/bin` or other custom directories. Fix by setting PATH explicitly at the top of the script: `PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin`, or use full paths for all commands.", difficulty: "mid" },
        { question: "You have a script that calls several commands. You want it to exit immediately if any command fails. How do you ensure this?", answer: "Add `set -euo pipefail` at the top of the script. `-e` exits on error, `-u` treats unset variables as errors, `-o pipefail` catches failures in pipelines. This prevents silent failures from propagating.", difficulty: "mid" },
        { question: "A script accepts a filename as `$1`. You want to check the file exists before processing it. Write the guard clause.", answer: "`[[ -f \"$1\" ]] || { echo \"Error: file '$1' not found\" >&2; exit 1; }` — using double brackets and quoting the variable to handle filenames with spaces. Output error to stderr with `>&2`.", difficulty: "mid" },
        { question: "You need a script to process 1000 files, running 10 jobs in parallel. How do you control parallelism in bash?", answer: "Use `xargs -P 10` or GNU parallel: `find . -name '*.log' | xargs -P 10 -I {} process_file.sh {}`. Or manage background jobs manually with a counter checking `jobs -p | wc -l` and waiting when the limit is reached.", difficulty: "mid" },
        { question: "Your script creates a temp file at `/tmp/myprocess.$$.tmp`. Why use `$$` and what's a more secure approach?", answer: "`$$` is the script's PID, making the filename unique per run and avoiding collisions. A more secure approach is `mktemp /tmp/myprocess.XXXXXX` which creates a file with random characters and returns the path, preventing symlink attacks.", difficulty: "mid" },
        { question: "You want a script to clean up temp files even if it exits with an error. How do you implement this?", answer: "Use a trap: `trap 'rm -f /tmp/mytemp.$$' EXIT`. The EXIT trap fires whenever the script exits, whether normally, via `exit`, or due to an error (when used with `set -e`).", difficulty: "mid" },
        { question: "A bash script is processing a CSV with lines like `alice,admin,active`. You need to extract the second field. Write the command using both `cut` and `awk`.", answer: "`cut -d',' -f2 file.csv` or `awk -F',' '{print $2}' file.csv`. For CSV with quoted fields containing commas, awk or a proper CSV tool (like `mlr` or Python's csv module) is more robust.", difficulty: "mid" },
        { question: "You need to write a function in bash that returns a value (e.g., the count of lines in a file). How do you return a value from a bash function?", answer: "Bash functions can't return arbitrary values — `return` only sets exit codes (0-255). To return data, either print it and capture with command substitution: `count=$(count_lines file.txt)`, or set a global variable inside the function.", difficulty: "senior" },
        { question: "A deployment script runs in production. How would you add proper error handling, logging, and a dry-run mode to make it production-safe?", answer: "Add `set -euo pipefail`, a log function writing to both stdout and a log file with timestamps, a `DRY_RUN` flag that prints commands instead of running them (`[[ $DRY_RUN == true ]] && echo \"DRY: $*\" || \"$@\"`), and a rollback trap on EXIT for cleanup. Validate all inputs before starting.", difficulty: "senior" },
      ],
    },
    {
      id: "linux-security",
      title: "Security Hardening",
      level: "advanced",
      description: "Harden Linux systems following CIS benchmarks and industry best practices.",
      lessons: [
        {
          id: "system-hardening",
          title: "Linux Security Hardening",
          duration: 18,
          type: "lesson",
          description: "Apply CIS benchmarks, configure firewall rules, and implement audit logging.",
          objectives: [
            "Apply kernel security parameters with sysctl",
            "Configure UFW/iptables firewall rules",
            "Set up fail2ban for brute-force protection",
            "Enable auditd for compliance logging",
          ],
          content: `# Linux Security Hardening

## SSH Hardening

Edit \`/etc/ssh/sshd_config\`:

\`\`\`bash
# Disable root login
PermitRootLogin no

# Disable password auth (use keys only)
PasswordAuthentication no
PubkeyAuthentication yes

# Limit users
AllowUsers alice bob deploy

# Reduce attack surface
Protocol 2
MaxAuthTries 3
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2
X11Forwarding no

systemctl reload sshd
\`\`\`

## Firewall with UFW

\`\`\`bash
ufw default deny incoming         # block all inbound
ufw default allow outgoing        # allow all outbound

ufw allow 22/tcp                  # SSH
ufw allow 80/tcp                  # HTTP
ufw allow 443/tcp                 # HTTPS
ufw allow from 10.0.0.0/8 to any port 5432  # PostgreSQL from internal only

ufw enable
ufw status verbose
ufw status numbered               # numbered rules for deletion
ufw delete 3                      # delete rule by number
\`\`\`

## fail2ban — Brute-Force Protection

\`\`\`bash
apt install fail2ban

# /etc/fail2ban/jail.local
cat <<'EOF' > /etc/fail2ban/jail.local
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5
banaction = ufw

[sshd]
enabled = true
maxretry = 3

[nginx-http-auth]
enabled = true
EOF

systemctl enable --now fail2ban
fail2ban-client status sshd      # view banned IPs
fail2ban-client set sshd unbanip 1.2.3.4
\`\`\`

## Kernel Hardening (sysctl)

\`\`\`bash
# /etc/sysctl.d/99-hardening.conf
cat <<'EOF' > /etc/sysctl.d/99-hardening.conf
# Disable IP forwarding (unless router/k8s node)
net.ipv4.ip_forward = 0

# Prevent SYN flood
net.ipv4.tcp_syncookies = 1

# Don't respond to broadcasts (smurf attack)
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Disable source routing
net.ipv4.conf.all.accept_source_route = 0

# Enable ASLR (randomize memory layout)
kernel.randomize_va_space = 2

# Restrict kernel logs to root
kernel.dmesg_restrict = 1

# Restrict ptrace to child processes
kernel.yama.ptrace_scope = 1
EOF

sysctl --system           # apply all sysctl.d files
sysctl -p /etc/sysctl.d/99-hardening.conf
\`\`\`

## auditd — Audit Logging

\`\`\`bash
apt install auditd

# Watch sensitive files
auditctl -w /etc/passwd -p wa -k user_changes
auditctl -w /etc/sudoers -p wa -k sudoers_changes
auditctl -w /var/log/auth.log -p wa -k auth_log

# Watch for privileged commands
auditctl -a always,exit -F arch=b64 -S execve -F euid=0 -k root_commands

# Query audit log
ausearch -k user_changes          # filter by key
ausearch -m USER_LOGIN --start today
aureport --login --start this-week --summary
\`\`\`

## Automatic Updates

\`\`\`bash
apt install unattended-upgrades

# /etc/apt/apt.conf.d/50unattended-upgrades
# Enable security updates automatically
Unattended-Upgrade::Allowed-Origins {
    "\${distro_id}:\${distro_codename}-security";
};
Unattended-Upgrade::Automatic-Reboot "false";

dpkg-reconfigure -plow unattended-upgrades
\`\`\`

## Security Checklist

\`\`\`bash
# Check for world-writable files
find / -xdev -type f -perm -0002 2>/dev/null

# Check for SUID/SGID files (review these carefully)
find / -xdev -type f \\( -perm -4000 -o -perm -2000 \\) 2>/dev/null

# Check for empty passwords
awk -F: '($2 == "") {print}' /etc/shadow

# List users with UID 0 (root-equivalent)
awk -F: '($3 == 0) {print}' /etc/passwd

# Check listening services
ss -tlnp

# CIS benchmark scanning
apt install lynis
lynis audit system
\`\`\`
`,
          interviewQuestions: [
            {
              question: "How do you harden a fresh Linux server before deploying a web application?",
              difficulty: "mid" as const,
              answer: `**Systematic hardening checklist:**

**1. Update and patch:**
\`\`\`bash
apt update && apt upgrade -y
apt install -y unattended-upgrades  # automatic security updates
dpkg-reconfigure -plow unattended-upgrades
\`\`\`

**2. SSH hardening:**
\`\`\`bash
# /etc/ssh/sshd_config:
PermitRootLogin no
PasswordAuthentication no    # require key-based auth only
PubkeyAuthentication yes
Port 2222                    # non-standard port (not security, just reduces bot noise)
AllowUsers deploy admin      # whitelist specific users
MaxAuthTries 3

systemctl restart sshd
\`\`\`

**3. Firewall (UFW):**
\`\`\`bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 2222/tcp           # SSH on custom port
ufw allow 80/tcp             # HTTP
ufw allow 443/tcp            # HTTPS
ufw enable
\`\`\`

**4. Fail2ban — block brute force:**
\`\`\`bash
apt install -y fail2ban
# Auto-blocks IPs with 5+ failed SSH attempts in 10 minutes
systemctl enable --now fail2ban
\`\`\`

**5. Create a non-root deploy user:**
\`\`\`bash
adduser --disabled-password --gecos "" deploy
usermod -aG sudo deploy      # sudo only when needed
# Copy SSH keys for deploy user
\`\`\`

**6. Disable unused services:**
\`\`\`bash
systemctl list-units --type=service --state=running
# Disable services you don't need: cups, avahi-daemon, etc.
systemctl disable --now cups
\`\`\`

**7. Audit:**
\`\`\`bash
lynis audit system           # comprehensive security score
ss -tlnp                     # check what's listening on which ports
\`\`\``,
            },
            {
              question: "Explain Linux file permissions. What does chmod 755 mean and when would you use setuid?",
              difficulty: "junior" as const,
              answer: `**Permission model:**

Every file has 3 permission sets: Owner, Group, Others. Each has 3 bits: Read (4), Write (2), Execute (1).

\`\`\`
chmod 755 myfile
  7 = 4+2+1 = rwx (owner: read, write, execute)
  5 = 4+0+1 = r-x (group: read, execute, no write)
  5 = 4+0+1 = r-x (others: read, execute, no write)

chmod 644 config.txt
  6 = 4+2+0 = rw- (owner: read, write)
  4 = 4+0+0 = r-- (group: read only)
  4 = 4+0+0 = r-- (others: read only)
\`\`\`

**Common patterns:**
\`\`\`bash
chmod 755 /usr/local/bin/myapp  # executable script: everyone can run, only owner writes
chmod 644 /etc/config.conf      # config file: everyone reads, only owner writes
chmod 600 ~/.ssh/id_rsa         # private key: only owner reads (SSH requires this)
chmod 700 ~/.ssh/                # directory: only owner can access
\`\`\`

**Special bits:**
- **setuid (4)**: Execute as the file's owner, not the running user. Example: \`/usr/bin/passwd\` runs as root (to modify /etc/shadow) even when run by a regular user. \`chmod 4755 file\`
- **setgid (2)**: Execute as file's group. On directories: new files inherit the directory's group (useful for shared directories)
- **sticky bit (1)**: On directories (like /tmp): only file owner can delete their files

\`\`\`bash
ls -la /usr/bin/passwd
# -rwsr-xr-x root root  ← 's' in owner execute position = setuid
\`\`\`

**Security warning:** Setuid binaries are high-value attack targets — a bug in a setuid binary can lead to privilege escalation. Audit them:
\`\`\`bash
find / -perm /4000 -type f 2>/dev/null  # find all setuid files
\`\`\``,
            },
          ],
        },
      ],
      exam: [
        { question: "You inherit a server and want a quick overview of potential security issues. What are the first three commands you run?", answer: "`last` to see recent logins, `ss -tlnp` to see what's listening on the network, and `find / -perm /4000 -type f 2>/dev/null` to find setuid binaries. Also check `crontab -l` and `/etc/crontab` for unexpected scheduled tasks.", difficulty: "junior" },
        { question: "After a deployment, you need to verify that only SSH (22), HTTP (80), and HTTPS (443) are accessible from the internet on a server. How do you check?", answer: "`ss -tlnp` shows locally what's listening. Then from an external machine, use `nmap -p 22,80,443,8080,3000 <server-ip>` to verify what's actually reachable through the firewall. Don't rely only on local checks — firewall misconfigs can expose ports.", difficulty: "mid" },
        { question: "You run `sudo grep 'Failed password' /var/log/auth.log | wc -l` and see 50,000 lines in the last hour. What's happening and what do you do?", answer: "The server is under a brute-force SSH attack. Immediate steps: check the top attacking IPs (`grep 'Failed password' /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -rn | head`), block them with `ufw deny from <ip>`, and install fail2ban to automate this. Long-term: disable password auth in sshd_config and use key-only auth.", difficulty: "mid" },
        { question: "A new policy requires all SSH keys in `authorized_keys` to be RSA 4096-bit or Ed25519. How do you audit existing keys?", answer: "Run `ssh-keygen -l -f ~/.ssh/authorized_keys` to list key fingerprints with their type and size. For system-wide audit: `find /home -name authorized_keys -exec ssh-keygen -l -f {} \\;`. Remove or replace any short RSA keys (< 2048) or DSA keys.", difficulty: "mid" },
        { question: "You need to ensure a critical config file cannot be modified even by root, until a change is needed. How do you achieve this?", answer: "Use the immutable attribute: `chattr +i /etc/critical.conf`. Even root cannot modify or delete an immutable file. To make changes later: `chattr -i /etc/critical.conf`. Verify with `lsattr /etc/critical.conf`.", difficulty: "mid" },
        { question: "A security audit requires you to ensure that `PermitRootLogin no` and `PasswordAuthentication no` are set in sshd_config. How do you verify this is actually in effect (not overridden)?", answer: "Check with `sshd -T | grep -E 'permitrootlogin|passwordauthentication'` — this shows the effective running configuration including all includes and defaults, not just what's in the main config file. Also check for `Include /etc/ssh/sshd_config.d/*.conf` in the main file.", difficulty: "mid" },
        { question: "You need to run an audit of all world-writable files outside /tmp and /proc. What command finds them?", answer: "`find / -xdev -type f -perm -0002 ! -path '/tmp/*' ! -path '/proc/*' ! -path '/sys/*' 2>/dev/null` — `-xdev` stays on the same filesystem, `-perm -0002` matches world-writable, `!` excludes noisy paths.", difficulty: "mid" },
        { question: "After a suspected compromise, you need to find all files modified in the last 24 hours. What command do you use and what do you look for?", answer: "`find / -xdev -mtime -1 -type f 2>/dev/null | grep -v /proc` — then focus on suspicious locations: binaries in /usr/bin or /usr/sbin with recent timestamps, new files in /etc, or files in /tmp with execute bits. Compare hashes against known-good baselines if available.", difficulty: "senior" },
        { question: "You need to configure sudo so that the `deploy` user can run `/usr/bin/systemctl restart app.service` without a password, but nothing else. Write the sudoers entry.", answer: "In `/etc/sudoers.d/deploy` (edit with `visudo -f /etc/sudoers.d/deploy`): `deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart app.service`. Use the full absolute path and be specific — never use wildcards that could be exploited.", difficulty: "senior" },
        { question: "A CIS benchmark scan flags that your system has accounts with empty passwords. How do you find and remediate this?", answer: "Find them with `awk -F: '($2 == \"\" ) {print $1}' /etc/shadow` (requires root). Lock the accounts with `passwd -l <username>` (adds ! to prevent login) or set a password with `passwd <username>`. Also verify `PermitEmptyPasswords no` in sshd_config.", difficulty: "senior" },
      ],
    },
    {
      id: "linux-command-mastery",
      title: "Command Line Mastery",
      level: "intermediate",
      description: "Master the power tools every senior DevOps engineer reaches for daily: grep, awk, sed, jq, yq, find, xargs, curl, and system inspection utilities.",
      lessons: [
        {
          id: "grep-awk-sed",
          title: "grep, awk & sed — Text Processing at Scale",
          duration: 22,
          type: "lesson",
          description: "Master the Unix trinity of text processing. Learn to search, filter, transform, and extract data from logs, configs, and API output at production scale.",
          objectives: [
            "Use grep with basic, extended, and Perl-compatible regex across large log files",
            "Write awk programs for field processing, reporting, and log aggregation",
            "Apply sed for in-place file editing, substitution, and deletion in CI/CD pipelines",
            "Chain grep, awk, and sed together for real-world log analysis workflows",
            "Understand when to use each tool and when to reach for something else",
          ],
          content: `# grep, awk & sed — Text Processing at Scale

These three tools are the backbone of log analysis, config manipulation, and data extraction in Linux. Netflix, Cloudflare, and virtually every company with a Linux fleet uses grep + awk pipelines in their on-call runbooks and monitoring scripts.

## grep — Finding What Matters

grep searches for patterns. It's your first line of defense when something goes wrong.

\`\`\`bash
# Basic syntax
grep "pattern" file
grep "pattern" file1 file2
grep "pattern" *.log

# Case-insensitive search (production logs often mix capitalization)
grep -i "error" /var/log/nginx/access.log

# Show line numbers — essential for jumping to the right place
grep -n "FATAL" /var/log/app/application.log

# Count matches — how bad is this error rate?
grep -c "500" /var/log/nginx/access.log

# Invert match — show everything EXCEPT debug lines
grep -v "DEBUG" /var/log/app/application.log

# Recursive search across a directory tree
grep -r "database_url" /etc/app/
grep -r "password" /etc/nginx/ --include="*.conf"

# Show filenames only (useful in scripts)
grep -l "CRITICAL" /var/log/*.log

# Context lines — see what happened before and after an error
grep -A 5 "OutOfMemoryError" app.log   # 5 lines After
grep -B 3 "Connection refused" app.log  # 3 lines Before
grep -C 10 "Segmentation fault" app.log # 10 lines Context (before AND after)
\`\`\`

### Extended Regex (-E / egrep)

\`\`\`bash
# Match multiple patterns (OR)
grep -E "ERROR|WARN|FATAL" /var/log/app/application.log

# Match IP addresses
grep -E "([0-9]{1,3}\\.){3}[0-9]{1,3}" /var/log/nginx/access.log

# Lines starting with a timestamp pattern (ISO 8601)
grep -E "^2024-[0-9]{2}-[0-9]{2}" app.log

# Find requests taking over 5 seconds (response time in last field)
grep -E "\\s[5-9][0-9]{3}ms$" access.log
\`\`\`

### Perl-Compatible Regex (-P) — The Power Mode

\`\`\`bash
# Lookahead / lookbehind — extract just the value
grep -oP "(?<=user_id=)[0-9]+" app.log

# Named groups (grep -P with -o for extraction)
grep -oP "(?<=status=)\\d{3}" nginx.log | sort | uniq -c | sort -rn

# Find lines with repeated words (useful for finding typos in configs)
grep -P "\\b(\\w+)\\s+\\1\\b" config.txt
\`\`\`

### Real-World Production grep Examples

\`\`\`bash
# 1. How many 5xx errors in the last hour? (assuming nginx combined log format)
grep "$(date -d '1 hour ago' '+%d/%b/%Y:%H')" /var/log/nginx/access.log | grep -c '" 5'

# 2. Find which IPs are hammering your API (top 10)
grep '" 429 ' /var/log/nginx/access.log | grep -oE "^[0-9.]+" | sort | uniq -c | sort -rn | head -10

# 3. Find config files containing a deprecated setting
grep -rl "ssl_protocols.*SSLv3" /etc/nginx/

# 4. Check if a specific deployment tag appears in logs (canary validation)
grep -c "version=v2.3.1" /var/log/app/application.log

# 5. Find Java stack traces (multiline — grep the start)
grep -n "Exception in thread" /var/log/tomcat/catalina.out | tail -20
\`\`\`

### Common grep Gotchas

\`\`\`bash
# Gotcha 1: grep is line-buffered — in pipelines from tail -f, use --line-buffered
tail -f /var/log/app.log | grep --line-buffered "ERROR" | tee errors.log

# Gotcha 2: Binary files — grep will say "Binary file matches" and stop
grep -a "pattern" binary_file  # treat as text anyway
grep -I "pattern" *            # skip binary files silently

# Gotcha 3: Regex metacharacters in patterns — escape dots, brackets, etc.
grep -F "192.168.1.1" access.log  # -F = fixed string, no regex interpretation

# Gotcha 4: Large files — grep reads the whole file; for streaming, use:
tail -n 100000 huge.log | grep "ERROR"
\`\`\`

---

## awk — Field Processing & Reporting

awk is a full programming language designed for processing structured text. Think of it as "Python for the command line" for columnar data.

### awk Fundamentals

\`\`\`bash
# Basic structure: awk 'BEGIN{} /pattern/{action} END{}'
# NR = current record (line) number
# NF = number of fields in current record
# $0 = entire line, $1 = first field, $2 = second, etc.

# Print specific fields (nginx access log: IP, status, size)
awk '{print $1, $9, $10}' /var/log/nginx/access.log

# Default separator is whitespace. For CSV/TSV:
awk -F',' '{print $2, $5}' data.csv
awk -F'\t' '{print $1}' data.tsv

# Multiple separators
awk -F'[,:]' '{print $1, $3}' data.txt
\`\`\`

### BEGIN and END Blocks

\`\`\`bash
# BEGIN runs before any input; END runs after all input
awk 'BEGIN{total=0} {total += $10} END{print "Total bytes:", total}' access.log

# Print a header and footer
awk 'BEGIN{print "IP Address", "Requests"}
     {count[$1]++}
     END{for (ip in count) print ip, count[ip]}' access.log | sort -k2 -rn | head -20
\`\`\`

### Real-World awk Examples

\`\`\`bash
# 1. Calculate average response time from nginx logs (last field = response time in ms)
awk '{sum += $NF; count++} END{printf "Avg response: %.2f ms\\n", sum/count}' response.log

# 2. Find all unique HTTP status codes and their counts (like a mini analytics)
awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -rn

# 3. Extract failed deployments from CI logs (Jenkins/GitHub Actions format)
awk '/FAILED/ {print NR": "$0}' ci-build.log

# 4. Parse /proc/meminfo for memory usage percentage
awk '/MemTotal/{total=$2} /MemAvailable/{avail=$2} END{printf "Used: %.1f%%\\n", (1-avail/total)*100}' /proc/meminfo

# 5. Sum disk usage by user from du output
du -sh /home/* 2>/dev/null | awk '{sum[$2]+=$1} END{for(u in sum) print sum[u], u}' | sort -rh

# 6. Netflix-style: parse structured logs and compute p95 latency
# (assumes JSON-ish log with "latency=Xms" pattern)
grep "latency=" app.log | grep -oP "(?<=latency=)[0-9]+" | sort -n | awk '
  {values[NR]=$1}
  END{
    p50 = values[int(NR*0.50)]
    p95 = values[int(NR*0.95)]
    p99 = values[int(NR*0.99)]
    print "p50:", p50"ms  p95:", p95"ms  p99:", p99"ms"
  }'

# 7. Kubernetes-style: get pod names and their restart counts
kubectl get pods --all-namespaces | awk 'NR>1 && $5>0 {print $1, $2, "restarts:", $5}' | sort -k4 -rn
\`\`\`

### printf in awk

\`\`\`bash
# Format output cleanly (like C printf)
awk '{printf "%-20s %8.2f MB\\n", $1, $2/1024}' disk_usage.txt

# Generate reports
awk 'BEGIN{printf "%-15s %-10s %s\\n", "IP", "Requests", "Bytes"}
     {ips[$1]++; bytes[$1]+=$10}
     END{for(ip in ips) printf "%-15s %-10d %d\\n", ip, ips[ip], bytes[ip]}' access.log
\`\`\`

---

## sed — Stream Editing

sed is the go-to tool for in-place file editing in deployment scripts, config management, and CI/CD pipelines.

### Core sed Patterns

\`\`\`bash
# Substitution: s/find/replace/flags
sed 's/old/new/' file           # replace first occurrence per line
sed 's/old/new/g' file          # replace ALL occurrences (g = global)
sed 's/old/new/2' file          # replace only 2nd occurrence
sed 's/old/new/gi' file         # global, case-insensitive

# In-place editing (critical for deployment scripts)
sed -i 's/localhost/prod-db.internal/g' /etc/app/config.ini
sed -i.bak 's/DEBUG/INFO/g' /etc/app/config.ini  # .bak = keep backup (ALWAYS do this in prod)

# Delete lines
sed '/^#/d' config.conf         # delete comment lines
sed '/^$/d' file.txt            # delete blank lines
sed '5d' file.txt               # delete line 5
sed '5,10d' file.txt            # delete lines 5-10

# Print specific lines
sed -n '10,20p' file.txt        # print lines 10-20 (like head/tail combined)
sed -n '/START/,/END/p' file    # print between markers (inclusive)
\`\`\`

### Real-World sed Examples

\`\`\`bash
# 1. Update a version string in a config file during deployment
sed -i "s/APP_VERSION=.*/APP_VERSION=\${NEW_VERSION}/" /etc/app/environment

# 2. Comment out a problematic config line without deleting it
sed -i 's/^max_connections = 200/#max_connections = 200/' /etc/postgresql/postgresql.conf

# 3. Replace a database hostname across all app configs
find /etc/app/ -name "*.conf" -exec sed -i 's/db-old.internal/db-new.internal/g' {} \\;

# 4. Remove trailing whitespace from all Python files (pre-commit style)
find . -name "*.py" -exec sed -i 's/[[:space:]]*$//' {} \\;

# 5. Insert a line after a match (useful for adding config entries)
sed -i '/\[database\]/a host = prod-db.internal' config.ini

# 6. Extract a block between two patterns (like a config section)
sed -n '/^server {/,/^}/p' /etc/nginx/nginx.conf

# 7. Strip ANSI color codes from CI logs before storing
sed 's/\\x1B\\[[0-9;]*[mGKHF]//g' colored.log > clean.log
\`\`\`

### Multiline sed

\`\`\`bash
# Join lines (remove line breaks within a block)
sed ':a;N;$!ba;s/\\n/ /g' file.txt

# Replace across multiple lines using N command
sed 'N;s/line1\\nline2/replacement/' file.txt
\`\`\`

### The Python Perspective

When would you use Python instead?

- sed: single-pass substitution, line deletion, address ranges — blazing fast, no dependencies
- Python: when you need state across lines, complex data structures, or the logic gets beyond 2-3 sed expressions

\`\`\`python
# Python equivalent of: sed 's/old/new/g' file
import re, sys
for line in sys.stdin:
    print(re.sub('old', 'new', line), end='')
\`\`\`

The shell pipeline will usually be 10-100x faster for this kind of work.`,
          interviewQuestions: [
            {
              question: "You're on call and nginx is returning 502s. How would you use grep and awk to identify the problem?",
              difficulty: "mid" as const,
              answer: `**Step-by-step investigation:**

\`\`\`bash
# 1. Quantify the problem — how many 502s in the last 5 minutes?
grep "$(date -d '5 minutes ago' '+%d/%b/%Y:%H:%M')" /var/log/nginx/access.log | grep -c '" 502 '

# 2. Which upstream servers are failing? (502 = bad gateway, upstream is the issue)
grep '" 502 "' /var/log/nginx/error.log | grep -oE "upstream: \\"[^\\"]+\\"" | sort | uniq -c | sort -rn

# 3. Which endpoints are affected?
grep '" 502 ' /var/log/nginx/access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -20

# 4. Is it specific pods/backends? (if upstream is Kubernetes)
grep '" 502 ' /var/log/nginx/error.log | grep -oE "[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+:[0-9]+" | sort | uniq -c | sort -rn

# 5. Calculate the error rate as a percentage
awk 'BEGIN{total=0; errors=0}
     {total++; if($9==502) errors++}
     END{printf "Error rate: %.2f%% (%d/%d)\\n", errors/total*100, errors, total}' /var/log/nginx/access.log
\`\`\`

This pattern — grep to filter, awk to aggregate — is faster than loading logs into Elasticsearch for a quick incident triage.`,
            },
            {
              question: "How would you use sed to safely update a config file in a deployment script?",
              difficulty: "junior" as const,
              answer: `**Safe in-place editing with sed:**

\`\`\`bash
# Always keep a backup before modifying
sed -i.bak "s/DB_HOST=.*/DB_HOST=\${NEW_DB_HOST}/" /etc/app/config.env

# Verify the change before applying (dry run with -n and p)
sed -n "s/DB_HOST=.*/DB_HOST=\${NEW_DB_HOST}/p" /etc/app/config.env

# Validate after applying
grep "DB_HOST" /etc/app/config.env
\`\`\`

**Gotchas in deployment scripts:**
- If \`/\` appears in the replacement value (e.g., a URL), use a different delimiter:
  \`sed -i 's|old_url|https://new.example.com/path|g' config.conf\`
- Test with \`--dry-run\` equivalent (sed without -i) in staging first
- On macOS, \`sed -i\` requires an extension: \`sed -i '' 's/old/new/' file\` — this breaks Linux scripts! Use \`sed -i.bak\` for portability`,
            },
            {
              question: "Write an awk one-liner to find the top 5 slowest API endpoints from an nginx access log.",
              difficulty: "senior" as const,
              answer: `**Assuming standard nginx log with response time as the last field (add \`\$request_time\` to log_format):**

\`\`\`bash
awk '{
  endpoint = $7                     # URL path
  sub(/\\?.*/, "", endpoint)         # strip query string
  time = $NF                        # last field = response time
  if (time > max[endpoint]) {
    max[endpoint] = time
  }
  sum[endpoint] += time
  count[endpoint]++
}
END{
  for (ep in sum) {
    printf "%.3f\\t%.3f\\t%d\\t%s\\n", max[ep], sum[ep]/count[ep], count[ep], ep
  }
}' /var/log/nginx/access.log | sort -rn | head -5 | column -t

# Output: max_time  avg_time  requests  endpoint
\`\`\`

**What this reveals:**
- Endpoints with consistently high avg are candidates for caching or query optimization
- Endpoints with high max but low avg may have occasional N+1 queries or lock contention
- Low request count + high time = likely a background job endpoint worth investigating`,
            },
          ],
        },
        {
          id: "jq-and-yq",
          title: "jq & yq — JSON and YAML on the Command Line",
          duration: 18,
          type: "lesson",
          description: "Parse, filter, and transform JSON and YAML output from kubectl, AWS CLI, Terraform, and Helm without writing Python scripts.",
          objectives: [
            "Query and filter JSON with jq select, map, and path expressions",
            "Iterate arrays and transform objects with jq pipes and functions",
            "Use yq for YAML parsing, merging, and in-place editing of Kubernetes manifests",
            "Parse kubectl and AWS CLI JSON output for automation scripts",
            "Debug jq expressions using type and error functions",
          ],
          content: `# jq & yq — JSON and YAML on the Command Line

Modern DevOps is drowning in JSON: AWS CLI returns it, kubectl outputs it, Terraform state is JSON, GitHub Actions produces it. jq is the Swiss Army knife for slicing through it. yq is jq's YAML-native sibling — essential for Helm values files and Kubernetes manifests.

## jq — JSON Processor

### Installation & Basics

\`\`\`bash
# Install
apt-get install jq          # Debian/Ubuntu
brew install jq             # macOS
yum install jq              # RHEL/CentOS

# Basic identity (pretty-print JSON)
cat response.json | jq '.'
aws s3api list-buckets | jq '.'

# Extract a field
echo '{"name": "prod-cluster", "region": "us-east-1"}' | jq '.name'
# Output: "prod-cluster"

# Remove quotes from string output (-r = raw)
echo '{"name": "prod-cluster"}' | jq -r '.name'
# Output: prod-cluster  (no quotes — use in scripts!)
\`\`\`

### Array Iteration

\`\`\`bash
# .[] iterates over array elements
echo '[{"name":"a"},{"name":"b"}]' | jq '.[].name'

# Access by index
echo '[1,2,3,4,5]' | jq '.[2]'      # 3
echo '[1,2,3,4,5]' | jq '.[1:3]'    # [2,3] (slice)
echo '[1,2,3,4,5]' | jq '.[-1]'     # 5 (last element)

# Get array length
echo '[1,2,3]' | jq 'length'
\`\`\`

### select — Filtering

\`\`\`bash
# Filter by condition
echo '[{"name":"a","status":"Running"},{"name":"b","status":"Failed"}]' | \
  jq '.[] | select(.status == "Failed")'

# Multiple conditions
jq '.[] | select(.status == "Failed" and .restarts > 3)'

# String contains
jq '.[] | select(.name | contains("prod"))'

# Type checking
jq '.[] | select(.value | type == "number")'
\`\`\`

### map — Transform Arrays

\`\`\`bash
# Transform each element
echo '[1,2,3,4,5]' | jq 'map(. * 2)'
# [2,4,6,8,10]

# Extract a field from each object in array
echo '[{"name":"a","port":8080},{"name":"b","port":9090}]' | jq '[.[] | .name]'
# equivalent: jq '[.[].name]'
# or shorter:  jq 'map(.name)'

# Filter and transform in one step
jq 'map(select(.status == "Running") | .name)'
\`\`\`

### Real kubectl Output Examples

\`\`\`bash
# 1. List all pods in CrashLoopBackOff
kubectl get pods --all-namespaces -o json | \
  jq -r '.items[] | select(.status.containerStatuses[]?.state.waiting.reason == "CrashLoopBackOff") |
         [.metadata.namespace, .metadata.name] | @tsv'

# 2. Find pods consuming more than 500Mi memory
kubectl get pods -o json | \
  jq -r '.items[] | select(.spec.containers[].resources.limits.memory |
         (if . then (gsub("Mi";"") | tonumber) > 500 else false end)) | .metadata.name'

# 3. Get all image tags currently running in prod namespace
kubectl get pods -n prod -o json | \
  jq -r '.items[].spec.containers[].image' | sort -u

# 4. Find services without resource limits (compliance check)
kubectl get pods -o json | \
  jq '.items[] | select(.spec.containers[] | .resources.limits == null) |
      .metadata.name' -r

# 5. Extract NodePort mappings
kubectl get svc -o json | \
  jq -r '.items[] | select(.spec.type == "NodePort") |
         [.metadata.name, (.spec.ports[] | "\(.port):\(.nodePort)")] | @tsv'
\`\`\`

### Real AWS CLI Examples

\`\`\`bash
# 1. List EC2 instances with Name tag and private IP
aws ec2 describe-instances | \
  jq -r '.Reservations[].Instances[] |
         [(.Tags[]? | select(.Key=="Name") | .Value // "unnamed"), .PrivateIpAddress] | @tsv'

# 2. Find all stopped instances
aws ec2 describe-instances | \
  jq -r '.Reservations[].Instances[] | select(.State.Name == "stopped") | .InstanceId'

# 3. Get all RDS instances and their endpoint:port
aws rds describe-db-instances | \
  jq -r '.DBInstances[] | [.DBInstanceIdentifier, .Endpoint.Address, (.Endpoint.Port | tostring)] | @csv'

# 4. Sum total cost by service from AWS Cost Explorer JSON
aws ce get-cost-and-usage --... | \
  jq '.ResultsByTime[].Groups[] | {service: .Keys[0], cost: .Metrics.BlendedCost.Amount}' | \
  jq -s 'group_by(.service)[] | {service: .[0].service, total: (map(.cost | tonumber) | add)}'

# 5. Find Security Groups with 0.0.0.0/0 inbound (security audit)
aws ec2 describe-security-groups | \
  jq -r '.SecurityGroups[] | select(.IpPermissions[].IpRanges[]?.CidrIp == "0.0.0.0/0") |
         [.GroupId, .GroupName] | @tsv'
\`\`\`

### Advanced jq

\`\`\`bash
# @base64 — encode/decode
echo '"hello world"' | jq -r '@base64'
echo '"aGVsbG8gd29ybGQ="' | jq -r '@base64d'

# @sh — safely quote for shell (use in xargs pipelines)
jq -r '.instances[] | @sh "aws ec2 terminate-instances --instance-ids \(.id)"'

# @tsv and @csv — structured output
jq -r '[.name, .ip, .port] | @tsv'

# path expressions — useful for deep updates
jq 'getpath(["spec","containers",0,"image"])'
jq 'setpath(["spec","replicas"]; 3)'

# Debugging with type
jq '.someField | type'    # returns "string", "number", "array", "object", "null", "boolean"
jq '.someField | debug'   # prints value to stderr, passes through to stdout
\`\`\`

---

## yq — YAML Processor

yq brings jq-style querying to YAML — essential for Kubernetes manifests and Helm values.

\`\`\`bash
# Install (Mike Farah's yq — the Go version, not the Python one)
wget https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 -O /usr/local/bin/yq
chmod +x /usr/local/bin/yq

# Basic read
yq '.spec.replicas' deployment.yaml

# Multiple documents (--- separated)
yq '.' multi-doc.yaml

# Select from multi-doc
yq 'select(.kind == "Deployment")' multi-doc.yaml
\`\`\`

### yq for Real DevOps Work

\`\`\`bash
# 1. Update a Helm values file before deploying
yq -i '.image.tag = "v2.3.1"' values.yaml

# 2. Update replica count across environments
yq -i '.replicaCount = 5' production-values.yaml

# 3. Merge two YAML files (base + override pattern)
yq '. *+ load("override.yaml")' base-values.yaml > merged.yaml

# 4. Extract all image references from a Kubernetes manifest
yq '.spec.template.spec.containers[].image' deployment.yaml

# 5. Add a new environment variable to a Deployment
yq -i '.spec.template.spec.containers[0].env += [{"name": "NEW_VAR", "value": "new_value"}]' deployment.yaml

# 6. Convert YAML to JSON (for tools that need JSON)
yq -o=json '.' values.yaml | jq '.database.host'

# 7. Validate that all Deployments have resource limits (CI check)
for f in k8s/*.yaml; do
  yq 'select(.kind == "Deployment") | .spec.template.spec.containers[].resources.limits' "\$f" | \
    grep -q "null" && echo "WARNING: \$f missing resource limits"
done
\`\`\`

### The Python Perspective

\`\`\`python
# jq equivalent in Python
import json, subprocess

data = json.loads(subprocess.check_output(["kubectl", "get", "pods", "-o", "json"]))
failed = [p["metadata"]["name"] for p in data["items"]
          if any(c.get("state", {}).get("waiting", {}).get("reason") == "CrashLoopBackOff"
                 for c in p.get("status", {}).get("containerStatuses", []))]
\`\`\`

jq is faster to write and faster to run for ad-hoc queries. Python wins when the logic gets complex (multiple passes, error handling, writing results to a database).`,
          interviewQuestions: [
            {
              question: "How would you use jq to parse kubectl output and find all pods that have restarted more than 5 times?",
              difficulty: "mid" as const,
              answer: `\`\`\`bash
kubectl get pods --all-namespaces -o json | \\
  jq -r '.items[] |
         select(.status.containerStatuses != null) |
         select(.status.containerStatuses[].restartCount > 5) |
         [.metadata.namespace, .metadata.name, (.status.containerStatuses[].restartCount | tostring)] |
         @tsv' | \\
  column -t
\`\`\`

**Key points:**
- \`select()\` filters elements based on a condition
- Null check first (\`.containerStatuses != null\`) prevents errors on pending pods
- \`@tsv\` formats as tab-separated for human-readable output with \`column -t\`
- Add \`-r\` flag to get raw strings without JSON quotes

**In a real incident, you'd follow up with:**
\`\`\`bash
# Get the restart reason for the top crashers
kubectl describe pod \${POD_NAME} -n \${NAMESPACE} | grep -A 10 "Last State:"
\`\`\``,
            },
            {
              question: "You need to update the image tag in 20 Helm values files before a release. How would you do this safely?",
              difficulty: "senior" as const,
              answer: `\`\`\`bash
#!/bin/bash
NEW_TAG="v2.5.0"
OLD_TAG="v2.4.9"

# 1. Dry run — see what would change
find ./helm-values/ -name "*.yaml" -exec yq '.image.tag' {} + | grep "\${OLD_TAG}"

# 2. Make changes with backup
for f in ./helm-values/*.yaml; do
  if yq -e '.image.tag == "\${OLD_TAG}"' "\$f" > /dev/null 2>&1; then
    cp "\$f" "\${f}.bak"  # backup
    yq -i ".image.tag = \\\"\${NEW_TAG}\\\\"" "\$f"
    echo "Updated: \$f"
  fi
done

# 3. Verify the changes
find ./helm-values/ -name "*.yaml" -exec yq '.image.tag' {} +

# 4. Diff to confirm
for f in ./helm-values/*.yaml; do
  [ -f "\${f}.bak" ] && diff "\${f}.bak" "\$f"
done

# 5. Commit after verification
git diff helm-values/
git add helm-values/
git commit -m "chore: bump image tag to \${NEW_TAG}"
\`\`\`

**In practice at companies like Spotify and Shopify:** This is handled by automated release pipelines, but knowing the manual procedure is essential for emergency hotfixes and debugging automation failures.`,
            },
          ],
        },
        {
          id: "find-and-xargs",
          title: "find & xargs — Filesystem Power Tools",
          duration: 14,
          type: "lesson",
          description: "Use find to locate files by any attribute and xargs to build powerful parallel execution pipelines. Essential for disk cleanup, bulk operations, and CI/CD tasks.",
          objectives: [
            "Use find with type, name, mtime, size, and newer filters for targeted file discovery",
            "Execute commands on found files with -exec and xargs efficiently",
            "Run parallel operations with xargs -P to speed up bulk tasks",
            "Handle filenames with spaces using null delimiter (-print0 / -0)",
            "Build production-grade cleanup and audit scripts",
          ],
          content: `# find & xargs — Filesystem Power Tools

find is the most powerful file search tool on Linux. Combined with xargs, it becomes a parallel execution engine. Together, they handle everything from disk cleanup to bulk file operations that would take hours to do manually.

## find — Core Syntax

\`\`\`bash
# Basic syntax: find [path] [options] [tests] [actions]
find /var/log -name "*.log"

# Type filtering (-type)
find /etc -type f          # files only
find /var -type d          # directories only
find /usr/bin -type l      # symbolic links only

# Name patterns
find /home -name "*.conf"          # exact extension
find /etc -name "nginx*"           # starts with nginx
find /var -iname "*.LOG"           # case-insensitive (-iname)
find . -name "*.py" -not -name "*test*"  # exclude test files
\`\`\`

## Time-Based Filtering

\`\`\`bash
# -mtime = modification time in days
# + means "more than", - means "less than", no sign = "exactly"
find /var/log -mtime +30                  # modified more than 30 days ago
find /tmp -mtime +7                       # older than 7 days
find /var/cache -mtime -1                 # modified in the last 24 hours

# -mmin = minutes
find /var/log -mmin -60                   # modified in the last hour
find /tmp -mmin +120                      # older than 2 hours

# -newer = newer than a reference file (great for incremental operations)
find /opt/app -newer /opt/app/last_backup -type f  # files changed since last backup

# -newermt = newer than a specific time string
find /var/log -newermt "2024-01-15 10:00:00"
\`\`\`

## Size-Based Filtering

\`\`\`bash
# -size: c=bytes, k=KB, M=MB, G=GB
find /var/log -size +100M              # larger than 100MB
find /home -size +1G -type f           # files over 1GB (disk hogs)
find /tmp -size 0 -type f              # empty files
find /var/log -size +50M -size -500M   # between 50MB and 500MB
\`\`\`

## Executing Commands on Results

\`\`\`bash
# -exec runs a command on each found file
# {} = placeholder for the filename, \\; = end of command
find /var/log -name "*.log" -mtime +30 -exec gzip {} \\;

# -exec with + (batches files — faster than \\; for most commands)
find /tmp -mtime +7 -exec rm -f {} +

# -execdir runs in the file's directory (safer for relative paths)
find /opt/app -name "*.py" -execdir python3 -m py_compile {} \\;
\`\`\`

## xargs — Build and Execute Command Lines

\`\`\`bash
# Basic xargs: read stdin, pass as arguments
find /var/log -name "*.log" -mtime +30 | xargs gzip

# -I {} for custom placement
find . -name "*.txt" | xargs -I {} cp {} /backup/

# Handle spaces in filenames (ALWAYS use -print0 / -0 in scripts)
find /home -name "*.mp4" -print0 | xargs -0 rm -f

# -n: max arguments per command invocation
find . -name "*.py" | xargs -n 10 wc -l   # process 10 files at a time
\`\`\`

## Parallel Execution with xargs -P

\`\`\`bash
# -P N: run N processes in parallel — massive speedup for CPU/IO bound tasks
find /backup -name "*.tar" | xargs -P 4 -I {} gzip {}

# Compress 1000 log files using all CPU cores
find /var/log/archive/ -name "*.log" -print0 | \
  xargs -0 -P "$(nproc)" -I {} gzip -9 {}

# Download multiple files in parallel (use with curl)
cat urls.txt | xargs -P 10 -I {} curl -O {}

# Parallel image resizing (common in media pipelines)
find /uploads -name "*.jpg" -print0 | \
  xargs -0 -P "$(nproc)" -I {} convert {} -resize 800x600 /thumbnails/\$(basename {})
\`\`\`

## Real-World Production Examples

\`\`\`bash
# 1. DISK CLEANUP: Find and delete logs older than 30 days (safe version)
find /var/log/app -name "*.log" -mtime +30 -type f -print  # always preview first!
find /var/log/app -name "*.log" -mtime +30 -type f -delete

# 2. SECURITY AUDIT: Find world-writable files (potential attack vectors)
find /etc /usr /bin /sbin -type f -perm -o+w 2>/dev/null | head -20

# 3. SECURITY AUDIT: Find setuid/setgid binaries (privileged escalation targets)
find / -type f \\( -perm /4000 -o -perm /2000 \\) 2>/dev/null

# 4. DEPLOYMENT: Verify all config files are owned correctly after deploy
find /etc/app -type f -not -user appuser -exec chown appuser:appgroup {} +

# 5. PERFORMANCE: Find large files eating disk space during an incident
find / -type f -size +500M -printf "%s\\t%p\\n" 2>/dev/null | sort -rn | head -20

# 6. CI/CD: Lint all changed Python files (faster than linting everything)
git diff --name-only origin/main | grep "\\.py$" | xargs -P 4 flake8

# 7. BACKUP: Find files modified since last backup (incremental backup script)
find /opt/app -newer /var/lib/backup/last_run -type f -print0 | \
  xargs -0 tar -czf /backup/incremental-\$(date +%Y%m%d).tar.gz

# 8. LOG ANALYSIS: Count lines in all log files, sorted by size
find /var/log -name "*.log" -type f -print0 | \
  xargs -0 wc -l | sort -rn | head -20
\`\`\`

## Common Gotchas

\`\`\`bash
# Gotcha 1: find returns paths with ./ prefix — strip it if needed
find . -name "*.py" | sed 's|^./||'
# or use:
find . -name "*.py" -printf "%P\\n"   # %P = path without leading ./

# Gotcha 2: -exec \\; runs one process per file (slow for thousands of files)
# Use + instead of \\; to batch:
find . -name "*.log" -exec gzip {} \\;   # slow: one gzip per file
find . -name "*.log" -exec gzip {} +    # fast: gzip called with multiple files

# Gotcha 3: rm -rf with find — NEVER do this in production without preview
find /tmp -mtime +30 -exec rm -rf {} \\;  # DANGEROUS: {} could expand to directories
# Safe pattern:
find /tmp -maxdepth 1 -mtime +30 -type f -delete   # -delete is atomic and safe

# Gotcha 4: find crosses filesystem boundaries by default
find / -name "*.log"  # will search /proc, /sys, mounted NFS — very slow
find / -xdev -name "*.log"  # -xdev: stay on same filesystem

# Gotcha 5: Quoting in -exec with shell features
find . -name "*.log" -exec sh -c 'gzip "\$1" && echo "Compressed: \$1"' _ {} \\;
\`\`\`

## The Python Perspective

\`\`\`python
# Python equivalent of: find /var/log -name "*.log" -mtime +30 -delete
import os
import time

cutoff = time.time() - (30 * 86400)  # 30 days ago
for root, dirs, files in os.walk("/var/log"):
    for filename in files:
        if filename.endswith(".log"):
            filepath = os.path.join(root, filename)
            if os.path.getmtime(filepath) < cutoff:
                os.unlink(filepath)
                print(f"Deleted: {filepath}")
\`\`\`

Python's os.walk is ~10x slower than find for large directory trees. Use find for performance-critical cleanup scripts. Use Python when you need complex filtering logic, database logging of deleted files, or cross-platform compatibility.`,
          interviewQuestions: [
            {
              question: "Your disk is at 95% on a production server. Walk me through how you'd identify and clean up disk usage.",
              difficulty: "mid" as const,
              answer: `\`\`\`bash
# 1. Identify which filesystem is full
df -h

# 2. Find the top space consumers in that filesystem
du -sh /var/log/* 2>/dev/null | sort -rh | head -20
du -sh /home/* /opt/* /tmp 2>/dev/null | sort -rh | head -10

# 3. Find large individual files
find / -xdev -type f -size +500M -printf "%s\\t%p\\n" 2>/dev/null | sort -rn | head -20

# 4. Find old log files
find /var/log -name "*.log" -mtime +7 -type f -ls | sort -k7 -rn | head -20

# 5. Check for deleted-but-open files (common gotcha — processes holding file handles)
lsof | grep deleted | awk '{print $7, $9}' | sort -rn | head -10

# 6. Safe cleanup options (in order of safety):
# Option A: Rotate/compress old logs
find /var/log/app -name "*.log" -mtime +3 -exec gzip {} +

# Option B: Delete old temp files
find /tmp -mtime +1 -type f -delete

# Option C: Clean package cache
apt-get clean  # or: yum clean all

# Option D: Truncate a log that's still being written to (DON'T delete it)
> /var/log/huge.log   # truncates to 0 bytes while process still has the fd
\`\`\`

**Key insight:** Deleted files still held open by processes don't free space until the process closes them (or is restarted). \`lsof | grep deleted\` reveals this — a common reason disk doesn't free up after deletion.`,
            },
            {
              question: "How would you use find and xargs to parallelize a CPU-intensive operation across 10,000 files?",
              difficulty: "senior" as const,
              answer: `\`\`\`bash
# Example: compress 10,000 log files using all CPU cores
NPROC=\$(nproc)

find /var/log/archive -name "*.log" -mtime +1 -print0 | \\
  xargs -0 -P "\${NPROC}" -n 1 gzip -9

# More sophisticated: parallel image processing with progress tracking
find /uploads -name "*.jpg" -print0 | \\
  xargs -0 -P "\${NPROC}" -I {} sh -c '
    convert "\$1" -resize 1920x1080\\> -quality 85 "/processed/\$(basename \$1)"
    echo "Done: \$1"
  ' _ {}

# With rate limiting (don't overwhelm I/O)
find . -name "*.tar.gz" -print0 | \\
  xargs -0 -P 4 -I {} sh -c 'tar -tzf "\$1" > /dev/null && echo "OK: \$1" || echo "CORRUPT: \$1"' _ {}
\`\`\`

**Why not GNU parallel instead?** GNU parallel has more features (progress bars, resume, logging) but isn't installed by default. xargs -P is universal and sufficient for most cases.

**Choosing -P value:**
- CPU-bound tasks: \`-P \$(nproc)\`
- I/O-bound tasks: \`-P \$((\$(nproc) * 2))\` (more parallelism because tasks spend time waiting on disk)
- Network tasks: \`-P 20-50\` (network latency dominates, so more threads help)`,
            },
          ],
        },
        {
          id: "curl-and-http-tools",
          title: "curl & HTTP Tools — API Testing and Automation",
          duration: 16,
          type: "lesson",
          description: "Master curl for API testing, health checks, authentication, file transfers, and debugging HTTP in production environments.",
          objectives: [
            "Use curl for HTTP requests with all major flags and authentication methods",
            "Debug HTTP responses with headers, verbose output, and timing information",
            "Implement retry logic and timeouts for production health checks",
            "Work with REST APIs, upload files, and send form data",
            "Use wget for recursive downloads and httpie for human-friendly API exploration",
          ],
          content: `# curl & HTTP Tools — API Testing and Automation

curl is installed on virtually every Linux system and is the universal tool for making HTTP requests from scripts, health checks, CI/CD pipelines, and on-call runbooks. Every DevOps engineer needs to be fluent in it.

## curl Fundamentals

\`\`\`bash
# Basic GET request
curl https://api.example.com/health

# Save output to file
curl -o response.json https://api.example.com/data
curl -O https://example.com/file.tar.gz  # save with original filename

# Follow redirects (essential for HTTPS redirects)
curl -L https://example.com/download

# Silent mode (suppress progress bar — use in scripts)
curl -s https://api.example.com/health

# Show response code only
curl -s -o /dev/null -w "%{http_code}" https://api.example.com/health
\`\`\`

## Headers and Response Information

\`\`\`bash
# Show response headers only (-I = HEAD request)
curl -I https://api.example.com/

# Show both headers and body (-D = dump headers to file, - = stdout)
curl -D - https://api.example.com/data

# Verbose mode — shows full request/response cycle (use when debugging)
curl -v https://api.example.com/health

# Even more verbose (includes TLS handshake details)
curl --trace-ascii debug.txt https://api.example.com/health

# Custom request headers
curl -H "Authorization: Bearer \${TOKEN}" https://api.example.com/users
curl -H "Content-Type: application/json" -H "X-Request-ID: abc123" https://api.example.com/
\`\`\`

## Request Bodies — POST, PUT, PATCH

\`\`\`bash
# POST JSON
curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Alice", "email": "alice@example.com"}'

# POST from file (avoids quoting issues with complex JSON)
curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d @user.json

# PUT/PATCH
curl -X PUT https://api.example.com/users/123 \\
  -H "Content-Type: application/json" \\
  -d '{"status": "active"}'

# DELETE
curl -X DELETE https://api.example.com/users/123

# Form data (multipart)
curl -F "file=@/path/to/file.pdf" -F "name=report" https://api.example.com/upload

# URL-encoded form data
curl -d "username=alice&password=secret" https://example.com/login
\`\`\`

## Authentication

\`\`\`bash
# Basic auth
curl -u username:password https://api.example.com/

# Bearer token
curl -H "Authorization: Bearer \${API_TOKEN}" https://api.example.com/

# API key in header
curl -H "X-API-Key: \${API_KEY}" https://api.example.com/

# API key in query string (less secure, avoid if possible)
curl "https://api.example.com/data?api_key=\${API_KEY}"

# mTLS (client certificate authentication — common in service meshes)
curl --cert client.crt --key client.key https://internal-api.example.com/

# Skip TLS verification (-k) — ONLY for testing, never in production scripts
curl -k https://self-signed.example.internal/health
\`\`\`

## Timeouts and Retry Logic

\`\`\`bash
# Connect timeout vs total timeout
curl --connect-timeout 5 --max-time 30 https://api.example.com/

# Retry logic (essential for health checks and CI/CD)
curl --retry 3 --retry-delay 2 --retry-max-time 60 https://api.example.com/health

# Retry on specific HTTP error codes
curl --retry 3 --retry-on-http-error 500,502,503 https://api.example.com/

# Complete health check with all safety flags
curl -sfL --connect-timeout 5 --max-time 10 --retry 3 https://api.example.com/health
# -s: silent, -f: fail on 4xx/5xx (non-zero exit code), -L: follow redirects
\`\`\`

## Timing Information — Performance Debugging

\`\`\`bash
# Detailed timing breakdown (invaluable for diagnosing slow APIs)
curl -w "\\n
DNS lookup:    %{time_namelookup}s
TCP connect:   %{time_connect}s
TLS handshake: %{time_appconnect}s
First byte:    %{time_starttransfer}s
Total:         %{time_total}s
HTTP status:   %{http_code}
Downloaded:    %{size_download} bytes
" -o /dev/null -s https://api.example.com/endpoint

# Save timing format to a file and reuse
cat > /tmp/curl-format.txt << 'EOF'
DNS: %{time_namelookup}s
Connect: %{time_connect}s
TLS: %{time_appconnect}s
TTFB: %{time_starttransfer}s
Total: %{time_total}s
EOF
curl -w "@/tmp/curl-format.txt" -o /dev/null -s https://api.example.com/
\`\`\`

## Real-World Production Examples

\`\`\`bash
# 1. Health check loop — wait for a service to become ready (deployment scripts)
wait_for_service() {
  local url="\$1"
  local max_attempts=30
  local attempt=0

  until curl -sf --max-time 5 "\$url" > /dev/null 2>&1; do
    attempt=\$((attempt + 1))
    if [ "\$attempt" -ge "\$max_attempts" ]; then
      echo "ERROR: Service \$url did not become ready after \$max_attempts attempts"
      exit 1
    fi
    echo "Waiting for \$url... (attempt \$attempt/\$max_attempts)"
    sleep 10
  done
  echo "Service \$url is ready!"
}
wait_for_service "https://api.example.com/health"

# 2. Webhook trigger with payload from environment
curl -s -X POST "\${SLACK_WEBHOOK_URL}" \\
  -H "Content-Type: application/json" \\
  -d "{\\\"text\\\": \\\"Deployment \${VERSION} completed in \${ENV}\\\"}"

# 3. Download with progress and checksum verification
curl -L --progress-bar https://releases.example.com/app-v2.tar.gz -o app.tar.gz
sha256sum -c app-v2.sha256

# 4. Test API with multiple auth methods (debugging auth issues)
# Try bearer token
curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer \${TOKEN}" https://api.example.com/test
# Try basic auth
curl -s -o /dev/null -w "%{http_code}" -u "\${USER}:\${PASS}" https://api.example.com/test

# 5. Bulk API calls (with rate limiting)
while IFS= read -r id; do
  curl -s -H "Authorization: Bearer \${TOKEN}" "https://api.example.com/items/\${id}" | jq '.status'
  sleep 0.1  # rate limit: 10 requests/second
done < item_ids.txt

# 6. Upload a file to S3-compatible API
curl -X PUT "https://s3.amazonaws.com/\${BUCKET}/\${KEY}" \\
  -H "Content-Type: application/octet-stream" \\
  --data-binary @/path/to/file.bin \\
  --aws-sigv4 "aws:amz:us-east-1:s3" \\
  --user "\${AWS_ACCESS_KEY_ID}:\${AWS_SECRET_ACCESS_KEY}"
\`\`\`

## wget — Recursive Downloads

\`\`\`bash
# Download a single file
wget https://example.com/file.tar.gz

# Download in background (useful for large files)
wget -b https://example.com/large-file.tar.gz

# Recursive download of a website (for mirroring/archiving)
wget -r -l 2 --no-parent https://docs.example.com/

# Download only specific file types
wget -r -A "*.pdf" https://example.com/docs/

# Continue interrupted download
wget -c https://example.com/large-file.tar.gz
\`\`\`

## httpie — Human-Friendly HTTP Client

httpie is optional but excellent for interactive API exploration.

\`\`\`bash
# Install
pip install httpie  # or: apt-get install httpie

# GET request (pretty-printed JSON by default)
http https://api.example.com/users

# POST JSON (httpie auto-detects JSON from key=value pairs)
http POST https://api.example.com/users name="Alice" email="alice@example.com"

# Auth
http https://api.example.com/ Authorization:"Bearer \${TOKEN}"
http -a username:password https://api.example.com/

# Equivalent curl commands are shown with --print all
http --print=Hh GET https://api.example.com/users  # request headers only
\`\`\`

## The Python Perspective

\`\`\`python
# Python equivalent of a curl health check
import requests

try:
    response = requests.get(
        "https://api.example.com/health",
        timeout=(5, 30),  # (connect timeout, read timeout)
        headers={"Authorization": f"Bearer {token}"},
    )
    response.raise_for_status()  # raises on 4xx/5xx
    print(f"Status: {response.status_code}")
except requests.exceptions.ConnectionError:
    print("Connection failed")
except requests.exceptions.Timeout:
    print("Timed out")
\`\`\`

Use Python (requests/httpx) when: you need retry logic with backoff, sessions/cookies, response parsing, or building a monitoring tool. Use curl when: it's a one-liner, you're in a shell script, or the environment doesn't have Python (Alpine containers, recovery shells).`,
          interviewQuestions: [
            {
              question: "How would you write a production-ready health check script using curl?",
              difficulty: "junior" as const,
              answer: `\`\`\`bash
#!/bin/bash
# health-check.sh — production-ready health check

SERVICE_URL="\${1:-https://api.example.com/health}"
MAX_RETRIES=3
TIMEOUT=10
EXPECTED_CODE=200

check_health() {
  local http_code
  http_code=\$(curl -s -o /dev/null -w "%{http_code}" \\
    --connect-timeout 5 \\
    --max-time "\${TIMEOUT}" \\
    --retry "\${MAX_RETRIES}" \\
    --retry-delay 2 \\
    "\${SERVICE_URL}")

  if [ "\${http_code}" -eq "\${EXPECTED_CODE}" ]; then
    echo "HEALTHY: \${SERVICE_URL} returned HTTP \${http_code}"
    return 0
  else
    echo "UNHEALTHY: \${SERVICE_URL} returned HTTP \${http_code}"
    return 1
  fi
}

check_health || exit 1
\`\`\`

Key flags explained:
- \`-s\`: silent (no progress bar)
- \`-o /dev/null\`: discard body
- \`-w "%{http_code}"\`: output only the status code
- \`--connect-timeout 5\`: fail fast if TCP connect takes too long
- \`--max-time 10\`: abort if total request exceeds this
- \`--retry 3\`: retry on network failures (not on HTTP errors by default)`,
            },
            {
              question: "You suspect a service is slow due to DNS resolution. How would you diagnose this with curl?",
              difficulty: "mid" as const,
              answer: `\`\`\`bash
# 1. Use curl's timing output to identify where time is spent
curl -w "\\nDNS: %{time_namelookup}s\\nConnect: %{time_connect}s\\nTLS: %{time_appconnect}s\\nTTFB: %{time_starttransfer}s\\nTotal: %{time_total}s\\n" \\
  -o /dev/null -s https://api.example.com/

# If DNS lookup >> 0.1s, DNS is the bottleneck

# 2. Test with an IP to confirm (bypasses DNS)
curl --resolve "api.example.com:443:203.0.113.10" https://api.example.com/

# 3. Compare DNS resolution time
time dig api.example.com @8.8.8.8      # Google DNS
time dig api.example.com @1.1.1.1      # Cloudflare DNS
time dig api.example.com               # Your default resolver

# 4. Check if internal DNS is slow (common in AWS/GCP VPCs)
time nslookup internal-service.cluster.local

# Root causes for slow DNS in production:
# - Misconfigured /etc/resolv.conf (wrong nameserver)
# - ndots setting causing unnecessary search domain lookups
# - AWS VPC DNS resolver overloaded (check CloudWatch DNS metrics)
# - Missing /etc/hosts entry for frequently-used internal services
\`\`\``,
            },
          ],
        },
        {
          id: "system-inspection",
          title: "System Inspection — ss, lsof, strace & /proc",
          duration: 17,
          type: "lesson",
          description: "Inspect what's happening inside a live Linux system using modern tools. Find what's listening on ports, which processes have which files open, and how to trace system calls for deep debugging.",
          objectives: [
            "Use ss (not netstat) to inspect socket state and find what's listening on ports",
            "Use lsof to identify processes holding file handles, network connections, and deleted files",
            "Apply strace basics to debug mysterious process behavior",
            "Navigate the /proc filesystem to extract process and system information",
            "Diagnose common production issues: port conflicts, file descriptor leaks, zombie processes",
          ],
          content: `# System Inspection — ss, lsof, strace & /proc

These tools let you see inside a running Linux system. They're your instruments when something is wrong and you don't know why: a port is in use, a file won't delete, a process is hanging, or performance is degraded.

## ss — Socket Statistics (Not netstat)

**Why not netstat?** netstat is deprecated. ss is faster (reads from /proc directly), supports more output formats, and ships with modern Linux distributions. If you're writing runbooks in 2024, use ss.

\`\`\`bash
# Install (usually in iproute2 package)
apt-get install iproute2

# Show all listening ports
ss -tlnp    # t=TCP, l=listening, n=numeric (no DNS lookup), p=show process

# All sockets (listening + established)
ss -tunap   # t=TCP, u=UDP, n=numeric, a=all, p=process

# Show what's on a specific port
ss -tlnp | grep :8080
ss -tlnp sport = :8080  # ss native filter

# Show established connections only
ss -tn state established

# Show connections to a specific remote host
ss -tn dst 10.0.0.100

# Count connections by state (connection leak detection)
ss -s    # summary: total, TCP states breakdown

# Show process name and PID (requires root for other users' processes)
sudo ss -tlnp
\`\`\`

### Real Production ss Examples

\`\`\`bash
# 1. Find what's using port 80 (pre-deploy check)
ss -tlnp | grep ':80 '

# 2. Find all ports this server is listening on (inventory / compliance)
ss -tlnp | awk 'NR>1 {print $4}' | grep -oE ":[0-9]+" | sort -u

# 3. Count active connections per source IP (detecting DDoS / rate-limit candidates)
ss -tn state established | awk 'NR>1 {print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -20

# 4. Find TIME_WAIT sockets (common after high traffic — indicates keep-alive tuning needed)
ss -tn state time-wait | wc -l

# 5. Check if a microservice is actually listening (health check before smoke test)
ss -tlnp | grep -q ":8080 " && echo "Service is up" || echo "Service is NOT listening"

# 6. Show Unix domain sockets (for local service communication)
ss -xp
\`\`\`

### ss vs netstat Equivalents

\`\`\`bash
# netstat -tlnp  →  ss -tlnp
# netstat -an    →  ss -anp
# netstat -s     →  ss -s
# netstat -rn    →  ip route show
\`\`\`

---

## lsof — List Open Files

In Linux, everything is a file: regular files, sockets, pipes, devices. lsof shows you what every process has open.

\`\`\`bash
# Show all open files (output is massive — always filter)
lsof | head -20

# Files opened by a specific process
lsof -p 1234

# Files opened by a specific user
lsof -u www-data

# What process is using a port?
lsof -i :8080
lsof -i TCP:8080

# What process is using a file?
lsof /var/log/nginx/access.log

# All network connections for a process
lsof -i -p 1234    # internet connections for PID 1234

# Show deleted files still held open (disk space mystery)
lsof | grep deleted

# All files in a directory
lsof +D /var/lib/mysql/

# Watch file handles in real-time (like top for file descriptors)
watch -n 2 'lsof -p \$(pgrep java) | wc -l'
\`\`\`

### Real Production lsof Examples

\`\`\`bash
# 1. INCIDENT: "Port 5432 is in use" — find the culprit
lsof -i :5432
# Output: COMMAND PID USER FD TYPE DEVICE SIZE/OFF NODE NAME
# postgres 12345 postgres  5u IPv4 ... TCP *:5432 (LISTEN)

# 2. DISK FULL MYSTERY: Find deleted files still held open
lsof | grep '(deleted)' | awk '{print $1, $2, $7, $9}' | sort -k3 -rn | head -20
# Restart the process to release the space, or: > /proc/PID/fd/FD (truncate in-place)

# 3. FILE DESCRIPTOR LEAK: Check if a process is leaking FDs
watch -n 5 'lsof -p \$(pgrep myapp) | wc -l'
# If this number keeps growing, you have a leak

# 4. SECURITY: What network connections is this process making?
lsof -i -p \$(pgrep suspicious_process) -n -P

# 5. DEBUGGING: What config files is nginx reading right now?
lsof -p \$(pgrep nginx) | grep -E "\\.conf|\\.crt|\\.key"

# 6. DATABASE CONNECTIONS: Count open connections to MySQL
lsof -i :3306 | grep ESTABLISHED | wc -l
\`\`\`

---

## strace — System Call Tracer

strace shows every system call a process makes. It's the "black box flight recorder" for mysterious process behavior.

\`\`\`bash
# Trace a new process
strace ls /tmp

# Trace an existing process (attach to running process)
strace -p 1234

# Filter by system call type (-e)
strace -e openat ls /tmp          # only file open calls
strace -e network ls /tmp         # only network calls
strace -e read,write -p 1234      # only read/write calls

# Summarize system calls (great for performance profiling)
strace -c ls /tmp
# Output: % time, calls, errors, syscall name

# Trace with timestamps
strace -tt ls /tmp                 # absolute timestamps
strace -T ls /tmp                  # time spent in each call

# Follow child processes (important for forking servers)
strace -f nginx

# Write output to file (trace output goes to stderr by default)
strace -o /tmp/trace.txt -p 1234
\`\`\`

### Real strace Use Cases

\`\`\`bash
# 1. Why is my app failing silently? (find the failing syscall)
strace -e openat myapp 2>&1 | grep "ENOENT\\|EACCES\\|EPERM"
# Common result: "openat(/etc/app/missing.conf) = -1 ENOENT (No such file or directory)"

# 2. What config files does an app load? (reverse-engineering behavior)
strace -e openat myapp 2>&1 | grep "openat" | grep -v "ENOENT"

# 3. Why is this process slow? (find the slow syscall)
strace -T -p 1234 2>&1 | awk -F'<' '{print $2, $0}' | sort -rn | head -20

# 4. Is my app actually writing to disk? (verify no-op writes)
strace -e write -p 1234 2>&1 | head -20

# 5. Why won't this process exit? (find what it's waiting on)
strace -p 1234
# If it hangs on: epoll_wait() = waiting for I/O events
# If it hangs on: futex() = waiting on a lock
# If it hangs on: read() = waiting for network/pipe data
\`\`\`

---

## /proc Filesystem

/proc is a virtual filesystem — it doesn't exist on disk. The kernel generates its contents dynamically. It's the source of truth for everything running on the system.

\`\`\`bash
# Process information
ls /proc/1234/                # all info about PID 1234
cat /proc/1234/status         # process name, state, memory, uid/gid
cat /proc/1234/cmdline        # full command line (null-separated)
cat /proc/1234/environ        # environment variables (null-separated)
ls -la /proc/1234/fd/         # open file descriptors
cat /proc/1234/net/tcp        # TCP connections for this process's namespace

# System-wide information
cat /proc/meminfo             # memory stats (MemTotal, MemFree, MemAvailable, SwapUsed)
cat /proc/cpuinfo             # CPU details (model, cores, flags)
cat /proc/loadavg             # 1min, 5min, 15min load averages + running/total processes
cat /proc/net/tcp             # all TCP connections (hex format)
cat /proc/sys/vm/swappiness   # current swappiness value

# Kernel parameters (readable and some writable)
cat /proc/sys/net/core/somaxconn       # max TCP connection queue
cat /proc/sys/net/ipv4/tcp_tw_reuse   # TIME_WAIT socket reuse

# Quickly check if a process is alive
[ -d /proc/\${PID} ] && echo "Process \$PID is running" || echo "Process \$PID is gone"
\`\`\`

### /proc for DevOps Diagnostics

\`\`\`bash
# 1. Check memory breakdown for a process (are we using swap?)
awk '/VmRSS|VmSwap|VmPeak/ {print}' /proc/\$(pgrep java)/status

# 2. How many file descriptors is a process using?
ls /proc/\$(pgrep nginx)/fd | wc -l

# 3. What are the open file descriptor limits?
cat /proc/\$(pgrep nginx)/limits | grep "open files"
# Compare against actual usage — if close to limit, you'll get "too many open files" errors

# 4. System uptime without the uptime command
cat /proc/uptime    # seconds since boot (total, idle)

# 5. OOM killer history (who got killed for being too greedy?)
dmesg | grep -i "oom\\|killed process"
# or:
journalctl -k | grep -i "oom killer"
\`\`\``,
          interviewQuestions: [
            {
              question: "A developer says 'I can't start my app on port 3000, something is already using it.' How do you diagnose and fix this?",
              difficulty: "junior" as const,
              answer: `\`\`\`bash
# 1. Identify what's using the port
ss -tlnp | grep ':3000 '
# or:
lsof -i :3000

# Output example:
# COMMAND   PID     USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
# node     15234   deploy  22u  IPv4 123456      0t0  TCP *:3000 (LISTEN)

# 2. Get more info about that process
ps aux | grep 15234
cat /proc/15234/cmdline | tr '\\0' ' '  # full command with arguments

# 3. Decide whether to kill it
# If it's a stale process from a previous deployment:
kill 15234            # graceful (SIGTERM)
# If it doesn't respond:
kill -9 15234         # force (SIGKILL)

# 4. Verify port is now free
ss -tlnp | grep ':3000 '

# Prevention: In systemd services, add:
# RestartSec=5
# And ensure ExecStop properly shuts down the process

# Common gotcha: Node/Python dev servers that didn't clean up.
# Also check: sudo ss -tlnp (process might be owned by another user)
\`\`\``,
            },
            {
              question: "Your disk shows 95% full but you can't find the files. How would you use lsof to find the issue?",
              difficulty: "mid" as const,
              answer: `**This is the classic 'deleted but still open' problem:**

\`\`\`bash
# Find deleted files still held open by processes
lsof | grep '(deleted)'

# Sort by size to find the biggest offenders
lsof | grep '(deleted)' | awk '{print $7, $1, $2, $9}' | sort -rn | head -10

# Typical output:
# SIZE PID COMMAND FILENAME
# 10737418240 12345 java /var/log/app/application.log.2024-01-01 (deleted)
\`\`\`

**What happened:** A log rotation script deleted the file, but Java still has the file descriptor open and keeps writing to it. The disk space isn't freed until Java closes the FD or the process restarts.

**Fix options:**

\`\`\`bash
# Option A: Restart the process (cleanest)
systemctl restart myapp

# Option B: Truncate the file in-place WITHOUT restarting (zero downtime)
# The FD number is shown by lsof in the FD column (e.g., "22u")
> /proc/12345/fd/22   # truncates the deleted file to 0 bytes

# Verify disk space is recovered
df -h /var/log
\`\`\`

This pattern is extremely common with Java apps, Elasticsearch, and any process with long-lived log file handles — especially when logrotate uses \`copytruncate\` instead of \`create\`.`,
            },
            {
              question: "A process is hanging and you don't know why. How would you use strace to diagnose it?",
              difficulty: "senior" as const,
              answer: `\`\`\`bash
# 1. Attach to the hanging process
sudo strace -p \$(pgrep myapp)

# The strace will show the CURRENT blocking syscall immediately:

# Scenario A: Waiting on network I/O
# epoll_wait(5, ...) = hanging here

# Scenario B: Waiting on a file lock
# fcntl(3, F_SETLKW, ...) = blocked on file lock
# Check who holds the lock: flock and lsof

# Scenario C: Waiting on a mutex/semaphore (deadlock)
# futex(0x7f..., FUTEX_WAIT, ...) = waiting on userspace lock

# Scenario D: Sleeping in a loop
# nanosleep({tv_sec=30, tv_nsec=0}, ...) = just sleeping, not hung

# 2. For threaded applications, trace all threads
sudo strace -p \$(pgrep myapp) -f 2>&1 | grep -v "^[0-9]* ---"

# 3. Check if it's making progress (vs truly stuck)
# Run strace for 5 seconds and summarize
sudo timeout 5 strace -c -p \$(pgrep myapp) 2>&1

# 4. For Java specifically — use jstack instead (language-level stack traces)
sudo -u appuser jstack \$(pgrep java) | grep -A 20 "BLOCKED"

# Key insight: strace shows OS-level blocking; language runtimes (JVM, Python GIL)
# may block at a higher level — combine strace with language-specific tools.
\`\`\``,
            },
          ],
        },
      ],
      exam: [
        { question: "You need to find all `.log` files larger than 100MB under `/var/log`. What command do you use?", answer: "`find /var/log -type f -name '*.log' -size +100M` — `-size +100M` matches files strictly larger than 100MB. Add `-ls` to see sizes or `-exec ls -lh {} \\;` for human-readable output.", difficulty: "junior" },
        { question: "You run `grep -r 'password' /etc/` and get thousands of results. How do you filter to only show lines that look like actual passwords (e.g., `password=something`)?", answer: "`grep -rP 'password\\s*=\\s*\\S+' /etc/` using Perl-compatible regex (`-P`) to match `password=` followed by a non-whitespace value. Also try `grep -rE 'password[[:space:]]*=[[:space:]]*[^$]' /etc/` with extended regex.", difficulty: "mid" },
        { question: "You have a JSON API response and need to extract the `.items[].name` field for all items where `.status == \"active\"`. What jq command do you use?", answer: "`jq -r '.items[] | select(.status == \"active\") | .name'` — `select()` filters elements, `-r` outputs raw strings without JSON quotes.", difficulty: "mid" },
        { question: "You need to find all files owned by a deleted user (UID 1042) that no longer exists in /etc/passwd. What command finds them?", answer: "`find / -xdev -nouser 2>/dev/null` finds all files with no valid owner in /etc/passwd. For a specific UID: `find / -xdev -uid 1042 2>/dev/null`.", difficulty: "mid" },
        { question: "You need to run `gzip` on 10,000 log files in parallel using all CPU cores. How do you do this efficiently?", answer: "`find /var/log/archive -name '*.log' | xargs -P $(nproc) -I {} gzip {}` — `-P $(nproc)` runs as many parallel jobs as CPU cores. Alternatively: `find /var/log/archive -name '*.log' | parallel gzip` with GNU parallel.", difficulty: "mid" },
        { question: "A YAML config file needs the value of `database.port` changed from `5432` to `5433` without breaking the file structure. How do you do this safely?", answer: "`yq e '.database.port = 5433' -i config.yaml` — `yq` is the YAML-aware tool that parses and modifies YAML properly. Avoid using `sed` for YAML as it can break indentation or multiline strings.", difficulty: "mid" },
        { question: "You need to run a command on 50 servers listed in a file `hosts.txt`, collecting the output of `df -h` from each. How do you parallelize this?", answer: "`parallel -j 10 'ssh {} df -h' :::: hosts.txt` with GNU parallel, or `xargs -P 10 -I{} ssh {} df -h < hosts.txt`. Ensure SSH keys are in place and `known_hosts` is populated, or add `-o StrictHostKeyChecking=accept-new`.", difficulty: "mid" },
        { question: "You pipe a command through `awk` to sum a column of numbers. The result is 0 even though the numbers look correct. What's likely wrong?", answer: "The numbers likely contain invisible characters (carriage returns from Windows line endings, trailing spaces, or non-breaking spaces). Check with `cat -A file | head`. Fix with `tr -d '\\r'` or `dos2unix`. Also ensure you're summing the right field: `awk '{sum += $3} END {print sum}'`.", difficulty: "senior" },
        { question: "You need to watch a directory and run a script whenever a new file appears. How do you implement this without polling?", answer: "Use `inotifywait` from the `inotify-tools` package: `inotifywait -m -e create /watch/dir | while read dir event file; do process_file \"$dir$file\"; done`. This uses the kernel's inotify mechanism for event-driven notification rather than polling.", difficulty: "senior" },
        { question: "A complex `find | xargs` pipeline is deleting wrong files in production. How would you have tested it safely first?", answer: "Always prototype with `find ... -print` first to see what files match before acting. For `xargs`, use `-p` (prompt before executing) or replace the destructive command with `echo`. Use `find ... -exec echo rm {} \\;` for a dry run. Never run destructive pipelines untested in production.", difficulty: "senior" },
      ],
    },
    {
      id: "linux-production-ops",
      title: "Linux Production Operations",
      level: "advanced",
      description: "Operate Linux systems in production: log management, job scheduling, disk management, and emergency troubleshooting techniques used by SREs at scale companies.",
      lessons: [
        {
          id: "log-management",
          title: "Log Management — journalctl, logrotate & /var/log",
          duration: 16,
          type: "lesson",
          description: "Manage logs across systemd and traditional /var/log. Query journald efficiently, configure log rotation, and set up log aggregation pipelines.",
          objectives: [
            "Query systemd journal with journalctl using time ranges, units, priorities, and JSON output",
            "Configure logrotate for automatic log rotation and retention",
            "Understand the difference between systemd journal and /var/log files",
            "Set up persistent journald storage and configure size limits",
            "Build log aggregation pipelines for shipping to Elasticsearch/Loki/Splunk",
          ],
          content: `# Log Management — journalctl, logrotate & /var/log

Logs are your primary debugging tool in production. Modern Linux uses two parallel logging systems: the systemd journal (structured, binary, queryable) and traditional /var/log files (text, append-only, familiar). You need to be fluent in both.

## journalctl — The systemd Journal

### Core Flags

\`\`\`bash
# Follow logs in real-time (like tail -f, but for systemd)
journalctl -f
journalctl -f -u nginx   # follow a specific service

# Show logs for a specific unit (service)
journalctl -u nginx
journalctl -u nginx -u postgresql   # multiple units

# Time filtering (essential for incident investigation)
journalctl --since "2024-01-15 10:00:00" --until "2024-01-15 11:00:00"
journalctl --since "1 hour ago"
journalctl --since today
journalctl --since yesterday

# Priority filtering (-p = priority level)
# 0=emerg, 1=alert, 2=crit, 3=err, 4=warning, 5=notice, 6=info, 7=debug
journalctl -p err                    # errors and worse
journalctl -p warning..err           # range: warnings through errors
journalctl -u nginx -p err --since "1 hour ago"

# Show kernel messages (-k = kernel, like dmesg)
journalctl -k
journalctl -k --since "1 hour ago"
journalctl -k | grep -i "oom\\|killed\\|error"

# Boot logs
journalctl -b         # current boot
journalctl -b -1      # previous boot (great for crash investigation)
journalctl -b -2      # two boots ago
journalctl --list-boots   # show all available boot sessions
\`\`\`

### Output Formats

\`\`\`bash
# JSON output — pipe to jq for analysis
journalctl -u nginx -o json | jq '.MESSAGE'

# One JSON object per line (for log shippers like Filebeat, Fluentd)
journalctl -u nginx -o json-pretty
journalctl -o json | head -1 | jq 'keys'  # see all available fields

# Short output formats
journalctl -o short-precise   # microsecond timestamps
journalctl -o cat             # message only, no metadata (for grepping)
journalctl -o verbose         # all fields

# Export for analysis
journalctl --since "1 hour ago" -o json > incident-2024-01-15.json
\`\`\`

### Efficient Log Querying

\`\`\`bash
# Filter by systemd field values (very fast — uses journal index)
journalctl _PID=1234              # logs from a specific PID
journalctl _UID=1000              # logs from a specific user
journalctl _SYSTEMD_UNIT=nginx.service _PRIORITY=3  # combine filters

# Show logs with context around errors (--catalog shows message explanations)
journalctl -u nginx -p err --catalog

# Disk usage of journal
journalctl --disk-usage

# Vacuum old journals
journalctl --vacuum-time=30d      # remove entries older than 30 days
journalctl --vacuum-size=1G       # keep only 1GB of logs
\`\`\`

### journald Configuration

\`\`\`bash
# /etc/systemd/journald.conf
[Journal]
Storage=persistent          # Keep logs across reboots (default: auto)
Compress=yes                # Compress old journals
SystemMaxUse=2G             # Max disk space for system journal
SystemKeepFree=1G           # Always keep 1G free on the partition
MaxRetentionSec=30day       # Auto-delete logs older than 30 days
MaxFileSec=1week            # Rotate journal files weekly
ForwardToSyslog=yes         # Also send to rsyslog (for /var/log)
RateLimitInterval=30s
RateLimitBurst=10000        # Allow 10000 messages per 30s per unit

# Apply changes
systemctl restart systemd-journald
\`\`\`

---

## logrotate — Traditional Log Rotation

logrotate handles /var/log files and application logs not managed by journald.

\`\`\`bash
# Config location
ls /etc/logrotate.conf          # main config
ls /etc/logrotate.d/            # per-application configs (drop files here)

# Example /etc/logrotate.d/myapp:
cat > /etc/logrotate.d/myapp << 'EOF'
/var/log/myapp/*.log {
    daily                       # rotate daily
    rotate 14                   # keep 14 rotated logs
    compress                    # gzip rotated logs
    delaycompress               # don't compress the most recent rotation (app still writing)
    missingok                   # don't error if log is missing
    notifempty                  # don't rotate empty logs
    dateext                     # add date to rotated filename (not just a number)
    sharedscripts               # run postrotate script once, not per file
    postrotate
        systemctl kill --kill-who=main --signal=USR1 myapp.service
    endscript
}
EOF
\`\`\`

### logrotate Patterns

\`\`\`bash
# Test your logrotate config without executing (dry run)
logrotate -d /etc/logrotate.d/myapp

# Force rotation now (useful after config changes)
logrotate -f /etc/logrotate.d/myapp

# Common signal patterns for postrotate:
# nginx: kill -USR1 \$(cat /var/run/nginx.pid)
# Apache: apachectl graceful
# rsyslog: systemctl kill -s HUP rsyslog.service

# For apps that can't receive signals (like Java), use copytruncate instead:
/var/log/java-app/*.log {
    daily
    rotate 7
    compress
    copytruncate     # copy file, then truncate (no signal needed — but risk of missing a few log lines)
    missingok
}
\`\`\`

---

## Finding Logs Across systemd and /var/log

\`\`\`bash
# Map: which logs are where?

# systemd-managed services → journald
journalctl -u sshd      # SSH
journalctl -u docker    # Docker
journalctl -u kubelet   # Kubernetes kubelet

# Traditional /var/log files (often also sent to journal via rsyslog)
/var/log/syslog         # general system log (Debian/Ubuntu)
/var/log/messages       # general system log (RHEL/CentOS)
/var/log/auth.log       # authentication events (Debian)
/var/log/secure         # authentication events (RHEL)
/var/log/nginx/         # nginx access and error logs
/var/log/mysql/         # MySQL error log
/var/log/app/           # your application's log directory

# Combined search (check both journals and files)
journalctl -u nginx --since "1 hour ago"
tail -f /var/log/nginx/error.log
\`\`\`

### Log Shipping to Centralized Systems

\`\`\`bash
# Filebeat config snippet for shipping to Elasticsearch
cat /etc/filebeat/filebeat.yml
# filebeat.inputs:
# - type: journald
#   id: system-journal
#   include_matches:
#     - _SYSTEMD_UNIT=myapp.service

# Promtail (Loki) config for Grafana stack
cat /etc/promtail/config.yml
# scrape_configs:
# - job_name: journal
#   journal:
#     max_age: 12h
#     labels:
#       job: systemd-journal

# Quick ship with journalctl + curl to Elasticsearch
journalctl -o json --since "1 hour ago" | \\
  while IFS= read -r line; do
    curl -s -X POST "http://elasticsearch:9200/logs/_doc" \\
      -H "Content-Type: application/json" -d "\$line" > /dev/null
  done
\`\`\``,
          interviewQuestions: [
            {
              question: "A service crashed 2 hours ago but is now restarted. How do you find what caused the crash?",
              difficulty: "mid" as const,
              answer: `\`\`\`bash
# 1. Find when the service crashed
journalctl -u myapp --since "3 hours ago" | grep -E "start|stop|fail|crash|killed" -i

# 2. Look at logs around the crash time
journalctl -u myapp --since "2024-01-15 14:30:00" --until "2024-01-15 14:45:00"

# 3. Check previous boot if the crash caused a restart
journalctl -u myapp -b -1     # logs from before the last reboot

# 4. Check kernel OOM killer (common crash cause)
journalctl -k --since "3 hours ago" | grep -i "oom\\|killed process\\|out of memory"

# 5. Check for segfaults or signals
journalctl -u myapp --since "3 hours ago" | grep -E "signal|segfault|core dump"

# 6. Get the exact exit code and crash signal
journalctl -u myapp | grep "Main process exited\\|code=killed\\|status="
# code=killed, status=9 → SIGKILL (OOM or manual kill)
# code=killed, status=11 → SIGSEGV (segfault)
# code=exited, status=1 → non-zero exit (app error)

# 7. Check if there's a core dump
coredumpctl list
coredumpctl info \$(pgrep -a myapp | awk '{print $1}')
\`\`\``,
            },
            {
              question: "Your /var/log directory is growing without bound. How would you set up proper log rotation?",
              difficulty: "junior" as const,
              answer: `\`\`\`bash
# 1. Find what's consuming space
du -sh /var/log/* | sort -rh | head -20

# 2. Create a logrotate config for the offending app
cat > /etc/logrotate.d/myapp << 'EOF'
/var/log/myapp/*.log {
    daily
    rotate 7              # keep 7 days of logs
    compress              # gzip old logs
    delaycompress         # don't compress yesterday's log (app might still write)
    missingok             # don't error if log is missing
    notifempty            # skip if log is empty
    create 0644 www-data www-data  # create new log with correct permissions
    sharedscripts
    postrotate
        # Tell the app to re-open its log file
        systemctl kill --kill-who=main --signal=USR1 myapp.service 2>/dev/null || true
    endscript
}
EOF

# 3. Test the config
logrotate -d /etc/logrotate.d/myapp

# 4. Force immediate rotation (initial cleanup)
logrotate -f /etc/logrotate.d/myapp

# 5. Verify logrotate runs daily (it's a cron job)
cat /etc/cron.daily/logrotate

# 6. Also configure journald limits
sed -i 's/#SystemMaxUse=/SystemMaxUse=2G/' /etc/systemd/journald.conf
sed -i 's/#MaxRetentionSec=/MaxRetentionSec=30day/' /etc/systemd/journald.conf
systemctl restart systemd-journald
\`\`\``,
            },
            {
              question: "How would you set up a log pipeline to ship structured logs from journald to a central logging system?",
              difficulty: "senior" as const,
              answer: `**Production log shipping architecture:**

\`\`\`bash
# Option 1: Filebeat (most common, ships to Elasticsearch/Logstash)
cat > /etc/filebeat/filebeat.yml << 'EOF'
filebeat.inputs:
- type: journald
  id: system-journal
  include_matches:
    - _SYSTEMD_UNIT=myapp.service
    - _SYSTEMD_UNIT=nginx.service

processors:
- add_host_metadata: ~
- decode_json_fields:
    fields: ["message"]
    target: ""
    overwrite_keys: true

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
  index: "logs-%{+YYYY.MM.dd}"
  pipeline: "parse-app-logs"
EOF

# Option 2: Promtail → Loki (Grafana stack)
cat > /etc/promtail/config.yml << 'EOF'
scrape_configs:
- job_name: journal
  journal:
    max_age: 12h
    labels:
      job: systemd-journal
      host: \${HOSTNAME}
  relabel_configs:
  - source_labels: ['__journal__systemd_unit']
    target_label: 'unit'
  - source_labels: ['__journal_priority_keyword']
    target_label: 'level'
EOF

# Option 3: rsyslog → remote syslog (for legacy systems)
# /etc/rsyslog.d/forward.conf:
# *.* @@logserver.internal:514  # @@ = TCP, @ = UDP

# Key decisions:
# - Filebeat/Elastic: Best for full-text search and Kibana dashboards
# - Promtail/Loki: Best for Grafana-native, lower cost (stores metadata not full text)
# - rsyslog: Works everywhere, minimal overhead, good for compliance systems
# - In all cases: add host metadata and ensure JSON-structured app logs for richer queries
\`\`\``,
            },
          ],
        },
        {
          id: "cron-and-scheduling",
          title: "Cron & Scheduling — Automating Operational Tasks",
          duration: 13,
          type: "lesson",
          description: "Schedule automated tasks with cron and systemd timers. Master cron syntax, handle common pitfalls, and know when to use systemd timers instead.",
          objectives: [
            "Write and manage cron jobs with crontab -e, including @reboot and @daily shortcuts",
            "Understand cron's environment limitations and how to work around them",
            "Configure systemd timers as a more robust alternative to cron",
            "Implement common DevOps cron patterns: backups, cleanup, monitoring, certificate renewal",
            "Debug failed cron jobs and verify execution",
          ],
          content: `# Cron & Scheduling — Automating Operational Tasks

Cron is the workhorse of Linux automation. Backups, log cleanup, certificate renewal, database maintenance, report generation — if it runs on a schedule, cron (or its modern replacement, systemd timers) is involved.

## cron Basics

\`\`\`bash
# Edit your user's crontab
crontab -e

# List current crontab
crontab -l

# Edit another user's crontab (as root)
crontab -u www-data -e

# Remove your crontab
crontab -r   # WARNING: no confirmation, destructive!

# System-wide cron locations
ls /etc/cron.d/           # package/app cron jobs (drop files here)
ls /etc/cron.daily/       # scripts run daily by run-parts
ls /etc/cron.weekly/      # scripts run weekly
ls /etc/cron.monthly/     # scripts run monthly
cat /etc/crontab          # system crontab (includes username field)
\`\`\`

## Cron Syntax

\`\`\`
┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12 or jan-dec)
│ │ │ │ ┌───────────── day of week (0-7, 0 and 7 = Sunday, or sun-sat)
│ │ │ │ │
* * * * * command to run
\`\`\`

\`\`\`bash
# Examples
0 * * * *         # every hour, on the hour
0 2 * * *         # every day at 2:00 AM
0 2 * * 0         # every Sunday at 2:00 AM
*/15 * * * *      # every 15 minutes
0 9-17 * * 1-5    # every hour from 9-17, Monday-Friday
0 2 1 * *         # first day of every month at 2:00 AM
30 4 1,15 * *     # 1st and 15th of every month at 4:30 AM

# Shorthand macros
@reboot           # run once at system startup
@daily            # run once per day (same as: 0 0 * * *)
@weekly           # run once per week (same as: 0 0 * * 0)
@monthly          # run once per month (same as: 0 0 1 * *)
@hourly           # run once per hour (same as: 0 * * * *)
@yearly           # run once per year (same as: 0 0 1 1 *)
\`\`\`

## The Cron Environment Problem

This is the #1 source of cron job failures for experienced engineers.

\`\`\`bash
# Cron runs with a MINIMAL environment:
# PATH=/usr/bin:/bin    ← NOT your full user PATH
# HOME=/root (or user's home)
# SHELL=/bin/sh         ← NOT bash
# No X11, no SSH agent, no virtualenvs

# SOLUTION: Always use absolute paths in cron jobs
# Bad:
0 2 * * * python manage.py cleanup

# Good:
0 2 * * * /usr/bin/python3 /opt/myapp/manage.py cleanup

# Or: source the environment explicitly
0 2 * * * /bin/bash -l -c '/opt/myapp/scripts/cleanup.sh'  # -l = login shell (loads profile)

# Set PATH explicitly in crontab (applies to all jobs in this crontab):
PATH=/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin
MAILTO=ops@company.com  # send errors here (default: root's mail)

# Debug cron environment
* * * * * env > /tmp/cron-environment.txt  # run this, then check what vars cron sees
\`\`\`

## Real-World DevOps Cron Patterns

\`\`\`bash
# 1. DATABASE BACKUP — daily at 2 AM, keep 7 days
0 2 * * * /usr/bin/pg_dump -U postgres mydb | /usr/bin/gzip > /backup/db/\$(date +\\%Y\\%m\\%d).sql.gz
# Also: rotate backups
0 3 * * * /usr/bin/find /backup/db/ -mtime +7 -name "*.sql.gz" -delete

# 2. SSL CERTIFICATE RENEWAL — check twice daily (certbot/Let's Encrypt)
0 0,12 * * * /usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"

# 3. LOG CLEANUP — delete logs older than 30 days
0 4 * * * /usr/bin/find /var/log/app -name "*.log" -mtime +30 -delete

# 4. DISK SPACE CHECK — alert if over 80%
*/5 * * * * /usr/bin/df -h / | /usr/bin/awk 'NR==2 && \$5+0 > 80 {print "ALERT: Disk usage at "\$5}' | /usr/bin/mail -s "Disk Alert" ops@company.com

# 5. HEALTH CHECK — restart service if it's down
*/5 * * * * /usr/bin/systemctl is-active --quiet myapp || /usr/bin/systemctl restart myapp

# 6. CACHE WARM-UP — pre-warm API cache at midnight
0 0 * * * /usr/bin/curl -s https://api.example.com/cache/warm > /dev/null

# 7. SECURITY: Sync time (before NTP daemon was universal)
@daily /usr/sbin/ntpdate time.google.com

# 8. KUBERNETES: Scale down dev cluster overnight to save costs
0 20 * * 1-5 /usr/local/bin/kubectl scale deployment --all --replicas=0 -n dev
0 8 * * 1-5 /usr/local/bin/kubectl scale deployment --all --replicas=1 -n dev
\`\`\`

## Cron Gotchas

\`\`\`bash
# Gotcha 1: % signs need escaping in crontab (they become newlines!)
# Bad:
0 2 * * * date +%Y-%m-%d
# Good:
0 2 * * * date +\\%Y-\\%m-\\%d

# Gotcha 2: Cron output goes to email (set MAILTO or redirect)
0 2 * * * /my/script.sh >> /var/log/cron-script.log 2>&1
# or disable email output:
MAILTO=""

# Gotcha 3: Race conditions — two instances overlap
# Use flock to ensure only one instance runs:
0 * * * * /usr/bin/flock -n /tmp/myapp.lock /opt/myapp/hourly-job.sh

# Gotcha 4: Cron doesn't log by default (hard to debug)
# Check syslog for cron execution:
grep CRON /var/log/syslog | tail -20
journalctl -u cron | tail -20

# Gotcha 5: @reboot doesn't wait for network
@reboot sleep 30 && /my/network-dependent-script.sh
# Better: use systemd with After=network-online.target
\`\`\`

## systemd Timers — The Better Cron

systemd timers are more powerful and observable than cron. Use them for new work on systemd-based systems.

\`\`\`bash
# A systemd timer requires TWO files: the .timer and the .service

# 1. Create the service: /etc/systemd/system/daily-backup.service
cat > /etc/systemd/system/daily-backup.service << 'EOF'
[Unit]
Description=Daily database backup
After=network.target postgresql.service

[Service]
Type=oneshot
User=postgres
ExecStart=/opt/scripts/backup-db.sh
StandardOutput=journal
StandardError=journal
EOF

# 2. Create the timer: /etc/systemd/system/daily-backup.timer
cat > /etc/systemd/system/daily-backup.timer << 'EOF'
[Unit]
Description=Run daily backup at 2 AM

[Timer]
OnCalendar=*-*-* 02:00:00   # at 2 AM every day
RandomizedDelaySec=300        # add up to 5 minutes random delay (prevents stampedes)
Persistent=true               # run if timer was missed while machine was off

[Install]
WantedBy=timers.target
EOF

# 3. Enable and start
systemctl daemon-reload
systemctl enable --now daily-backup.timer

# 4. Check timer status
systemctl list-timers           # all timers with next/last run times
systemctl status daily-backup.timer
journalctl -u daily-backup.service   # logs from the service
\`\`\`

### systemd Timer vs Cron

| Feature | cron | systemd timer |
|---------|------|---------------|
| Logging | syslog only | Full journald (structured) |
| Dependencies | None | Can depend on other units |
| Missed run handling | No | Yes (Persistent=true) |
| Run as user | Limited | Full systemd user support |
| Email alerts | Built-in | Needs OnFailure= |
| Visibility | \`crontab -l\` | \`systemctl list-timers\` |

**When to use cron:** Simple one-liners, legacy systems, containers (no systemd)
**When to use systemd timers:** Complex scripts, need logging, dependencies on network/services, missed-run recovery`,
          interviewQuestions: [
            {
              question: "Your cron job works when run manually but fails when run by cron. How do you debug it?",
              difficulty: "junior" as const,
              answer: `**The most common cause is the environment difference between your shell and cron's minimal environment.**

\`\`\`bash
# 1. First, capture what cron's environment actually looks like
* * * * * env > /tmp/cron-env.txt 2>&1

# Compare to your normal environment:
diff <(sort /tmp/cron-env.txt) <(env | sort)

# 2. Add full output logging to the failing job temporarily
0 2 * * * /opt/scripts/backup.sh >> /tmp/cron-debug.log 2>&1

# Check the log after the expected run time:
tail -f /tmp/cron-debug.log

# 3. Simulate cron's environment manually
env -i HOME=\$HOME USER=\$USER SHELL=/bin/sh PATH=/usr/bin:/bin /opt/scripts/backup.sh

# 4. Fix in the crontab:
# Set PATH explicitly:
PATH=/usr/local/bin:/usr/bin:/bin

# Or use absolute paths + explicit shell:
0 2 * * * /bin/bash -l -c '/opt/scripts/backup.sh'

# 5. Common specific fixes:
# Missing virtualenv:
0 2 * * * /opt/myapp/venv/bin/python /opt/myapp/manage.py task
# Missing AWS credentials:
0 2 * * * AWS_PROFILE=prod /usr/local/bin/aws s3 sync ...
# Missing NVM/node:
0 2 * * * /home/deploy/.nvm/versions/node/v18.0.0/bin/node /opt/app/script.js
\`\`\``,
            },
            {
              question: "How would you set up a systemd timer to run a backup script, including handling failures and logging?",
              difficulty: "mid" as const,
              answer: `\`\`\`bash
# /etc/systemd/system/db-backup.service
[Unit]
Description=PostgreSQL Database Backup
After=postgresql.service network-online.target
Requires=postgresql.service

[Service]
Type=oneshot
User=postgres
Group=postgres
ExecStart=/opt/scripts/db-backup.sh
StandardOutput=journal
StandardError=journal

# Alert on failure via a separate notification service
OnFailure=notify-failure@%n.service

# Timeout — kill backup if it runs longer than 2 hours
TimeoutStartSec=2h

# /etc/systemd/system/db-backup.timer
[Unit]
Description=Run DB backup at 2 AM

[Timer]
OnCalendar=*-*-* 02:00:00
RandomizedDelaySec=300      # prevents all servers backing up simultaneously
Persistent=true             # if server was off at 2 AM, run when it comes back

[Install]
WantedBy=timers.target

# /etc/systemd/system/notify-failure@.service (generic alert service)
[Unit]
Description=Notify on failure of %i

[Service]
Type=oneshot
ExecStart=/usr/bin/curl -s -X POST \${SLACK_WEBHOOK} \\
  -d "{\\\"text\\\": \\\"FAILURE: %i failed. Check: journalctl -u %i\\\"}"

# Deploy and verify:
systemctl daemon-reload
systemctl enable --now db-backup.timer
systemctl list-timers db-backup.timer
journalctl -u db-backup.service -f
\`\`\``,
            },
          ],
        },
        {
          id: "disk-and-storage",
          title: "Disk & Storage Management — From df to LVM",
          duration: 19,
          type: "lesson",
          description: "Manage disk space, partitions, mounts, and LVM volumes in production. Learn to diagnose and recover from disk full emergencies.",
          objectives: [
            "Use df, du, and ncdu to analyze disk usage at system and directory level",
            "Inspect block devices with lsblk and manage partitions with fdisk",
            "Mount filesystems manually and configure persistent mounts with /etc/fstab",
            "Manage Logical Volume Manager (LVM) volumes: extend, create, snapshot",
            "Recover from disk full emergencies without downtime",
          ],
          content: `# Disk & Storage Management — From df to LVM

Disk full is one of the most common production incidents. Understanding how Linux manages storage — from the filesystem layer down to block devices and LVM — is essential for SREs and DevOps engineers.

## df — Filesystem Usage

\`\`\`bash
# Human-readable disk usage
df -h

# Output:
# Filesystem      Size  Used Avail Use% Mounted on
# /dev/xvda1       50G   38G   12G  76% /
# tmpfs           7.8G     0  7.8G   0% /dev/shm

# Show filesystem type
df -hT

# Show specific filesystem
df -h /var/log

# Show inodes (can be full even when disk space is free)
df -i
# If Use% is 100% for inodes but disk space is free:
# You have too many small files (common with Docker layers, npm node_modules)
\`\`\`

## du — Directory Usage (Finding What's Eating Disk)

\`\`\`bash
# Summarize total size of a directory
du -sh /var/log

# List sizes of all immediate subdirectories
du -sh /var/log/*

# Find the 20 largest directories, sorted
du -sh /var/log/* | sort -rh | head -20

# Find large files (not directories)
du -ah /var/log | sort -rh | head -20  # -a = include files

# Exclude certain paths (useful for skipping network mounts)
du -sh --exclude=/proc --exclude=/sys /*

# Find directories larger than 1GB
du -h / 2>/dev/null | grep "^[0-9.]*G"
\`\`\`

### ncdu — Interactive Disk Usage

\`\`\`bash
# Install
apt-get install ncdu

# Run (interactive browser, vi-style navigation)
ncdu /var

# Scan a specific directory
ncdu /home

# Remote server (scan over SSH)
ssh user@server "ncdu -o- /" | ncdu -f-
\`\`\`

---

## lsblk — Block Device Inspection

\`\`\`bash
# List all block devices (disks and partitions)
lsblk

# With filesystem info
lsblk -f

# With sizes in human-readable format
lsblk -h

# Output example (AWS EC2 typical):
# NAME    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
# xvda    202:0    0   50G  0 disk
# └─xvda1 202:1    0   50G  0 part /
# xvdb    202:16   0  200G  0 disk
# └─xvdb1 202:17   0  200G  0 part /data

# Detailed info including UUIDs (needed for /etc/fstab)
blkid
blkid /dev/xvdb1

# Show disk model and serial (useful for hardware inventory)
lsblk -d -o NAME,SIZE,MODEL,SERIAL
\`\`\`

---

## fdisk — Partition Management

\`\`\`bash
# View partition table for a disk
fdisk -l /dev/xvdb

# Interactive fdisk (creates/modifies/deletes partitions)
fdisk /dev/xvdb
# Commands within fdisk:
# p = print partition table
# n = new partition
# d = delete partition
# t = change partition type
# w = write changes and exit
# q = quit without saving

# Modern alternative: parted (supports GPT)
parted /dev/xvdb print

# After creating a partition, create a filesystem:
mkfs.ext4 /dev/xvdb1
mkfs.xfs /dev/xvdb1    # XFS is default on RHEL/CentOS — better for large files
\`\`\`

---

## mount & /etc/fstab

\`\`\`bash
# Mount a filesystem
mount /dev/xvdb1 /data

# Mount with options
mount -o ro /dev/xvdb1 /data              # read-only
mount -o remount,rw /data                 # remount read-write
mount -t ext4 /dev/xvdb1 /data           # explicit type

# Unmount
umount /data
umount -l /data   # lazy unmount (waits until not busy)

# Check what's mounted
mount | grep /data
findmnt /data     # modern alternative to mount, tree view

# Why is umount failing? (something is using the mount)
fuser -m /data    # show PIDs using the mount
lsof | grep /data
\`\`\`

### /etc/fstab — Persistent Mounts

\`\`\`bash
# Format: device  mountpoint  fstype  options  dump  pass
cat /etc/fstab

# Example entries:
UUID=abc123  /data  ext4  defaults,noatime  0  2
/dev/xvdb1   /data  xfs   defaults          0  0

# Use UUID, not device name (/dev/xvdb1 can change on reboot!)
# Get UUID:
blkid /dev/xvdb1

# Common fstab options:
# defaults = rw, suid, dev, exec, auto, nouser, async
# noatime  = don't update access time on read (performance boost)
# nofail   = don't fail boot if device is missing (for removable/optional drives)
# ro       = read-only
# noexec   = don't allow execution (security hardening for /tmp)
# _netdev  = mount is network-dependent (wait for network before mounting)

# Test fstab without rebooting:
mount -a       # mount everything in fstab that isn't mounted
mount -a -v    # verbose — see what it's mounting

# NFS mount example
10.0.0.100:/exports/shared  /mnt/shared  nfs  _netdev,nofail,soft,timeo=30  0  0
\`\`\`

---

## LVM — Logical Volume Manager

LVM adds a flexible layer between physical disks and filesystems. It's standard on most production Linux systems (especially RHEL/CentOS) and is what lets you resize volumes without downtime.

\`\`\`bash
# LVM concepts:
# PV (Physical Volume) = a disk or partition prepared for LVM
# VG (Volume Group) = pool of storage made from PVs
# LV (Logical Volume) = slice of a VG, acts like a partition, gets a filesystem

# Check existing LVM setup
pvs    # physical volumes
vgs    # volume groups
lvs    # logical volumes
lvdisplay /dev/vg0/data   # detailed info

# MOST COMMON TASK: Extend a logical volume when disk is full

# Step 1: Add a new disk (or expand existing in cloud)
# In AWS: modify EBS volume size, then:
# Check the OS sees the new space:
lsblk   # the disk should show new size

# Step 2a: If using LVM
# Extend the physical volume to use new space
pvresize /dev/xvda

# Extend the logical volume (add all free space)
lvextend -l +100%FREE /dev/vg0/root
# Or extend by specific amount:
lvextend -L +20G /dev/vg0/root

# Resize the filesystem (live, no unmount needed for ext4 and xfs)
resize2fs /dev/vg0/root     # ext4
xfs_growfs /                 # xfs (use mount point, not device)

# Step 2b: If NOT using LVM (direct partition)
# Use growpart:
growpart /dev/xvda 1         # grow partition 1 of xvda
resize2fs /dev/xvda1         # then expand filesystem

# Verify
df -h /
\`\`\`

### LVM Snapshots

\`\`\`bash
# Create a snapshot before risky operations (database migration, OS upgrade)
lvcreate -L 10G -s -n db-snapshot /dev/vg0/db-data

# If something goes wrong, revert:
lvconvert --merge /dev/vg0/db-snapshot

# Remove snapshot when no longer needed
lvremove /dev/vg0/db-snapshot
\`\`\`

---

## Disk Full Emergency Playbook

\`\`\`bash
# 1. CHECK: Which filesystem is full?
df -h

# 2. FIND: What's consuming the space?
du -sh /var/log/* | sort -rh | head -10
du -sh /home/* | sort -rh | head -10
find / -xdev -type f -size +500M -printf "%s\\t%p\\n" 2>/dev/null | sort -rn | head -20

# 3. FIND: Deleted files still held open (space not freed yet)
lsof | grep '(deleted)' | awk '{print $7, $1, $2}' | sort -rn | head -10

# 4. QUICK WINS (in order of safety):
# a) Truncate deleted-but-open log files
kill -USR1 \$(cat /var/run/nginx.pid)   # tell nginx to reopen log files
# b) Clear package cache
apt-get clean          # ~500MB typical savings
yum clean all
# c) Remove old Docker resources
docker system prune -f
# d) Compress old logs
find /var/log -name "*.log" -mtime +3 -exec gzip {} +

# 5. MEDIUM RISK: Delete old log files (VERIFY these are expendable)
find /var/log/app -name "*.log" -mtime +7 -delete
journalctl --vacuum-time=7d

# 6. PERMANENT FIX:
# - Add more disk (cloud: resize EBS volume + growpart + resize2fs)
# - Move high-growth directories to dedicated mount (/var/log on its own partition)
# - Implement log rotation and retention policies
\`\`\`

## The Python Perspective

\`\`\`python
# Python equivalent of df -h for the most critical paths
import shutil

paths = ["/", "/var/log", "/home", "/tmp"]
for path in paths:
    try:
        usage = shutil.disk_usage(path)
        pct = usage.used / usage.total * 100
        print(f"{path}: {usage.free/2**30:.1f}GB free ({pct:.1f}% used)")
        if pct > 90:
            print(f"  WARNING: {path} is above 90%!")
    except FileNotFoundError:
        pass
\`\`\`

Python's \`shutil.disk_usage()\` is perfect for monitoring scripts that check disk and alert. The shell tools are better for interactive investigation and one-liners.`,
          interviewQuestions: [
            {
              question: "Walk me through how you would add a 100GB EBS volume to a running AWS EC2 instance and make it available as /data.",
              difficulty: "mid" as const,
              answer: `\`\`\`bash
# 1. Attach the EBS volume in AWS console or CLI
aws ec2 attach-volume --volume-id vol-xxx --instance-id i-xxx --device /dev/xvdb

# 2. Verify the OS sees it
lsblk   # should show xvdb with 100G

# 3. Create a filesystem (ext4 or xfs)
mkfs.xfs /dev/xvdb   # or mkfs.ext4 — XFS handles large files better

# 4. Create the mount point
mkdir -p /data

# 5. Mount it temporarily to verify it works
mount /dev/xvdb /data
df -h /data

# 6. Get the UUID for /etc/fstab (DON'T use /dev/xvdb — device names can change)
blkid /dev/xvdb
# Output: /dev/xvdb: UUID="abc-123-def" TYPE="xfs"

# 7. Add to /etc/fstab for persistence
echo 'UUID=abc-123-def  /data  xfs  defaults,nofail  0  2' >> /etc/fstab

# 8. Test fstab is correct
umount /data
mount -a && echo "fstab OK" || echo "fstab ERROR"

# 9. Set permissions
chown appuser:appgroup /data
chmod 750 /data

# 10. Verify
df -h /data && ls -la /data
\`\`\`

**Key points:**
- Always use UUID, not device name
- Always add \`nofail\` option so a missing volume doesn't prevent boot
- Test \`mount -a\` before rebooting to catch fstab errors`,
            },
            {
              question: "Your root filesystem is 100% full and the system is barely responsive. What do you do?",
              difficulty: "senior" as const,
              answer: `**This is a race against time. Move fast.**

\`\`\`bash
# 1. IMMEDIATE: Free up enough space to make the system usable
# Clear package cache (safe, fast)
apt-get clean 2>/dev/null || yum clean all 2>/dev/null

# Clear temp files
rm -rf /tmp/* /var/tmp/*

# Truncate the largest log files (DON'T delete — the process still has the FD open)
# First find them:
ls -lh /var/log/*.log | sort -k5 -rh | head -5
# Then truncate:
> /var/log/syslog    # or whichever is huge
> /var/log/nginx/access.log

# 2. Check for deleted-but-open files (space not freed yet)
lsof | grep '(deleted)' | sort -k7 -rn | head -5
# Restart the offending service to free space, or truncate via /proc/PID/fd/N

# 3. Find where space went
du -sh /* 2>/dev/null | sort -rh | head -10

# 4. Docker cleanup (if Docker is present — can save GBs)
docker system prune -f

# 5. STABILIZE: Implement rotation for whatever caused the fill
# If it was logs: configure logrotate
# If it was Docker: add --log-opt max-size=10m to containers
# If it was app data: set up archival to S3

# 6. PREVENT RECURRENCE:
# - Set up disk monitoring: alert at 80%, page at 90%
# - Separate /var/log onto its own partition
# - Set journald size limits: SystemMaxUse=2G in journald.conf
\`\`\`

**What NOT to do:**
- Don't \`rm -rf /var/log/*\` — that will break log rotation and may delete files that are needed
- Don't kill random processes — understand what's using the space first
- Don't restart the server — if /tmp is full, it won't boot cleanly`,
            },
            {
              question: "Explain LVM and when you would use it. How do you extend a logical volume without downtime?",
              difficulty: "senior" as const,
              answer: `**LVM (Logical Volume Manager) adds a virtualization layer between physical disks and filesystems.**

**Why use LVM:**
- Resize volumes without unmounting (extend while live)
- Span a single filesystem across multiple physical disks
- Create snapshots for zero-downtime backups
- Standard on RHEL/CentOS; common in enterprise environments

**Architecture:**
\`\`\`
Physical Disk(s) → Physical Volumes (PV) → Volume Group (VG) → Logical Volumes (LV) → Filesystems
\`\`\`

**Extending a logical volume live (the most common LVM task):**

\`\`\`bash
# Scenario: /dev/vg0/data is full, we added a new 100GB disk

# 1. Prepare the new disk as a PV
pvcreate /dev/xvdb

# 2. Add it to the existing volume group
vgextend vg0 /dev/xvdb

# 3. Check available space
vgdisplay vg0 | grep "Free"

# 4. Extend the logical volume (use all free space)
lvextend -l +100%FREE /dev/vg0/data

# 5. Resize the filesystem (LIVE, no unmount needed)
xfs_growfs /data           # XFS: use mount point
# or:
resize2fs /dev/vg0/data    # ext4: use device

# 6. Verify
df -h /data
\`\`\`

**Snapshots for zero-downtime backups:**
\`\`\`bash
lvcreate -L 10G -s -n data-snap /dev/vg0/data
mount -o ro /dev/vg0/data-snap /mnt/backup
rsync -a /mnt/backup/ s3://my-bucket/backup/
umount /mnt/backup && lvremove -f /dev/vg0/data-snap
\`\`\``,
            },
          ],
        },
      ],
    },
  ],
};
