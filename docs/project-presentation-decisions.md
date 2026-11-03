# Project presentation decisions — 2026-10-29

## User decisions

- Preserve the original project representative artwork. The request to remove unrelated middle island illustrations did not authorize removing the representative hero.
- Latest correction: artwork → introduction MUST use native vertical scrolling, as on zaeze.com. Only the embedded Archify document must remain free of internal scrolling.
- Reference zaeze.com project/service introductions, including the references behind their animation and interaction work.
- Keep existing project descriptions; do not add marketing copy to fill the visual space.

## Inspected references

- `/Users/ze/work/zezestudio/company-web/docs/solution-reference-development.md`
- `company-web/src/components/immersive/GahyeonWorld.astro` and `DataGroundWorld.astro`
- `company-web/src/scripts/immersive-motion.ts`
- Rendered https://zaeze.com/services/gahyeon/ (screenshot in output/playwright/zaeze-reference.png).
- `/Users/ze/work/ocean-atlas-scroll/README.md`, `aligned.js` timing table and `reference-lab/README.md`.
- Ocean Atlas is an independent learning implementation based on Career Hacker Alex. Its reference lab interprets Lusion, Igloo, Unseen, Bruno and Dennis interactions, not their original code/artwork. We use no external reference artwork or source code here.

## Adaptation

The local portfolio's existing Palamedes and Gahyeon background/subject layers remain unchanged. Full-viewport covers use opposing pointer parallax, staged live typography and background particles. Palamedes approaches through the golden scene; Gahyeon combines a lateral move with a curtain reveal. Native vertical scroll drives a pinned timeline with a hold segment, approach and continuous reveal. Upward scrolling reverses it. The former entry button and horizontal swipe are removed; navigation remains an optional shortcut. Reading states remain still between transitions. Main navigation and Escape restore the artwork. Reduced motion disables camera transforms and ambient animation while preserving native scrolling and readable content.

Archify remains the actual interactive embedded diagram, not a screenshot. The flow examples retain their existing text, exception controls, autoplay and source links; small staggered transitions replace disconnected island illustrations. Mobile diagram dimensions are initialized only when its panel is visible.

No deployment in this change. No representative artwork deleted or regenerated.

## 2026-10-29 — complete scroll and quality correction

- User: scrolling alone must expose all content, with interaction beyond the opening scenes. The previous hero-to-diagram-only scroll implementation is superseded.
- Keep the original project hero art and the bounded, zoomable Archify overview. Follow it with native document sections: project description, motivation, all six chapters (including input/output and implementation), and scope/stack. No prose is hidden behind a mobile tab.
- Each chapter has a source-based **illustrative** process with two selectable conditions and selectable stages. These are frontend examples, not requests against a live Palamedes/Gahyeon server. Scroll advances the process; manual inspection can return to scroll tracking. All four Backend practice explanations are also present in the document.
- Added details come from local source: Palamedes planning handoff proof/validation; Gahyeon WorldActionCoordinator and ARCHITECTURE. Palamedes handoff proof remains local/unpublished and is marked accordingly; its link is the public repository, not a nonexistent public file. Existing Palamedes source links use the published 0d0737d commit instead of unpublished 9c1e292.
- Character: calibrate a helmet center in the imported head bone's local space, then transform it after animation evaluation every frame. Use the same center for brain placement and camera correction. Increase brain-view camera distance. The wording about the body being close was interpreted as camera framing while awaiting clarification.
- Bear: preserve wave.png; render one registered frame through SVG clips, continuously rotate the waving arm, keep body position fixed, use opacity 0→0.3→0.42→0, then reveal a star at the same center. No new bitmap or character regeneration. Original sprite candidate provenance is retained.
- Intro card: expand only with facts from the existing about/evidence documents and public project scope. No invented employers, tenure, achievements or performance claims.
- PC game: preserve engine rules and source rigs. Add water, cliff/shore geometry, shadows, instanced thick trails, pickups and capture/cut pulses. Keep HUD over the playfield; fix back/pause overlap. Web demo remains a Three.js implementation, not a Unity WebGL build.

