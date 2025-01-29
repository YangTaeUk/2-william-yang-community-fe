import React from 'react';
import {
  Box,
  Modal,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  height: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'row', // 좌/우 레이아웃
};

const FeedDetailModal = ({ open, handleClose, feed }) => {
  if (!feed) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* 피드 상세 */}
        <Box sx={{ flex: 2, pr: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {feed.username}의 게시글
          </Typography>
          <Divider />
          <Typography variant="body1" sx={{ mt: 2 }}>
            {feed.caption}
          </Typography>
        </Box>
        {/* 댓글 리스트 */}
        <Box sx={{ flex: 1, overflowY: 'auto', borderLeft: '1px solid #ddd', pl: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            댓글 목록
          </Typography>
          <List>
            {feed.comments.map((comment) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={comment.username}
                    secondary={comment.text}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Box>
    </Modal>
  );
};

export default FeedDetailModal;
