"use client";

import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";
import type { Message } from "@/types/chat";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Divider,
  Tooltip,
  Container,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import MessageBubble from "@components/MessageBubble";

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>(
    "Waiting for a partner to join..."
  );
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [isFindingPartner, setIsFindingPartner] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const [isFindAnotherClicked, setIsFindAnotherClicked] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on("paired", ({ partnerId }) => {
      setPartnerId(partnerId);
      setStatusMessage("Paired! Say hi 👋");
      setIsFindingPartner(false);
    });

    socket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("partner-left", () => {
      setPartnerId(null);
      setMessages([]);
      setPartnerTyping(false);
      setStatusMessage("Your partner has left.");
    });

    socket.on("partner-typing", (isTyping: boolean) => {
      setPartnerTyping(isTyping);
    });

    socket.on("waiting", () => {
      // setStatusMessage("Waiting for a partner to join...");
      setIsFindingPartner(false);
    });

    return () => {
      socket.disconnect();
      socket.off("paired");
      socket.off("message");
      socket.off("partner-left");
      socket.off("partner-typing");
      socket.off("waiting");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!partnerId || !input.trim()) return;
    const msg: Message = {
      senderId: socket.id!,
      partnerId,
      content: input.trim(),
      timestamp: Date.now(),
    };
    socket.emit("message", msg);
    setMessages((prev) => [...prev, msg]);
    setInput("");
    stopTyping();
  };

  const startTyping = () => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit("typing", true);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(stopTyping, 1500);
  };

  const stopTyping = () => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
      socket.emit("typing", false);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const findAnotherPartner = () => {
    setStatusMessage("Finding new partner...");
    setIsFindingPartner(true);
    setIsFindAnotherClicked(true);
    socket.emit("find-partner");
  };

  // console.log(statusMessage);

  const isShowFindAnotherButton =
    (!partnerId && !isFindAnotherClicked) ||
    statusMessage === "Your partner has left.";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "grey.100",
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #0B72FF 0%, #004AAD 100%)",
          color: "white",
          py: { xs: 3, md: 4 },
          px: { xs: 3, md: 6 },
          textAlign: "center",
          userSelect: "none",
          letterSpacing: 1,
          fontWeight: 800,
          fontSize: { xs: "1.8rem", md: "2.6rem" },
        }}
      >
        <Typography
          variant="h3"
          component="h3"
          gutterBottom
          fontWeight={500}
          sx={{
            fontSize: { xs: "2.2rem", md: "3.2rem" },
            lineHeight: 1.2,
            mb: 0,
          }}
        >
          AnonyMeet
        </Typography>
      </Box>

      <Container
        maxWidth="md"
        sx={{ flex: 1, display: "flex", flexDirection: "column", py: 4 }}
      >
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow:
              "rgba(11, 114, 255, 0.12) 0px 4px 20px, rgba(0, 74, 173, 0.08) 0px 2px 8px",
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              px: 3,
              py: 2,
              backgroundColor: "white",
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#0B72FF",
                borderRadius: 3,
              },
            }}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.length === 0 && (
              <Box
                sx={{
                  mt: 6,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body1"
                  color="text.secondary"
                  fontStyle="italic"
                  mb={2}
                >
                  {statusMessage}
                </Typography>

                {isShowFindAnotherButton && (
                  <>
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      onClick={findAnotherPartner}
                      loading={isFindingPartner}
                      disabled={isFindingPartner}
                      loadingPosition="start"
                      sx={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        transition: "transform 0.1s ease",
                        "&:active": {
                          transform: "scale(0.97)",
                        },
                      }}
                    >
                      {isFindingPartner
                        ? "Searching..."
                        : "Find Another Partner"}
                    </LoadingButton>

                    {isFindingPartner && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        mt={1}
                        sx={{ userSelect: "none" }}
                      >
                        Looking for a new partner. Please wait...
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            )}

            {messages.map((msg) => (
              <MessageBubble
                key={msg.timestamp}
                message={msg}
                isOwn={msg.senderId === socket.id}
              />
            ))}

            <div ref={messagesEndRef} />
          </Box>

          <Divider />

          <Box
            sx={{
              minHeight: 24,
              px: 3,
              pt: 1,
              fontStyle: "italic",
              color: "text.secondary",
              userSelect: "none",
              bgcolor: "background.paper",
            }}
            aria-live="polite"
            aria-atomic="true"
          >
            <Typography variant="subtitle1">
              {partnerTyping && "Partner is typing..."}
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
              bgcolor: "background.default",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              size="medium"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                startTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              multiline
              maxRows={4}
              aria-label="Message input"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
              disabled={!partnerId}
            />

            <Tooltip title="Send message" arrow>
              <span>
                <IconButton
                  color="secondary"
                  onClick={sendMessage}
                  disabled={!input.trim() || !partnerId}
                  aria-label="Send message"
                  sx={{
                    bgcolor: "secondary.main",
                    color: "black",
                    "&:hover": { bgcolor: "secondary.dark" },
                    borderRadius: "50%",
                    p: 1.5,
                  }}
                >
                  <SendIcon fontSize="medium" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChatPage;
