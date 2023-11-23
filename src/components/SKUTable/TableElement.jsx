import numeral from "numeral";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import utils from "../../QlikUtils";
import ObjectError from "../ObjectError/ObjectError";

const TableElement = ({ app, reference }) => {
  const refsToClose = useRef();
  const [data, setData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const mounted = useRef();

  const formatData = (hypercube) => {
    const empty = ["-", " - "];

    const value =
      hypercube?.qGrandTotalRow[0]?.qNum === "NaN"
        ? hypercube?.qGrandTotalRow[0]?.qText || ""
        : hypercube?.qGrandTotalRow[0]?.qNum || "";

    let colorTemp =
      hypercube?.qMeasureInfo[0]?.conditionalColoring?.useConditionalColoring ||
      false;

    if (colorTemp) {
      colorTemp = utils.getColorByLimit(
        hypercube?.qGrandTotalRow[0]?.qNum,
        hypercube.qMeasureInfo[0].conditionalColoring?.segments?.limits || null,
        hypercube.qMeasureInfo[0].conditionalColoring?.segments
          ?.paletteColors || null,
      );
    }

    return empty.includes(value) ? {} : { value, color: colorTemp };
  };

  useEffect(() => {
    mounted.current = true;
    if (app) {
      utils.createHyperCubeByQlikId(app, reference.id, (res, vis) => {
        refsToClose.current = { hypercube: res, vis };
        if (mounted.current) {
          if (res && res.code) {
            setError({
              message: "Could not load object",
            });
            setIsLoaded(true);
          }

          if (Object.keys(data).length > 0) setData({});

          const { value, color } = formatData(res?.qHyperCube);

          const formattedValue = reference.format
            ? numeral(value).format(reference.format)
            : value;

          if (typeof value === "number") {
            setData({ value: formattedValue, color });
          } else {
            setData({ value, color });
          }

          setIsLoaded(true);
        }
      });
    }

    return () => {
      mounted.current = false;
      if (refsToClose.current) {
        utils.destroyHC(
          app,
          refsToClose.current?.hypercube,
          refsToClose.current?.vis,
        );
      }
    };
  }, [app, reference.id]);

  if (!isLoaded) return <td />;
  return error ? (
    <td>
      <ObjectError message={error.message} />
    </td>
  ) : (
    <td style={{ color: data?.color }} id={reference.id}>
      {data?.value}
    </td>
  );
};

TableElement.defaultProps = {
  app: null,
  reference: {},
};

TableElement.propTypes = {
  app: PropTypes.object,
  reference: PropTypes.object,
};

export default TableElement;
