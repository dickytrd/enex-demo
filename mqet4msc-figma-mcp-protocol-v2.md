# Figma MCP Auto-Pilot Protocol (v2)

This document governs how the agent accesses and processes data from Figma MCP completely and autonomously. **v2 adds MCP server lifecycle management** (restart, validation, stale-state mitigation) to address inconsistency issues observed in real use.

---

## Core Principle

When user provides a Figma URL via MCP, the agent MUST complete ALL data gathering steps BEFORE writing ANY code. The agent operates in **auto-pilot** mode — no confirmation needed for data access, only ask if data is genuinely unavailable.

**v2 addition:** The agent operates on the assumption that the MCP server may return stale, partial, or corrupted data. **Validation after every fetch is mandatory.** When validation fails, restart the MCP server rather than improvise.

---

## Step 0 — Pre-Session MCP Hygiene (NEW in v2, MANDATORY)

**ALWAYS perform these steps before any new build session.** Skipping this is the single biggest cause of silent fetch failures.

### 0.1 Restart MCP Server

Stale state from previous sessions (cache, broken sockets, partial responses in memory) causes ~30-50% of unexplained inconsistent outputs. Always restart before a fresh build.

```bash
# Kill existing instance (adjust to your setup)
pkill -f "figma-mcp" || true
# Wait for port release
sleep 2
# Restart server (adjust command to your install)
npx figma-developer-mcp --figma-api-key=<KEY>
# or via docker:
# docker restart figma-mcp-container
```

### 0.2 Verify Server Health

```bash
# Test SSE endpoint responds within 5 seconds
curl -N --max-time 5 "http://127.0.0.1:3845/sse" | head -5
```

Expected: `event: endpoint` line. If timeout or connection refused → the server didn't start; investigate logs before proceeding. Do NOT continue with a degraded server.

### 0.3 Pre-Fetch Probe

Before doing the real fetch, do a small probe to verify the file + node-id resolve correctly:

```json
{
  "method": "tools/call",
  "params": {
    "name": "get_metadata",
    "arguments": { "nodeId": "<root-node-id>" }
  }
}
```

If metadata returns empty, malformed, or errors → fix BEFORE attempting full fetch. Probe failures with `Invalid node ID` usually mean node format issue (dash vs colon — see Node ID Extraction).

---

## Step 1 — Connect & Discover

### 1.1 Connect to MCP Server (SSE Session)

```bash
curl -N "http://127.0.0.1:3845/sse"
# Response contains:
# event: endpoint
# data: /messages/?sessionId=<UUID>
```

### 1.2 Initialize Session

```json
POST /messages/?sessionId=<UUID>
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": { "name": "figma-agent", "version": "1.0.0" }
  }
}
```

### 1.3 List Available Tools

```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list" }
```

**Available tools in Figma Context MCP:**

| Tool | Function | Parameters |
|------|----------|------------|
| `get_design_context` | Primary data — reference code + screenshot + metadata | `nodeId`, `clientLanguages`, `clientFrameworks`, `forceCode`, `artifactType`, `taskType` |
| `get_screenshot` | Visual screenshot of node | `nodeId`, `contentsOnly` |
| `get_variable_defs` | Variable definitions (colors, fonts, spacing) | `nodeId` |
| `get_metadata` | XML structure with node IDs, positions, sizes | `nodeId` |
| `get_figjam` | For FigJam boards only | `nodeId`, `includeImagesOfNodes` |

---

## Step 2 — Fetch Complete Design Data (MANDATORY)

Execute in this order:

### 2.1 Get Screenshot (Visual Reference)

```json
{ "name": "get_screenshot", "arguments": { "nodeId": "<node-id>", "contentsOnly": false } }
```

Save to: `figma-data/screenshot.png` — **keep open as visual oracle throughout coding.**

### 2.2 Get Design Context (Primary Data)

```json
{
  "name": "get_design_context",
  "arguments": {
    "nodeId": "<node-id>",
    "clientLanguages": "html,css,javascript",
    "clientFrameworks": "vanilla",
    "forceCode": true,
    "artifactType": "WEB_PAGE_OR_APP_SCREEN",
    "taskType": "CREATE_ARTIFACT"
  }
}
```

Save to: `figma-data/design-context.json`

### 2.3 Get Variable Definitions

```json
{ "name": "get_variable_defs", "arguments": { "nodeId": "<node-id>" } }
```

Save to: `figma-data/variable-defs.json`

### 2.4 Get Metadata Structure

```json
{ "name": "get_metadata", "arguments": { "nodeId": "<node-id>" } }
```

Save to: `figma-data/metadata.json`

### 2.5 Fetch Child Nodes (Recursive, if design has many sections)

