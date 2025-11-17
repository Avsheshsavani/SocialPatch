import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        position: "relative",
        overflow: "auto",
        "&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('/assets/robin-unsplash.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(8px)",
          zIndex: -1
        },
        "&::after": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: -1
        }
      }}
    >
      <Box
        width="100%"
        backgroundColor="rgba(0, 0, 0, 0.7)"
        backdropFilter="blur(10px)"
        p="1rem 6%"
        textAlign="center"
        borderBottom={`2px solid ${theme.palette.primary.main}`}
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          SocialPatch
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={
          theme.palette.mode === "dark"
            ? "rgba(26, 26, 26, 0.95)"
            : "rgba(255, 255, 255, 0.95)"
        }
        backdropFilter="blur(20px)"
        boxShadow="0 8px 32px 0 rgba(0, 150, 136, 0.37)"
        border={`1px solid ${theme.palette.primary.main}40`}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to SocialPatch, the SocialPatch for Social Connection!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
