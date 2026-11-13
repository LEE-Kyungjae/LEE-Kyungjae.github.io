---
version: "0.2"
name: "Room → Brain → Project stories"
description: "Portfolio as a small 3D workroom in space: enter the character's brain to reach project stories, with a plain list for direct access."
colors:
  space: "#07121e"          # page and transition background (room-project-fade)
  space-panel: "#091624"    # brain label background
  paper: "#f5f2e4"          # keycap/paper surfaces (movement keys, entry button)
  paper-shadow: "#828f88"   # keycap bottom edge
  room-ink: "#274b49"       # text on paper surfaces
  room-mint: "#65b9a7"      # chair ring and room accents
  catalog-ink: "#111819"    # project list and project story pages
  field-ai: "#c7a5ff"       # brainFields.ai
  field-tools: "#78d9bc"    # brainFields.tools
  field-web: "#7cc7ff"      # brainFields.web
  field-backend: "#f3bd76"  # brainFields.backend
  focus: "#b77837"          # room focus ring
typography:
  hand:
    fontFamily: "PortfolioHand (Nanum Pen Script), cursive"
    use: "intro card name, chair hint — handwritten room voice only"
  body:
    fontFamily: "Arial, 'Apple SD Gothic Neo', sans-serif"
  keycap:
    fontFamily: "ui-monospace, monospace"
    use: "WASD/SPACE movement keys"
---

## Overview

The home page is a small isometric workroom floating in space (Three.js). An astronaut avatar stands in the room next to a desk, a constellation frame and a bear. The intro card on the right is a paper card with tape, hand lettering and bear stickers. Entering the character's head (avatar click, "Click me", or the "프로젝트 보기" button) moves the camera into the helmet, where a 3D brain shows every project as a labeled node. Selecting a node dives into that project's story page. The chair opens a small playable game on the room computer.

Flow: room (`/`) → brain (`/#brain`) → project story (`/projects/<id>/`) → single ← back to `/#brain`. The plain list (`/projects/`) is reachable from the room and the brain for visitors who skip 3D.

## Colors

The room is warm paper and mint against dark space. The brain view is dark space with project labels colored by field (`brainFields` in `app/components/brainProjects.ts`): AI·판단 violet, 개발·운영 도구 mint, 인터랙티브 웹 blue, 백엔드 amber. Field colors identify categories, not decoration. Project list and story pages use the dark catalog ink with muted light text.

## Typography

PortfolioHand (Nanum Pen Script) is reserved for the room's handwritten voice. Body text stays plain Arial/Apple SD Gothic Neo. Keycaps use monospace. Korean copy keeps `word-break: keep-all`.

## Layout

- Room: canvas fills the viewport; the intro card sits right on desktop and below the room on mobile; movement keys bottom-left; project entry (primary keycap button + "목록으로 보기") top-left; motion toggle top-right.
- Brain: labels are offset from projected anchor points on the brain surface, connected by leader lines, relaxed against each other so they do not overlap, and clamped inside the viewport. Field legend top-left under the list link.
- Project story pages: representative artwork first, then product purpose, actual workflow/results, scope and status, then architecture (see `docs/project-presentation-decisions.md`). Native vertical scroll, one fixed ← to `/#brain`.

## Elevation & Depth

Depth comes from the 3D scene itself. Brain labels facing away from the camera keep full contrast and are distinguished by a dashed left edge, a softer text tone and a dimmer anchor pin, never by fading text below readable contrast. Paper surfaces use a keycap bottom shadow; dark panels use a soft blur.

## Components

- Keycap button: paper gradient, 1px light border, bottom shadow that compresses on press (movement keys, "프로젝트 보기").
- Brain label: dark panel, field-colored 3px left edge and text, ↘ affordance, min height 44px.
- Field legend: round dot buttons that filter labels by field.
- Project list item: number (brain order), field · kind, name, one-line description, stack and private-repo note. Data comes from `brainProjects`, `projectDetails`, `extraProjects` and `backendProject`; do not duplicate project copy.

## Accessibility

- Every 3D entry has a DOM equivalent: "프로젝트 보기" button, "목록으로 보기" links and the `/projects/` list.
- Interactive targets are at least 40–44px; focus rings stay visible.
- Reduced motion (system setting or the ◌ toggle) shortens camera transitions and disables ambient animation.

## Do's and Don'ts

- Do attach evidence or an explicit limit to technical claims.
- Do keep every project reachable without the 3D scene.
- Do keep generated illustrations, recorded outputs and live services distinguishable.
- Don't add GitHub statistics, technology clouds or invented metrics.
- Don't describe Palamedes as proven AGI or Gahyeon as a finished AAA character.

## Decision history

The entries below are earlier design decisions kept for provenance. Sections about floating islands, circuits and the ivory home describe a superseded home page; the current home is the room described above.

### 2026-10-27 home revision (superseded)

The home now uses an ivory surface with deep green and mint, a compact header, a scroll-driven 3D brain composition, selectable project nodes, and two-column project cards. The earlier dark editorial treatment above remains relevant to existing document pages only. Implementation and asset provenance: `docs/portfolio-reference-integration-20261027.md`.

### Copy and interaction corrections (2026-10-27, latest user decisions)

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
