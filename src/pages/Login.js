import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Link,
} from '@mui/material';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    // 로그인 처리 로직 (API 요청 등)
    alert(`로그인 시도: 이메일=${email}, 비밀번호=${password}`);
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          width: '100%',
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          로그인
        </Typography>
        <Typography variant="body2" color="text.secondary">
          계정이 없으신가요?{' '}
          <Link href="/signup" underline="hover">
            회원가입
          </Link>
        </Typography>
      </Box>
      {/* 로그인 폼 */}
      <Box
        component="form"
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="이메일"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="비밀번호"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          로그인
        </Button>
      </Box>
      {/* 비밀번호 찾기 */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link href="/forgot-password" underline="hover">
          비밀번호를 잊으셨나요?
        </Link>
      </Box>
    </Container>
  );
};

export default LoginPage;
