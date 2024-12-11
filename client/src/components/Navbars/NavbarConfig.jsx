import HomeIcon from '@mui/icons-material/Home';

const navOptns = [
  {
    navName: 'Home',
    navPath: '/',
    navIcon: <HomeIcon />,
  },
  {
    navName: 'Complaint',
    navPath: '/complaint',
    navIcon: <HomeIcon />,
  },
  {
    navName: 'Approve Ct',
    navPath: '/complaint2',
    navIcon: <HomeIcon />,
  },

  {
    navName: 'Builder Form',
    navPath: '/builder-form',
    navIcon: <HomeIcon />,
  },
  {
    navName: 'Detect Buildings',
    navPath: '/buildings',
    navIcon: <HomeIcon />,
  },
  // {
  //   navName: 'Drone Paths',
  //   navPath: '/drone-path',
  //   navIcon: <HomeIcon />,
  // },
  {
    navName: 'Surveys',
    navPath: '/survey',
    navIcon: <HomeIcon />,
  },
  {
    navName: 'Compare Satellite Images',
    navPath: '/sat-compare',
    navIcon: <HomeIcon />,
  },
];

export default navOptns;