## 2026-10-29 — user correction: explain the argument, not the inventory

- Supersedes the six repeated chapter/step-list presentation. Each project now has three principal design arguments with different visual techniques: Palamedes competing interpretation branches, evidence/authority comparison, revision preview; Gahyeon persistent Core/client orbit, independent runtime timescales, durable queue/ACK example.
- Remove project headers, section-index navigation and all in-page scroll-jump controls. Keep a single fixed ← to /#brain. Functional demo controls and external source links remain; scrolling exposes every argument.
- User clarified the astronaut issue means arms too close to torso, not camera distance. Apply outward upper-arm abduction after imported animation evaluation, attenuate it while seated, and restore the previous camera distance. Preserve the imported GLB/skin and head anchor.
- User explicitly requests imagegen for the game map. Generate and ship painted orthographic terrain beneath an alpha ownership overlay; preserve game collision and rules. Provenance lives in assets/projects/territory-map-20261029/manifest.json.

## 2026-10-29 monitor transition and nonuniform project staging
- User explicitly rejects making every project introduction follow the same format. Preserve source-grounded content but use argument-specific composition, reading order and materials: evidence workbench, authority checkpoint, revision archive; memory observatory, response score, recovery station.
- Use imagegen beyond the initial card: generated evidence workbench and transparent memory-core object integrated in live interactive sections. Text and controls remain HTML; artifacts/prompts/selection under assets/projects/story-art-20261029.
- Sitting must visibly approach/enlarge monitor, fade into full darkness, then fade darkness away to the loaded game screen. Keep darkness until renderer assets are ready, and prevent clicking through the reveal. Respect reduced-motion preference with a short fade.

## 2026-10-29 — product comprehension before design arguments
- User still cannot tell what was built from the introduction. Architectural sophistication and generated art are insufficient. Lead with the actual product category, intended user, action/result, implemented surfaces, technology and honest status; then explain consequential design decisions.
- Hero keeps original art and gains a factual product definition. Opening section adds Palamedes recorded CLI input plus actual stored plan; Gahyeon actual Unreal render plus a labeled voice-processing example. Architecture sections remain below these results with distinct compositions.
- Palamedes evidence run uses a fresh isolated temporary workspace, no model/provider calls, and user-supplied example values. QA failure due to incomplete plan fields is visibly disclosed; storage success is not described as QA approval or autonomous mission generation. Temporary workspace path is normalized in the public record.
- Gahyeon local canonical config identifies Unreal as current and Electron as retired. Existing Desktop references must not imply a currently shipped client. The actual render is a candidate, not final approved identity or voice validation. Live conversation is not connected in the portfolio example.
- Added global portfolio-project-story skill; completed the prior room-card-character-focus placeholder. Both are linked from AGENTS.md and structurally validated. These skills preserve the user's scope and do not impose a uniform count/layout or authorize deployment.

## 2026-10-29 — causal scenes replace isolated argument demos
- Latest feedback: more polished prose and decorative images still fail to explain the product. Replace the six standalone argument panels, rather than append another layer of explanation.
- Palamedes uses a single evidence workbench; native scroll moves from observed problem to competing directions, a physical mission dossier, then review/save and immutable local history. Changing evidence changes the actual branch, mission and reason. Reviewed evidence is checked at save; stale review rejects the mutation. Comparison conditions 2–3 are visibly labeled hypothetical.
- Gahyeon uses a performance stage, three independent processing lanes and a persistent glass Core. Scroll alone demonstrates cancellation and stored-state continuity; manual controls take over that state and run cancellable local timers. Disconnect prevents pending completion; reconnect retains committed memory/ACK. No real backend or audio is connected.
- Imagegen asset is a transparent open dossier with dynamic HTML overlays, not a screenshot. Existing generated workbench and memory core have distinct context/state roles; actual Unreal capture remains explicitly a candidate render.
- Keep real CLI evidence and truthful development scope below the experiences. Do not bury failed sample QA or confuse frontend examples with product runs.
- Short-height viewports show all four story beats in normal document flow. Standard desktop/mobile use sticky native-scroll progression; reduced motion disables movement. No added header or jump navigation.

