import { Button, Stack, Box } from "@mui/material";

const MainNav = () => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
	  width="100%"
	  sx={{ position: "sticky", 
        top: 0, 
        zIndex: 100,
		backdropFilter: "blur(6px)",
	}}
      py={1.7}
      px={3}
    >


      <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={2} pr={4}>
        <Button variant="outlined" color="primary"  sx={{ px:4, fontSize:"16px",borderWidth:"2px" }}>
          Settings
        </Button>
        <Button variant="outlined" color="primary" sx={{ px:4, fontSize:"16px",borderWidth:"2px" }}>
          Logout
        </Button>

		<Box
          component="img"
          src="/me.png"
          alt="User Avatar"
          sx={{
            width: 50, 
			aspectRatio: "1/1",
			borderRadius: "20%", 
			border: "3px solid #979797",
		}}
        />
      </Stack>
    </Stack>
  );
};

export default MainNav;
