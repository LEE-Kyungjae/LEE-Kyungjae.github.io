# Portfolio room — 2026-10-27

## User decisions
- Keep the existing brain model, project artwork, floating islands and effects.
- Custom avatar; the suggestion to base it on Jaejae was explicitly withdrawn.
- First scene is a fullscreen world. Header, footer and lower content stay hidden, scrolling locked.
- Latest correction: clicking the avatar continuously zooms in and makes the same mesh transparent to reveal the brain. No blackout or scene cut on this step. Fade out/in occurs only when a project is selected, around unlocking and scrolling the content.
- Select a project from the brain to unlock and scroll to the existing project content. Return to brain hides and locks the lower page again.
- Crayon Clickme with a curled tail; a short introduction card on the right, stacked on narrow screens.
- Archify architecture visualizations inside project introduction pages.

## Implementation
RoomExperience owns the camera, movement bounds, transition state and retained anatomical model. RoomAvatar creates the same articulated figure for both modes. Walking supports ground clicks, keyboard and four touch buttons. Movement uses delta time; no animation update while offscreen. Reduced-motion skips walking swings and camera travel. The page keeps OS and manual motion controls.

The original BrainScene component is retained, as are both key-art originals, alpha layers, particle effects, corrected Gahyeon fingers and all engineering island assets. Public files come from assets via prepare-public.

Imagegen originals, optimized derivatives and prompts: assets/projects/room-20261027/provenance.json. Selected by agent; not recorded as user artwork approval.