## 2026-10-30 — factual portfolio tone
- User rejects slogan-like scene titles and presentation-style prose. Visual and interactive expressiveness does not authorize rhetorical questions, dramatic contrasts or poetic one-liners.
- Use short headings identifying the actual product or mechanism, followed by factual prose about operation and design reasons. Apply this to both project scenes and shared chapter metadata.
- Preserve existing interaction, original/generated artwork, implementation evidence and development limitations. Updated portfolio-project-story with this scoped writing rule.

## 2026-10-30 — interviewer review
- User requests an active interviewer's critique, an improvement list, then implementation. Review and status: docs/evidence/interviewer-review-20261030/review.md.
- Actual recorded source checks appear before frontend scene examples with date, command/results link, scope and dirty-tree disclosure. Palamedes gate/lifecycle: 8 tests pass; Gahyeon boundary check: 2 violations. Neither proves full service quality or business impact.
- Explain engineering costs alongside mechanisms. Do not fabricate personal decision history, ownership, team size, dates or metrics; these require attribution evidence.
- Make existing home-card project names direct links; retain room exploration. Shorten scene scroll while preserving all four beats. Preserve original images and one back arrow; no header or scroll-jump controls added.
- Keep current/retired client descriptions consistent across project and Backend pages. Workflow source is not live deployment proof.

## 2026-10-30 — reuse identifiable service assets
- User explicitly requires the GitHub icon on GitHub destinations. Searched current assets, legacy theme and adjacent project assets first; no reusable logo SVG was present. Vendored the original Primer Octicons mark with license/source/hash under assets/projects/icons.
- Shared GitHubLink uses the actual SVG asset. Profile/repository links are icon controls with accessible names; source/document links retain descriptive labels alongside the icon. Internal project links and local verification records are not GitHub links and must not use that mark.
- Before substituting text, arrows or generated art for familiar service marks, inspect existing asset libraries and the service's original vector assets. Do not treat text-only delivery as finished without checking destination identity.
- Follow-up audit includes active static About, Contact and Services routes in Korean and English. Reuse the same GitHub SVG, preserve existing labels and distinguish internal navigation with →. Historical unused Jekyll home templates are not represented as current routes.

## 2026-10-30 — product result before test score
- Latest user instruction follows the hiring critique: implementation evidence must support an understandable product result and concrete problem-solving case. The earlier top-of-page test-count panel was an overcorrection and is superseded.
- New order: approved cover → actual stored output / runtime capture → existing interactive explanation → specific condition, decision, cost and actual reproduction result → related tests and limitations.
- Do not remove failed checks to improve hiring appearance; place them alongside the relevant engineering constraints. Do not imply a local synthetic runtime reproduction is a live voice conversation or a historical production incident.
- New temporary gate-function reproduction and isolated compiled RuntimeCore caller provide actual evidence. Origin and limits: docs/evidence/product-cases-20261030/README.md.

## 2026-10-30 — upright Gahyeon staging
- User rejects the visibly leaning character in the voice scene. The earlier Unreal capture froze a weight-shift pose; CSS rotation was not the cause.
- Re-render frame 1 from the existing interchange-v003 Blender source with a level frontal camera. Preserve the mesh, texture, rig and original file. Do not rotate or distort the raster to disguise skeletal posture.
- Use the new render only in the illustrative voice scene and label it as an existing 3D model render. Preserve the actual Unreal capture in the product evidence section, where its original provenance matters.
- Align the new asset's feet with the stage and check desktop/mobile silhouette and panel overlap. Keep the original and derivation in the scene manifest.

