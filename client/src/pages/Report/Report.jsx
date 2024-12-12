import { Box, Paper, Typography } from "@mui/material";
import { Grid, Stack } from "@mui/system";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Report = () => {
  const params = useParams();
  const id = params.id;
  const [pincode, setPincode] = useState("");
  const [date, setDate] = useState("");

  const fetchPincode = async () => {
    try {
      const res = await axios.get(
        config.api.baseUrl + "/inspection/fetch/" + id
      );

      if (res.status === 200) {
        setPincode(res.data.area_pincode);
        setDate(res.data.date);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const [data,setData]=useState({
	total_nodes:25,
	previous_flags:2,
	builder_projects:4,
	complaints:5,
	nodes:[
		{id:"ghjkjhjklkj",name:"1bnbnbvbh"},
		{id:"ghjkjhjklka",name:"1bnbnbvbh"},
		{id:"ghjkjhjklkd",name:"1bnbnbvbh"},
		{id:"ghjkjhjklkf",name:"1bnbnbvbh"},
		{id:"ghjkjhjklkv",name:"1bnbnbvbh"},
		{id:"ghjkjhjk",name:"1bnbnbvbh"},
		{id:"lkv",name:"1bnbnbvbh"},
	]
  })

  const [nodeIdx,setNodeIdx]=useState(-1);

  const [nodeData,setNodeData]=useState({
	
  })

  useEffect(() => {
    // fetchPincode();
    // fetchInitialData();
  }, [pincode]);

  return (
    <Box p={2}>
      <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }} color="primary">
        Survey Report{" "}
        <span style={{ color: "black", fontWeight: 500, fontSize: "36px" }}>
          {" "}
          - {pincode} | {dayjs(date).format("DD MMMM YYYY")}
        </span>
      </Typography>

      <Stack direction="row" gap={4}>
        <Paper sx={{ p: 2, width: 1 }} elevation={6}>
			<Stack gap={2} width={1} direction="row" alignItems="center" justifyContent="space-between">
				<Paper elevation={10} sx={{width:1,p:2}}>
					<Typography variant="h2" color="var(--primary-color)">{data.total_nodes}</Typography>
					<Typography variant="h6" >Total Nodes</Typography>
				</Paper>
				<Paper elevation={10} sx={{width:1,p:2}}>
					<Typography variant="h2" color="var(--primary-color)">{data.previous_flags}</Typography>
					<Typography variant="h6" >Previous Flags</Typography>
				</Paper>
			</Stack>
			<Stack gap={2} width={1} mt={2} direction="row" alignItems="center" justifyContent="space-between">
				<Paper elevation={10} sx={{width:1,p:2}}>
					<Typography variant="h2" color="var(--primary-color)">{data.builder_projects}</Typography>
					<Typography variant="h6" >Buildings</Typography>
				</Paper>
				<Paper elevation={10} sx={{width:1,p:2}}>
					<Typography variant="h2" color="var(--primary-color)">{data.complaints}</Typography>
					<Typography variant="h6" >Complaints</Typography>
				</Paper>
			</Stack>
        </Paper>
        <Paper sx={{ p: 2, width: 1 }} elevation={6}></Paper>
      </Stack>

		<Stack mt={3} direction="row" gap={2}>
			<Paper sx={{width:"0.25",p:2,pr:0.4}} elevation={6}>
			<Typography variant="h4" sx={{ fontWeight:600,lineHeight: 1, mb: 1 }}>
            Nodes
          </Typography>

			<Stack
                  sx={{
					width:1,
                    height: "38vh",
                    overflowY: "auto",
					pr:2,
                  }}
                >
                  {data.nodes.map((node, index) => (
                    <Box
                      key={index}
                      sx={{
						width:1,
						py:0.5,
						my:1,
						textAlign:"center",
						cursor:"pointer",
						px:2,
                        position: "relative",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
						color:nodeIdx===index?"white":"var(--primary-color)",
						background:nodeIdx===index?"var(--primary-color)":"#f9f9f9",
                      }}
                    >
                      <Typography
                        variant="h6"
                        lineHeight={1.3}
                        mb={1}
                        mt={1}
                        gutterBottom
                      >
                        {node.name}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
			</Paper>


		</Stack>


    </Box>
  );
};

export default Report;
