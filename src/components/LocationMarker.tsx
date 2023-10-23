import { Marker, Popup, useMapEvents } from 'react-leaflet';
import Leaflet, {LatLngLiteral } from 'leaflet'
import 'leaflet/dist/leaflet.css';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

type propType = {
 position: {
   lat: number,
   lng: number
 };
 setPosition: any;
 onSelectedSpot: any;
};

/**
* 位置表示アイコン
* ・クリックした位置にアイコン表示する
*   ・クリックした位置を、親コンポーネント(App)へ通知する(state)し、その位置にMarkerを表示する
*/
const LocationMarker = ({ position, setPosition, onSelectedSpot }: propType): any => {

  const redIcon = Leaflet.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: iconShadow.src,
    iconAnchor: [12, 41], // アイコンのとがった位置をクリックした場所に合わせるためのオフセット
    popupAnchor: [0, -32], // ポップアップの位置も合わせて調整
  });

  useMapEvents({
    click: (e) => {
      setPosition(e.latlng);
    },
  });

  return !position ? null : (
    <Marker position={position} icon={redIcon} eventHandlers={{click: (e) => {onSelectedSpot({"location": position})}}}>
      {/* <Popup><div>{location}</div></Popup> */}
    </Marker>
  );
};

export default LocationMarker;
