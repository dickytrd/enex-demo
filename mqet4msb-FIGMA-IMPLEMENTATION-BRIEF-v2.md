# Figma MCP Implementation Brief (v2 — refined)

## Context

```
MCP Server: http://127.0.0.1:3845/mcp
Framework: Lumos
```

## Task

Implement the Figma design EXACTLY. Pixel-perfect fidelity. No improvisation. No invented elements. No silent simplification.

---

## References (read first, do not duplicate)

- `figma-mcp-protocol-v2.md` — all MCP procedures (pre-session restart, post-fetch validation, error handling)
- `SKILL.md` — Lumos conventions (units, class naming, responsive behavior, anti-patterns)

This brief = WHAT to build. SKILL.md = HOW to write it. Protocol = HOW to fetch data. Follow them; do not restate their rules here.

---

## Phase 1 — Setup (once per session)

1. Run pre-session steps from `figma-mcp-protocol-v2.md` (Step 0): restart MCP server, verify health, run pre-fetch probe
2. From the root node, identify the section list (top-level frames) — do NOT fetch the full design at once

---

## Phase 2 — Section-by-section loop (the core)

For each section, in this exact order:

1. **Fetch** — `get_design_context(sectionNode)` + `get_screenshot(sectionNode)`. The response is the source of truth for this section.

2. **Validate** (per `figma-mcp-protocol-v2.md` Step 2.5) — content non-empty, image URLs HEAD-probe 200, metadata count sensible. If anything fails → restart MCP and re-fetch. Do NOT proceed with partial data.

3. **Implement** — build markup + styles using values **directly from the MCP response**:
   - Use resolved values from `get_variable_defs` for colors/spacing/typography tokens
   - Use exact pixel/unit values from `get_design_context` (no rounding, no manual conversion arithmetic)
   - For unit handling and class conventions, follow SKILL.md (Lumos = rem-based)

4. **Self-report** — produce the report in the Phase 3 format below

5. **Proceed** to next section only after self-report is complete and no blockers exist

---

## Phase 3 — Self-report format (per section)

After implementing each section, output:

```
## Section: [name] (node-id)

Element count: [code: N] vs [screenshot: N] — match: yes/no

Values applied (only non-trivial / new tokens):
  property → value [MCP source path]
  e.g. font-size → 70px [style.fontSize]
  e.g. color → #264424 [fills[0].color via get_variable_defs]
  e.g. padding → 47px 24px [paddingTop/Right/Bottom/Left]

Images:
  filename → status (loaded / 404 / missing)

Ambiguities: [list each unclear case, or "none"]

Blockers: [list anything preventing completion, or "none"]
```

**If element count mismatches, any image failed, or any blocker exists → STOP. Surface to user. Do NOT proceed. Do NOT substitute.**

> **Honest scope of verification:** an LLM cannot do visual pixel overlay or image diffing. What an LLM CAN do honestly: count elements, pair code values to MCP source paths, check image load status. Visual diff is the human's job at checkpoint time — don't fake it here.

---

## ASK protocol (mandatory stops)

Stop and ask the user if ANY of these occurs:

- MCP returns empty, partial, or contradictory data after a restart
- An image asset fails to retrieve
- The same value differs across Figma frames without clear reason
- A behavior is implied but not explicitly designed (hover state, transition, responsive variant)
- You are about to substitute, paraphrase, summarize, or fill in any gap

**Never substitute. Never invent. Never silently simplify.**

---

## Output structure

- All code must be contained within a single HTML document, with styles in <style> and scripts in <script>.
- /components/navbar.html and /components/footer.html must be implemented as single-source partials, referenced across pages (not duplicated). Each component should include its own <style> and <script> blocks so that the navbar and footer have independent styling and JavaScript logic.
- Navbar: `position: fixed`, floating per Figma insets, high z-index, mobile collapses to hamburger menu with proper ARIA
- Unit and class conventions per SKILL.md

---

## Forbidden

- Redesign, re-arrange, or simplify the layout
- Round, approximate, or "clean up" any Figma value
- Manually recalculate colors, letter-spacing, or other unit conversions — use MCP-provided values
- Substitute images, copy, or icons not present in Figma
- Skip elements or treat complex components as optional
- Add elements absent from the Figma source
- Mark verification items complete without actually performing them
