import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import { TrendingUp, Dashboard, TableChart, AccountCircle } from '@mui/icons-material';

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleAccountMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <div>
      {/* 상단 로고 */}
      <Toolbar>
        <Typography variant="h6" noWrap>
          Instagram Clone
        </Typography>
      </Toolbar>
      <Divider />
      {/* 네비게이션 항목 */}
      <List>
        {[
          { text: '게시판', icon: <Dashboard /> },
          { text: '데이터그리드', icon: <TableChart /> },
          { text: '통계', icon: <TrendingUp /> },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {/* 사용자 계정 메뉴 */}
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleAccountMenuOpen}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="계정 설정" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </div>
  );

  const accountMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleAccountMenuClose}
    >
      {['프로필 수정', '로그아웃', '로그인'].map((menu) => (
        <MenuItem key={menu} onClick={handleAccountMenuClose}>
          {menu}
        </MenuItem>
      ))}
    </Menu>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* 모바일 Drawer */}
        <Drawer
          container={container}
          variant="temporary"
          open={false}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* 데스크톱 Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      {/* 계정 메뉴 */}
      {accountMenu}
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
