import { drawChosenSquares } from "../../helpers";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

function ChosenSquares({
  api,
  chosenSquares,
  isClaiming,
  words,
  setMoveEnd,
  claimed,
  moveEnd,
}) {
  const map = useMap();

  useEffect(() => {
    if (chosenSquares.length) {
      if (!isClaiming && !claimed) {
        drawChosenSquares(map, api, [words], isClaiming, setMoveEnd);
      } else drawChosenSquares(map, api, chosenSquares, isClaiming, setMoveEnd);
    }
  }, [
    chosenSquares,
    isClaiming,
    moveEnd,
    api,
    claimed,
    setMoveEnd,
    map,
    words,
  ]);

  return null;
}

export default ChosenSquares;
