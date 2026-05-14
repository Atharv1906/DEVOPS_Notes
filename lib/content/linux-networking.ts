import type { Track } from "./types";

export const linuxNetworkingTrack: Track = {
  id: "linux-networking",
  title: "Linux Networking",
  description: "Master networking on Linux systems",
  longDescription:
    "From IP addressing and routing to firewalls, SSH tunneling, and network troubleshooting — become fluent in Linux networking for DevOps and SRE work.",
  icon: "Globe",
  color: "#e11d48",
  gradient: "track-linux-gradient",
  tags: ["linux", "networking", "security", "sre", "infrastructure"],
  modules: [
    {
      id: "network-fundamentals",
      title: "Network Fundamentals",
      level: "beginner",
      description: "Understand the protocols and concepts that underpin all Linux networking.",
      lessons: [
        {
          id: "osi-model",
          title: "The OSI Model",
          duration: 12,
          type: "lesson",
          description: "Understand the 7-layer OSI model and how it maps to real networking.",
          objectives: [
            "Describe all 7 OSI layers and their responsibilities",
            "Map common protocols to the correct OSI layer",
            "Explain how packets traverse the OSI stack",
          ],
          content: `# The OSI Model

The **Open Systems Interconnection (OSI) model** is a conceptual framework that describes how different network protocols interact when data is transmitted over a network. Understanding it makes troubleshooting network problems systematic rather than guesswork.

## The 7 Layers

\`\`\`
┌──────────────────────────────────────────────────────────────────┐
│  Layer 7 │ Application  │ HTTP, DNS, FTP, SMTP, SSH, TLS        │
├──────────────────────────────────────────────────────────────────┤
│  Layer 6 │ Presentation │ TLS/SSL encryption, compression       │
├──────────────────────────────────────────────────────────────────┤
│  Layer 5 │ Session      │ Session management, authentication    │
├──────────────────────────────────────────────────────────────────┤
│  Layer 4 │ Transport    │ TCP, UDP — ports, flow control        │
├──────────────────────────────────────────────────────────────────┤
│  Layer 3 │ Network      │ IP, ICMP, routing — IP addresses      │
├──────────────────────────────────────────────────────────────────┤
│  Layer 2 │ Data Link    │ Ethernet, ARP — MAC addresses         │
├──────────────────────────────────────────────────────────────────┤
│  Layer 1 │ Physical     │ Cables, switches, electrical signals  │
└──────────────────────────────────────────────────────────────────┘
\`\`\`

## Each Layer Explained

### Layer 1 — Physical
The actual hardware: cables, fiber, radio waves, voltage. Data is raw bits.

\`\`\`bash
# View physical interface details
ethtool eth0
# Speed: 1000Mb/s
# Duplex: Full
# Link detected: yes
\`\`\`

### Layer 2 — Data Link
Frames data for transmission between directly connected nodes. Uses **MAC addresses**.

\`\`\`bash
# View MAC addresses
ip link show
# 2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
#     link/ether 52:54:00:ab:cd:ef brd ff:ff:ff:ff:ff:ff

# View ARP table (IP → MAC mappings)
arp -n
# Address         HWtype  HWaddress           Flags
# 192.168.1.1     ether   aa:bb:cc:dd:ee:ff   C
\`\`\`

### Layer 3 — Network
Routes packets between networks using **IP addresses**. This is the internet layer.

\`\`\`bash
# View IP addresses
ip addr show

# View routing table
ip route show
# default via 192.168.1.1 dev eth0
# 192.168.1.0/24 dev eth0 proto kernel

# Ping uses ICMP (Layer 3)
ping -c 3 8.8.8.8
\`\`\`

### Layer 4 — Transport
Provides end-to-end communication between processes using **ports**.

| Protocol | Type | Use case |
|----------|------|----------|
| TCP | Connection-oriented, reliable | HTTP, SSH, databases |
| UDP | Connectionless, fast | DNS, video, VoIP |

\`\`\`bash
# View active TCP connections (Layer 4)
ss -tn
# State    Recv-Q  Send-Q  Local Address:Port  Peer Address:Port
# ESTAB    0       0       192.168.1.5:22      192.168.1.2:51234

# View listening UDP ports
ss -uln
\`\`\`

### Layers 5–7 — Application Layers
In practice, these three are often collapsed into "the application layer":
- **Session** — establishing and managing connections (TLS handshake)
- **Presentation** — encryption, encoding, compression
- **Application** — the protocol your app speaks (HTTP, DNS, SMTP)

## The TCP/IP Model (Practical Alternative)

In practice, engineers use the simpler **4-layer TCP/IP model**:

\`\`\`
OSI Layer 7, 6, 5  →  Application  (HTTP, DNS, SSH)
OSI Layer 4        →  Transport     (TCP, UDP)
OSI Layer 3        →  Internet      (IP, ICMP)
OSI Layer 2, 1     →  Link          (Ethernet, WiFi)
\`\`\`

## Troubleshooting by Layer

When something is broken, work from bottom to top:

\`\`\`bash
# Layer 1: Is the cable connected?
ip link show eth0 | grep "state UP"

# Layer 2: Do we have a MAC address and ARP works?
arp -n | grep 192.168.1.1

# Layer 3: Can we ping the gateway?
ping -c 1 192.168.1.1

# Layer 3: Can we ping an external IP?
ping -c 1 8.8.8.8

# Layer 7: Can we resolve DNS?
nslookup google.com

# Layer 7: Can we reach an HTTP server?
curl -I https://example.com
\`\`\`

> **Tip:** "ping works but HTTP doesn't" means the issue is at Layer 7 (application), not the network itself.
`,
          interviewQuestions: [
            {
              question: "Walk me through the OSI model and where common network problems occur at each layer.",
              difficulty: "junior" as const,
              answer: `The OSI model has 7 layers. Network troubleshooting follows a bottom-up approach:

**Layer 1 — Physical:** Cables, NICs, switches
- Problem: no link, intermittent drops
- Tools: \`ethtool eth0\` (link speed/duplex), \`ip link show\` (UP/DOWN)

**Layer 2 — Data Link:** MAC addresses, VLANs, Ethernet frames
- Problem: ARP failures, wrong VLAN, MAC flooding
- Tools: \`arp -n\`, \`ip neigh\`, Wireshark (ARP filter)

**Layer 3 — Network:** IP routing, ICMP
- Problem: wrong subnet, missing route, firewall blocking ICMP
- Tools: \`ping\`, \`traceroute\`, \`ip route show\`, \`ip addr show\`

**Layer 4 — Transport:** TCP/UDP, ports, connections
- Problem: firewall blocking port, wrong port, connection refused
- Tools: \`ss -tlnp\`, \`nc -zv host port\`, \`telnet host port\`

**Layer 7 — Application:** HTTP, DNS, TLS
- Problem: wrong URL, cert error, app crash
- Tools: \`curl -v\`, \`dig\`, \`openssl s_client\`

**Troubleshooting heuristic:**
\`\`\`bash
# Layer 3: Can I ping?
ping -c 4 10.0.0.1

# Layer 4: Is the port open?
nc -zv 10.0.0.1 443

# Layer 7: Does the application respond?
curl -v https://10.0.0.1/health

# DNS: Does the name resolve?
dig api.example.com
nslookup api.example.com 8.8.8.8
\`\`\`

"ping works but HTTP fails" = Layer 3 OK but Layer 4/7 problem (firewall, wrong port, app crash).`,
            },
            {
              question: "How does DNS resolution work end-to-end when you type a URL in a browser?",
              difficulty: "mid" as const,
              answer: `\`\`\`
1. Browser checks its DNS cache → not found
2. OS checks /etc/hosts → not found
3. OS checks its resolver cache (nscd/systemd-resolved) → not found
4. OS queries the configured recursive resolver (e.g., 8.8.8.8 or your ISP's resolver)

At the recursive resolver:
5. Resolver checks its cache → not found
6. Resolver queries a Root Name Server (one of 13 root NS clusters):
   "Who handles .com?" → Root NS returns addresses of .com TLD nameservers
7. Resolver queries a .com TLD nameserver:
   "Who handles example.com?" → TLD NS returns example.com's authoritative NS
8. Resolver queries example.com's authoritative nameserver:
   "What is the IP of www.example.com?" → Returns A record: 93.184.216.34

9. Recursive resolver caches the answer (per TTL)
10. Recursive resolver returns answer to OS
11. OS caches it, returns to browser
12. Browser connects to 93.184.216.34
\`\`\`

**TTL (Time To Live):** Each DNS record has a TTL. During that time, the resolver doesn't re-query the authoritative NS. Low TTL (60s) = faster propagation when you change IPs. High TTL (3600s) = less DNS traffic.

**Debugging:**
\`\`\`bash
# Full resolution trace:
dig +trace www.example.com

# Check from specific resolver:
dig @8.8.8.8 www.example.com
dig @1.1.1.1 www.example.com

# Find authoritative NS:
dig NS example.com

# Check TTL:
dig www.example.com | grep -E "ANSWER|TTL"
\`\`\``,
            },
          ],
        },
        {
          id: "tcp-ip-addressing",
          title: "IP Addressing & Subnetting",
          duration: 18,
          type: "lesson",
          description: "Master IPv4 addressing, CIDR notation, and subnet calculations.",
          content: `# IP Addressing & Subnetting

## IPv4 Address Structure

An IPv4 address is 32 bits, written as 4 octets:

\`\`\`
192.168.1.100
│   │   │ │
│   │   │ └── Host part
│   │   └──── Subnet
│   └──────── Network
└──────────── Class identifier (historical)

Binary: 11000000.10101000.00000001.01100100
\`\`\`

## CIDR Notation

CIDR (Classless Inter-Domain Routing) specifies both the IP and subnet mask:

\`\`\`
192.168.1.0/24
             └── 24 bits are the network portion (subnet mask)

Subnet mask: 255.255.255.0  (24 ones, then 8 zeros)
Binary:      11111111.11111111.11111111.00000000

/24 gives you 256 addresses (254 usable — .0 is network, .255 is broadcast)
\`\`\`

## Common Subnet Sizes

| CIDR | Hosts | Subnet Mask | Use Case |
|------|-------|-------------|----------|
| /8 | 16,777,214 | 255.0.0.0 | Large enterprise |
| /16 | 65,534 | 255.255.0.0 | Medium enterprise |
| /24 | 254 | 255.255.255.0 | Typical office LAN |
| /25 | 126 | 255.255.255.128 | Split /24 in half |
| /28 | 14 | 255.255.255.240 | Small VLAN |
| /30 | 2 | 255.255.255.252 | Point-to-point links |
| /32 | 1 | 255.255.255.255 | Single host (loopback) |

## Private Address Ranges

RFC 1918 defines private (non-routable) ranges:

\`\`\`
10.0.0.0/8        →  10.0.0.0 – 10.255.255.255      (class A)
172.16.0.0/12     →  172.16.0.0 – 172.31.255.255    (class B)
192.168.0.0/16    →  192.168.0.0 – 192.168.255.255  (class C)
127.0.0.0/8       →  Loopback (localhost)
169.254.0.0/16    →  Link-local (APIPA — no DHCP response)
\`\`\`

## Calculating Subnet Ranges

\`\`\`bash
# Install ipcalc
apt install ipcalc

# Calculate subnet info
ipcalc 192.168.1.100/24
# Network:   192.168.1.0/24
# Netmask:   255.255.255.0
# Broadcast: 192.168.1.255
# HostMin:   192.168.1.1
# HostMax:   192.168.1.254
# Hosts/Net: 254

ipcalc 10.0.0.0/22
# HostMin:   10.0.0.1
# HostMax:   10.0.3.254
# Hosts/Net: 1022
\`\`\`

## Linux IP Commands

\`\`\`bash
# Show all IP addresses
ip addr show
# or shorter:
ip a

# Show specific interface
ip addr show eth0

# Add an IP address to an interface
ip addr add 192.168.1.50/24 dev eth0

# Remove an IP address
ip addr del 192.168.1.50/24 dev eth0

# Show routing table
ip route show
ip r

# Add a static route
ip route add 10.0.0.0/8 via 192.168.1.1

# Add default gateway
ip route add default via 192.168.1.1

# Delete a route
ip route del 10.0.0.0/8
\`\`\`

## IPv6 Basics

\`\`\`bash
# IPv6 is 128 bits, written in hex groups
# Full:      2001:0db8:0000:0000:0000:0000:0000:0001
# Shorthand: 2001:db8::1

# Common IPv6 addresses
::1          # Loopback (equivalent to 127.0.0.1)
fe80::/10    # Link-local (automatically assigned)
::ffff:0:0/96  # IPv4-mapped IPv6

# Show IPv6 addresses
ip -6 addr show

# Ping IPv6
ping6 ::1
ping6 2001:db8::1
\`\`\`
`,
        },
        {
          id: "common-ports-protocols",
          title: "Ports & Protocols",
          duration: 10,
          type: "lesson",
          description: "Learn the essential ports and protocols every Linux engineer must know.",
          content: `# Ports & Protocols

## Well-Known Ports (0–1023)

These require root to bind:

| Port | Protocol | Service |
|------|----------|---------|
| 22 | TCP | SSH |
| 25 | TCP | SMTP (email) |
| 53 | TCP/UDP | DNS |
| 80 | TCP | HTTP |
| 443 | TCP | HTTPS (TLS) |
| 110 | TCP | POP3 |
| 143 | TCP | IMAP |
| 3306 | TCP | MySQL |
| 5432 | TCP | PostgreSQL |
| 6379 | TCP | Redis |
| 27017 | TCP | MongoDB |
| 2181 | TCP | ZooKeeper |
| 9092 | TCP | Kafka |

## Checking Ports

\`\`\`bash
# What's listening on which port?
ss -tlnp
# State    Recv-Q  Send-Q  Local Address:Port
# LISTEN   0       128     0.0.0.0:22           ← SSH on all interfaces
# LISTEN   0       128     127.0.0.1:5432       ← Postgres on loopback only

# Older equivalent
netstat -tlnp

# Is a specific port open on a remote host?
nc -zv 10.0.0.5 443
# Connection to 10.0.0.5 443 port [tcp/https] succeeded!

nc -zv 10.0.0.5 8080
# nc: connect to 10.0.0.5 port 8080 (tcp) failed: Connection refused

# Scan ports with nmap
nmap -sV 192.168.1.1         # Service detection
nmap -p 22,80,443 192.168.1.5  # Specific ports
nmap -p- 192.168.1.5          # All 65535 ports (slow)
\`\`\`

## TCP vs UDP

\`\`\`
TCP (Transmission Control Protocol)
├── Connection-oriented (3-way handshake)
│   SYN → SYN-ACK → ACK
├── Guaranteed delivery (retransmits lost packets)
├── Ordered delivery
├── Flow and congestion control
└── Use: HTTP, SSH, databases, email

UDP (User Datagram Protocol)
├── Connectionless (fire and forget)
├── No delivery guarantee
├── No ordering
├── Much lower overhead
└── Use: DNS, DHCP, video streaming, VoIP, games
\`\`\`

## The TCP Handshake

\`\`\`bash
# Watch TCP connections with tcpdump
tcpdump -i eth0 'host 10.0.0.5 and port 80' -n

# You'll see:
# SYN     (client → server, seq=x)
# SYN-ACK (server → client, seq=y, ack=x+1)
# ACK     (client → server, ack=y+1)
# ... data transfer ...
# FIN-ACK (connection teardown)
\`\`\`

## Socket States

\`\`\`bash
ss -tn
# LISTEN     – waiting for connections
# SYN-SENT   – sent SYN, waiting for SYN-ACK
# SYN-RECV   – received SYN, sent SYN-ACK
# ESTABLISHED – connection active
# FIN-WAIT-1 – sent FIN, waiting for ACK
# FIN-WAIT-2 – received ACK of FIN
# TIME-WAIT  – waiting to ensure remote got FIN-ACK (2MSL)
# CLOSE-WAIT – received FIN, waiting for app to close
# CLOSED     – connection closed

# Count connections by state
ss -tan | awk 'NR>1 {print $1}' | sort | uniq -c | sort -rn
\`\`\`
`,
        },
      ],
    },
    {
      id: "network-configuration",
      title: "Network Configuration",
      level: "beginner",
      description: "Configure Linux network interfaces, routes, and hostname resolution.",
      lessons: [
        {
          id: "ip-command",
          title: "The ip Command",
          duration: 15,
          type: "lesson",
          description: "Master the modern ip command — the replacement for ifconfig, route, and arp.",
          content: `# The ip Command

The \`ip\` command is the modern, unified tool for all network configuration in Linux. It replaces the older \`ifconfig\`, \`route\`, and \`arp\` commands.

## ip link — Manage Network Interfaces

\`\`\`bash
# List all interfaces
ip link show
# 1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
#     link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
# 2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP
#     link/ether 52:54:00:ab:cd:ef brd ff:ff:ff:ff:ff:ff

# Short form
ip l

# Bring interface up/down
ip link set eth0 up
ip link set eth0 down

# Change MTU (Maximum Transmission Unit)
ip link set eth0 mtu 9000

# Set promiscuous mode (capture all traffic)
ip link set eth0 promisc on

# Rename an interface
ip link set eth0 name eth0-wan

# Add a VLAN interface
ip link add link eth0 name eth0.100 type vlan id 100
ip link set eth0.100 up

# Add a bridge
ip link add br0 type bridge
ip link set eth0 master br0
ip link set br0 up
\`\`\`

## ip addr — Manage IP Addresses

\`\`\`bash
# Show all addresses
ip addr show
ip a       # short form

# Show a specific interface
ip addr show eth0

# Add an address
ip addr add 192.168.1.100/24 dev eth0

# Add a secondary address (alias)
ip addr add 192.168.1.101/24 dev eth0 label eth0:0

# Remove an address
ip addr del 192.168.1.100/24 dev eth0

# Flush all addresses from an interface
ip addr flush dev eth0
\`\`\`

## ip route — Manage Routing Table

\`\`\`bash
# Show routing table
ip route show
ip r       # short form

# Add a default gateway
ip route add default via 192.168.1.1 dev eth0

# Add a static route
ip route add 10.0.0.0/8 via 192.168.1.1

# Add a route via a specific interface
ip route add 192.168.2.0/24 dev eth1

# Delete a route
ip route del 10.0.0.0/8

# Test which route a packet will take
ip route get 8.8.8.8
# 8.8.8.8 via 192.168.1.1 dev eth0 src 192.168.1.100

# Multiple routing tables (policy routing)
ip rule show
ip route show table local
ip route show table main
\`\`\`

## ip neigh — ARP/Neighbor Table

\`\`\`bash
# Show ARP table
ip neigh show
ip n

# Add a static ARP entry
ip neigh add 192.168.1.5 lladdr aa:bb:cc:dd:ee:ff dev eth0

# Flush ARP cache
ip neigh flush dev eth0
\`\`\`

## Persistent Configuration

Changes made with \`ip\` are lost on reboot. For persistence:

### Debian/Ubuntu (netplan — Ubuntu 18.04+)
\`\`\`yaml
# /etc/netplan/00-installer-config.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: false
      addresses:
        - 192.168.1.100/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 1.1.1.1]
\`\`\`

\`\`\`bash
# Apply netplan config
netplan apply
\`\`\`

### RHEL/CentOS/Rocky (NetworkManager)
\`\`\`bash
# Configure with nmcli
nmcli con mod eth0 ipv4.addresses "192.168.1.100/24"
nmcli con mod eth0 ipv4.gateway "192.168.1.1"
nmcli con mod eth0 ipv4.dns "8.8.8.8 1.1.1.1"
nmcli con mod eth0 ipv4.method manual
nmcli con up eth0
\`\`\`
`,
        },
        {
          id: "dns-resolution",
          title: "DNS & Name Resolution",
          duration: 15,
          type: "lesson",
          description: "Understand how Linux resolves hostnames and troubleshoot DNS issues.",
          content: `# DNS & Name Resolution

## How Linux Resolves Names

Linux uses a configurable resolution order defined in \`/etc/nsswitch.conf\`:

\`\`\`bash
cat /etc/nsswitch.conf | grep hosts
# hosts: files dns myhostname

# Resolution order:
# 1. /etc/hosts (files)
# 2. DNS servers from /etc/resolv.conf (dns)
# 3. mDNS/hostname itself
\`\`\`

## /etc/hosts

Static hostname mappings — checked before DNS:

\`\`\`bash
cat /etc/hosts
# 127.0.0.1     localhost
# 127.0.1.1     myhostname
# ::1           localhost ip6-localhost ip6-loopback

# Add custom entries
echo "10.0.0.5  db.internal postgres" >> /etc/hosts
\`\`\`

> **Note:** /etc/hosts is read on every lookup — changes take effect immediately, no restart needed.

## /etc/resolv.conf

Configures DNS server addresses:

\`\`\`bash
cat /etc/resolv.conf
# nameserver 8.8.8.8
# nameserver 1.1.1.1
# search mycompany.internal
# options ndots:5 timeout:2 attempts:3
\`\`\`

Options:
- \`nameserver\` — DNS server to query (up to 3)
- \`search\` — domain suffixes to try (e.g., \`db\` → \`db.mycompany.internal\`)
- \`ndots\` — dots needed before trying absolute name first

> **Warning:** On modern systems, \`/etc/resolv.conf\` is managed by \`systemd-resolved\` or \`NetworkManager\`. Editing it directly may be overwritten.

## DNS Query Tools

### dig — The Definitive DNS Tool

\`\`\`bash
# Basic lookup (A record)
dig google.com
dig google.com A

# MX records (mail servers)
dig google.com MX

# NS records (name servers)
dig google.com NS

# TXT records (SPF, DKIM, etc.)
dig google.com TXT

# Reverse lookup (IP → hostname)
dig -x 8.8.8.8

# Query a specific DNS server
dig @8.8.8.8 google.com
dig @1.1.1.1 google.com

# Short output
dig +short google.com
# 142.250.80.46

# Full trace from root servers
dig +trace google.com

# Check DNSSEC
dig +dnssec google.com
\`\`\`

### nslookup

\`\`\`bash
# Simple lookup
nslookup google.com

# Query specific server
nslookup google.com 8.8.8.8

# Reverse lookup
nslookup 8.8.8.8
\`\`\`

### host

\`\`\`bash
host google.com
# google.com has address 142.250.80.46
# google.com mail is handled by 10 smtp.google.com.

host -t MX google.com
host 8.8.8.8
\`\`\`

## systemd-resolved

Modern Ubuntu/Debian uses \`systemd-resolved\`:

\`\`\`bash
# Check status
systemd-resolve --status

# Query with systemd-resolve
systemd-resolve google.com

# View statistics
systemd-resolve --statistics

# Flush DNS cache
systemd-resolve --flush-caches

# Which DNS server is being used?
resolvectl status
\`\`\`

## Common DNS Troubleshooting

\`\`\`bash
# DNS not working but ping to IP works?
# → Check /etc/resolv.conf has valid nameservers
cat /etc/resolv.conf

# Test direct DNS query
dig @8.8.8.8 google.com

# Check if DNS port is reachable
nc -zuv 8.8.8.8 53

# Check systemd-resolved
systemctl status systemd-resolved

# DNS slow? Check search domains (too many ndots?)
cat /etc/resolv.conf | grep -E 'search|ndots'

# Wireshark DNS filter: dns
# tcpdump DNS
tcpdump -i eth0 port 53 -n
\`\`\`
`,
        },
      ],
    },
    {
      id: "ssh-remote-access",
      title: "SSH & Remote Access",
      level: "intermediate",
      description: "Master SSH for secure remote access, key management, and tunneling.",
      lessons: [
        {
          id: "ssh-basics",
          title: "SSH Fundamentals",
          duration: 15,
          type: "lesson",
          description: "Connect securely to remote servers and set up key-based authentication.",
          content: `# SSH Fundamentals

SSH (Secure Shell) is the standard way to access remote Linux systems securely. It encrypts all traffic, including authentication credentials.

## Basic SSH Usage

\`\`\`bash
# Connect to a remote host
ssh username@hostname
ssh username@192.168.1.10
ssh -p 2222 username@hostname   # custom port

# Run a command remotely (non-interactive)
ssh username@host "df -h"
ssh username@host "systemctl status nginx"

# Copy your public key to a remote host
ssh-copy-id username@hostname
ssh-copy-id -i ~/.ssh/id_ed25519.pub username@hostname
\`\`\`

## Key-Based Authentication

Password auth is weak. Keys are exponentially more secure.

### Generating SSH Keys

\`\`\`bash
# Modern: Ed25519 (recommended — smaller, faster, equally secure)
ssh-keygen -t ed25519 -C "your@email.com"

# Older RSA (4096-bit for compatibility)
ssh-keygen -t rsa -b 4096 -C "your@email.com"

# Keys are stored in:
ls ~/.ssh/
# id_ed25519       ← private key (NEVER share this)
# id_ed25519.pub   ← public key (safe to share)
# authorized_keys  ← keys that can log into THIS machine
# known_hosts      ← fingerprints of hosts you've connected to
\`\`\`

### Deploying Public Keys

\`\`\`bash
# Method 1: ssh-copy-id
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server

# Method 2: Manual
cat ~/.ssh/id_ed25519.pub | ssh user@server \
  "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

# Set correct permissions on the server
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
\`\`\`

## SSH Server Configuration

\`\`\`bash
# Main config file
sudo nano /etc/ssh/sshd_config
\`\`\`

\`\`\`
# Essential security settings
Port 22                        # Change to non-standard port
PermitRootLogin no             # Never allow root to SSH in
PasswordAuthentication no      # Key-only auth
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys

MaxAuthTries 3                 # Limit brute force
LoginGraceTime 30              # Seconds to authenticate
ClientAliveInterval 120        # Keepalive every 120 seconds
ClientAliveCountMax 3          # Disconnect after 3 missed keepalives

AllowUsers alice bob           # Whitelist specific users
DenyUsers backup monitor       # Or blacklist

# Restrict to specific networks
ListenAddress 192.168.1.10     # Only listen on this IP
\`\`\`

\`\`\`bash
# Apply config (test first!)
sudo sshd -t                   # Test config syntax
sudo systemctl restart sshd
\`\`\`

## SSH Client Config File

\`\`\`bash
# ~/.ssh/config
# Avoids typing long ssh commands

Host prod-web
    HostName 10.0.1.50
    User ubuntu
    IdentityFile ~/.ssh/prod_key
    Port 22

Host jump-host
    HostName bastion.mycompany.com
    User ec2-user
    IdentityFile ~/.ssh/aws_key

Host internal-*
    ProxyJump jump-host
    User ubuntu
    IdentityFile ~/.ssh/prod_key

# Now just type:
ssh prod-web
ssh internal-db      # Automatically jumps through bastion
\`\`\`

## SSH Tunneling & Port Forwarding

\`\`\`bash
# Local port forwarding: access remote service locally
# Forward local port 8080 → remote host:80
ssh -L 8080:localhost:80 user@remote-server
# Now: curl http://localhost:8080 → hits remote nginx

# Access a DB only accessible from the server
ssh -L 5433:db.internal:5432 user@bastion
# Now: psql -h localhost -p 5433

# Remote port forwarding: expose local service to remote
ssh -R 8080:localhost:3000 user@remote-server
# Remote users can hit remote-server:8080 → your machine:3000

# Dynamic (SOCKS proxy): route all traffic through server
ssh -D 9050 user@remote-server
# Configure browser to use SOCKS5 proxy at localhost:9050

# Jump host (ProxyJump)
ssh -J bastion.company.com user@10.0.0.50
\`\`\`

## SSH Agent

\`\`\`bash
# Start agent
eval "$(ssh-agent -s)"

# Add key to agent (so you don't need to type passphrase every time)
ssh-add ~/.ssh/id_ed25519

# List loaded keys
ssh-add -l

# Forward agent to remote server (use your local keys on server)
ssh -A user@remote-server
\`\`\`
`,
        },
      ],
    },
    {
      id: "firewalls",
      title: "Firewalls & Security",
      level: "intermediate",
      description: "Protect Linux systems with iptables, ufw, and nftables.",
      lessons: [
        {
          id: "ufw-basics",
          title: "UFW — Uncomplicated Firewall",
          duration: 12,
          type: "lesson",
          description: "Quickly secure a Linux server with ufw.",
          content: `# UFW — Uncomplicated Firewall

UFW (Uncomplicated Firewall) is a user-friendly frontend for \`iptables\`. It's the recommended tool for managing a server firewall on Ubuntu/Debian.

## Installation & Setup

\`\`\`bash
# Install
sudo apt install ufw

# Check status
sudo ufw status
sudo ufw status verbose
sudo ufw status numbered    # Shows rule numbers

# Enable/disable (be careful — don't lock yourself out!)
sudo ufw enable
sudo ufw disable
\`\`\`

## Allow Rules

\`\`\`bash
# Allow by service name (reads /etc/services)
sudo ufw allow ssh          # Port 22
sudo ufw allow http         # Port 80
sudo ufw allow https        # Port 443

# Allow by port
sudo ufw allow 8080
sudo ufw allow 8080/tcp
sudo ufw allow 53/udp

# Allow port range
sudo ufw allow 6000:6007/tcp

# Allow from specific IP
sudo ufw allow from 192.168.1.0/24
sudo ufw allow from 10.0.0.5 to any port 5432

# Allow specific interface
sudo ufw allow in on eth1 to any port 80
\`\`\`

## Deny & Reject Rules

\`\`\`bash
# Deny (silently drop packets)
sudo ufw deny 23            # Telnet
sudo ufw deny from 203.0.113.0/24

# Reject (send ICMP unreachable — attacker knows port is closed)
sudo ufw reject 23

# Delete rules
sudo ufw delete allow 8080
sudo ufw delete 3           # Delete rule number 3
\`\`\`

## Default Policies

\`\`\`bash
# Secure default: deny all incoming, allow all outgoing
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw default deny routed    # Block forwarding (for servers, not routers)
\`\`\`

## Application Profiles

\`\`\`bash
# List available application profiles
sudo ufw app list
# Available applications:
#   Apache
#   Apache Full
#   Apache Secure
#   Nginx Full
#   OpenSSH

# Allow an application profile
sudo ufw allow "Nginx Full"     # Allows 80 and 443
sudo ufw allow OpenSSH

# View profile details
sudo ufw app info "Nginx Full"
\`\`\`

## Logging

\`\`\`bash
# Enable logging
sudo ufw logging on
sudo ufw logging medium     # low, medium, high, full

# View UFW logs
tail -f /var/log/ufw.log
grep "BLOCK" /var/log/ufw.log | head -20
\`\`\`

## Complete Server Setup Example

\`\`\`bash
# Start fresh — reset all rules
sudo ufw --force reset

# Set defaults
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH first (critical — or you'll lock yourself out!)
sudo ufw allow ssh

# Web server
sudo ufw allow http
sudo ufw allow https

# Allow monitoring from specific network
sudo ufw allow from 10.0.0.0/8 to any port 9090    # Prometheus
sudo ufw allow from 10.0.0.0/8 to any port 3000    # Grafana

# Enable
sudo ufw enable

# Verify
sudo ufw status verbose
\`\`\`
`,
        },
        {
          id: "iptables-intro",
          title: "iptables Fundamentals",
          duration: 20,
          type: "lesson",
          description: "Understand the powerful low-level Linux packet filtering framework.",
          content: `# iptables Fundamentals

\`iptables\` is the traditional Linux firewall tool that ufw and Docker both use under the hood. Understanding it is essential for advanced networking.

## Concepts

\`\`\`
Packet arrives
     │
     ▼
  PREROUTING ────── (DNAT, routing decision) ─────────→ FORWARD → POSTROUTING
     │                                                               │
     │ (destined for local)                                          │ (leaving)
     ▼                                                               ▼
   INPUT                                                         OUTPUT
     │                                                               │
     ▼                                                               ▼
  Local Process ──────────────────────────────────────────────────→
\`\`\`

**Tables:**
- \`filter\` — the main firewall (INPUT, OUTPUT, FORWARD chains)
- \`nat\` — Network Address Translation (PREROUTING, POSTROUTING)
- \`mangle\` — packet modification
- \`raw\` — bypass connection tracking

## Viewing Rules

\`\`\`bash
# List rules in filter table
sudo iptables -L
sudo iptables -L -v -n     # verbose, numeric (no DNS lookups)
sudo iptables -L -n --line-numbers  # with line numbers

# List specific chain
sudo iptables -L INPUT -n -v

# List NAT table
sudo iptables -t nat -L -n -v
\`\`\`

## Adding Rules

\`\`\`bash
# Append to chain (-A = append, -I = insert at top)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Allow established/related connections
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow loopback
sudo iptables -A INPUT -i lo -j ACCEPT

# Drop everything else
sudo iptables -A INPUT -j DROP

# Allow from specific IP
sudo iptables -A INPUT -s 10.0.0.5 -p tcp --dport 5432 -j ACCEPT

# Limit rate (brute force protection)
sudo iptables -A INPUT -p tcp --dport 22 -m recent --name ssh --update --seconds 60 --hitcount 4 -j DROP
sudo iptables -A INPUT -p tcp --dport 22 -m recent --name ssh --set -j ACCEPT
\`\`\`

## NAT — Network Address Translation

\`\`\`bash
# MASQUERADE: share internet from eth0 (replace src IP with server's IP)
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
# Enable IP forwarding
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward

# DNAT: port forwarding (redirect port 8080 → internal server:80)
sudo iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT \
  --to-destination 192.168.1.10:80

# SNAT: static NAT (specific source IP substitution)
sudo iptables -t nat -A POSTROUTING -o eth0 -s 192.168.1.0/24 \
  -j SNAT --to-source 203.0.113.5
\`\`\`

## Deleting Rules

\`\`\`bash
# Delete by rule specification
sudo iptables -D INPUT -p tcp --dport 80 -j ACCEPT

# Delete by line number
sudo iptables -D INPUT 3

# Flush all rules in a chain
sudo iptables -F INPUT

# Flush all chains and delete custom chains
sudo iptables -F
sudo iptables -X
\`\`\`

## Saving & Restoring Rules

\`\`\`bash
# Save current rules
sudo iptables-save > /etc/iptables/rules.v4
sudo ip6tables-save > /etc/iptables/rules.v6

# Restore rules
sudo iptables-restore < /etc/iptables/rules.v4

# Auto-restore on boot (Debian/Ubuntu)
sudo apt install iptables-persistent
# Rules saved to /etc/iptables/rules.v4 are loaded at boot
\`\`\`

> **Note:** Modern systems use \`nftables\` instead of \`iptables\`. nftables has a cleaner syntax but iptables rules are still valid via the \`iptables-nft\` compatibility layer on most distros.
`,
        },
      ],
    },
    {
      id: "network-monitoring",
      title: "Network Monitoring & Troubleshooting",
      level: "intermediate",
      description: "Diagnose network issues with professional tools.",
      lessons: [
        {
          id: "troubleshooting-tools",
          title: "Network Troubleshooting Toolkit",
          duration: 20,
          type: "lesson",
          description: "Master the essential tools for diagnosing any network problem.",
          content: `# Network Troubleshooting Toolkit

## ping — Connectivity Testing

\`\`\`bash
# Basic ping
ping google.com
ping 8.8.8.8

# Limit count
ping -c 5 google.com

# Set interval (default 1s)
ping -i 0.2 google.com      # 5 pings per second

# Set packet size
ping -s 1400 google.com     # Test large packets (MTU issues)

# Flood ping (requires root — network stress test)
ping -f -c 1000 192.168.1.1

# Ping with TTL (detect routing loops)
ping -t 5 google.com        # TTL=5, expires after 5 hops

# Ping IPv6
ping6 ::1
ping6 google.com
\`\`\`

## traceroute / tracepath — Path Discovery

\`\`\`bash
# Trace the path to a host (shows each router hop)
traceroute google.com
# 1  192.168.1.1  1.234 ms  1.123 ms  1.089 ms
# 2  10.0.0.1    5.678 ms  5.432 ms  5.123 ms
# 3  * * *       (packet dropped — router doesn't reply)

# Use TCP instead of ICMP (bypasses some firewalls)
traceroute -T -p 443 google.com

# mtr: continuous traceroute (best tool)
mtr google.com                  # interactive
mtr --report --report-cycles 10 google.com  # generate report

# tracepath: similar, no root required
tracepath google.com
\`\`\`

## ss — Socket Statistics (replaces netstat)

\`\`\`bash
# All listening TCP sockets with process names
ss -tlnp
# State   Recv-Q Send-Q  Local Address:Port
# LISTEN  0      128     0.0.0.0:22          users:(("sshd",pid=1234))
# LISTEN  0      128     0.0.0.0:80          users:(("nginx",pid=5678))

# All TCP connections
ss -tan

# UDP sockets
ss -uln

# Unix domain sockets
ss -xl

# Filter by port
ss -tn sport = :443

# Filter by state
ss -tn state established

# Show socket memory
ss -tm

# Count connections by state
ss -tan | awk 'NR>1{print $1}' | sort | uniq -c
\`\`\`

## tcpdump — Packet Capture

\`\`\`bash
# Capture on interface eth0
sudo tcpdump -i eth0

# Don't resolve hostnames (faster)
sudo tcpdump -i eth0 -n

# Save to file (for Wireshark)
sudo tcpdump -i eth0 -w capture.pcap
wireshark capture.pcap       # Open in Wireshark

# Read from file
tcpdump -r capture.pcap

# Filters
sudo tcpdump -i eth0 port 80              # HTTP traffic
sudo tcpdump -i eth0 host 8.8.8.8        # Traffic to/from IP
sudo tcpdump -i eth0 src 192.168.1.5     # From specific source
sudo tcpdump -i eth0 'tcp and port 443'  # HTTPS
sudo tcpdump -i eth0 'port 53'           # DNS queries
sudo tcpdump -i eth0 'icmp'             # Ping packets

# Show packet contents
sudo tcpdump -i eth0 -A port 80         # ASCII
sudo tcpdump -i eth0 -X port 80         # Hex + ASCII

# Capture N packets
sudo tcpdump -i eth0 -c 100 port 80
\`\`\`

## curl — HTTP Debugging

\`\`\`bash
# Full request/response with timing
curl -v https://api.example.com/health

# Custom timing breakdown
curl -o /dev/null -s -w "\\n\\
DNS lookup:    %{time_namelookup}s\\n\\
TCP connect:   %{time_connect}s\\n\\
TLS handshake: %{time_appconnect}s\\n\\
TTFB:          %{time_starttransfer}s\\n\\
Total:         %{time_total}s\\n" https://example.com

# Check if a port is open
curl -v telnet://192.168.1.5:5432

# Follow redirects
curl -L http://example.com

# Custom headers
curl -H "Authorization: Bearer token123" https://api.example.com

# POST request
curl -X POST -H "Content-Type: application/json" \
  -d '{"key": "value"}' https://api.example.com/endpoint
\`\`\`

## iperf3 — Bandwidth Testing

\`\`\`bash
# On server:
iperf3 -s

# On client:
iperf3 -c server-ip

# Test UDP
iperf3 -c server-ip -u -b 100M

# Test reverse (server → client)
iperf3 -c server-ip -R

# Output:
# [SUM]  0.00-10.00 sec  1.09 GBytes  939 Mbits/sec  receiver
\`\`\`
`,
        },
      ],
    },
    {
      id: "linux-networking-advanced",
      title: "Advanced Networking",
      level: "advanced",
      description: "VPNs, network namespaces, traffic shaping, and container networking.",
      lessons: [
        {
          id: "wireguard",
          title: "WireGuard VPN",
          duration: 25,
          type: "lesson",
          description: "Set up a modern, high-performance WireGuard VPN.",
          content: `# WireGuard VPN

WireGuard is a modern, fast, and simple VPN that uses state-of-the-art cryptography. It's built into the Linux kernel (5.6+) and far simpler than OpenVPN or IPsec.

## Why WireGuard?

| | WireGuard | OpenVPN | IPSec |
|--|-----------|---------|-------|
| Code size | ~4,000 lines | ~400,000 lines | ~400,000+ |
| Performance | Very fast | Moderate | Fast |
| Configuration | Simple | Complex | Complex |
| Protocols | UDP only | TCP or UDP | UDP |
| Kernel integration | Yes (5.6+) | No | Yes |

## Installation

\`\`\`bash
# Ubuntu/Debian
sudo apt update
sudo apt install wireguard

# RHEL/CentOS
sudo dnf install wireguard-tools

# Check WireGuard is loaded
lsmod | grep wireguard
\`\`\`

## Server Setup

\`\`\`bash
# 1. Generate server keys
wg genkey | tee /etc/wireguard/server_private.key | wg pubkey > /etc/wireguard/server_public.key
chmod 600 /etc/wireguard/server_private.key

# View keys
cat /etc/wireguard/server_private.key
cat /etc/wireguard/server_public.key

# 2. Create server config
cat > /etc/wireguard/wg0.conf << EOF
[Interface]
Address = 10.10.0.1/24
ListenPort = 51820
PrivateKey = $(cat /etc/wireguard/server_private.key)

# Enable IP forwarding for VPN traffic
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Client peer
[Peer]
PublicKey = <CLIENT_PUBLIC_KEY>
AllowedIPs = 10.10.0.2/32    # This client's VPN IP
EOF

# 3. Enable IP forwarding permanently
echo "net.ipv4.ip_forward = 1" | tee /etc/sysctl.d/99-wireguard.conf
sysctl -p /etc/sysctl.d/99-wireguard.conf

# 4. Open firewall port
ufw allow 51820/udp

# 5. Start WireGuard
systemctl enable --now wg-quick@wg0

# Check status
wg show
\`\`\`

## Client Setup

\`\`\`bash
# 1. Generate client keys
wg genkey | tee client_private.key | wg pubkey > client_public.key

# 2. Create client config
cat > /etc/wireguard/wg0.conf << EOF
[Interface]
Address = 10.10.0.2/24
PrivateKey = $(cat client_private.key)
DNS = 1.1.1.1

[Peer]
PublicKey = <SERVER_PUBLIC_KEY>
Endpoint = server-ip:51820
AllowedIPs = 0.0.0.0/0       # Route ALL traffic through VPN
                               # or: 10.10.0.0/24 for split tunnel
PersistentKeepalive = 25       # Keep NAT alive
EOF

# 3. Connect
wg-quick up wg0

# 4. Verify
wg show
curl ifconfig.me                # Should show server's IP
\`\`\`

## WireGuard Management

\`\`\`bash
# Check tunnel status
wg show
wg show wg0 latest-handshakes

# Add a peer on the fly (no restart)
wg set wg0 peer <PUBLIC_KEY> allowed-ips 10.10.0.3/32

# Remove a peer
wg set wg0 peer <PUBLIC_KEY> remove

# Check traffic stats
wg show wg0 transfer

# Restart VPN
wg-quick down wg0
wg-quick up wg0
\`\`\`

## Network Namespaces (Container Networking)

\`\`\`bash
# Create a new network namespace
ip netns add myns

# List namespaces
ip netns list

# Run a command in the namespace
ip netns exec myns ip addr show
ip netns exec myns bash         # Shell in isolated network

# Create a veth pair (virtual ethernet cable)
ip link add veth0 type veth peer name veth1

# Move one end to namespace
ip link set veth1 netns myns

# Configure both ends
ip addr add 192.168.99.1/24 dev veth0
ip link set veth0 up
ip netns exec myns ip addr add 192.168.99.2/24 dev veth1
ip netns exec myns ip link set veth1 up

# Ping across namespaces
ip netns exec myns ping 192.168.99.1

# Delete namespace
ip netns del myns
\`\`\`
`,
          interviewQuestions: [
            {
              question: "A server can't reach an external endpoint. Walk me through your network troubleshooting process.",
              difficulty: "mid" as const,
              answer: `**Systematic bottom-up approach:**

**1. Is there a network interface?**
\`\`\`bash
ip link show          # interfaces and UP/DOWN state
ip addr show          # IP addresses assigned
\`\`\`

**2. Is the route correct?**
\`\`\`bash
ip route show
# default via 10.0.0.1 dev eth0  ← default gateway
# If no default route → packets don't know where to go

# Test gateway reachability:
ping 10.0.0.1         # can we reach the gateway?
\`\`\`

**3. Is DNS working?**
\`\`\`bash
dig api.example.com              # full DNS lookup
dig @8.8.8.8 api.example.com    # bypass local resolver (bypass DNS issue)
cat /etc/resolv.conf             # check configured nameservers
\`\`\`

**4. Is the port reachable?**
\`\`\`bash
nc -zv api.example.com 443        # TCP connect test
curl -v https://api.example.com   # full HTTP test with verbose
\`\`\`

**5. Is there a firewall?**
\`\`\`bash
iptables -L -n              # check local iptables rules
# On AWS: check security group outbound rules
# On GCP: check VPC firewall egress rules
\`\`\`

**6. Packet tracing:**
\`\`\`bash
traceroute api.example.com    # where does it stop?
# * * *  → packet is being dropped at that hop

mtr api.example.com           # real-time traceroute with packet loss per hop
\`\`\`

**7. Capture actual traffic:**
\`\`\`bash
tcpdump -n -i eth0 host api.example.com and port 443
# See if SYN packets go out and if SYN-ACK comes back
# No SYN-ACK = firewall/routing problem on the remote side
\`\`\``,
            },
            {
              question: "Explain TCP's three-way handshake and why TIME_WAIT exists.",
              difficulty: "senior" as const,
              answer: `**Three-way handshake establishes connection:**
\`\`\`
Client                    Server
  │─── SYN (seq=x) ──────→│   Client wants to connect
  │←── SYN-ACK (seq=y, ack=x+1) ─│   Server acknowledges, sends its own seq
  │─── ACK (ack=y+1) ─────→│   Client acknowledges server's seq
  │═══════ DATA ═══════════│   Connection established, data flows
\`\`\`

**Four-way teardown (TCP close):**
\`\`\`
Initiator                  Receiver
  │─── FIN ───────────────→│   "I'm done sending"
  │←── ACK ────────────────│   "Got it"
  │←── FIN ────────────────│   "I'm done too"
  │─── ACK ───────────────→│   "Got it"
  │        (TIME_WAIT)      │
\`\`\`

**Why TIME_WAIT exists:**
The initiator (usually the client, or the side that calls \`close()\` first) enters TIME_WAIT for 2×MSL (Maximum Segment Lifetime, typically 60s = 2 minutes total).

**Reason 1 — Ensure final ACK is received:**
If the last ACK (client→server) is lost, the server will retransmit its FIN. The client in TIME_WAIT can re-send the ACK. Without TIME_WAIT, the client's socket is gone and it would send RST, confusing the server.

**Reason 2 — Prevent old packets from confusing new connections:**
If you immediately open a new connection on the same port with same source/dest, delayed packets from the old connection could arrive and be interpreted as data in the new connection.

**TIME_WAIT problems at scale:**
\`\`\`bash
# High-traffic servers can exhaust port range:
ss -s | grep TIME-WAIT    # count TIME_WAIT connections
ss -tan | grep TIME-WAIT | wc -l

# Solutions:
# 1. Enable SO_REUSEADDR (allows port reuse after TIME_WAIT)
# 2. Load balancer in front (LB handles connections, backend uses HTTP/1.1 keep-alive)
# 3. Reduce TIME_WAIT duration (risky):
sysctl net.ipv4.tcp_fin_timeout=30  # 30s instead of 60s
\`\`\``,
            },
          ],
        },
      ],
    },
  ],
};
