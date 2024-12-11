import { Box, Stack, Typography } from "@mui/material";
import navOptns from "./NavbarConfig.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const selectedStyle = { background: "var(--primary-color)", color: "white" };
  const navigate = useNavigate();

  return (
    <Box width="20%" p={2} sx={{ background: "#F5F5F5" }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={1}
        mt={2}
      >
        <Typography variant="h4" fontWeight={700} fontSize="40px">
          Plot
        </Typography>
        <Box
          sx={{ px: 1, borderRadius: 1, background: "var(--primary-color)", color: "white" }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            fontSize="40px"
            textAlign="center"
          >
            Patrol
          </Typography>
        </Box>
      </Stack>

      <Stack mt={12} px={3} gap={1}>
        {navOptns.map((navOptn, index) => (
          <Stack
            key={navOptn.navPath || index}
            direction="row"
            alignItems="center"
            gap={1}
            sx={{
              cursor: "pointer",
              py: 1,
              borderRadius: "12px",
              transition: "ease-in-out 0.3s",
              px: 2,
              ...(navOptn.navPath === window.location.pathname
                ? selectedStyle
                : {
                  '&:hover':{
                  color: "var(--primary-color)",
                }
                }),
                
            }}
            onClick={() => navigate(navOptn.navPath)}
          >
            {navOptn.navIcon}
            <Typography  variant="h6" fontSize="17px">{navOptn.navName}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default Navbar;
