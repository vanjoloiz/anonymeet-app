import { io, Socket } from "socket.io-client";

const socket: Socket = io(undefined, { autoConnect: false });

export default socket;