## 2026-10-30 — both character placements use rig animation
- User points out the upper image and requests a living character. Supersedes leaving the upper tilted still visible: both product introduction and voice scene now share GahyeonCharacter, using the existing mesh/material/rig and frames 1–90 of its original animation.
- Label current display as browser 3D playback, not an Unreal runtime recording. Preserve old capture files as historical evidence without displaying the tilted still.
- Avoid whole-image floating. Lazy-load the 3.4 MB GLB, cap rendering at 30 fps/DPR 1.5, pause offscreen/document-hidden/reduced-motion, retain upright still fallback, clean up renderer/resources on unmount. No simulated speech lip-sync claims.

## 2026-11-02 — develop project introductions using tobspr.io
- Explicit scope: develop existing project introductions, not the portfolio homepage/room. Inspected https://tobspr.io/ visually, including its moving product scene, conveyor motif, paired media cards and wide flagship layout. Adapt composition/interaction principles; no reference artwork, code, marketing copy or navigation copied.
- Preserve original cover layers with larger factual project-name typography, bounded framing, and existing status/stack. Keep one back arrow and ordinary vertical scrolling; add no jump/header navigation.
- Palamedes product result is an editable HTML terminal/document composition: select recorded CLI operations, see actual stored content, keep all plan fields visible. Preserve the recorded QA failure. Remove duplicate command listing.
- Gahyeon gets a larger framed live character exhibit alongside the recorded RuntimeCore timeline. Original model/idle motion and lazy/pause behavior remain; no fake speech added.
- Both actual cases gain optional replay/scrub controls, with distinct document-ledger and concurrent-generation layouts. Their source JSON supplies observed facts; all descriptive prose remains visible without interaction. Replay is historical visualization, not an execution against backend services.
- Improve existing dossier/control contrast, scene framing and mobile touch targets; finite entry motion and pointer highlights use existing media rather than adding unrelated illustrations. Short/reduced-motion layouts remain readable.
- QA and reference notes: docs/evidence/project-development-20261102/. No deployment or commit in this task.

## 2026-11-02 — source-depth and repository expansion
- User requests authored AI answer samples for Gahyeon, deeper cross-layer Palamedes explanation, insight-rag as a project and seven further repositories including promdeck.
- Palamedes is presented as pre-execution mission intelligence, not merely a goal storage CLI. The independent inventors → frozen candidates → blinded critique/selection → host-issued draft → planner boundary → outcome feedback structure precedes the existing state-CLI evidence. Browser scenarios remain illustrative and always deny implicit delivery authority.
- Gahyeon sample dialogues are explicitly authored fictional examples based on the existing persona prompt. Default dialogue is fully visible; optional timed replay can be canceled by selecting another example and respects reduced motion. Character motion does not claim speech synchronization.
- insight-rag receives a dedicated page with actual deterministic scoring results from seven repository fixtures. Semantic-only comparison and evidence-aware ordering remain clearly separate from a live retrieval/model service.
- Dedicated routes and a project index cover all requested repos. Private source status, third-party brain model attribution, Ocean Atlas reference-learning origin and laplaces-demon research limits are retained. No private code or operational configuration is copied.
- No deployment or commit requested. Source record and rendered QA: docs/evidence/project-expansion-20261102/.

## 2026-11-02 — every project is an individual brain node
- User explicitly rejects category grouping: retain Palamedes, Gahyeon and Backend and add all eight requested destinations as individual nodes (11 total). Do not create AI/tool/web category parents.
- Brain labels and navigation share one registry sourced from the project catalog, preserving original three indices. Each new node uses the existing dive transition and its own actual detail route.
- Desktop uses two peripheral columns; tall mobile uses upper/lower rows to leave the brain center available for rotation and zoom. Names wrap instead of truncating. No new explanatory UI copy.