## Architecture
Archify 3.2.0 (https://github.com/tt-a1i/archify) generated standalone interactive HTML from checked repository evidence. JSON specifications and verification receipts are under assets/projects/architecture-20261027. No manual modification of the generated HTML after its provenance checks.

Palamedes diagram is deliberately scoped to gate proposal/evidence/application handling, pinned to 0d0737dc73664488b1294aac9169b1b5c86b2ea7. Local palamedes.py and palamedes_planning_brief.py have unrelated uncommitted work; none is cited. Gahyeon architecture boundary diagram is pinned to 0edd9c93d13f654b3b80f347ed6bdfae287c677c. It describes the documented structure, not a claim that all dependency checks pass; the existing 2-violation result remains visible.

Automated impact lookup was unavailable because the portfolio repository is not indexed in GitNexus. Manual review scope: HomePage, RoomExperience, RoomAvatar, ProjectIntroduction and portfolio.css. Deployment is not part of this task.

## Character direction correction
The procedural human figure was rejected for insufficient character design. Latest user reference: Fall Guys-like compact bean body with short limbs and a simple expressive face. New custom concept at assets/projects/avatar-concepts-20261027/bean-v1.png is a design image only, not a 3D asset or user-approved final artwork. Keep existing prototype solely for interaction validation until a proper mesh replaces it.

## Local QA
Production build passed. 30 desktop/mobile assertions passed in output/playwright/room-qa.log: fullscreen lock, walking, brain reveal, project selection/unlock, target scrolling, retained islands, return flow, both Archify embeds and deep links. No browser errors in that run. Tests cover the prototype human model, not the new bean concept or physical mobile hardware. Not deployed.

## Skinned bean character — integrated 2026-10-27
The user extended the direction to Human Fall Flat-like softness and loose movement. The rejected primitive human constructor is replaced by an original Blender-authored GLB, `assets/projects/avatar-model-20261027/avatar.glb`. Source: `scripts/avatar/build_avatar.py` and `avatar.blend`. The figure has fused body/feet, curved face panel, tailored jacket/collar, mitten hands and seven weighted bones. Movement uses an authored damped gait, not a ragdoll physics solver.

First rendered revision had excessive normal-map grain and a pocket penetrating the jacket; both were corrected before delivery. Revision 1 GLB is retained under output/avatar-20261027. Native Blender app startup stalled; official bpy 5.2.3 in an isolated output venv produced the asset. CPU studio rendering was stopped after export; visual acceptance used the real Three.js website renderer. System security settings and remote media services were not changed.

Production build passed; 26 assertions passed in output/avatar-20261027/qa.json. Desktop1440 and mobile390 render inspections cover room, walking and brain reveal; project fade, return and reduced motion passed. Existing artwork, project introduction pages and islands are preserved. Not deployed.

## Character identity correction — 2026-10-27

User clarified that Fall Guys / Human Fall Flat were proportion and softness references, not a character identity to copy. Preserve the current compact body, short limbs and teal / ivory palette; remove the full pale oval faceplate and vertical pill-eye combination. Revision 3 uses individual rounded eye whites with pupils and upper lids, a small sculpted nose, a raised brow and a restrained asymmetric smile. Existing jacket and body proportions remain. This is an agent-selected refinement, not recorded as user approval. Revision 2 source, GLB and provenance are archived in `output/avatar-20261027/v2-archive/`. Runtime, brain reveal and project navigation are unchanged.

Revision 3 validation: desktop/mobile room and brain screenshots inspected; 26 checks passed (`output/avatar-20261027/qa-v3.json`). First fixed-delay morph assertion failed; subsequent live state was 1.000, and waiting for that endpoint passed both sizes. No runtime or UI copy changes. Local public/out GLB synchronized; not deployed.

## Forehead approach, selected-card navigation and space — 2026-10-27

User correction: existing zoom did not feel like entering the forehead. Brain project selection must scroll to one selected card, with only a short description below; the card opens the interactive detail portfolio. Provide an explicit return-up button. Brain particles reference https://vincentgarreau.com/particles.js/ and https://jnicol.github.io/particleground/ . Outside the physical room is space.

Implementation: 2.2-second staged camera path aligns with Y=3.38 forehead, then approaches to Z offset 3.05 desktop / 3.65 mobile. Avatar remains opaque through 52% of progress; brain reveal occurs afterward. Background is a self-contained canvas star field and drifting proximity-linked particle network, with pointer displacement, lower mobile density, reduced motion, and offscreen pause. No remote runtime library or generated bitmap is required for this effect.

Home renders exactly one selected article; quintic eased scroll transitions are reversible through a fixed `뇌로 돌아가기` button. Only existing project description text is reused. Layered key art, particles, scramble titles, diagrams and implementation chapter interactions remain on the detail routes. Existing engineering islands now have a `/projects/backend/` detail route. Details link back to the same selection via hash; direct hash entry initializes the room in brain mode. Earlier full-list HomePage source is retained under `output/room-navigation-20261027/` along with the previous camera and CSS.

GitNexus impact calls for HomePage, RoomExperience and ProjectIntroduction returned repository unindexed; manually inspected direct imports, callback flow and static detail routes. No names or unsolicited promotional UI text added. Production build passed; rendered QA follows. Not deployed.

Rendered QA found a same-document hash-navigation defect: HomePage initially read the project hash only on mount. Added hashchange synchronization to both the selected card and brain state. Mobile Gahyeon label moved above the cortex so all three labels sit outside the brain silhouette. Rebuilt successfully after these corrections. An immediate assertion on the existing Backend island activation was premature (its energy animation completes after 1250ms); the harness now waits for the actual active state rather than treating a click as completion.

Final validation: production build passed; 50/50 checks passed at 1440x960 and 390x844 (`output/room-navigation-20261027/qa.json`), covering opaque forehead approach before reveal, close camera, one-card selection for all three projects, smooth-scroll endpoint and return, short description only, detail links, same-selection return, chapters/architecture, Backend island activation, reduced motion and zero browser errors. Actual room, brain and selected-card screenshots reviewed. Mobile hardware performance is not measured; local host was heavily loaded during parts of QA. No deployment performed.

Late visual check: a desktop approach screenshot captured a blank WebGL layer while the canvas inset was animating. The mobile approach frame correctly showed an opaque face. ResizeObserver previously resized/cleared the canvas and waited for the next animation callback to render. It now renders immediately after setting the new canvas dimensions and camera aspect. The 50 functional checks alone did not catch this visual issue; a targeted paused-time transition render is added before final handoff.

Resize correction validation: rebuilt successfully. Four targeted transition checks passed at desktop/mobile sizes. Paused-time captures at ~40% progress show the opaque face enlarged toward the forehead, with no empty WebGL layer; final brain reveal also passes. Reviewed `forehead-1440.png` and `forehead-390.png`. Preview returned to desktop entry room.

## Name badge and deployment — 2026-10-27
User requested a character name badge while deployment was being prepared. Added an ivory / teal chest badge reading `이경재`, attached to the torso bone in its rest pose. It uses the same transparency/material disposal lifecycle as the avatar and follows the walking motion. No unrelated copy added. Deployment scope includes the previously verified room, navigation, project details and asset changes; unrelated OpenSquare privacy draft remains local.
