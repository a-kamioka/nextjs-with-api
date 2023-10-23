import React, { useState, useEffect } from 'react';
import { axiosClient } from '../hooks/axiosClient';
import Modal from 'react-modal';
import { Box, Button, TextField, Typography, Backdrop, CircularProgress, Switch } from '@mui/material';
import { AxiosResponse, AxiosError } from 'axios';
import Leaflet, { LatLng } from 'leaflet'
import { useMap, LayerGroup, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import LayeredMap from './LayeredMap'
import LocationMarker from './LocationMarker';
// import Entry from './Entry';

type Spot = {
  id: number,
  name: string,
  lat: number,
  lng: number
}

type SpotId = {
  id: number
}

type Position = {
  lat: number,
  lng: number
}

type PositionProps = {
  position: Position
}

//マーカーのデフォルトアイコンを設定
let defaultIcon = Leaflet.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconAnchor: [12, 41], // アイコンのとがった位置をクリックした場所に合わせるためのオフセット
  popupAnchor: [0, -32], // ポップアップの位置も合わせて調整
});
Leaflet.Marker.prototype.options.icon = defaultIcon;

function MapViewControl({position}: PositionProps): any {
  const map = useMap()
  map.panTo(position)
}

export default function Map() {

  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  
  // const [position, setPosition] = useState<Position>(location.state ? JSON.parse(location.state.position) :
  const [position, setPosition] = useState<Position>({
    lat: 35.13267449594266,
    lng: 137.11121003745856,
  });
  const [address, setAddress] = useState<string>("")
  // const [initState, setInitState] = useState(location.state ? false : true);

  //住所検索
  const onSearch = async () => {
    //「国土地理院API」でキーワードから緯度・経度を含む住所情報を取得
    const url = `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(address)}`
    const response = await fetch(url);
    const results = await response.json();

    if (Array.isArray(results) && results.length > 0) {
      //見つかった住所（施設）の位置を表示
      const coordinates = results[0].geometry.coordinates
      const answerPosition = {
          lat: coordinates[1],
          lng: coordinates[0]
        }
      setPosition(answerPosition)
    } else {
      alert("Not Found")
    }
  }

  // データ取得
  const getData = async () => {
    setIsLoading(true);
    await axiosClient.get("/api/spots")
    .then((res: AxiosResponse) => setSpots(res.data))
    .catch((e: AxiosError) => {
      alert("データの取得に失敗しました");
    })
    .finally(() => {
      setIsLoading(false);
      setIsModalOpen(false);
    })
  }
  useEffect(() => {
    getData();
  }, [])

  // 選択スポットをモーダルで表示
  const onSelectedSpot = ({id}: SpotId) => {
    setSelectedSpot(spots.find(spot => spot.id == id));
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSpot(null);
  }

  // 高さ調整
  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1
      }}
    >
      <Box id='searchBox' sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '5px' }}>
        <TextField
          sx={{ width: '80%' }}
          size="small"
          label="住所"
          margin="normal"
          name="address"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
          value={address}
          variant="outlined"
        />
        <Box>
          <Button
            size="medium"
            type="submit"
            variant="contained"
            onClick={onSearch}
          >
            検索
          </Button>
        </Box>
      </Box>
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{ position: 'absolute', top: '10px', left: '50px', zIndex: '900', backgroundColor: '#fff' }}
        >
          <Switch
            checked={isOpen}
            onChange={() => setIsOpen(!isOpen)}
          />
        </Box>
        <LayeredMap center={position}>
          <LocationMarker position={position} setPosition={setPosition} onSelectedSpot={onSelectedSpot} />
          <MapViewControl position={position} />
          <LayerGroup>
            {
              (Array.isArray(spots)) ?
                spots.map(({id, name, lat, lng}: Spot) => {
                  const _position = new LatLng(lat, lng);
                  return (
                    <Marker
                      position={_position}
                      key={id} 
                      eventHandlers={{
                        click: (e) => {
                          setPosition({lat:lat, lng:lng});
                          onSelectedSpot({id:id});
                        }
                      }}>
                    </Marker>
                  )
                })
              :
              <></>
            }
          </LayerGroup>
        </LayeredMap>
      </Box>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{ overlay: { zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }, content: { inset: 'auto', width: '90%', height: '90%', maxWidth: '500px', padding: '10px' } }}
      >
            {/* <Entry spot={selectedSpot} position={position} setIsLoading={setIsLoading} getData={getData} closeModal={closeModal} /> */}
      </Modal>
      <Backdrop
        sx={{ color: '#fff', zIndex: 1100 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};