## 2026-11-02 — surface-attached nodes and field colors
- User rejects fixed screen-position labels and approves surface-following nodes with field colors. This supersedes the preceding peripheral-column/upper-lower-row layout.
- Keep all 11 individual destinations. Fields provide color metadata only, never parent nodes: AI/judgment purple, developer/operations tools mint, interactive web blue, backend amber. Short legend and accessible names identify colors without adding explanatory copy.
- Sample directions are bound to actual visible brain mesh intersections after model transforms. Each frame projects those local surface anchors through the orbit/zoom camera; labels begin beside the projected points. Only intersecting names are relaxed, with viewport bounds. No persistent screen slots.
- Rear hemisphere labels, pins and links dim; hover/keyboard focus restores name contrast. Selection retains the existing dive transition. Existing avatar/head attachment and model assets are preserved.
- Render and navigation evidence: docs/evidence/brain-attached-20261102/.

## 2026-11-02 — dark reflective astronaut visor
- User requests a dark, mirror-gloss helmet glass reminiscent of Astroneer. Preserve the existing astronaut identity, mesh, texture, skeleton and motion.
- Imported GLB has one shared material/texture. A UV-island shader mask confines dark tint, low roughness, high metallic response and clearcoat to the visor. Suit rendering outside the mask retains its source shading; original GLB/texture are unchanged.
- Capture one 256 px room cubemap with reflection-only softboxes and filter through PMREM. Reflection changes with view/model orientation; this is a static environment probe, not a live scene mirror. No six-face render loop is added. Capture targets and temporary lighting geometry are disposed.
- Shader participates in the existing ghost fade so brain entry/return preserves attachment and visibility behavior. Source and visual evidence: docs/evidence/visor-20261102/.

## 2026-11-02 — running and personal introduction
- User requests more responsive running and explicitly supplies material for a natural personal introduction: building things for personal use, efficiency, collection-to-operations scope, sustainable services, information/tradeoff/learning-cost decisions, requirements/usability, care for work and technical conversation.
- Replace prior generic introduction with four first-person paragraphs grounded in those statements. Remove all project links and the project-entry button from the introduction card; keep the personal GitHub icon. Project access remains the avatar/brain with all eleven nodes.
- Raise room movement from 2.5 to 5.8 world units/second for keyboard, touch controls and floor-click destinations. Increase turn responsiveness, running cadence, stride, arm swing and knee flexion; add modest gait-weighted vertical motion while preserving existing rig/clips. Reduced motion suppresses gait exaggeration.
- Intro card height drives mobile room/control space; short/narrow screens can scroll the card instead of hiding text or reducing it to unreadable size. Reserve at least 260 px for the room on portrait phones.

## 2026-11-02 — low-gravity jump, synchronized farewell and stickers
- User requests Space jump with a mildly lunar float. Add ground-only impulse 3.2, gravity 3.6, approximate apex 1.42 units and airtime 1.78 s; preserve horizontal control. Ignore repeated/held jumps and keep normal keyboard behavior for focused interactive/form controls. Airborne room-to-brain/sitting entry waits for landing. Horizontal displacement excludes Y so a click destination cannot pull the character to the floor. Head/brain and click hint follow vertical position.
- Airborne pose suppresses running cadence and lightly bends knees/arms. Existing model and visor preserved.
- User requests closer bear/comet timing and a quieter, faint appearance. Bear/star/comet share a 7400 ms timeline; bear dissolves at 64%, star and comet meet at the same anchor, comet departs from there. Bear stays fixed and waves its hand. Opacity ramps through .10 to .19 then fades, superseding prior .42 maximum. Reduced-motion/background scheduling remains intact.
- User requests small bear stickers around the personal card. Reuse two cells of the existing approved wave.png sheet as static, decorative stickers at heading/footer whitespace; no regenerated identity or added copy. Screen-reader hidden, pointer-transparent; no prose overlap.

