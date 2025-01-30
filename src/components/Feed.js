import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  Fab,
  IconButton,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import FeedDetailModal from './FeedDetailModal'; // ✅ 기존 모달 활용

const Feed = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [open, setOpen] = useState(false); // ✅ 모달 상태
  const observer = useRef();
  const hasFetched = useRef(false);
  const [commentInputs, setCommentInputs] = useState({}); // ✅ 댓글 입력 상태 관리

  // ✅ 게시글 불러오기
  const fetchPosts = async (page = 1) => {
    if (loading) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/posts?page=${page}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("데이터 불러오기 실패");

      const data = await response.json();

      // ✅ comments가 없으면 빈 배열 추가
      const updatedPosts = data.posts.map((post) => ({
        ...post,
        comments: post.comments || [],
      }));

      setPosts((prevPosts) => [...prevPosts, ...updatedPosts]);

      if (!Array.isArray(data.posts)) {
        return;
      }
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error("🚨 fetchPosts 오류:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 무한 스크롤 (Intersection Observer)
  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
          fetchPosts(currentPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, currentPage, totalPages]
  );

  // ✅ 페이지 첫 로딩 시 초기 데이터 가져오기
  useEffect(() => {
    if (!hasFetched.current) {
      fetchPosts(1);
      hasFetched.current = true;
    }
  }, []);

  // ✅ 날짜 포맷 변환 함수
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  // ✅ 피드 상세보기 모달 열기
  const handleOpen = (post) => {
    if (!post || typeof post !== "object") {
      return;
    }

    setSelectedPost(post); // ✅ 상태 업데이트
  };

  // ✅ `useEffect`를 사용하여 `selectedPost`가 변경된 후 `open`을 true로 설정
  useEffect(() => {
    if (selectedPost) {
      setOpen(true);
    }
  }, [selectedPost]);

  // ✅ 피드 상세보기 모달 닫기
  const handleClose = () => {
    setSelectedPost(null);
    setOpen(false);
  };

  // ✅ 댓글 입력 필드 변경 핸들러
  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  // ✅ 댓글 제출 핸들러
  const handleCommentSubmit = async (postId) => {
    const commentContent = commentInputs[postId]?.trim();
    if (!commentContent) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: commentContent }),
      });

      if (!response.ok) throw new Error('댓글 등록 실패');

      const newComment = await response.json();

      // ✅ 새로운 댓글을 추가하고 상태 업데이트
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...(post.comments || []), newComment] }
            : post
        )
      );

      // ✅ 입력 필드 초기화
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: '600px', margin: '0 auto', mt: 4, position: 'relative' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        최신 피드
      </Typography>

      {/* ✅ 글 작성 버튼 */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
        onClick={() => navigate('/feed/create')}
      >
        <AddIcon />
      </Fab>

      {/* ✅ 게시글이 없을 경우 */}
      {!loading && posts.length === 0 && (
        <Typography sx={{ textAlign: 'center', color: 'gray', my: 5 }}>
          게시글이 없습니다.
        </Typography>
      )}

      {/* ✅ 게시글 리스트 */}
      {posts.map((post, index) => (
        <Card key={post.id} sx={{ mb: 3, p: 2, position: 'relative' }}>
          {/* ✅ 피드 상단 (프로필 정보 + 상세보기 아이콘) */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar>{post.author.username[0].toUpperCase()}</Avatar>
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {post.author.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(post.createdAt)}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => handleOpen(post)}>
              <MoreVertIcon />
            </IconButton>
          </Box>

          <CardContent>
            <Typography variant="h6">{post.title}</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
              {post.content}
            </Typography>
          </CardContent>

          {/* ✅ 댓글 표시 (최대 2개) */}
          <Box sx={{ mt: 2, px: 1 }}>
            {post.comments.length > 0 ? (
              post.comments.slice(0, 2).map((comment) => (
                <Typography key={comment.id} variant="body2">
                  <b>{comment.author.username}</b>: {comment.content}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                댓글 없음
              </Typography>
            )}
            {post.comments.length > 2 && (
              <Button size="small" onClick={() => handleOpen(post)}>
                더 보기
              </Button>
            )}
          </Box>
        </Card>
      ))}

      {/* ✅ 피드 상세 모달 (기존 `FeedDetailModal.js` 활용) */}
      {selectedPost && (
        <FeedDetailModal open={open} handleClose={handleClose} feed={selectedPost} />
      )}
    </Box>
  );
};

export default Feed;
