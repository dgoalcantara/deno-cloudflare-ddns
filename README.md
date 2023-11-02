# Update Cloudflare dynamic DNS (DDNS)

A small Deno script to update your Cloudflare DNS subdomain A-records dynamically.

The script will fetch your public IP Adress from ipify.org and update the subdomain Record to point to that address.

This script is compatible with `deno compile` which will compile the script into a self-contained executable.

```ts
// Edit the following lines to configure the script
const AUTH = "YOUR_AUTH_KEY"; // Bearer token
const ZONE = "YOUR_DNS_ZONE";
const SUBDOMAIN = "login";
```