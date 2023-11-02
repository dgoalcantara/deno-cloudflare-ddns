// Copyright (c) 2023 Diego de Alcântara

// This software is provided 'as-is', without any express or implied
// warranty. In no event will the authors be held liable for any damages
// arising from the use of this software.

// Permission is granted to anyone to use this software for any purpose,
// including commercial applications, and to alter it and redistribute it
// freely, subject to the following restrictions:

// 1. The origin of this software must not be misrepresented; you must not
//    claim that you wrote the original software. If you use this software
//    in a product, an acknowledgment in the product documentation would be
//    appreciated but is not required.
// 2. Altered source versions must be plainly marked as such, and must not be
//    misrepresented as being the original software.
// 3. This notice may not be removed or altered from any source distribution.

const AUTH = "9FR_YfdfKzIDCueDroNct83FgLaOKzCcVsNJbpRD";
const ZONE = "5b744dc64ee89ca77d7bc75e06507f72";
const SUBDOMAIN = "login";

const r = await fetch("https://api.ipify.org");
const ip = await r.text();

console.log("Public Address:", ip);
let ipv4_regex = /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm;
if (!ipv4_regex.test(ip)) {
  console.log("%cINVALID IP ADDRESS", "color: red; font-weight: bold");
  Deno.exit(1);
}

const listDns: string =
  `https://api.cloudflare.com/client/v4/zones/${ZONE}/dns_records`;

const listDnsReq = await fetch(listDns, {
  headers: {
    Authorization: `Bearer ${AUTH}`,
  },
});

const list = await listDnsReq.json();
if (!("result" in list)) {
  throw "error";
}

const result = list.result.filter((x: object) =>
  "name" in x && (x['name'] as string).startsWith(SUBDOMAIN + ".");
);

if (result.length === 0) {
  throw "result length is 0";
}

const identifier = result[0].id;
const currentCfIp = result[0].content;

if (currentCfIp === ip) {
  console.log("%cUPDATE SKIPPED", "color: yellow; font-weight: bold");
  Deno.exit(0);
}

const updateUrl: string =
  `https://api.cloudflare.com/client/v4/zones/${ZONE}/dns_records/${identifier}`;

const updateResult = await fetch(updateUrl, {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${AUTH}`,
  },
  body: JSON.stringify({
    content: ip,
    name: SUBDOMAIN,
    proxied: false,
    type: "A",
    comment: "",
    tags: [],
    ttl: 3600,
  }),
});

if (updateResult.status === 200) {
  console.log("%cUPDATE OK", "color: green; font-weight: bold");
} else {
  console.log("%cUPDATE FAILED", "color: red; font-weight: bold");
}