```json
{
  "name": "get_design_context",
  "arguments": {
    "nodeId": "<child-node-id>",
    "clientLanguages": "html,css,javascript",
    "clientFrameworks": "vanilla",
    "forceCode": true
  }
}
```

---

## Step 2.5 — Post-Fetch Validation (NEW in v2, MANDATORY)

**After fetching, validate BEFORE proceeding to coding.** This catches silent partial-fetch failures that are the #1 cause of "agent skipped entire sections" issues.

### Validation Checklist

1. **Design context not empty.** If `content: []` or `null` → re-fetch with `contentsOnly: false`. If still empty → restart MCP (Step 0).

2. **Metadata covers all expected sections.** Count top-level frames returned in metadata; compare against a manual count of sections visible in Figma. If counts differ → MCP returned partial data → restart MCP, re-fetch.

3. **All image URLs resolve.** For every image URL in the design-context response, do a HEAD request:
   ```bash
   curl -I --max-time 5 "<image-url>"
   ```
   Any 404 / timeout → flag, restart MCP, re-fetch. **Do NOT substitute with placeholder/stock/generated images.** Missing images must be reported to user, never silently filled.

4. **Screenshot dimensions sensible.** Width/height should match the Figma frame's actual dimensions ±10%. Wildly off = corrupted screenshot fetch.

5. **Variable defs non-empty.** If the Figma file uses variables (most modern files do) and `get_variable_defs` returns empty → restart MCP, re-fetch.

6. **Cross-check with screenshot.** Visually compare metadata structure against the screenshot. If screenshot shows 8 sections but metadata returns 5 → partial fetch → restart, re-fetch.

**If ANY validation fails:** restart MCP (Step 0) and re-fetch the failing tool call. Do NOT proceed to coding with partial or corrupted data. Partial data is the root cause of the "silent simplification" failure mode.

---

## Step 3 — Create figma-analysis.md (OPTIONAL — only if brief requires it)

**v2 note:** Empirically, mandatory intermediate analysis documents introduce lossy abstraction that degrades pixel-perfect output. The agent works most accurately directly from Figma data + screenshot, not from its own summary. **Only create this document if the active brief explicitly requires it.** Otherwise skip directly to implementation, with the screenshot as the live reference.

If required, see the template in the previous version of this protocol.

---

## MCP Server Restart Protocol (NEW in v2)

### When to Restart MCP Server

Restart triggers — perform Step 0 again when ANY of the following occurs:

- **Mandatory:** Before every new build session
- **Mandatory:** Before resuming work after the Figma file has been edited externally
- After hitting any rate limit (429)
- After any "session expired" or socket error
- When the same fetch call returns different data across retries
- When `content: []`, `null`, or empty arrays are returned for valid node-ids
- When image URLs in responses return 404 or timeout
- When generated output is missing entire sections you can see in Figma (sign of upstream partial fetch)
- After long sessions (>2 hours of active fetching) to avoid stale-state buildup
- When the agent reports unexplained partial data
- When validation (Step 2.5) fails on any check

### Restart Procedure

1. Kill the running MCP server process
2. Wait 2-3 seconds for port release
3. Restart the server
4. Run Step 0.2 (health verification)
5. Run Step 0.3 (pre-fetch probe)
6. Re-fetch from scratch — **do NOT trust any pre-restart data**, including cached responses
7. Re-run Step 2.5 (post-fetch validation)

### Stale State Indicators

Signs the MCP server has corrupted/stale state and needs immediate restart:

- Identical fetch calls returning different responses on consecutive runs
- Empty responses where you previously got full data
- Image URLs that worked yesterday returning 404 today
- Response times suddenly spiking (>10s for simple calls)
- Server crashes or hangs mid-session
- Output volume dropping significantly between fetches of similar-complexity nodes

---

## Error Handling

### Connection Errors

```
Error: ECONNREFUSED 127.0.0.1:3845
```

**Action:** MCP server not running. Run Step 0 (full restart procedure). Do NOT proceed without connection.

### Session Timeout

```
Error: Session expired or invalid
```

**Action:** Re-initialize session (Step 1.2). Max 3 retries. If still failing → restart MCP server (Step 0).

### Tool Not Found

```
Error: Tool 'xxx' not found
```

**Action:** List available tools (Step 1.3). Use closest alternative. If critical tool missing → MCP version mismatch, restart server or update.

### Empty Response

```
Response: { "content": [] } or null
```

**Action:**
1. Retry with different parameters (e.g., `contentsOnly: true`)
2. Try parent or child node
3. **If still empty → restart MCP server (Step 0) and re-fetch**
4. If empty after restart → flag to user; do NOT improvise content

### Rate Limiting

```
Error: 429 Too Many Requests
```

**Action:** Wait 5 seconds, retry with exponential backoff. Max 3 retries. **After 3 failed retries → restart MCP server** (often clears the rate-limit state).

