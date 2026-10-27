---
version: "0.1"
name: "Operational Atlas"
description: "An evidence-led portfolio for systems that decide, speak, and keep running."
colors:
  ink: "#11110f"
  paper: "#f2f0e9"
  paper-muted: "#ddd9ce"
  violet: "#8069ff"
  mint: "#3ed598"
  amber: "#ffb547"
  rule: "#34342f"
typography:
  display:
    fontFamily: "Arial Narrow, Arial, sans-serif"
    fontSize: "clamp(3.8rem, 10vw, 9rem)"
    fontWeight: 700
    lineHeight: 0.84
    letterSpacing: "-0.075em"
  body:
    fontFamily: "Arial, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.6
  utility:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "0.72rem"
    lineHeight: 1.35
rounded:
  none: "0px"
  control: "999px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "24px"
  lg: "48px"
  xl: "96px"
components:
  rule:
    backgroundColor: "{colors.rule}"
    height: "1px"
  action:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
---

## Overview

Operational Atlas presents Kyungjae Lee as a builder of persistent systems, not a collector of technologies. The visual language borrows from engineering field notes: broad identifying type, explicit status, visible routes, and evidence attached to every claim.

## Colors

Ink and paper carry the shared identity. Project colors identify domains rather than decorate: violet for mission cognition, mint for Gahyeon's living runtime, and amber for remote tooling.

## Typography

The display face is compressed and loud only at thesis moments. Body copy stays plain. Monospace is reserved for state, evidence, paths, and machine-readable facts.

## Layout

The page uses a twelve-column field with hard rules. Sections change rhythm according to their job: the hero is expansive, project records are editorial, and architecture is compact and directional.

## Elevation & Depth

Depth comes from overlapping fields and color contrast, not generic card shadows or glass blur.

## Shapes

Content containers are square. Pills are reserved for controls and runtime status only.

## Components

Every project record contains a problem, a mechanism, an honest status, a primary artifact, and a source link. Architecture routes remain visible before motion begins.

## Do's and Don'ts

- Do attach evidence or an explicit limit to technical claims.
- Do use one orchestrated trace motion for system flow.
- Do keep all primary projects visible without requiring tabs.
- Don't add GitHub statistics, technology clouds, invented metrics, or decorative node maps.
- Don't describe Palamedes as proven AGI or Gahyeon as a finished AAA character.


## 2026-10-27 home revision

The home now uses an ivory surface with deep green and mint, a compact header, a scroll-driven 3D brain composition, selectable project nodes, and two-column project cards. The earlier dark editorial treatment above remains relevant to existing document pages only. Implementation and asset provenance: `docs/portfolio-reference-integration-20261027.md`.

## Copy and interaction corrections (2026-10-27, latest user decisions)

- Write for someone evaluating this developer's work: what the project does, what was implemented, and where to inspect it. Keep implementation limits where materially relevant.
- No rhetorical paired titles (e.g. “문제 정의부터 실패 복구까지”), middle-dot keyword chains, decorative English labels, generic competence claims, or repeated summaries across hero, cards and case studies.
- Use a short factual section name. Do not fill removed copy with replacement slogans, subtitles or explanatory text.
- The homepage hero offers brief project identifiers. Cards explain each project's purpose and development status. Implementation cases describe specific behavior and link to source code. Each layer has a separate job.
- Engineering devices animate at rest. Hover or keyboard navigation alone does not activate or brighten them. Click/tap/Enter/Space activates a device.
- Energy moves toward the newly activated center. A rapid subsequent activation redirects the SAME moving particle with position, velocity and clock retained; it must not restart at the previous device or pause between rapid inputs. The final clicked device receives the arrival pulse.

### 2026-10-27 floating-island circuit direction
- Each engineering structure sits on its own generated transparent rocky island. Shared slab retired. Azure sky, white cumulus, warm upper-left sun. Keep art separate for ambient floating.
- User rejected lightning entirely. Use stable orthogonal gold circuit traces from the previous island floor to the clicked island floor. Fill all three ascending building traces before energizing the building (1.05 seconds after floor arrival).
- Click selection changes content immediately; visual activation waits for the completed charge. Hover/focus alone do not activate. Retarget the light from its current position during rapid clicks. No new UI copy.

### 2026-10-27 correction: ground-local energy only (supersedes transfer direction)
- No visible energy between islands. No circuits climbing the buildings.
- Previous island: light radiates outward from the ground center. Clicked island: light gathers inward along ground circuits, then the building activates.
- Ground paths share an oblique projection, are clipped inside the top surface, and render behind the structure. Buildings reduced to 70% of their prior width, with bases kept on the island surface.

### Building placement correction
Center each building's ground-contact footprint on its island top, not the square artwork bounds. Keep the approved 70% scale. Per-artwork top offsets compensate for different footprint locations; floor circuits remain centered at (50,94) in the island frame.

### Smaller buildings, denser circuits, moving clouds
Buildings now use 58% of the island frame width (previously 70%), with footprint-center offsets recalculated per artwork. Ground paths expanded from 6 to 24 with screen-space stroke widths, preserving projected ground clipping. Two transparent imagegen cloud layers drift independently behind islands at 130/75 seconds; offscreen and reduced-motion playback are respected. No new UI copy.

### Island focus and circuit spacing
Clicking an island focuses the scene at 1.1 scale around that island. Clicking empty sky or Escape returns to the wide composition; clicking the same active island can focus again without restarting activation. Mobile uses its own two-row focus origins. Empty control layout boxes do not intercept sky clicks. Circuits reduced to 12 separate routes with spaced starts/bends, retaining local ground projection and spread/gather directions.

### Project card paper-depth and pointer interaction
- Preserve the project names and existing copy. Separate the original background from its registered character cutout; background, subject and two particle depths respond to scroll from the first visible pixel (IntersectionObserver threshold 0). No mouse-driven card tilting.
- Gahyeon hand correction: the selected foreground has one thumb plus four fingers, visually inspected at enlarged size. Earlier extraction is superseded and retained with provenance.
- Pointer: small amber native SVG cursor on fine pointers, cyan/gold click shards and a 700 ms pressed-drag ribbon. Overlays never intercept events or disable touch scrolling; dragging a card does not navigate, normal click and keyboard activation still do. Reduced motion disables camera/particles/trails; offscreen card particles pause.

### Codename reveal and brain callouts
Project card titles scramble for 800 ms once on first visibility, resolving left-to-right into the approved project name. Fixed-width title layout and stable accessible heading name; reduced-motion skips scrambling. Brain project buttons are offset labels connected to projected 3D points by elbow leader lines. Points themselves are decorative; selecting the label retains the existing project-selection behavior. Leaders update with camera rotation and responsive resize.

### Internal project introductions
Home project artwork opens `/projects/palamedes/` or `/projects/gahyeon/`, not GitHub. Each static introduction reuses layered scroll artwork, codename reveal, pointer effects and approved project/status copy. Three selectable implementation topics show artwork, concise evidence-backed explanation and a pinned source link. GitHub remains an explicit secondary link. Keep the homepage and brain behavior otherwise unchanged. New copy is within the user's explicit request for project introductions; preserve research/development limits and Gahyeon's two known dependency violations.

### QA correction — reduced motion on project introductions
The manual motion-reduction toggle must also stop pseudo-element animations. The dotted orbit remained active because its pseudo-element selector was inside `:is()`. Use an explicit `.is-calm .project-orbit:after` rule and verify computed animation state on both introduction pages. Native touch scrolling must not trigger project navigation; a deliberate tap still opens the internal introduction.
