"use client";

import { useRouter } from "next/navigation";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import FlashOnOutlinedIcon from "@mui/icons-material/FlashOnOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";

const HomePage = () => {
  const features = [
    {
      icon: (
        <VisibilityOffOutlinedIcon
          sx={{ fontSize: 40, color: "primary.main" }}
        />
      ),
      title: "100% Anonymous",
      desc: "Join meetings without sharing your name, email, or phone number.",
    },
    {
      icon: <LockOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Secure & Encrypted",
      desc: "Your conversations are encrypted end-to-end for maximum privacy.",
    },
    {
      icon: (
        <FlashOnOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />
      ),
      title: "One-Click Access",
      desc: "Start a meeting instantly — no downloads, no sign-ups.",
    },
    {
      icon: (
        <DevicesOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />
      ),
      title: "Cross-Platform",
      desc: "Works seamlessly on desktop, tablet, and mobile devices.",
    },
    {
      icon: (
        <PeopleOutlineOutlinedIcon
          sx={{ fontSize: 40, color: "primary.main" }}
        />
      ),
      title: "Group or 1-on-1",
      desc: "Host private one-on-one chats or group video calls easily.",
    },
    {
      icon: <PublicOutlinedIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Global Access",
      desc: "Connect with anyone, anywhere in the world without restrictions.",
    },
  ];

  const router = useRouter();

  return (
    <>
      <Box
        sx={{
          background: "linear-gradient(135deg, #0B72FF 0%, #004AAD 100%)",
          color: "white",
          py: { xs: 10, md: 14 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight={800}
            sx={{
              fontSize: { xs: "2.2rem", md: "3.2rem" },
              lineHeight: 1.2,
            }}
          >
            Meet. Talk. Stay Anonymous.
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              mb: 5,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            AnonyMeet lets you connect in secure, anonymous video rooms — no
            personal info required.
          </Typography>
          <Button
            onClick={() => router.push("/chat")}
            variant="contained"
            size="large"
            sx={{
              bgcolor: "secondary.main",
              color: "black",
              fontWeight: "bold",
              px: 5,
              py: 1.5,
              borderRadius: "999px",
              fontSize: "1.1rem",
              "&:hover": { bgcolor: "secondary.dark" },
            }}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          fontWeight={800}
          gutterBottom
        >
          Why Choose AnonyMeet?
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto", mb: 6 }}
        >
          We believe in private, secure, and effortless communication for
          everyone — anywhere in the world.
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }} display="flex">
              <Paper
                elevation={3}
                sx={{
                  p: 5,
                  textAlign: "center",
                  borderRadius: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  flexGrow: 1,
                  minHeight: 220,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                {feature.icon}
                <Typography variant="h6" fontWeight={700}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box
        sx={{
          bgcolor: "grey.900",
          color: "white",
          py: { xs: 8, md: 10 },
          textAlign: "center",
        }}
      >
        <Container>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Ready to meet anonymously?
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 4, maxWidth: 500, mx: "auto", opacity: 0.85 }}
          >
            Start your first private conversation in seconds — it’s free and
            always secure.
          </Typography>
          <Button
            onClick={() => router.push("/chat")}
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              color: "black",
              fontWeight: "bold",
              px: 5,
              py: 1.5,
              borderRadius: "999px",
              fontSize: "1.1rem",
              "&:hover": { bgcolor: "secondary.dark" },
            }}
          >
            Start Meeting
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
