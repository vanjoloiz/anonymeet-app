import { Message } from "@/types/chat";
import { Avatar, Box, Typography } from "@mui/material";
import { format } from "date-fns";

const MessageBubble = ({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isOwn ? "row-reverse" : "row",
        alignItems: "flex-end",
        mb: 1.5,
        px: 1,
      }}
    >
      <Avatar
        sx={{
          bgcolor: isOwn ? "primary.main" : "grey.500",
          width: 32,
          height: 32,
          fontSize: 14,
          ml: isOwn ? 1 : 0,
          mr: isOwn ? 0 : 1,
          userSelect: "none",
        }}
      >
        {isOwn ? "Y" : "P"}
      </Avatar>

      <Box
        sx={{
          maxWidth: "70%",
          background: isOwn
            ? "linear-gradient(135deg, #4caf50 0%, #81c784 100%)"
            : "#fff",
          color: isOwn ? "#fff" : "text.primary",
          borderRadius: 3,
          p: 1.25,
          fontSize: 14,
          wordBreak: "break-word",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        }}
      >
        <Typography component="span">{message.content}</Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.5,
            opacity: 0.7,
            fontSize: 11,
            textAlign: "right",
            userSelect: "none",
          }}
        >
          {format(message.timestamp, "MMM d, yyyy h:mm a")}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageBubble;
