import React, { useState, useEffect }  from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  IconButton,
  Grid,
  Card,
  CardMedia,
} from '@mui/material';
import { PhotoCamera, Delete, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CreateFeed = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  //로그인 여부 확인 함수
  const authChecker = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/feed'); //비로그인 상태면 /feed로 이동
    }
  };
  //페이지가 로드될 때 로그인 여부 확인
  useEffect(() => {
    authChecker();
  }, []);

  //이미지 업로드 핸들러
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + images.length > 5) {
      alert('최대 5개의 이미지만 업로드할 수 있습니다.');
      return;
    }

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...files]);
    setPreviewImages([...previewImages, ...newPreviewUrls]);
  };

  //이미지 삭제 핸들러
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previewImages];

    // 미리보기 URL 해제
    URL.revokeObjectURL(newPreviews[index]);

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setImages(newImages);
    setPreviewImages(newPreviews);
  };
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('인증이 필요합니다. 로그인 후 이용해주세요.');
      navigate('/login');
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      ...options.headers, // 기존 헤더 유지
    };

    const response = await fetch(url, { ...options, headers });
    return response;
  };
  //게시글 등록 API 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const response = await fetchWithAuth('http://localhost:4000/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('게시글이 성공적으로 등록되었습니다.');
        navigate('/feed');
      } else {
        const data = await response.json();
        alert(data.error || '게시글 등록에 실패했습니다.');
      }
    } catch (error) {
      alert('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };


  //작성 취소 핸들러 (입력값 초기화 + `/feed`로 이동)
  const handleCancel = () => {
    setTitle('');
    setContent('');

    //메모리 정리
    previewImages.forEach((url) => URL.revokeObjectURL(url));

    setImages([]);
    setPreviewImages([]);

    //`/feed`로 이동
    navigate('/feed');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        글 작성
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
        <TextField
          label="제목"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/*  내용 입력란 - 크기 조정 가능 */}
        <TextField
          label="내용"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{
            resize: 'vertical',
            overflow: 'auto',
          }}
        />

        {/* 이미지 업로드 */}
        <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
          <Button
            variant="contained"
            component="label"
            startIcon={<PhotoCamera />}
          >
            이미지 업로드
            <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
          </Button>
          <Typography sx={{ ml: 2 }}>
            {images.length} / 5 (최대 5개)
          </Typography>
        </Box>

        {/* 이미지 미리보기 */}
        <Grid container spacing={2}>
          {previewImages.map((image, index) => (
            <Grid item xs={4} key={index}>
              <Card sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="120"
                  image={image}
                  alt={`이미지 ${index + 1}`}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                  }}
                  onClick={() => handleRemoveImage(index)}
                >
                  <Delete sx={{ color: 'white' }} />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* 버튼 그룹 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ flex: 1, mr: 1 }}
            disabled={loading}
          >
            {loading ? '등록 중...' : '게시글 등록'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{ flex: 1 }}
            startIcon={<Cancel />}
            onClick={handleCancel}
          >
            취소
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateFeed;
