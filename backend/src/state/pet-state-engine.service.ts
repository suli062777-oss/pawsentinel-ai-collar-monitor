import { Injectable } from '@nestjs/common';
import { TREND_DISCLAIMER } from '../common/constants/product-boundaries';
import { PawRoomCopy } from '../common/text/pawroom-copy';
import {
  PetStateSnapshot,
  RawCollarSample,
  SafetyLevel,
  StateKey,
} from '../common/types/pawroom.types';

type BaseState = Pick<PetStateSnapshot, 'stateKey' | 'safetyLevel' | 'animationKey' | 'bubbleText'>;

@Injectable()
export class PetStateEngineService {
  toSnapshot(sample: RawCollarSample): PetStateSnapshot {
    const base = this.baseStateFor(sample);
    const vitalConcern = this.hasVitalConcern(sample);
    const longRestConcern = sample.restingDurationTrend === 'long';

    let stateKey: StateKey = base.stateKey;
    let safetyLevel: SafetyLevel = base.safetyLevel;
    let animationKey = base.animationKey;
    let bubbleText = base.bubbleText;
    let disclaimer: string | undefined;

    if (vitalConcern) {
      stateKey = 'needs_attention';
      safetyLevel = 'watch';
      animationKey = sample.motionHint === 'pacing' ? 'attention_pace' : 'attention_idle';
      bubbleText = sample.zoneId === 'door' ? PawRoomCopy.state.vitalDoor : PawRoomCopy.state.vitalGeneral;
      disclaimer = TREND_DISCLAIMER;
    } else if (longRestConcern && sample.activityLevel === 'low') {
      stateKey = 'resting';
      safetyLevel = 'watch';
      animationKey = 'long_rest_idle';
      bubbleText = PawRoomCopy.state.longRest;
    }

    if (sample.battery < 15) {
      safetyLevel = 'attention';
      animationKey = 'low_battery_idle';
      bubbleText = PawRoomCopy.state.lowBattery;
    }

    return {
      petId: sample.petId,
      deviceId: sample.deviceId,
      sampleId: sample.sampleId,
      timestamp: sample.timestamp,
      stateKey,
      safetyLevel,
      zoneId: sample.zoneId,
      animationKey,
      bubbleText,
      source: 'rule',
      confidence: sample.confidence,
      battery: sample.battery,
      disclaimer,
    };
  }

  private baseStateFor(sample: RawCollarSample): BaseState {
    if (sample.zoneId === 'bed' && sample.activityLevel === 'low') {
      if (sample.motionHint === 'walking') {
        return {
          stateKey: 'resting',
          safetyLevel: 'safe',
          animationKey: 'walk_slow',
          bubbleText: PawRoomCopy.state.bedWalking,
        };
      }
      return {
        stateKey: 'sleeping',
        safetyLevel: 'safe',
        animationKey: 'sleep_idle',
        bubbleText: PawRoomCopy.state.bedSleeping,
      };
    }

    if (sample.zoneId === 'sofa' && sample.activityLevel === 'low') {
      if (sample.motionHint === 'walking') {
        return {
          stateKey: 'resting',
          safetyLevel: 'safe',
          animationKey: 'walk_slow',
          bubbleText: PawRoomCopy.state.sofaWalking,
        };
      }
      return {
        stateKey: 'resting',
        safetyLevel: 'safe',
        animationKey: 'rest_on_sofa',
        bubbleText: PawRoomCopy.state.sofaResting,
      };
    }

    if (sample.zoneId === 'door') {
      return {
        stateKey: 'waiting',
        safetyLevel: 'watch',
        animationKey: sample.motionHint === 'still' ? 'sit_near_door' : 'pace_near_door',
        bubbleText: PawRoomCopy.state.doorWaiting,
      };
    }

    if (sample.zoneId === 'toy_area' && sample.activityLevel === 'high') {
      return {
        stateKey: 'playing',
        safetyLevel: 'safe',
        animationKey: sample.motionHint === 'running' ? 'toy_chase' : 'play_jump',
        bubbleText: PawRoomCopy.state.toyPlaying,
      };
    }

    if (sample.zoneId === 'bowl') {
      return {
        stateKey: 'walking',
        safetyLevel: 'safe',
        animationKey: 'sniff_bowl',
        bubbleText: PawRoomCopy.state.bowlWalking,
      };
    }

    if (sample.zoneId === 'window') {
      return {
        stateKey: 'walking',
        safetyLevel: 'safe',
        animationKey: 'look_window',
        bubbleText: PawRoomCopy.state.windowWalking,
      };
    }

    return {
      stateKey: sample.activityLevel === 'high' ? 'playing' : 'walking',
      safetyLevel: 'safe',
      animationKey: sample.activityLevel === 'high' ? 'play_jump' : 'walk_slow',
      bubbleText: PawRoomCopy.state.normal,
    };
  }

  private hasVitalConcern(sample: RawCollarSample): boolean {
    return (
      sample.heartRateTrend === 'slightly_high' ||
      sample.heartRateTrend === 'slightly_low' ||
      sample.respirationTrend === 'slightly_high' ||
      sample.respirationTrend === 'slightly_low'
    );
  }
}