// third-party
import { FormattedMessage } from 'react-intl';

// assets
import FileDoneOutlined from '@ant-design/icons/FileDoneOutlined';
import StepForwardOutlined from '@ant-design/icons/StepForwardOutlined';

// icons
const icons = {
  FileDoneOutlined,
  StepForwardOutlined,
};

const formsTables = {
  id: 'wizard',
  title: <FormattedMessage id="forms-wizard" />,
  type: 'group',
  url: '/forms/wizard',
  icon: icons.StepForwardOutlined
};

export default formsTables;


// // third-party
// import { FormattedMessage } from 'react-intl';

// // assets
// import CloudUploadOutlined from '@ant-design/icons/CloudUploadOutlined';
// import FileDoneOutlined from '@ant-design/icons/FileDoneOutlined';
// import FormOutlined from '@ant-design/icons/FormOutlined';
// import PieChartOutlined from '@ant-design/icons/PieChartOutlined';
// import StepForwardOutlined from '@ant-design/icons/StepForwardOutlined';
// import TableOutlined from '@ant-design/icons/TableOutlined';
// import InsertRowAboveOutlined from '@ant-design/icons/InsertRowAboveOutlined';

// // type

// // icons
// const icons = {
//   CloudUploadOutlined,
//   FileDoneOutlined,
//   FormOutlined,
//   PieChartOutlined,
//   StepForwardOutlined,
//   TableOutlined,
//   InsertRowAboveOutlined
// };

// // ==============================|| MENU ITEMS - FORMS & TABLES ||============================== //

// const formsTables = {
//   id: 'group-forms-tables',
//   title: <FormattedMessage id="forms-tables" />,
//   icon: icons.FileDoneOutlined,
//   type: 'group',
//   children: [
//     {
//       id: 'wizard',
//       title: <FormattedMessage id="forms-wizard" />,
//       type: 'item',
//       url: '/forms/wizard',
//       icon: icons.StepForwardOutlined
//     }
//   ]
// };

// export default formsTables;
