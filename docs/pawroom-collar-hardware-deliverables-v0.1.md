# PawSentinel Collar S1 Hardware Deliverables

Date: 2026-07-08  
Status: public submission package  
Scope: product review, course/competition evaluation, and future hardware engineering handoff

This document is the lightweight hardware package index for **PawSentinel Collar S1**, the smart-collar data entry point of the PawSentinel system.

## 1. Core Deliverables

- [Collar S1 hardware architecture](./pawroom-collar-hardware-design-v0.1.md)  
  Detailed hardware product specification, including module stack, sensor selection, enclosure structure, firmware loop, power system, communications, data contract, and validation plan.

- [GitHub showcase assets](./assets/showcase/)  
  Public-facing visuals for the software-hardware story, including the desktop companion scene, smart collar concept, sensor detail, software gallery, and pixel pet scene asset.

- Retained hardware colorway assets:
  - [Deep brown collar concept](./assets/pawroom-collar-concept-v01-deep-brown.png)
  - [Warm white collar concept](./assets/pawroom-collar-concept-v01-warm-white.png)
  - [Pure white collar concept](./assets/pawroom-collar-concept-v01-pure-white.png)

Historical image-generation prompts have been moved to [archive/media-prompts](./archive/media-prompts/) and are no longer part of the main review path.

## 2. Hardware Architecture Summary

PawSentinel Collar S1 uses a compact smart-collar structure composed of:

| Module | Proposed component / technology | Role |
| --- | --- | --- |
| Cellular + GNSS | Nordic nRF9160-SICA | LTE-M / NB-IoT uplink and outdoor location fallback |
| BLE control | Nordic nRF52840 | App pairing, low-power local control, sensor scheduling |
| Motion sensing | Bosch BMI270 | Still, walking, running, pacing, sleep/rest trend detection |
| Vital-trend window | MAX30101 / MAX86141 + TMP117 | Non-medical heart-rate, respiration, and temperature trend references |
| Wear detection | AD7147 + capacitive contact electrodes | Collar wearing state and sensor-window contact quality |
| Power system | 420mAh LiPo + BQ25120A + MAX17048 | Charging, power path, battery gauge, and low-battery events |
| Device identity | ATECC608B | Device certificate, TLS private key protection, anti-spoofing |

## 3. Software-Hardware Interaction

```text
Collar S1 telemetry
  -> backend telemetry ingestion
  -> rule-based pet state engine
  -> safety level, zone, battery, and timeline events
  -> desktop companion world and mobile lightweight alerts
```

The collar does not directly present complex raw sensor data to users. PawSentinel converts activity, zone, battery, resting trend, and vital-trend signals into understandable safety states and animation commands.

## 4. Presentation Narrative

Use this sequence when presenting the hardware:

1. Start with the user problem: owners want reassurance without staring at cold surveillance video.
2. Position the collar as the sensing entry point, not as a medical device.
3. Show the module stack: location, motion, wear detection, battery, and non-medical vital trends.
4. Explain how telemetry becomes a desktop pet world and lightweight safety reminder.
5. State the boundary clearly: PawSentinel provides daily safety monitoring and trend reminders, not veterinary diagnosis or medical-grade monitoring.

## 5. Next Engineering Materials

Future hardware work should add:

- Mainboard block diagram
- Exploded enclosure diagram
- Sensor-window cross-section
- Magnetic charging dock design
- EVT / DVT / PVT test plan
- 20-unit Alpha sample BOM
