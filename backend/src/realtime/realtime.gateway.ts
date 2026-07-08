import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PetStateSnapshot, TimelineEvent } from '../common/types/pawroom.types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RealtimeGateway {
  @WebSocketServer()
  private server?: Server;

  private readonly logger = new Logger(RealtimeGateway.name);

  @SubscribeMessage('demo.session.join')
  joinSession(@MessageBody() body: { sessionId?: string }, @ConnectedSocket() client: Socket) {
    if (body.sessionId) {
      void client.join(body.sessionId);
      return { joined: body.sessionId };
    }
    return { joined: null };
  }

  broadcastState(snapshot: PetStateSnapshot, sessionId?: string) {
    this.emit('pet.state.updated', snapshot, sessionId);
    this.emit(
      'scene.animation.command',
      {
        petId: snapshot.petId,
        zoneId: snapshot.zoneId,
        stateKey: snapshot.stateKey,
        animationKey: snapshot.animationKey,
        bubbleText: snapshot.bubbleText,
        safetyLevel: snapshot.safetyLevel,
        confidence: snapshot.confidence,
      },
      sessionId,
    );
  }

  broadcastTimelineEvent(event: TimelineEvent, sessionId?: string) {
    this.emit('timeline.event.created', event, sessionId);
    if (event.severity === 'watch' || event.severity === 'attention') {
      this.emit('pet.alert.created', event, sessionId);
    }
  }

  broadcastDeviceStatus(payload: Record<string, unknown>, sessionId?: string) {
    this.emit('device.status.updated', payload, sessionId);
  }

  broadcastCreationJob(payload: Record<string, unknown>, sessionId?: string) {
    this.emit('creation.job.updated', payload, sessionId);
  }

  private emit(event: string, payload: unknown, sessionId?: string) {
    if (!this.server) {
      this.logger.debug(`Skipped ${event}; websocket server not ready.`);
      return;
    }
    if (sessionId) {
      this.server.to(sessionId).emit(event, payload);
      return;
    }
    this.server.emit(event, payload);
  }
}
