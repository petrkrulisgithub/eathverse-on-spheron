import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map.jsx"), {
  ssr: false,
});

export default Map;
