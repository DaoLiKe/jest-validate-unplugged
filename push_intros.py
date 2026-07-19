#!/usr/bin/env python3
# Push ONLY the three intro markdown files to DaoLiKe/jest-validate-unplugged.
# Reads from disk (byte-exact); uses GitHub REST API with GITHUB_TOKEN.
import os, base64, json, sys, urllib.request, urllib.error
from urllib.parse import quote

TOKEN = os.environ.get("GITHUB_TOKEN")
if not TOKEN:
    print("ERROR: set GITHUB_TOKEN first", file=sys.stderr); sys.exit(1)

OWNER = "DaoLiKe"
REPO = "jest-validate-unplugged"
ROOT = os.path.dirname(os.path.abspath(__file__))
API = "https://api.github.com"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "jest-intro-push",
}


def api(method, url, data=None):
    body = json.dumps(data).encode() if data is not None else None
    req = urllib.request.Request(url, data=body, method=method)
    for k, v in HEADERS.items():
        req.add_header(k, v)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, json.loads(r.read().decode() or "{}")
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode() or "{}")
        except Exception:
            return e.code, {}


files = ["项目简介.md", "模块简介.md", "快速上手.md"]
print(f"pushing {len(files)} intro files to {OWNER}/{REPO} (branch main)...")
ok = 0
for i, name in enumerate(files, 1):
    full = os.path.join(ROOT, name)
    with open(full, "rb") as f:
        content = base64.b64encode(f.read()).decode()
    payload = {"message": f"docs: add intro {name}", "content": content, "branch": "main"}
    status, resp = api("PUT", f"{API}/repos/{OWNER}/{REPO}/contents/{quote(name)}", payload)
    if status in (200, 201):
        ok += 1
        print(f"  [{i}/{len(files)}] OK   {name}")
    elif status == 422 and "sha" in str(resp).lower():
        s2, r2 = api("GET", f"{API}/repos/{OWNER}/{REPO}/contents/{quote(name)}?ref=main")
        if s2 == 200 and "sha" in r2:
            status2, _ = api("PUT", f"{API}/repos/{OWNER}/{REPO}/contents/{name}",
                             {**payload, "sha": r2["sha"]})
            if status2 in (200, 201):
                ok += 1
                print(f"  [{i}/{len(files)}] UPD   {name}")
            else:
                print(f"  [{i}/{len(files)}] FAIL {name}: update {status2}")
        else:
            print(f"  [{i}/{len(files)}] FAIL {name}: {status} {resp}")
    else:
        print(f"  FAIL {name}: {status} {resp}")

print(f"DONE: {ok}/{len(files)} intro files pushed -> https://github.com/{OWNER}/{REPO}")
