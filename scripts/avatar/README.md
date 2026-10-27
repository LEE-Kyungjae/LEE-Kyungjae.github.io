# Portfolio avatar

Original Blender-authored GLB preserving the user's compact-body direction with an original face construction. The concept image is in `assets/projects/avatar-concepts-20261027`; model provenance is beside the GLB.

Generate using Blender 5.2.3 / official `bpy==5.2.3`:

```sh
python scripts/avatar/build_avatar.py
# Or: blender -b -t 4 -P scripts/avatar/build_avatar.py
```

The script writes the authored `.blend`, weighted `avatar.glb`, a portable canvas normal map and a build report. Optional CPU studio rendering requires `AVATAR_RENDER=1`. The web's GLTFLoader consumes the GLB; `RoomAvatar.ts` controls the seven bones and opacity. Source Blender axes are Z-up / facing -Y; export is glTF Y-up / facing +Z. Feet start at floor level; brain center in the scene remains at Y=3.3.

Validate in the actual room at `/` with desktop and mobile sizes: walking and stop settling, no cloth penetration, transparent brain reveal, project selection and fade, return, reduced motion. Do not substitute the design PNG for the interactive mesh or describe the gait as physics simulation.
