import express from "express";
import { createServer } from "http";
import next from "next";
import { Server, Socket } from "socket.io";

const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let waitingUser: string | null = null;

  const pairUsers = (socket1: Socket, socket2: Socket) => {
    const roomName = `room-${socket1.id}-${socket2.id}`;

    socket1.data.partnerId = socket2.id;
    socket1.data.roomName = roomName;

    socket2.data.partnerId = socket1.id;
    socket2.data.roomName = roomName;

    socket1.join(roomName);
    socket2.join(roomName);

    socket1.emit("paired", { partnerId: socket2.id });
    socket2.emit("paired", { partnerId: socket1.id });
  };

  io.on("connection", (socket: Socket) => {
    if (!waitingUser) {
      waitingUser = socket.id;
      socket.emit("waiting");
    } else {
      const waitingSocket = io.sockets.sockets.get(waitingUser);
      if (waitingSocket) {
        pairUsers(socket, waitingSocket);
        waitingUser = null;
      } else {
        waitingUser = socket.id;
        socket.emit("waiting");
      }
    }

    socket.on("find-partner", () => {
      if (socket.data.partnerId) {
        const oldPartner = io.sockets.sockets.get(socket.data.partnerId);
        if (oldPartner) {
          oldPartner.emit("partner-left");
          oldPartner.leave(socket.data.roomName);
          oldPartner.data.partnerId = null;
          oldPartner.data.roomName = null;
        }
        socket.leave(socket.data.roomName);
        socket.data.partnerId = null;
        socket.data.roomName = null;
      }

      if (waitingUser && waitingUser !== socket.id) {
        const waitingSocket = io.sockets.sockets.get(waitingUser);
        if (waitingSocket) {
          pairUsers(socket, waitingSocket);
          waitingUser = null;
          return;
        }
      }

      waitingUser = socket.id;
      socket.emit("waiting");
    });

    socket.on("message", (msg) => {
      if (socket.data.roomName) {
        socket.to(socket.data.roomName).emit("message", msg);
      }
    });

    socket.on("typing", (isTyping: boolean) => {
      if (socket.data.roomName) {
        socket.to(socket.data.roomName).emit("partner-typing", isTyping);
      }
    });

    socket.on("disconnect", () => {
      if (waitingUser === socket.id) {
        waitingUser = null;
      }

      if (socket.data.partnerId) {
        const partnerSocket = io.sockets.sockets.get(socket.data.partnerId);
        if (partnerSocket) {
          partnerSocket.emit("partner-left");
          partnerSocket.leave(socket.data.roomName);
          partnerSocket.data.partnerId = null;
          partnerSocket.data.roomName = null;
        }
      }
    });
  });

  server.all("*", (req, res) => handle(req, res));

  const PORT = process.env.PORT || 3000;

  httpServer.listen(PORT, () => {
    console.log(`> Server running on ${PORT}`);
  });
});
