import HomeIcon from '@mui/icons-material/Home';
import AddCardIcon from '@mui/icons-material/AddCard';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import EditNoteIcon from '@mui/icons-material/EditNote';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CompareIcon from '@mui/icons-material/Compare';
import PollIcon from '@mui/icons-material/Poll';

const navOptns = [
  {
    navName: 'Home',
    navPath: '/',
    navIcon: <HomeIcon />,
  },
  {
    navName: 'Complaint',
    navPath: '/complaint',
    navIcon: <AddCardIcon />,
  },
  {
    navName: 'Approve Complaint',
    navPath: '/complaint2',
    navIcon: <CreditScoreIcon />,
  },

  // {
  //   navName: 'Builder Form',
  //   navPath: '/builder-form',
  //   navIcon: <EditNoteIcon />,
  // },
  {
    navName: 'Detect Buildings',
    navPath: '/buildings',
    navIcon: <ApartmentIcon />,
  },
  // {
  //   navName: 'Drone Paths',
  //   navPath: '/drone-path',
  //   navIcon: <HomeIcon />,
  // },
  {
    navName: 'Surveys',
    navPath: '/survey',
    navIcon: <PollIcon />,
  },
  {
    navName: 'Satellite Analysis',
    navPath: '/sat-compare',
    navIcon: <CompareIcon />,
  },
];

export default navOptns;