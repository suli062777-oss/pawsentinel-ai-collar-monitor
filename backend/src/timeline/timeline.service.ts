import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PawRoomCopy } from '../common/text/pawroom-copy';
import { PetStateSnapshot, RawCollarSample, TimelineEvent } from '../common/types/pawroom.types';
import { PAWROOM_STORE, PawRoomStore } from '../store/pawroom-store.port';

@Injectable()
export class TimelineService {
  constructor(@Inject(PAWROOM_STORE) private readonly store: PawRoomStore) {}

  fromTelemetry(sample: RawCollarSample, snapshot: PetStateSnapshot): TimelineEvent {
    const event: TimelineEvent = {
      id: `timeline_${sample.sampleId ?? randomUUID()}`,
      petId: sample.petId,
      timestamp: sample.timestamp,
      title: this.titleFor(snapshot),
      description: snapshot.disclaimer
        ? `${snapshot.bubbleText} ${snapshot.disclaimer}`
        : snapshot.bubbleText,
      zoneId: sample.zoneId,
      source: 'rule',
      severity: snapshot.safetyLevel,
      linkedSampleId: sample.sampleId,
    };
    return this.store.addTimelineEvent(event);
  }

  addUserEvent(petId: string, description: string): TimelineEvent {
    return this.store.addTimelineEvent({
      id: `timeline_user_${randomUUID()}`,
      petId,
      timestamp: new Date().toISOString(),
      title: PawRoomCopy.timeline.userSupplementTitle,
      description,
      source: 'user',
      severity: 'info',
    });
  }

  getTimeline(petId: string) {
    return this.store.getTimeline(petId);
  }

  private titleFor(snapshot: PetStateSnapshot): string {
    if (snapshot.safetyLevel === 'attention') {
      return PawRoomCopy.timeline.attentionTitle;
    }
    if (snapshot.safetyLevel === 'watch') {
      return PawRoomCopy.timeline.watchTitle;
    }
    return PawRoomCopy.timeline.normalTitle;
  }
}