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
