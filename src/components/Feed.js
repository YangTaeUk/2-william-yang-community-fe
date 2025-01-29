import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
} from '@mui/material';
import { FavoriteBorder, ChatBubbleOutline, MoreHoriz, OpenInNew } from '@mui/icons-material';
import FeedDetailModal from './FeedDetailModal';

const sampleData = [
  {
    id: 1,
    username: 'hyezi0801',
    profileImage: 'https://via.placeholder.com/50',
    feedImage: 'https://via.placeholder.com/500',
    caption: '비숑컷 어뗘네ㅋ 🐶',
    likes: 2332,
    comments: [
      { id: 1, username: 'user1', text: '너무 귀여워요!' },
      { id: 2, username: 'user2', text: '저도 비숑 키우고 싶어요!' },
    ],
    timestamp: new Date().getTime() - 10 * 60 * 1000, // 10분 전
  },
  {
    id: 2,
    username: 'john_doe',
    profileImage: 'https://via.placeholder.com/50',
    feedImage: 'https://via.placeholder.com/500',
    caption: 'Beautiful day in the park!',
    likes: 1450,
    comments: [
      { id: 1, username: 'user3', text: '멋진 사진이네요!' },
      { id: 2, username: 'user4', text: '풍경이 정말 예뻐요.' },
    ],
    timestamp: new Date().getTime() - 45 * 60 * 1000, // 45분 전
  },
  // 데이터 추가 가능
];

const Feed = () => {
  const [feeds, setFeeds] = useState([]);
  const [page, setPage] = useState(1);
  const [commentInputs, setCommentInputs] = useState({}); // 각 게시물의 댓글 입력값 저장
  const [selectedFeed, setSelectedFeed] = useState(null); // 선택된 피드
  const [modalOpen, setModalOpen] = useState(false);
  const feedsPerPage = 5;

  const loadMoreFeeds = () => {
    const newFeeds = sampleData.slice(
      (page - 1) * feedsPerPage,
      page * feedsPerPage
    );
    setFeeds((prevFeeds) => [...prevFeeds, ...newFeeds]);
  };

  useEffect(() => {
    loadMoreFeeds();
  }, [page]);

  const handleOpenModal = (feed) => {
    setSelectedFeed(feed);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedFeed(null);
    setModalOpen(false);
  };

  const formatTime = (timestamp) => {
    const now = new Date().getTime();
    const diffMinutes = Math.floor((now - timestamp) / (1000 * 60));
    if (diffMinutes < 60) return `${diffMinutes}분 전`;
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}시간 전`;
  };

  const handleCommentChange = (feedId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [feedId]: value,
    }));
  };

  const handleAddComment = (feedId) => {
    const newComment = {
      id: Math.random(), // 임의의 고유 ID 생성
      username: '현재유저', // 현재 유저명 (예: 로그인 사용자)
      text: commentInputs[feedId] || '',
    };

    if (!newComment.text.trim()) return; // 빈 댓글은 추가하지 않음

    setFeeds((prevFeeds) =>
      prevFeeds.map((feed) =>
        feed.id === feedId
          ? { ...feed, comments: [...feed.comments, newComment] }
          : feed
      )
    );

    setCommentInputs((prev) => ({ ...prev, [feedId]: '' })); // 입력 필드 초기화
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      {feeds.map((feed) => (
        <Card key={feed.id} sx={{ mb: 2 }}>
          {/* 유저 정보 */}
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={feed.profileImage} alt={feed.username} />
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {feed.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatTime(feed.timestamp)}
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton>
                <MoreHoriz />
              </IconButton>
              <IconButton onClick={() => handleOpenModal(feed)}>
                <OpenInNew />
              </IconButton>
            </Box>
            </Box>
          {/* 게시물 이미지 */}
          <CardMedia
            component="img"
            height="500"
            image={feed.feedImage}
            alt={feed.caption}
          />
          {/* 캡션 및 정보 */}
          <CardContent>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {feed.caption}
            </Typography>
            {/* 좋아요 및 댓글 아이콘 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <IconButton>
                <FavoriteBorder />
              </IconButton>
              <IconButton>
                <ChatBubbleOutline />
              </IconButton>
            </Box>
            {/* 좋아요 및 댓글 수 */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              좋아요 {feed.likes.toLocaleString()}개
            </Typography>
            {/* 댓글 표시 */}
            {feed.comments.map((comment) => (
              <Typography variant="body2" key={comment.id} sx={{ mb: 0.5 }}>
                <strong>{comment.username}</strong> {comment.text}
              </Typography>
            ))}
            {/* 댓글 추가 입력 */}
            <Box sx={{ display: 'flex', mt: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="댓글 추가..."
                value={commentInputs[feed.id] || ''}
                onChange={(e) => handleCommentChange(feed.id, e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ ml: 1 }}
                onClick={() => handleAddComment(feed.id)}
              >
                추가
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
      {/* 더보기 버튼 */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setPage((prev) => prev + 1)}
        sx={{ width: '100%', mt: 2 }}
      >
        더 보기
      </Button>
      <FeedDetailModal open={modalOpen} handleClose={handleCloseModal} feed={selectedFeed} />
    
    </Box>
  );
};

export default Feed;