## 2026-11-02 — airborne gait, SPACE key, sticker replacement and chair affordance
- User corrects airborne movement: horizontal movement should articulate legs. Keep input-driven gait airborne at 60% stride and 9 rad/s (ground 15), retaining the bent floating base pose. Stop input damps the gait; airborne physics are not altered by gait bobbing. Reduced-motion still suppresses gait exaggeration.
- User requests visible SPACE alongside WASD. Add a full-width SPACE key in the same control cluster; pointer and keyboard button activation invoke the same ground-only jump with held/repeated protection.
- User rejects the reused handkerchief card stickers and rough pixel edges. Remove them from the card, retain the sky asset. Built-in imagegen creates separate transparent laptop and resting poses; native images replace sprite backgrounds. Preserve rejected halo candidate and prompt/selection provenance in assets/projects/bear-card-20261102/manifest.json.
- User requests removing visible ‘앉기’. Replace it with ‘클릭’ and a curled arrow, anchored to the chair's floor position. Add a translucent ring on the actual ground plane so camera projection produces the ellipse. Keep accessible ‘의자에 앉기’ label and existing chair/monitor transition.
- Narrow-card overflow exposed a footer sticker overlapping prose. Move the footer sticker into content flow; verify it stays below paragraphs on 320/390 px phones. No changes to introduction prose or project destinations.

## 2026-11-02 — chair target, right-hand SPACE and room scale correction
- User corrects floor-targeted chair hint: anchor to the actual chair back in local coordinates, lean 22 degrees to the right; retain the subtle ground ring. Clone the persistent anchor before screen projection to prevent cumulative coordinate corruption.
- SPACE moves to the right of D on the same row, including mobile. No third controls row.
- Supersede 1.78 s lunar jump with impulse 3.1/gravity 5.8 (nominal 1.07 s, apex .83). Preserve airborne directional gait and ground-only jump protection.
- Character and furniture scale to 80%; room and walking bounds stay unchanged. Furniture stays in its existing corner. Compute seat/approach/monitor/hint after scaling, scale monitor camera distance and ground ring, and derive character hint/focus from transformed anchors.
- Build and desktop/mobile browser QA passed; measured airborne samples span 1054 ms, apex .8284. Brain/head anchors match after scaling. Evidence: docs/evidence/room-scale-20261102/.

## 2026-11-02 — room decoration and brain field rail
- User points specifically to https://www.111percent.net/ after ENTER. Inspected that state: linked isometric rooms distinguish their purpose with coordinated color, furniture and wall objects. Reference screenshot retained; no reference art copied.
- Add original geometric studio details: teal lower wall panels, wood trim and floor seams, a constellation frame, books and ringed planet on a wall shelf, low rear cabinet, finished window sill. Preserve open center, 80% avatar/furniture scale, movement bounds and existing chair/monitor path. All additions share room fade/disposal hierarchy; no added animation loop or UI copy.
- User requests moving existing four colored field dots from bottom to top-left, vertically, with matching-project selection. Convert legend to accessible toggle buttons; same selected dot clears to all eleven projects. Hide unrelated labels, leader lines and surface pins together; only visible labels participate in collision resolution. Reserve the top-left filter area when placing labels.
- Desktop/mobile QA: AI 4, tools 4, web 2, backend 1; clear restores 11. Keyboard/pointer button semantics retained, names exposed by title/hover/focus. Jump, computer entry/reveal/return passed; no page errors. Evidence in docs/evidence/room-decor-20261102/.

