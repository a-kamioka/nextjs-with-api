import React, { useState, useEffect } from 'react';
import { Box, Button, Container, TextField, Typography, IconButton } from '@mui/material';
import { axiosClient } from '../hooks/axiosClient';
import axios from 'axios';
import CommentIcon from '@mui/icons-material/Comment';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  spot: any,
  position: any,
  setIsLoading: any,
  getData: any,
  closeModal: any
}

const Entry = ({spot, position, setIsLoading, getData, closeModal}: Props) => {

  const [spotId, setSpotId] = useState<number>(spot.id ? spot.id : 0);
  const [name, setName] = useState<string>();
  const [lat, setLat] = useState<number>();
  const [lng, setLng] = useState<number>();

  const [isSelected, setIsSelected] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const onButtonClick = async () => {
    if (true) {
      if (true) {
        setIsLoading(true);
        await axiosClient.post("/api/spots", {"id":spotId, "name":name, "lat":lat, "lng":lng})
        .then(res => {
          alert("登録しました");
          getData();
        })
        .catch((e) => {
          setIsLoading(false);
          alert("登録に失敗しました");
        })
      } else {
        alert("文字数が多すぎます")
      }
    } else {
      alert("値が入力されていません")
    };
  }

  const onDeleteButtonClick = async () => {
    let checkDeleteFlag = window.confirm("削除しますか？")
    if (checkDeleteFlag) {
      setIsLoading(true);
      await axiosClient.delete(`/api/spot/${spotId}`)
      .then(res => {
        alert("削除しました");
        getData();
      })
      .catch(e => {
        alert("削除に失敗しました");
      });
      setIsLoading(false);
    }
  }

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexGrow: 1,
      }}
    >
      <Container>
        <Box sx={{ float: 'right' }}>
          <IconButton onClick={closeModal} >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          size="small"
          label="名前"
          margin="normal"
          name="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          variant="outlined"
          InputProps={{
            readOnly: (!isModify)
          }}
          inputProps={{
            maxLength: 20
          }}
        />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '10px'}}
          >
          <Button
            sx={{ width: '45%' }}
            disabled={!(isModify)}
            type="submit"
            variant="contained"
            onClick={onButtonClick}
          >
            登録
          </Button>
          <Box sx={{ width: '10%' }}></Box>
          <Button
            sx={{ width: '45%' }}
            color="error"
            disabled={!(isDelete)}
            type="submit"
            variant="contained"
            onClick={onDeleteButtonClick}
          >
            削除
          </Button>
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '10px'}}
          >
          <Box sx={{ width: '10%' }}></Box>
          <Button
            sx={{ width: '45%' }}
            color="warning"
            type="submit"
            variant="contained"
            onClick={() => {window.location.replace(`https://www.google.co.jp/maps?q=${position.lat},${position.lng}`)}}
          >
            外部MAP
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Entry;