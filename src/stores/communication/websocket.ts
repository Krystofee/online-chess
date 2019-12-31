class Websocket implements ICommunication {
  socket: WebSocket;

  constructor(
    socketUrl: string,
    onOpen: (this: WebSocket, ev: Event) => any,
    onReceive: (this: WebSocket, ev: MessageEvent) => void,
  ) {
    this.socket = new WebSocket(socketUrl);
    this.socket.onopen = onOpen;
    this.socket.onmessage = onReceive;
  }

  send = async (action: ClientAction, data: ClientSendData) => {
    this.socket.send(JSON.stringify([action, data]));
  };

  close = () => {
    this.socket.close();
  };
}

export default Websocket;