## 2026-11-02 — persistent field names and distinct implementation scenes
- User requires the selected brain-field name to stay visible after click. Add selected-state name visibility independently of hover/focus. Verified pointer departure and Tab focus changes on desktop/mobile.
- User rejects homogeneous project presentation and requests varied visual information based on real internals. Read source implementations; replace the repeated input/output and generic mechanism sections for eight additional projects with distinct scenes. Keep existing Palamedes/Gahyeon/backend case studies.
- termi: phone ↔ tmux host with disconnected/replay states; promdeck: physical key deck using actual renderButtonSvg fixture exports; pocketterm: drag/keyboard pad → relative events → independent cursor/scroll output; brain-workspace: spatial nodes linked to list selection; ocean-atlas: scroll-driven layered aperture and 23-part sequence; laplaces-demon: browser SHA-256 chain and mutation detection; ClaudeCodeLooper: state timeline with process/output/controller lanes; insight-rag: selectable source sheets linked to derived component, retaining real ranking fixture results.
- Simulations are explicitly identified; no live shell, investment returns, hardware connection, model call or end-to-end service claim. No source product code changed. Key SVG provenance records renderer source hash and synthetic input scope. Original reference media not reused.
- Every page retains factual product definition and current scope, normal document scroll, single back-to-brain arrow and existing GitHub icon rules. No slogans added.
- Build, eight page desktop/390 and narrow 320 px checks, meaningful controls, pointer input, selected label persistence and reduced-motion checks completed. Evidence: docs/evidence/implementation-scenes-20261102/.

## 2026-11-02 — correction: actual product surfaces before explanatory simulations
- User explicitly rejects the prior delivery: diagrams and generated key outputs did not show actual products. Do not equate a source-grounded simulation with a product capture. Actual product UI/CLI/hardware evidence must lead when available; explanations follow.
- Executed original brain-workspace and ocean-atlas apps; captured their real browser views, plus a real browser scroll recording for ocean. Reused visually inspected termi Android QA screenshot dated 2026-10-22.
- Inspected previously missed insight-rag web_ui and laplaces-demon web app. Ran the former in an isolated copy with env files excluded and backend URLs disconnected; captured chat start and ingest forms without fake response data. Ran laplace's actual copper-full-demo into a separate local ledger, then its server; captured populated thesis/evidence board. Existing source UI's Palamedes name and synthetic demo limits disclosed.
- Opened promdeck's actual property-inspector HTML with original SDK components; captured original settings UI, explicitly not a connected Stream Deck or hardware photo. Executed installed ClaudeCodeLooper --help and retained unmodified stdout; no fabricated monitoring success.
- PocketTerm hardware photo/video remains unavailable; SSH timed out. Actual source excerpt is explicitly source, not a device capture. This part is not marked fulfilled as real-device proof.
- Actual captures are placed before visual-story components on all eight pages, image originals can be opened, original ocean recording has native controls. Preserve personal/sample data boundaries: do not publish the CLI's discovered live session status; only --help output is included.
- Original capture vs recorded fixture vs simulation provenance: assets/projects/actual-products-20261102/manifest.json. Desktop/mobile integration evidence: output/playwright/actual-products-20261102/.

## 2026-11-03 — core-feature coverage cycle
- Audit all eleven destinations by input/action/result, not screenshot count. Add actual session/reconnect, brain filter/selection, and Laplace debate/approval/evaluation screens. Capture original responsive mobile UI where desktop scaling makes it unreadable.
- Show Gahyeon's historical hardcoded QA model response verbatim and retain non-selected candidate status. Run Looper's original detector/event code with synthetic stdout; do not claim process monitoring or automatic restart. Present its executed result ahead of --help.
- Preserve Palamedes' documented Yut scope divergence beside its original app screenshot. A mostly static source recording is not presented as a gameplay demonstration. Move insight-rag's existing actual scoring output before explanatory diagrams.
- Keep outstanding Qdrant/model, physical Stream Deck, PocketTerm device, voice/Unreal and process restart evidence explicit. Do not fill missing proof with generated screens. Claims/provenance and remaining gaps: docs/evidence/core-features-20261103/audit.md and assets/projects/core-features-20261103/manifest.json.
