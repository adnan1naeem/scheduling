import { useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Image from 'next/legacy/image';

// project import
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';
import IconButton from 'components/@extended/IconButton';

import { DRAWER_WIDTH, MINI_DRAWER_WIDTH, MenuOrientation, ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import LogoIcon from './LogoIcon';
import logoImage from '/public/assets/images/contact/logo.png';

// assets
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';


// ==============================|| MAIN LAYOUT - HEADER ||============================== //

export default function Header() {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const { mode, menuOrientation } = useConfig();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  // header content
  const headerContent = useMemo(() => <HeaderContent />, []);

  const iconBackColor = mode === ThemeMode.DARK ? 'background.default' : 'grey.100';

  // common header
  const mainHeader = (
    <Toolbar>
      {/* <Image src={logoImage} width={120} height={120} /> */}
    </Toolbar>
  );

  // app-bar params
  const appBar = {
    position: 'fixed',
    color: 'inherit',
    elevation: 0,
  };

  return (
    <>
      <AppBar {...appBar}></AppBar>
    </>
  );
}
