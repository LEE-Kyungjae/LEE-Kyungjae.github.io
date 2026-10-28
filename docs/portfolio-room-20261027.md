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

## Room props, TOP and portfolio reference — 2026-10-27

Added an authored Three.js computer desk, monitor, keyboard, mouse, tower and white Nagano bear plush in `RoomProps.ts`. Plush reference: https://nagano-market.jp/products/4582662958401 (reference image only; not shipped). Props inherit room fade and cleanup. Mobile room target shifts 0.8 units right so the plush fits without shrinking the avatar or altering the forehead destination. Replaced `뇌로 돌아가기` with lower-right `↑ TOP`; behavior still returns to brain, not room. Build passed, six desktop/mobile navigation checks passed with no page errors, and room/TOP rendered screenshots reviewed in output/room-props-20261027. Local changes, not deployed.

Inspected sibling `/Users/ze/work/zezestudio/company-web`, including `src/data/products.ts`, GahyeonWorld/DataGroundWorld, Immersive layout and product chapter/experience scripts. Also inspected loaded public pages https://zaeze.com/services/gahyeon/ and https://zaeze.com/services/dataground/ in browser. Gahyeon leads with character art and then separates Windows/Mac, Discord and Looking Glass use scenes; DataGround leads with real console panels and follows source setup, execution/monitoring, diagnosis/recovery. Generated concept visuals are marked separately from actual captures in the source.

Reference-informed direction for subsequent portfolio detail development: retain existing character art as entry; show actual product use before internal architecture. Use a few interactive product-specific scenes, then concise implementation decisions with evidence, followed by Archify and the existing islands where they explain those decisions. Personal portfolio should additionally make the owner's contribution clear from repository evidence; do not infer outcomes or metrics. Do not duplicate the same diagram/text across introduction and architecture. This is a proposed presentation direction, not a completed detail-page rewrite or a user-approved new design. No unsolicited slogans or explanation text added to the UI in this change.

## Shortest rotation return and brain controls — 2026-10-27

User correction: rotation count must not be replayed backward when returning. Avatar yaw is now normalized on movement and entry; forehead alignment interpolates its shortest signed angle. Brain orientation is quaternion-based, with shortest-path slerp to rest on leaving, independent of accumulated turns. Primary-pointer dragging rotates the brain on both axes; pointer capture is released on completion, cancellation, blur, Escape and disposal. Wheel zoom smoothly changes the close-camera distance, bounded to 0.75–1.6, only while in brain mode. Project connector endpoints now follow brain-local points. Rotation and zoom persist during project-card/TOP navigation and reset on returning to the room.

Intro name remains Korean text and now uses locally served Nanum Pen Script; official font source https://github.com/google/fonts/tree/main/ofl/nanumpenscript . OFL license retained beside the font. No new UI explanation copy. GitNexus impact attempted for RoomExperience: repository not indexed; direct HomePage dependency and scene lifecycle reviewed manually.

Production build passed. Desktop1440/mobile390 checks passed for font loading, more than three turns of actual pointer rotation, zoom in/out, return rotation below 180 degrees, normalized body yaw and preserved project/TOP navigation (14 checks, zero page errors). Measured return was 90 degrees after roughly 3.75 turns; the pre-release expected-angle diagnostic was sampled before the last drag frame and is not a strict equality assertion. Screenshots reviewed in output/playwright/brain-controls. Local changes, not deployed.

## Computer chair and playable Rehate demo — 2026-10-27

User requested a chair, seating, monitor focus and playable Rehate territory. Added chair geometry and its own raycast target plus short `앉기` action. The avatar approaches the chair, rotates by the shortest signed angle, bends existing leg/arm bones, and camera approaches the monitor over 3.2 seconds. The foreground avatar fades as the view passes it. Game exit/Escape reverses this transition and restores walking and brain entry. Static room rendering is suspended behind the game overlay.

Reused `/Users/ze/work/rehate/frontend/src/games/territory-prototype/engine.ts` and `renderer.ts` unchanged (engine SHA256 f2f83845d2c58ec4bebebfb6684bc8b666283107c623fb4ec7b73d2583e825ba). Adapted component imports, local portrait paths, exit and scoped control layout. Four original icons retain their source hashes in assets/projects/territory-icons/provenance.json. Demo is one human plus three bots, 2v2, 120 seconds, with the existing capture/cut/item rules. It does not connect to multiplayer, balances, rewards or Unity, and does not alter Rehate's source.

17 reused rules tests passed. Desktop/mobile 14 integration checks passed for seating, play, pause, match end, restart, exit cleanup and subsequent brain entry. The develop-web-game client was copied with narrow integration adaptations: choose installed Chrome, enter via chair before start, select the actual game canvas. Its first run stayed at ready due a click timeout and was rejected; headed rerun passed and captured actual territory growth (305 → 509 cells, player capture count 1) with no console errors. Output: output/playwright/room-game.

## Comet and handkerchief farewell — 2026-10-27

