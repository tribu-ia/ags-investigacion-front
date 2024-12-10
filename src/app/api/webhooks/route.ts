import { NextRequest, NextResponse } from 'next/server';
import { EventEmitter } from 'events';

const emitter = new EventEmitter();
let connections = 0;

export async function POST(req: NextRequest) {
  const body = await req.json();
  emitter.emit('newMessage', body);
  return NextResponse.json({ success: true });
}

export async function GET() {
  connections++;
  console.log(`New SSE connection. Total connections: ${connections}`);

  const stream = new ReadableStream({
    start(controller) {
      const listener = (message: unknown) => {
        try {
          const encodedMessage = new TextEncoder().encode(`data: ${JSON.stringify(message)}\n\n`);
          controller.enqueue(encodedMessage);
        } catch (error) {
          console.error('Error encoding message:', error);
        }
      };

      emitter.on('newMessage', listener);

      return () => {
        emitter.off('newMessage', listener);
        connections--;
        console.log(`SSE connection closed. Total connections: ${connections}`);
      };
    },
    cancel() {
      connections--;
      console.log(`SSE connection cancelled. Total connections: ${connections}`);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
