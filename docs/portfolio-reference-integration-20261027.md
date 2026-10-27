# Portfolio reference integration — 2026-10-27

User request: redesign LEE-Kyungjae.github.io using ocean-atlas-scroll, benchmark zaeze.com, and download/reference brain-workspace-demo.

## References and implementation

- `LEE-Kyungjae/ocean-atlas-scroll`: inspected index.html/aligned.js and timeline/camera composition. Adapted sticky viewport, scroll normalization, smoothstep pacing, opacity transition and composition shift; no ocean media or sample slogans copied.
- `https://zaeze.com/`: inspected live page and screenshot. Applied compact header, generous light surface, visual identity focus, numbered project rail and two-column project overview.
- `LEE-Kyungjae/brain-workspace-demo`: cloned to `/Users/ze/work/brain-workspace-demo`; read REFERENCE.md and model setup/camera/drag behavior. Reused original unmodified brain.glb, ivory material and category visibility. Implemented portfolio-specific Three.js scene, selectable project nodes, eased camera orbit, horizontal drag, and projected labels.
- Reference repositories remain unchanged. No new promotional copy; existing project descriptions, evidence and limitations are reused. Language routes, services, legal and contact routes remain available.

## Assets

Original model: `assets/brain/brain.glb`, copied byte-for-byte from reference. Full upstream attribution and CC BY-SA 4.0 geometry terms: `assets/brain/MODEL-LICENSE.txt`; public footer links that file. Asset origin: Brain Project (https://github.com/itayinbarr/brainproject), Z-Anatomy, BodyParts3D/DBCLS and the additional atlas sources listed in the license. Materials and visibility are runtime presentation only.

Build prepares model and npm Three.js Draco decoder under public/assets. No CDN runtime dependency. Model is 4.4 MB; Three.js is dynamically imported. Offscreen/hidden page rendering pauses; pixel ratio capped at 1.5. WebGL failure preserves project links and static cards. Motion reduction removes sticky travel; project rail then navigates directly to corresponding content.

## Scope and verification

HomePage callers: root and /en. GitNexus impact attempted but this repository is not indexed; direct import tracing used. Existing untracked privacy draft untouched. No portfolio deployment or commit requested.

Verification evidence: `output/playwright/`. Static export, desktop/mobile render, selection, drag, reduced-motion and route checks recorded there.

Final verification: static export PASS; 17 interaction/route checks PASS; 3D failure fallback and keyboard selection PASS. 19 checks total. Desktop and 320/390/430 px frames visually reviewed. Preview: http://localhost:3149/. Not deployed.

## 2026-10-27 project card correction

User requested imagegen game key art for Palamedes and Gahyeon, full-bleed cards, left title/right illustration, and live particles/effects. Replaced the two-column logo panels with stacked wide image cards. Existing project descriptions/evidence/limits remain below each image. On narrow screens titles sit at lower left with the character's face above/right.

Built-in image_gen produced both images; prompt set and reference origin in `assets/projects/keyart-20261027/provenance.json`. Palamedes uses a conceptual strategist with a celestial instrument, not a newly established product mascot. Gahyeon references the live zaeze.com character illustration, retaining dark/teal hair, star earrings and cream/teal jacket. Original PNGs preserved in `output/imagegen/portfolio-cards-20261027/`; runtime WebPs in `assets/projects/keyart-20261027/`. selectedBy: agent; selected for right-weighted composition, left title space and distinct amber/cyan atmospheres.

Effects: 22 deterministic CSS particles per card, warm moving light for Palamedes, cyan glow and star-shaped particles for Gahyeon. IntersectionObserver/visibility state pauses effects when not visible; both OS reduced-motion and site motion toggle stop effects. Pointer events remain on the project link.

Validation: static export PASS; 22 checks PASS (image load/cover, actual particle transforms, source links/keyboard focus, title bounds and overflow at 320/390/430px, reduced motion, offscreen pause, no runtime exceptions). Evidence: `output/playwright/keyart-result.json` and `keyart-*.png`. Local preview only; not deployed.

## Name display correction

User decision: display 이경재, not Kyungjae Lee. Applied to header, main hero and footer on both home language routes. GitHub account URLs retain their actual identifiers.

## Repository-backed engineering section

User requested evidence-based strengths and a substantially developed illustrated diagram. See `docs/developer-strengths-evidence-20261027.md` for analysis, sources, limitations and verification. Replaced Backend/Agents/Operations with a Korean capability overview and four interactive stages. Built-in imagegen artwork, accessible DOM controls, animated SVG paths and pinned public source links are integrated. No deployment.

## Layered engineering scene and generated animation (2026-10-27)

User correction: artwork and interaction must read as one scene. Separate the background and objects. Follow-up explicitly requests generated sequential energy frames, moving attachments, clockwise orbits and energy condensation.

- Replaced the flattened engineering artwork and detached hotspot/tab UI with an empty environment plate and four independently generated RGBA device images. Device artwork itself is the keyboard-accessible tab control.
- Generated three 4×4 VFX atlases (16 frames each): transfer, condensation and runtime circulation. Original PNGs and the rejected orbital atlas remain in `output/imagegen/engineering-vfx-20261027/`. Shipped WebP files and exact prompts are in `assets/projects/engineering-20261027/vfx/`.
- Rejected orbital atlas because the generated satellites and ring geometry drifted between frames. A separately generated top-down ring rotates clockwise in a fixed CSS perspective plane instead. This is layered 2D animation, not a simulated 3D machine.
- All devices share a 12-second charge/transfer cycle; selecting a device restarts the energy sequence from that device. The perspective background, artwork, contact light, projected ring and energy sprites have separate responsibilities.
- Transfer paths are measured from actual device positions on resize, including the mobile 2×2 layout. Frame animations pause offscreen and when the document is hidden. Reduced motion retains selectable devices and evidence while disabling VFX movement.
- Existing evidence links and the explicit Gahyeon two-boundary-violations limitation remain. No new promotional UI copy was added.
- Validation: production static export; actual browser keyboard/click selection, desktop and 320/390/430px layouts, generated frame progression, independent rotor motion, sprite loading, reduced motion and runtime errors. Evidence: `output/playwright/engineering-vfx-qa.log`, four timed scene frames and desktop/mobile renders.
- This is a local preview update; no deployment or commit performed.

### Focus-only energy correction

User correction: energy must travel only while focused; the previous travel was unnatural, and the recovery rotor appeared broken.

- Removed the automatic four-route loop. Mouse hover and keyboard focus activate one source; leaving focus removes the packet. Touch activates a source and an outside tap dismisses it. Initial state has no transfer.
- Paths now connect measured device-core sockets, not guessed points under their bases. Devices stay stationary so effects remain attached. Packet core is anchored at its actual sprite location (68% x), reduced to 64px / 48px, and eases into/out of travel. Path length determines the cycle duration (desktop short routes 3.6s, long recovery return 10s). A destination pulse absorbs the packet.
- The original rotor WebP decoded successfully; a missing-image failure was not reproduced locally. Its rotating bounds did exceed the mobile scene in some orientations. Replaced its runtime derivative with a versioned PNG from the same original, removed 3D transform compositing in favor of a fixed 2D elliptical projection, reduced its bounds, and eagerly load/decode it.
- Static build and 34 browser checks passed, including actual touch-context taps, initial idle, focus exit, all four sources, keyboard focus, rotor decode/rotation, 320/390/768px bounds and reduced motion. Final evidence: `output/playwright/engineering-focus-qa.log`. A first validation navigation encountered transient local-server connection resets for JS chunks; a fresh successful navigation completed without runtime errors.

### Incoming energy follows focus history

User correction supersedes outgoing focus behavior: the focused device receives energy at its center from the previously focused device. Previous means actual interaction history, never the device to its left or a fixed graph predecessor.

- Record the last non-null mouse/keyboard/touch focus. Preserve history across pointer gaps; first-ever focus has no fabricated origin.
- Measure all device core sockets and construct all ordered source/destination pairs. Energy runs from the historical source to the current focus, including right-to-left, nonadjacent and mobile row-changing transitions.
- Play one transfer per focus transition, with receiving pulse centered on the current device. Revisiting the same device without another device in between does not emit a self-transfer.
- Existing offscreen/reduced-motion handling and evidence copy remain. Browser regression covers all 12 ordered pairs on desktop and mobile, endpoint-to-socket alignment, keyboard jumps and real touch history.

Validation result: 55 browser assertions passed for incoming history, including all ordered pairs at 1440px and 390px. Reverse transfer (recovery → execution boundary) was rendered at its intermediate frame and inspected. The old preview server intermittently reset asset/chunk connections; a new HTTP/1.1 preview with no-store responses and a larger connection queue is running at `http://127.0.0.1:3150/`. New-origin verification had no runtime errors. No deployment performed.

### Continuous mechanisms, explicit activation and rapid retargeting

Latest user direction supersedes focus-triggered activation. All four mechanisms animate at rest. Hover/navigation do not brighten them; click/tap or native keyboard button activation selects the device. Selection persists after pointer exit.

Replaced restarted CSS path playback with one persistent rAF particle. Each new activation updates its target while retaining position, velocity, heading and integration clock. Acceleration/speed limits and damped arrival make rapid redirects continuous. In-flight location is preserved instead of restarting at the previous device center; when idle the last activated device remains the source. Receiver pulse fires only on arrival at the final target.

Browser verification includes all four idle animations, hover invariance, explicit activation, eight rapid targets with measured position increments/no jumps/no disappearance, continued movement during retarget, final center arrival, reduced motion, mobile bounds, and a real touch sequence 3→0→2→1. A first test exposed a per-retarget clock reset; the clock now persists and the final samples continued moving on every retarget.

### Reader-oriented copy cleanup

User explicitly rejected middle-dot lists, rhetorical titles, duplicated information, excessive explanations and text that ignores the audience. Removed the slogan-style engineering title, intro pitch, three summary tiles, scene meta caption and duplicate device tags. Shortened implementation cases to concrete code behavior and kept source links plus the current two-violation limitation.

Project cards now show purpose, existing development status and GitHub. The hero uses brief identifiers instead of repeating card paragraphs. Removed redundant evidence accordions, repeated card names, decorative location text and unused slogan copy. Metadata now describes the actual projects. Revised Korean source copy is shared as a fallback on the existing English route; this is not a completed translation pass.

### Floating islands and gold circuits
User superseded electric lightning with right-angle floor circuits. New scene uses four separate transparent imagegen island bases and a blue sunlit cloud plate; sources and prompts recorded under `assets/projects/engineering-20261027/sky/provenance.json`, originals retained under `output/imagegen/engineering-sky-20261027/`. Selected by agent for compatible light direction, independent silhouettes and visible mounting surfaces.

EngineeringPractice now sequences floor transfer, three building-circuit fills and delayed activation. Rapid retarget starts at the live packet location; destination socket is measured during floating. No lightning DOM or impact sprite is rendered. The initial click charges the selected island locally because no prior island exists. No new visible copy added. Scope is shared homepage component on Korean and English routes; GitNexus impact could not resolve this unindexed portfolio repository, so component imports were checked manually.

Validation: production export; `output/playwright/sky-circuit-qa.cjs` verifies loaded islands, absent lightning, orthogonal transfer, previous source, retarget continuity, delayed activation, completed building traces, mobile bounds and browser errors. Desktop/mobile screenshots visually inspected. No deployment performed.

### Latest correction: ground-local spread / gather
The user rejected the cross-island transfer and building-climbing traces. Both renderers and the travel RAF were removed. Local ground paths now use opposite dash directions for source spreading and destination gathering. An oblique SVG transform follows the top plane and an explicit per-island clip keeps the paths inside the ground; the structure occludes the circuit center. Building size is 70% of the prior width. Latest-click timer cleanup prevents stale activation. No new UI strings.
Validation is now `output/playwright/local-floor-qa.cjs`; the older cross-island QA documents a superseded implementation. Desktop and mobile rendered bounds inspected, production build and diff whitespace checks run.

### Cloud drift and circuit density
Further user-requested reduction uses 58% width with centered footprints. 24 traces per island remain inside the same top-plane mask, with non-scaling strokes for mobile legibility. New transparent cloud art is saved in `sky/clouds.webp`; original, prompt and agent-selection rationale retained in `sky/clouds-provenance.json` and `output/imagegen/engineering-sky-20261027/clouds.png`. Two repeating layers use softened tile edges, different drift speeds, and offscreen/reduced-motion controls. QA: `output/playwright/clouds-density-qa.cjs` checks local spread/gather, latest selection, mobile overflow, trace count, running clouds and reduced-motion handling.

### Layered project artwork and pointer effects
ProjectArtwork now uses separate generated background/transparent subject layers, perspective depth and scroll camera movement from first entry. Two particle planes provide 48 sparks per desktop card with smaller mobile counts. Original art and all extraction prompts/candidates remain archived under `output/imagegen/project-layers-20261027` and `assets/projects/keyart-20261027/layers/provenance.json`. Gahyeon's corrected five-digit hand was enlarged for visual inspection; superseded subject extraction was not integrated. No new visible strings.

PointerEffects uses a passive pointer-event canvas for click fragments and continuous drag trails, with bounded history, pointer-cancel cleanup and no idle RAF. Custom cursor uses a native SVG cursor with a defined hotspot, so it stays aligned without JS lag. Card drags suppress accidental navigation; keyboard and normal link clicks remain native.

Validation: production build, whitespace diff check, `output/playwright/project-layer-qa.cjs` (20 checks: entry activation, changing scroll progress, loaded registered layers, particle playback, click emission, continuous drag, no drag navigation, trail expiry, custom cursor, normal click, mobile overflow, reduced motion, no browser errors). Both desktop/mobile card renders and hand detail visually inspected. This follow-up is local; no new deployment performed.

### Internal project introduction pages
Added static `/projects/palamedes/` and `/projects/gahyeon/` routes. Home artwork links now enter these pages; GitHub remains explicit in the introduction header and source evidence. Shared hero preserves the separated art, first-entry scramble, scroll camera and particles. Each page has three keyboard-selectable implementation topics with corresponding artwork, factual explanation, existing verification limitations and pinned source references. New explanatory copy is authorized by the user's introduction-page request and grounded in `developer-strengths-evidence-20261027.md`. No unrelated homepage behavior changed.

Validation: static export includes both routes; `output/playwright/project-intro-qa.cjs` passed 29 checks covering home-card navigation, single h1, all six topic selections/art/source links, arrow-key navigation, mobile width, project switch links, return navigation and browser errors. Desktop/mobile rendered layouts inspected; animated orbit overflow corrected. Local preview only, no deployment of this follow-up.

### Full follow-up QA, 2026-10-27
142 assertions passed across introduction navigation/tabs, island focus, responsive widths (320/390/768/1440), Korean/English home routes, card entry/scroll/particles, one-shot codename reveals, brain leaders, keyboard controls, manual/reduced motion, resource loading and browser errors. Touch swipe/tap checked with Chromium mobile emulation and CDP touch input; not a physical-device certification. Pointer effects additionally checked with a controlled clock because shared-host load made wall-clock particle sampling unreliable; no frame-rate claim.

Fixed one confirmed defect: the manual motion toggle failed to stop the project orbit pseudo-element because it was nested inside `:is()`. Explicit selector fixes both introduction pages; regression assertion included. Static export and diff whitespace validation pass. Detailed report: `output/playwright/portfolio-qa-20261027.json`. This QA covers the current local worktree, not the older published deployment.
