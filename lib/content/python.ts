import type { Track } from "./types";

export const pythonTrack: Track = {
  id: "python",
  title: "Python",
  description: "Python for DevOps and automation",
  longDescription:
    "Learn Python from scratch with a DevOps focus — write automation scripts, build CLI tools, interact with APIs, and automate infrastructure tasks.",
  icon: "Code2",
  color: "#3776ab",
  gradient: "track-python-gradient",
  tags: ["programming", "automation", "scripting", "devops"],
  modules: [
    {
      id: "python-basics",
      title: "Python Basics",
      level: "beginner",
      description: "Get Python set up and learn the fundamental syntax.",
      lessons: [
        {
          id: "installing-python",
          title: "Installing Python",
          duration: 8,
          type: "lesson",
          description: "Install Python and set up a proper development environment.",
          content: `# Installing Python

## Installation

### macOS

\`\`\`bash
# Using pyenv (recommended — manage multiple Python versions)
curl https://pyenv.run | bash

# Add to shell config (~/.zshrc or ~/.bashrc):
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)"

# Install Python
pyenv install 3.12.3
pyenv global 3.12.3

# Or use Homebrew
brew install python@3.12
\`\`\`

### Linux (Ubuntu/Debian)

\`\`\`bash
sudo apt update
sudo apt install python3.12 python3.12-venv python3-pip

# Or use pyenv (same as macOS)
\`\`\`

### Windows

\`\`\`powershell
# Download from python.org/downloads
# Or use winget
winget install Python.Python.3.12

# Or use pyenv-win
pip install pyenv-win --target $HOME\\.pyenv
\`\`\`

## Verify Installation

\`\`\`bash
python3 --version
# Python 3.12.3

python3 -c "print('Hello, DevOps!')"
# Hello, DevOps!

pip3 --version
# pip 24.0 from ...
\`\`\`

## The REPL (Interactive Shell)

Python's REPL (Read-Eval-Print Loop) lets you experiment interactively:

\`\`\`bash
python3
\`\`\`

\`\`\`python
>>> 2 + 2
4
>>> "hello".upper()
'HELLO'
>>> import os
>>> os.getcwd()
'/Users/you'
>>> exit()
\`\`\`

> **Tip:** IPython and Jupyter are enhanced REPLs great for experimentation:
> \`pip install ipython && ipython\`

## Running Python Scripts

\`\`\`bash
# Create a script
cat > hello.py << 'EOF'
#!/usr/bin/env python3
name = "DevOps"
print(f"Hello, {name}!")
EOF

# Run it
python3 hello.py
# Hello, DevOps!

# Make it executable (Unix)
chmod +x hello.py
./hello.py
\`\`\`
`,
          interviewQuestions: [
            {
              question: "Why is Python popular for DevOps and automation? What are its strengths and weaknesses?",
              difficulty: "junior" as const,
              answer: `**Python's strengths for DevOps:**

1. **Readable syntax** — scripts are maintainable by teammates who aren't Python experts
2. **Rich standard library** — \`os\`, \`subprocess\`, \`json\`, \`pathlib\`, \`http\` cover most automation needs without extra dependencies
3. **Excellent library ecosystem:**
   - \`boto3\` for AWS automation
   - \`kubernetes\` for K8s management
   - \`requests\` for HTTP APIs
   - \`paramiko\` for SSH automation
   - \`ansible\` (written in Python) for config management
4. **Shell replacement** — Python subprocess handles shell commands better than complex Bash (error handling, data parsing)
5. **Cross-platform** — works on Linux, macOS, Windows (unlike Bash)
6. **AI/ML integration** — same language for DevOps automation and ML pipeline management

**Weaknesses:**
- **Slower than Go/Rust** for performance-critical tools (kubectl, Terraform are Go — startup is ~100ms vs Python's 100-500ms)
- **Dependency management** can be complex (virtualenvs, pip conflicts)
- **Not as natural for interactive one-liners** as Bash
- **GIL (Global Interpreter Lock)** limits true thread-based parallelism for CPU-bound tasks

**When to use Python vs. Bash:**
- Logic complexity > 20 lines → Python
- Need to parse JSON/YAML → Python
- Calling multiple APIs → Python
- Simple one-time file ops → Bash`,
            },
          ],
        },
        {
          id: "variables-types",
          title: "Variables & Data Types",
          duration: 15,
          type: "lesson",
          description: "Learn Python's dynamic type system and core data types.",
          content: `# Variables & Data Types

Python is **dynamically typed** — you don't declare types explicitly. The interpreter infers them.

## Variables

\`\`\`python
# No declaration needed — just assign
name = "Alice"
age = 30
is_active = True
score = 98.5

# Multiple assignment
x = y = z = 0

# Swap
a, b = 1, 2
a, b = b, a  # a=2, b=1

# Delete a variable
del name
\`\`\`

## Core Types

### Strings

\`\`\`python
name = "DevOps"
greeting = 'Hello, World!'
multiline = """
This spans
multiple lines
"""

# f-strings (preferred formatting)
version = 3.12
print(f"Python {version}")
# Python 3.12

# String methods
"hello".upper()           # 'HELLO'
"  strip me  ".strip()    # 'strip me'
"a,b,c".split(",")        # ['a', 'b', 'c']
",".join(["a", "b"])      # 'a,b'
"hello world".replace("world", "Python")  # 'hello Python'
len("hello")              # 5

# String contains
"git" in "github"         # True
\`\`\`

### Numbers

\`\`\`python
# Integer
count = 42
big = 1_000_000     # underscores for readability

# Float
pi = 3.14159
temp = -17.5

# Arithmetic
10 // 3     # 3 (floor division)
10 % 3      # 1 (modulo)
2 ** 10     # 1024 (exponentiation)

# Type conversion
int("42")         # 42
float("3.14")     # 3.14
str(100)          # "100"

# Check type
type(42)          # <class 'int'>
isinstance(42, int)  # True
\`\`\`

### Booleans

\`\`\`python
is_running = True
has_error = False

# Falsy values (evaluate as False)
# False, None, 0, 0.0, "", [], {}, set()

bool(0)      # False
bool("")     # False
bool([])     # False
bool("hi")   # True
bool([1])    # True
\`\`\`

### None

\`\`\`python
result = None   # "no value" / null

if result is None:
    print("No result yet")

# Use 'is None' not '== None'
\`\`\`

## Type Hints (Python 3.5+)

Type hints make code more readable and enable IDE support — they're not enforced at runtime:

\`\`\`python
def greet(name: str) -> str:
    return f"Hello, {name}!"

def process(items: list[str], limit: int = 10) -> dict[str, int]:
    ...

# Optional type (can be None)
from typing import Optional
def find_user(id: int) -> Optional[str]:
    ...
\`\`\`
`,
        },
      ],
    },
    {
      id: "control-flow",
      title: "Control Flow",
      level: "beginner",
      description: "Write programs that make decisions and repeat operations.",
      lessons: [
        {
          id: "if-statements",
          title: "if / elif / else",
          duration: 10,
          type: "lesson",
          description: "Write conditional logic in Python.",
          content: `# if / elif / else

## Basic Conditionals

\`\`\`python
exit_code = 1

if exit_code == 0:
    print("Success")
elif exit_code == 1:
    print("General error")
elif exit_code == 127:
    print("Command not found")
else:
    print(f"Unknown exit code: {exit_code}")
\`\`\`

## Comparison Operators

\`\`\`python
x = 5
x == 5      # Equal to
x != 5      # Not equal to
x > 3       # Greater than
x >= 5      # Greater than or equal
x < 10      # Less than
x <= 10     # Less than or equal
x is None   # Identity check (use for None)
x in [1, 2, 5]  # Membership test → True
\`\`\`

## Logical Operators

\`\`\`python
# and, or, not (not &&, ||, !)
is_running = True
has_error = False

if is_running and not has_error:
    print("All good")

if is_running or has_error:
    print("Something is happening")
\`\`\`

## Ternary (Conditional Expression)

\`\`\`python
status = "success" if exit_code == 0 else "failure"

# Equivalent to:
if exit_code == 0:
    status = "success"
else:
    status = "failure"
\`\`\`

## Loops

### for loops

\`\`\`python
# Iterate over a list
services = ["nginx", "postgres", "redis"]
for service in services:
    print(f"Checking {service}...")

# Range
for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 11):    # 1 to 10
    print(i)

for i in range(0, 20, 5): # 0, 5, 10, 15
    print(i)

# With index (enumerate)
for i, service in enumerate(services):
    print(f"{i}: {service}")
# 0: nginx
# 1: postgres
# 2: redis

# Iterate over dict
config = {"host": "localhost", "port": 5432}
for key, value in config.items():
    print(f"{key} = {value}")
\`\`\`

### while loops

\`\`\`python
import time

retries = 0
max_retries = 3

while retries < max_retries:
    try:
        connect()
        break
    except ConnectionError:
        retries += 1
        time.sleep(2 ** retries)  # Exponential backoff

if retries == max_retries:
    print("Failed to connect after 3 attempts")
\`\`\`

### Loop Control

\`\`\`python
# break — exit loop immediately
for port in [80, 443, 8080, 8443]:
    if is_available(port):
        print(f"Using port {port}")
        break

# continue — skip to next iteration
for line in log_lines:
    if line.startswith("#"):
        continue  # Skip comments
    process(line)

# else clause (runs if loop completed without break)
for server in servers:
    if server.is_healthy():
        break
else:
    print("No healthy servers found!")  # Runs if no break
\`\`\`

## List Comprehensions

\`\`\`python
# Traditional loop
squares = []
for x in range(10):
    squares.append(x ** 2)

# List comprehension (preferred for simple cases)
squares = [x ** 2 for x in range(10)]

# With filter
even_squares = [x ** 2 for x in range(10) if x % 2 == 0]

# From DevOps context
failed_jobs = [job for job in jobs if job.status == "failed"]
service_names = [s.name for s in services]
\`\`\`
`,
        },
      ],
    },
    {
      id: "data-structures",
      title: "Data Structures",
      level: "beginner",
      description: "Work with Python's powerful built-in data structures.",
      lessons: [
        {
          id: "lists-dicts",
          title: "Lists & Dictionaries",
          duration: 18,
          type: "lesson",
          description: "Master the most commonly used Python data structures.",
          content: `# Lists & Dictionaries

## Lists — Ordered, Mutable Sequences

\`\`\`python
# Creating lists
servers = ["web-01", "web-02", "db-01"]
ports = [80, 443, 8080]
mixed = [1, "hello", True, None, [1, 2]]  # Any types

# Accessing elements (0-indexed)
servers[0]      # "web-01"
servers[-1]     # "db-01" (last element)
servers[1:3]    # ["web-02", "db-01"] (slice)
servers[:2]     # ["web-01", "web-02"]
servers[::2]    # ["web-01", "db-01"] (step)
\`\`\`

### Modifying Lists

\`\`\`python
servers = ["web-01", "web-02"]

servers.append("web-03")           # Add to end
servers.insert(0, "lb-01")        # Insert at index
servers.extend(["db-01", "db-02"]) # Add multiple

servers.remove("web-02")           # Remove by value
popped = servers.pop()             # Remove and return last
popped = servers.pop(0)            # Remove and return at index

servers.sort()                     # Sort in place
servers.reverse()                  # Reverse in place

sorted_copy = sorted(servers)      # Returns new sorted list
reversed_copy = list(reversed(servers))

len(servers)           # Length
"web-01" in servers    # True/False
servers.index("web-01") # Find index
servers.count("web-01")  # Count occurrences
\`\`\`

### Common List Patterns in DevOps

\`\`\`python
# Filter failed jobs
failed = [j for j in jobs if j["status"] == "failed"]

# Extract field from list of dicts
names = [s["name"] for s in services]

# Flatten nested list
all_ports = [port for server in servers for port in server["ports"]]

# Sort by field
services.sort(key=lambda s: s["cpu_usage"], reverse=True)

# Remove duplicates (preserving order)
seen = set()
unique = [x for x in items if not (x in seen or seen.add(x))]
\`\`\`

## Dictionaries — Key-Value Mappings

\`\`\`python
# Creating
config = {
    "host": "localhost",
    "port": 5432,
    "database": "myapp",
    "ssl": True
}

# Accessing
config["host"]          # "localhost"
config.get("host")      # "localhost"
config.get("timeout", 30)  # Returns default if missing (no KeyError)

# Checking
"host" in config        # True
"password" in config    # False

# Modifying
config["port"] = 5433             # Update
config["timeout"] = 30            # Add new key
del config["ssl"]                 # Delete key
config.pop("ssl", None)           # Delete, return default if missing
\`\`\`

### Dictionary Methods

\`\`\`python
config.keys()    # dict_keys(['host', 'port', ...])
config.values()  # dict_values(['localhost', 5432, ...])
config.items()   # dict_items([('host', 'localhost'), ...])

# Merge (Python 3.9+)
defaults = {"timeout": 30, "retry": 3}
custom = {"timeout": 60, "host": "prod-db"}
merged = defaults | custom    # custom takes precedence
# {'timeout': 60, 'retry': 3, 'host': 'prod-db'}

# Update in place
config.update({"timeout": 60, "host": "prod-db"})
\`\`\`

### Nested Structures

\`\`\`python
# Typical DevOps config structure
infrastructure = {
    "production": {
        "web": {
            "instances": ["web-01", "web-02"],
            "load_balancer": "lb-prod",
            "port": 443
        },
        "database": {
            "primary": "db-01",
            "replicas": ["db-02", "db-03"],
            "port": 5432
        }
    }
}

# Access nested values
web_instances = infrastructure["production"]["web"]["instances"]

# Safe deep access (dict.get for each level)
db_port = (infrastructure
    .get("production", {})
    .get("database", {})
    .get("port", 5432))
\`\`\`

### Dict Comprehensions

\`\`\`python
# Service name → status mapping
statuses = {
    service: check_health(service)
    for service in ["nginx", "postgres", "redis"]
}

# Filter dict
active = {k: v for k, v in services.items() if v["status"] == "running"}
\`\`\`
`,
        },
      ],
    },
    {
      id: "automation-scripts",
      title: "Automation Scripts",
      level: "advanced",
      description: "Write professional automation scripts for DevOps tasks.",
      lessons: [
        {
          id: "system-automation",
          title: "System Automation",
          duration: 25,
          type: "lesson",
          description: "Automate system tasks using Python's standard library.",
          content: `# System Automation

Python's standard library includes everything you need to automate common DevOps tasks.

## os and pathlib — File System Operations

\`\`\`python
import os
from pathlib import Path

# Current directory
cwd = Path.cwd()
home = Path.home()

# Path construction (works on all OS)
config_file = home / ".config" / "myapp" / "config.json"

# Check existence
config_file.exists()
config_file.is_file()
config_file.is_dir()

# Create directories
(home / ".config" / "myapp").mkdir(parents=True, exist_ok=True)

# List directory contents
for item in Path("/var/log").iterdir():
    print(item.name, item.stat().st_size)

# Find files recursively
log_files = list(Path("/var/log").glob("**/*.log"))

# Read and write
config_file.write_text("key=value\n")
content = config_file.read_text()

# File info
stat = config_file.stat()
print(f"Size: {stat.st_size} bytes")
print(f"Modified: {stat.st_mtime}")
\`\`\`

## subprocess — Run Shell Commands

\`\`\`python
import subprocess

# Simple run (captures output)
result = subprocess.run(
    ["git", "log", "--oneline", "-5"],
    capture_output=True,
    text=True,        # Decode output as text
    check=True        # Raise exception if command fails
)
print(result.stdout)

# Handling errors
try:
    result = subprocess.run(
        ["docker", "pull", "myimage:latest"],
        capture_output=True,
        text=True,
        check=True
    )
    print("Pulled successfully")
except subprocess.CalledProcessError as e:
    print(f"Failed: {e.stderr}")

# Stream output in real-time
import sys
process = subprocess.Popen(
    ["docker", "build", "-t", "myapp", "."],
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True
)
for line in process.stdout:
    sys.stdout.write(line)
process.wait()
if process.returncode != 0:
    raise RuntimeError("Build failed")

# Pass environment variables
env = os.environ.copy()
env["DOCKER_BUILDKIT"] = "1"
subprocess.run(["docker", "build", "."], env=env, check=True)
\`\`\`

## json and yaml — Config Files

\`\`\`python
import json

# Parse JSON
with open("config.json") as f:
    config = json.load(f)

# From string
data = json.loads('{"port": 3000, "debug": true}')

# Write JSON
with open("output.json", "w") as f:
    json.dump(config, f, indent=2)

# YAML (pip install pyyaml)
import yaml

with open("config.yaml") as f:
    config = yaml.safe_load(f)  # safe_load prevents code execution

# Write YAML
with open("output.yaml", "w") as f:
    yaml.dump(config, f, default_flow_style=False)
\`\`\`

## Complete Automation Script Example

\`\`\`python
#!/usr/bin/env python3
"""
Deploy checker — validates services are healthy before deployment.
"""
import json
import subprocess
import sys
import time
from pathlib import Path
from typing import NamedTuple

class ServiceStatus(NamedTuple):
    name: str
    healthy: bool
    message: str


def check_docker_service(name: str) -> ServiceStatus:
    """Check if a Docker container is healthy."""
    try:
        result = subprocess.run(
            ["docker", "inspect", "--format", "{{.State.Health.Status}}", name],
            capture_output=True, text=True, check=True
        )
        status = result.stdout.strip()
        return ServiceStatus(name, status == "healthy", f"Status: {status}")
    except subprocess.CalledProcessError:
        return ServiceStatus(name, False, "Container not found")


def wait_for_healthy(services: list[str], timeout: int = 120) -> bool:
    """Wait for all services to be healthy."""
    deadline = time.time() + timeout

    while time.time() < deadline:
        statuses = [check_docker_service(s) for s in services]
        all_healthy = all(s.healthy for s in statuses)

        for s in statuses:
            emoji = "✅" if s.healthy else "❌"
            print(f"  {emoji} {s.name}: {s.message}")

        if all_healthy:
            return True

        remaining = int(deadline - time.time())
        print(f"\nWaiting... ({remaining}s remaining)")
        time.sleep(10)

    return False


def main():
    services = ["web", "postgres", "redis"]

    print(f"Checking health of: {', '.join(services)}")

    if wait_for_healthy(services):
        print("\n✅ All services healthy — safe to deploy!")
        sys.exit(0)
    else:
        print("\n❌ Services not healthy after timeout — aborting!")
        sys.exit(1)


if __name__ == "__main__":
    main()
\`\`\`
`,
        },
      ],
    },
    {
      id: "python-file-handling",
      title: "File Handling & Error Management",
      level: "intermediate",
      description: "Read, write, and process files. Handle errors gracefully with exceptions.",
      lessons: [
        {
          id: "file-io",
          title: "Reading & Writing Files",
          duration: 12,
          type: "lesson",
          description: "Work with files, directories, and file paths using Python's built-in tools.",
          objectives: [
            "Open, read, and write files with context managers",
            "Use pathlib for cross-platform file paths",
            "Read and write CSV and JSON files",
            "Walk directory trees",
          ],
          content: `# Reading & Writing Files

## The \`open()\` Function and Context Managers

Always use the \`with\` statement — it automatically closes the file even if an error occurs:

\`\`\`python
# Read entire file
with open("log.txt", "r") as f:
    content = f.read()

# Read line by line (memory-efficient for large files)
with open("log.txt", "r") as f:
    for line in f:
        print(line.strip())

# Write (overwrites existing content)
with open("output.txt", "w") as f:
    f.write("Hello, file!\n")

# Append
with open("output.txt", "a") as f:
    f.write("Another line\n")
\`\`\`

## pathlib — The Modern Way

\`pathlib.Path\` is expressive and cross-platform:

\`\`\`python
from pathlib import Path

# Create paths
home = Path.home()
project = Path("/Users/sooraj/projects/devops-lms")
config = project / "config" / "settings.json"

# Check existence
if config.exists():
    print(config.read_text())

# Create directories
(project / "logs").mkdir(parents=True, exist_ok=True)

# Iterate files
for py_file in project.glob("**/*.py"):
    print(py_file)

# File info
print(config.stat().st_size)   # size in bytes
print(config.suffix)           # .json
print(config.stem)             # settings
print(config.parent)           # /Users/sooraj/projects/devops-lms/config
\`\`\`

## CSV Files

\`\`\`python
import csv
from pathlib import Path

# Write CSV
data = [
    {"name": "Alice", "role": "Engineer", "score": 95},
    {"name": "Bob",   "role": "Designer", "score": 87},
]

with open("team.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "role", "score"])
    writer.writeheader()
    writer.writerows(data)

# Read CSV
with open("team.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(f"{row['name']}: {row['score']}")
\`\`\`

## JSON Files

\`\`\`python
import json

config = {
    "debug": True,
    "host": "0.0.0.0",
    "port": 8080,
    "allowed_origins": ["https://example.com"],
}

# Write JSON
with open("config.json", "w") as f:
    json.dump(config, f, indent=2)

# Read JSON
with open("config.json") as f:
    loaded = json.load(f)

print(loaded["port"])  # 8080
\`\`\`

## Walking a Directory

\`\`\`python
from pathlib import Path

def count_lines(root: str) -> dict[str, int]:
    """Count lines in all .py files under root."""
    counts = {}
    for path in Path(root).rglob("*.py"):
        lines = path.read_text().count("\n")
        counts[str(path)] = lines
    return counts

totals = count_lines(".")
for path, lines in sorted(totals.items()):
    print(f"{lines:>6} {path}")
\`\`\`
`,
        },
        {
          id: "exceptions",
          title: "Exceptions & Error Handling",
          duration: 10,
          type: "lesson",
          description: "Write robust code that handles failures gracefully.",
          objectives: [
            "Catch and handle exceptions with try/except/finally",
            "Raise exceptions with helpful messages",
            "Create custom exception classes",
            "Distinguish LBYL vs EAFP patterns",
          ],
          content: `# Exceptions & Error Handling

## The try/except Block

\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
except (TypeError, ValueError) as e:
    print(f"Type or value error: {e}")
except Exception as e:
    # Catches any other exception — use as a last resort
    print(f"Unexpected error: {e}")
    raise  # re-raise after logging
else:
    # Runs only if no exception was raised
    print(f"Result: {result}")
finally:
    # Always runs — use for cleanup
    print("Done")
\`\`\`

## Common Built-in Exceptions

| Exception | When |
|-----------|------|
| \`ValueError\` | Wrong value for the type (e.g., \`int("abc")\`) |
| \`TypeError\` | Wrong type (e.g., \`1 + "a"\`) |
| \`KeyError\` | Missing dictionary key |
| \`IndexError\` | List index out of range |
| \`FileNotFoundError\` | File doesn't exist |
| \`PermissionError\` | No access to file |
| \`AttributeError\` | Object has no such attribute |
| \`ImportError\` | Module not found |

## Raising Exceptions

\`\`\`python
def parse_port(value: str) -> int:
    try:
        port = int(value)
    except ValueError:
        raise ValueError(f"Port must be an integer, got {value!r}")
    if not 1 <= port <= 65535:
        raise ValueError(f"Port must be 1–65535, got {port}")
    return port
\`\`\`

## Custom Exceptions

Create a hierarchy of app-specific exceptions:

\`\`\`python
class AppError(Exception):
    """Base class for all application errors."""

class ConfigError(AppError):
    """Raised when configuration is invalid."""

class NetworkError(AppError):
    """Raised when a network operation fails."""
    def __init__(self, message: str, status_code: int | None = None):
        super().__init__(message)
        self.status_code = status_code

# Usage
try:
    raise NetworkError("Connection refused", status_code=503)
except NetworkError as e:
    print(f"Network problem ({e.status_code}): {e}")
except AppError as e:
    print(f"App error: {e}")
\`\`\`

## EAFP vs LBYL

Python favors **EAFP** (Easier to Ask Forgiveness than Permission):

\`\`\`python
# LBYL — "Look Before You Leap" (common in C/Java)
if "key" in data:
    value = data["key"]

# EAFP — Pythonic
try:
    value = data["key"]
except KeyError:
    value = default_value

# Even better for dicts:
value = data.get("key", default_value)
\`\`\`

## Context Managers for Cleanup

\`\`\`python
from contextlib import contextmanager, suppress

# Suppress specific errors
with suppress(FileNotFoundError):
    Path("missing.txt").unlink()  # No error if file doesn't exist

# Create your own context manager
@contextmanager
def temporary_file(suffix=".tmp"):
    path = Path(f"/tmp/work{suffix}")
    try:
        yield path
    finally:
        path.unlink(missing_ok=True)

with temporary_file(".json") as tmp:
    tmp.write_text('{"ok": true}')
    process(tmp)
# File is deleted automatically
\`\`\`
`,
        },
      ],
    },
    {
      id: "python-oop",
      title: "Object-Oriented Python",
      level: "intermediate",
      description: "Model real-world concepts with classes, inheritance, and protocols.",
      lessons: [
        {
          id: "classes-basics",
          title: "Classes & Objects",
          duration: 14,
          type: "lesson",
          description: "Build classes, use dataclasses, and understand Python's object model.",
          objectives: [
            "Define classes with __init__, properties, and methods",
            "Use @dataclass to eliminate boilerplate",
            "Implement __repr__, __str__, and comparison methods",
            "Understand class vs instance attributes",
          ],
          content: `# Classes & Objects

## Defining a Class

\`\`\`python
class Server:
    # Class attribute — shared by all instances
    default_port = 8080

    def __init__(self, host: str, port: int | None = None):
        # Instance attributes
        self.host = host
        self.port = port or Server.default_port
        self._healthy = False       # convention: "private" with _

    # Properties — computed attributes with validation
    @property
    def healthy(self) -> bool:
        return self._healthy

    @healthy.setter
    def healthy(self, value: bool):
        self._healthy = value

    def url(self) -> str:
        return f"http://{self.host}:{self.port}"

    # __repr__ is for developers (used in debug/REPL)
    def __repr__(self) -> str:
        return f"Server(host={self.host!r}, port={self.port})"

    # __str__ is for end users
    def __str__(self) -> str:
        status = "healthy" if self._healthy else "unhealthy"
        return f"{self.url()} [{status}]"


s = Server("localhost")
print(repr(s))        # Server(host='localhost', port=8080)
print(str(s))         # http://localhost:8080 [unhealthy]
s.healthy = True
print(s)              # http://localhost:8080 [healthy]
\`\`\`

## dataclasses — Zero Boilerplate

\`\`\`python
from dataclasses import dataclass, field
from datetime import datetime

@dataclass
class DeployEvent:
    service: str
    version: str
    deployed_by: str
    timestamp: datetime = field(default_factory=datetime.now)
    success: bool = True
    tags: list[str] = field(default_factory=list)

    def summary(self) -> str:
        status = "✅" if self.success else "❌"
        return f"{status} {self.service}@{self.version} by {self.deployed_by}"


event = DeployEvent("api", "v2.3.1", "alice")
print(event.summary())
print(event)  # DeployEvent(service='api', version='v2.3.1', ...)
\`\`\`

## Inheritance

\`\`\`python
class Notifier:
    def send(self, message: str) -> bool:
        raise NotImplementedError

class SlackNotifier(Notifier):
    def __init__(self, webhook_url: str):
        self.webhook_url = webhook_url

    def send(self, message: str) -> bool:
        print(f"[Slack] POST {self.webhook_url}: {message}")
        return True

class EmailNotifier(Notifier):
    def __init__(self, recipients: list[str]):
        self.recipients = recipients

    def send(self, message: str) -> bool:
        print(f"[Email] Sending to {', '.join(self.recipients)}: {message}")
        return True

def notify_all(notifiers: list[Notifier], msg: str) -> None:
    for n in notifiers:
        n.send(msg)

notify_all([SlackNotifier("https://..."), EmailNotifier(["ops@company.com"])],
           "Deploy complete")
\`\`\`

## Protocols (Structural Subtyping)

Prefer \`Protocol\` over inheritance for flexibility:

\`\`\`python
from typing import Protocol

class Sendable(Protocol):
    def send(self, message: str) -> bool: ...

def alert(notifier: Sendable, msg: str) -> bool:
    return notifier.send(msg)

# Any object with a send() method works — no inheritance needed
class PagerDuty:
    def send(self, message: str) -> bool:
        print(f"[PagerDuty] {message}")
        return True

alert(PagerDuty(), "Disk at 95%")  # Works!
\`\`\`
`,
          interviewQuestions: [
            {
              question: "Write a Python script that checks disk usage on multiple servers via SSH and sends an alert if any disk is over 85%.",
              difficulty: "mid" as const,
              answer: `\`\`\`python
#!/usr/bin/env python3
"""Disk usage monitoring script using paramiko for SSH."""
import paramiko
import json
from dataclasses import dataclass
from typing import Optional

SERVERS = [
    {"host": "web-01.prod", "user": "deploy"},
    {"host": "web-02.prod", "user": "deploy"},
    {"host": "db-01.prod", "user": "deploy"},
]
THRESHOLD = 85
KEY_PATH = "/home/deploy/.ssh/id_rsa"

@dataclass
class DiskCheck:
    host: str
    mount: str
    usage_pct: int
    available_gb: float

def check_disk_usage(host: str, user: str) -> list[DiskCheck]:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    results = []
    try:
        client.connect(host, username=user, key_filename=KEY_PATH, timeout=10)
        _, stdout, _ = client.exec_command(
            "df -h --output=target,pcent,avail | tail -n +2"
        )
        for line in stdout.read().decode().splitlines():
            mount, pct, avail = line.split()
            pct_int = int(pct.rstrip("%"))
            avail_gb = float(avail.rstrip("G") if "G" in avail else "0")
            results.append(DiskCheck(host, mount, pct_int, avail_gb))
    except Exception as e:
        print(f"ERROR connecting to {host}: {e}")
    finally:
        client.close()
    return results

def send_alert(checks: list[DiskCheck]) -> None:
    # Replace with your actual alerting: PagerDuty, Slack, etc.
    for check in checks:
        print(f"ALERT: {check.host}:{check.mount} is {check.usage_pct}% full "
              f"({check.available_gb}GB available)")

def main() -> None:
    alerts = []
    for server in SERVERS:
        checks = check_disk_usage(server["host"], server["user"])
        alerts.extend(c for c in checks if c.usage_pct >= THRESHOLD)

    if alerts:
        send_alert(alerts)
        print(f"Sent {len(alerts)} alerts")
    else:
        print("All disks healthy")

if __name__ == "__main__":
    main()
\`\`\`

**Key concepts demonstrated:**
- Type hints for maintainability
- \`dataclass\` for structured data
- Context manager (try/finally) for SSH cleanup
- Separation of concerns: check vs. alert
- Error handling per server (one failure doesn't stop others)`,
            },
            {
              question: "Explain Python's GIL and how to work around it for CPU-bound vs I/O-bound tasks.",
              difficulty: "senior" as const,
              answer: `**The GIL (Global Interpreter Lock):** A mutex in CPython that ensures only one thread executes Python bytecode at a time, even on multi-core CPUs.

**Why it exists:** CPython's memory management (reference counting) is not thread-safe. The GIL simplifies this but limits parallelism.

**Impact by workload type:**

**I/O-bound tasks (network calls, file I/O, disk):**
The GIL is RELEASED during I/O operations. Multiple threads work effectively:
\`\`\`python
import concurrent.futures
import requests

# This actually runs in parallel — GIL released during HTTP calls:
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(requests.get, url) for url in urls]
    results = [f.result() for f in futures]
# 10× faster than sequential for 10 HTTP requests
\`\`\`

**CPU-bound tasks (parsing, compression, math):**
GIL is NOT released — threads take turns, no speedup from multiple cores:
\`\`\`python
# Threading DOESN'T help for CPU work:
with ThreadPoolExecutor(max_workers=4) as ex:
    results = list(ex.map(heavy_computation, data))
# Still single-core performance — threads compete for GIL

# multiprocessing DOES help — separate processes, no GIL:
from multiprocessing import Pool
with Pool(4) as p:
    results = p.map(heavy_computation, data)
# True 4-core parallelism
\`\`\`

**asyncio (for I/O-bound concurrency — most scalable for DevOps tools):**
\`\`\`python
import asyncio
import aiohttp

async def check_service(url: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            return {"url": url, "status": resp.status}

async def main():
    urls = ["https://api1.example.com", "https://api2.example.com"]
    results = await asyncio.gather(*[check_service(u) for u in urls])
    return results
# Single thread, single GIL, handles 1000s of concurrent I/O operations
\`\`\`

**Rule of thumb:**
- Network/file I/O → \`threading\` or \`asyncio\`
- CPU computation → \`multiprocessing\`
- Mixed → \`ProcessPoolExecutor\` for CPU parts + \`asyncio\` for I/O`,
            },
          ],
        },
      ],
    },
  ],
};