### Invalid Node ID

```
Error: Node not found
```

**Action:**
1. Verify node-id format (replace `-` with `:`)
2. Try parent node
3. Confirm URL with user

### Image Asset Retrieval Failure

**v2 specific:** Common silent failure mode.

**Action:**
1. HEAD-probe the image URL
2. If 404 → re-fetch design-context (URL may have rotated)
3. If still failing → restart MCP, re-fetch
4. If still failing after restart → **flag to user with the specific image filename + node-id**. Do NOT substitute. Do NOT use placeholders. Do NOT generate alternatives.

---

## Node ID Extraction

From Figma URL:

```
https://www.figma.com/design/P2F0UhaVNcQVlux5JCreky/40H_CC-Dental-design?node-id=3226-502
```

Extract:
- **File Key:** `P2F0UhaVNcQVlux5JCreky`
- **Node ID:** `3226-502` → API format: `3226:502` (replace `-` with `:`)

For branch URLs:
```
https://www.figma.com/design/FILE_KEY/branch/BRANCH_KEY/...
```
Use `BRANCH_KEY` as file key.

---

## Auto-Pilot Checklist (v2)

Before writing code, ensure ALL of this is satisfied:

**Pre-Session (NEW in v2):**
- [ ] MCP server restarted before this session
- [ ] Server health verified (SSE endpoint responded)
- [ ] Pre-fetch probe successful

**Data Collection:**
- [ ] Visual screenshot saved
- [ ] Complete color palette extracted
- [ ] Complete typography scale extracted
- [ ] Spacing values extracted (section, component, element)
- [ ] Border radius values extracted
- [ ] Shadow/effect values extracted
- [ ] Layout structure documented
- [ ] Component inventory listed
- [ ] Copywriting content extracted verbatim
- [ ] Image assets identified AND URL-validated
- [ ] Responsive behavior noted

**Validation (NEW in v2):**
- [ ] Design context response non-empty
- [ ] Metadata node count matches manual Figma section count
- [ ] All image URLs HEAD-probe successful
- [ ] Screenshot dimensions match Figma frame ±10%
- [ ] Variable defs non-empty (if file uses variables)
- [ ] No `null` or `[]` content in any tool response

If any validation item fails: **restart MCP and re-fetch.** Do not proceed with partial data — partial data causes silent simplification and section skipping in the implementation phase.

---

## Additional Fetch Requirements

### Image Asset Download

- Extract all image URLs from `get_design_context` response
- **HEAD-probe each URL before downloading** to detect failures early
- Download to `figma-data/images/`
- Use descriptive filenames based on layer names
- Verify file size > 0 after download
- **NEVER substitute failed downloads with placeholders or generated images**

### Nested Component Handling

- If metadata shows deeply nested frames (>3 levels), fetch child nodes individually
- Document hierarchy
- For repeated components (cards, buttons), extract one as reference pattern

### Responsive Variants

- Check if Figma contains mobile/tablet frames (frame names containing "Mobile", "Tablet", or widths like "375", "768")
- Fetch each viewport variant separately
- Document breakpoint differences

### Pixel Verification

- Use screenshot as visual truth source throughout coding
- Cross-reference computed values against screenshot when values seem inconsistent
- Prioritize visual match over code-generated values when conflicts occur

### Data Folder Structure

```
figma-data/
  screenshot.png           ← Full page screenshot
  screenshot-mobile.png    ← Mobile variant (if exists)
  screenshot-tablet.png    ← Tablet variant (if exists)
  design-context.json      ← Primary design data
  variable-defs.json       ← Design tokens
  metadata.json            ← Structure with positions
  images/                  ← Downloaded assets
```

---

## Summary

| Phase | Action | Output |
|-------|--------|--------|
| **0 (v2)** | **Restart MCP + verify health + pre-probe** | **Clean session, validated connection** |
| 1 | SSE + Initialize + List tools | Session ID, tool list |
| 2 | get_screenshot | Visual reference |
| 2 | get_design_context | Primary data |
| 2 | get_variable_defs | Design tokens |
| 2 | get_metadata | Structure map |
| **2.5 (v2)** | **Post-fetch validation (6 checks)** | **Verified-complete data, or restart trigger** |
| 3 | (Optional) Create analysis doc | figma-analysis.md (if brief requires) |
| → | Hand off to brief for implementation | Ready for coding |

**v2 philosophy:** Pre-session hygiene + post-fetch validation closes the silent-failure window where partial/corrupted MCP data causes downstream content fabrication, section skipping, and improvisation. When in doubt → restart. The cost of restarting is small (~10 seconds); the cost of building on bad data is rebuilding the whole page.

---

*This document is read together with the active build brief as a unified workflow.*