User requested a corner bear waving a handkerchief as a comet falls, then disappearing like becoming a star. Authored SVG figure uses the existing bear's face/ear proportions; CSS animates the arm/cloth, comet, shrinking departure and residual starlight. No text was added. The 7.4-second vignette starts after 6.5 seconds in the room, rests 34 seconds between appearances, is removed when entering brain/computer, resets when returning from a hidden tab, and respects reduced-motion settings. Seven desktop/mobile checks passed for visible comet/wave, disappearance into starlight, room-only gating and reduced motion. Both viewport captures inspected.

User explicitly requested deployment of these changes and preceding room refinements. GitNexus detect_changes attempted; repository unindexed, so direct imports and git diff reviewed manually. Deployment evidence recorded after release.

Final integration verification: 10 more desktop/mobile checks passed for player-created closed-loop capture, joystick steering/visibility, Escape cleanup and subsequent brain drag/zoom. Foreground avatar fading during monitor approach is included. Mobile farewell star shifted away from the fixed motion button; chair action receives explicit high-contrast text color. No errors in the final gameplay/navigation run.

User explicitly requested new intro copy conveying planning, design, implementation and operation. Replaced the intro card's Java/Spring-only description with `서비스를 기획하고 설계하며, 직접 만들고 운영합니다.` Mobile grid constrains the description so the handwritten name keeps its width. This copy change is within the user's explicit writing request; no metrics or results invented.

## Latest navigation decision — 2026-10-27 (supersedes earlier card-scroll flow)
- Brain project selection now pushes the camera toward the selected brain anchor, fades out, and opens `/projects/{id}/` directly. Existing artwork remains on each project page.
- Remove the intermediate selected card, TOP and the brain's workroom button. A click outside the brain returns to the room; orbit drags must not trigger exit. Escape remains available.
- Show W above A/S/D in a raised keyboard arrangement; touch-hold and physical keys use the same movement state.
- Project pages benchmark zaeze.com's `/services/gahyeon/`: a scroll-pinned visual opening followed by specific feature explanations. Existing illustration layers and floating island assets are retained.
- Read-only repository analysis: Palamedes 9c1e292f7c3f1a04bd63c697342b00fa92a4ff9b; Gahyeon 0edd9c93d13f654b3b80f347ed6bdfae287c677c. Uncommitted research work in both repositories was not edited or promoted as shipped functionality.
- Case-study stages distinguish inputs, decisions and outputs. The selectable exception examples are presentation simulations, not live agent/server runs. Product scope and unverified areas are stated in each overview.
- Archify source HTML and its provenance receipts remain intact. The same-origin embed receives a presentation-only dashed-flow stylesheet on load, honoring reduced-motion and the diagram's pause state.
- First correction release 730dc182f3a54ec83a272a69c9e0183c57e88a66 deployed successfully in Actions run 40496048672. Navigation/case-study follow-up is a separate change.
- Re-ran Gahyeon `verify_core_platform_boundaries.py`: two existing violations remain (SttLearningConversation → AssistantProperties, PersonalizedNewsCollector → BotInitializerRunner). The case study explicitly retains this limitation; no code in Gahyeon was changed.
- User correction: project entry must target the brain's exact center, not a project connector anchor. All project selections now share `brain.getWorldPosition()` as the look/dolly target; the first part of the transition centers the view before the forward push.
- Follow-up local verification: production build passed; 35 browser assertions passed at 1440×960 and 390×844. Brain-center targeting is checked from actual transition-frame samples for both Palamedes and Gahyeon. Case-study and diagram screenshots visually inspected. No browser errors.

## Full viewport destinations and camera-relative movement — 2026-10-28
- User correction: W must move upward in the camera view. WASD now uses the camera's horizontal forward/right basis, including on-screen controls; diagonal input is normalized.
- Game opens edge-to-edge in the browser viewport. Removed the monitor frame; scoreboard and controls overlay the responsive Three canvas. ResizeObserver adjusts orthographic aspect instead of stretching the old 960×640 frame. Native fullscreen remains available with F.
- Palamedes/Gahyeon open with a viewport-sized illustration. Scroll moves foreground, background and title at different depths, followed by a pinned four-stage walkthrough. Stage buttons, keyboard selection, exception simulation and Archify remain available. Short screens and reduced motion use a normal-flow walkthrough.
- Game and all three project destinations have one upper-right return arrow. Projects return to the brain, game returns to the room. Removed duplicated project return links and the top navigation bar.
- Existing assets, copy, game rules, brain-center dive and project provenance are preserved. No new marketing copy. GitNexus impact unavailable because this repository is unindexed; direct consumers reviewed: HomePage → RoomExperience → TerritoryPrototype/createUnityRenderer, project routes → ProjectIntroduction/BackendIntroduction. Scope is presentation and camera movement, not source projects or backend services.
- Validation: production build passed; 33 fullscreen/movement/stage assertions, 35 navigation/diagram regression assertions, 6 smoke checks and 6 desktop/portrait/landscape edge checks passed. Screenshots inspected for full-viewport game, layered project hero, pinned stages and floating islands. Browser runs reported no page errors. Fixed aspect-ratio-induced backend overflow and disabled scroll-driven selection on short screens after edge QA exposed them.
