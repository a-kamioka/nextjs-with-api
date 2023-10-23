import dynamic from "next/dynamic";
import { useMemo } from "react";
import Header from '../../components/Header';
// import Map from '../../components/Map';

export default function View() {
  const Map = useMemo(
    () =>
      dynamic(() => import("../../components/Map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return (
    <>
      <Header />
      <Map />
    </>
  );
};