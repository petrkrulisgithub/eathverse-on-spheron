import { drawGrid } from "../../helpers";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

function Grid({ api, setMoveEnd, setLineOpacity }) {
  const map = useMap();

  useEffect(() => {
    map.whenReady(() => drawGrid(map, api));
    map.on("zoomend", function () {
      setMoveEnd(Math.random());
      drawGrid(map, api);
    });

    map.on("dragend", function () {
      setMoveEnd(Math.random());
      drawGrid(map, api);
    });

    map.on("movestart", () => {
      setLineOpacity(0);
    });
  }, [map, api, setMoveEnd, setLineOpacity]);

  return null;
}

export default Grid;
