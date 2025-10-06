// utils/sse.ts
class SimpleSSE {
  private connections = new Map<string, any>();

  addConnection(id: string, stream: any) {
    this.connections.set(id, stream);
    console.log(`SSE connection added: ${id}`);
  }

  removeConnection(id: string) {
    this.connections.delete(id);
    console.log(`SSE connection removed: ${id}`);
  }

  // Send to all connected clients
  async sendToAll(data: any) {
    const message = `data: ${JSON.stringify(data)}\n\n`;
    const deadConnections: string[] = [];

    for (const [id, stream] of this.connections) {
      try {
        await stream.push(JSON.stringify(data));
      } catch (error) {
        deadConnections.push(id);
      }
    }

    // Clean up dead connections
    deadConnections.forEach((id) => this.removeConnection(id));
  }

  getConnectionCount() {
    return this.connections.size;
  }
}

export const sse = new SimpleSSE();
