import { useEffect, useRef, useState } from "react";
// import PropTypes from 'prop-types';
// import numeral from 'numeral';
// import ObjectLoader from '../ObjectLoader/ObjectLoader';

function Kpi(props) {
  const {
    app = null,
    reference = {},
    firstKpiStyle = {},
    secondKpiStyle = {},
    containerStyle = {},
    loaderHeight = null || "",
  } = props;

  const [loading, setLoading] = useState(true);
  const [kpi1, setKpi1] = useState();
  const [kpi2, setKpi2] = useState();
  const hypercubeId = useRef(null);
  const mounted = useRef(true);

  const getKpiData = async (measureId) => {
    const qValues = [
      {
        qValueExpression: `=${measureId}`,
        qLabel: "",
        qNumFormat: { qType: "U" },
      },
    ];

    const hypercubeDef = {
      qDimensions: [],
      qMeasures: [
        {
          qDef: {
            qLabel: "",
            qDescription: "",
            qTags: [],
            qGrouping: "N",
            qDef: qValues[0].qValueExpression,
            qNumFormat: qValues[0].qNumFormat,
            qRelative: false,
            qBrutalSum: false,
            qAggrFunc: "Expr",
            qAccumulate: 0,
            qReverseSort: false,
            qActiveExpression: 0,
            qExpressions: qValues,
          },
          qSortBy: { qSortByNumeric: -1 },
          qPseudoDimPos: -1,
          qNoOfLeftDims: -1,
          qMaxStackedCells: -1,
          qCalcCond: "",
          qAttributeExpressions: [],
          qShowTotalsAbove: false,
          qShowTotalsBelow: false,
          qResultOffset: 0,
          qGroupItemHeaders: [],
          qStateName: "$",
        },
      ],
      qInitialDataFetch: [
        {
          qTop: 0,
          qLeft: 0,
          qWidth: 1,
          qHeight: 1,
        },
      ],
      qSuppressZero: false,
      qSuppressMissing: true,
      qMode: "S",
      qInterColumnSortOrder: [],
      qStateName: "$",
    };

    const model = await app.createSessionObject({
      qHyperCubeDef: hypercubeDef,
    });
    hypercubeId.current = model.id;

    const layout = await model.getLayout();
    const value = layout.qHyperCube.qDataPages[0].qMatrix[0][0].qNum;
    return value;
  };

  const formatNumber = (number) => {
    if (typeof number !== "number") {
      return "";
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getColorByLimit = (value, limits, colors) => {
    if (!limits || !colors) {
      return null;
    }

    switch (true) {
      case value < limits[0]?.value:
        return colors[0]?.color;
      case value < limits[1]?.value:
        return colors[1]?.color;
      case value < limits[2]?.value:
        return colors[2]?.color;
      // Add more cases as needed
      default:
        return colors[colors.length - 1]?.color;
    }
  };

  const loadData = async () => {
    if (!app) {
      setLoading(false);
      return;
    }

    try {
      const measureInfo = await app.getMeasureList({
        qOffset: 0,
        qCount: 2,
      });
      const kpi1Id = measureInfo[0]?.qInfo?.qId;
      const kpi2Id = measureInfo[1]?.qInfo?.qId;
      const kpi1Value = await getKpiData(kpi1Id);
      const kpi2Value = await getKpiData(kpi2Id);

      if (mounted.current) {
        setKpi1(kpi1Value);
        setKpi2(kpi2Value);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    return () => {
      mounted.current = false;
      if (hypercubeId.current) {
        app.destroySessionObject(hypercubeId.current);
      }
    };
  }, [app]);

  const kpi1Color = getColorByLimit(
    kpi1,
    reference?.kpi1?.limits,
    reference?.kpi1?.colors,
  );
  const kpi2Color = getColorByLimit(
    kpi2,
    reference?.kpi2?.limits,
    reference?.kpi2?.colors,
  );

  return (
    <div style={containerStyle}>
      {loading && (
        <div style={{ height: loaderHeight }}>
          <Spinner />
        </div>
      )}
      {!loading && (
        <>
          {kpi1 !== null && (
            <div style={{ ...firstKpiStyle, color: kpi1Color }}>
              {formatNumber(kpi1)}
            </div>
          )}
          {kpi2 !== null && (
            <div style={{ ...secondKpiStyle, color: kpi2Color }}>
              {formatNumber(kpi2)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Kpi.defaultProps = {
//     app: null,
//     id: '',
//     firstKpiStyle: {},
//     secondKpiStyle: {},
//     containerStyle: {},
//     reference: {},
//     loaderHeight: ''
// };

// Kpi.propTypes = {
//     app: PropTypes.object,
//     id: PropTypes.string,
//     firstKpiStyle: PropTypes.object,
//     secondKpiStyle: PropTypes.object,
//     containerStyle: PropTypes.object,
//     reference: PropTypes.object,
//     loaderHeight: PropTypes.string
// };

export default Kpi;
