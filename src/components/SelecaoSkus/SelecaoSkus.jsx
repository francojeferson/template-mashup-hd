import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import utils from "../../QlikUtils";
import ObjectError from "../ObjectError/ObjectError";
import ObjectLoader from "../ObjectLoader/ObjectLoader";
import TooltipInfo from "../TooltipInfo/TooltipInfo";

function SelecaoSkus({ app, config }) {
  const { barchart, SKUs } = config;
  const { card } = SKUs;
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState({});
  const [qlikContent, setQlikContent] = useState({});
  const [icon, setIcon] = useState("error");
  const refsToClose = useRef([]);
  const [screenWidth] = useState(window.innerWidth);
  const mounted = useRef();

  const icons = {
    error: <i className="fal fa-times" />,
    success: <i className="fal fa-check" style={{ color: "#38bc9a" }} />,
  };

  const getData = () =>
    new Promise((resolve) => {
      const container = utils.getVisualization(app, card.content);
      resolve(container);
    })
      .then(async (res) => {
        const { properties, vis } = res || {};
        const { children } = properties;

        refsToClose.current.push(vis);

        if (mounted.current) {
          if (children) {
            const filtered = children.filter((child) => child.condition);

            await Promise.all(
              filtered.map(async (child) => {
                const { qExpr } = child.condition?.qStringExpression || "";
                if (qExpr !== "") {
                  const value = await utils.evaluateExpression(app, qExpr);
                  if (value === "1") {
                    const visualization = await utils.getVisualization(
                      app,
                      child.refId,
                    );
                    refsToClose.current.push(visualization.vis);
                    setIcon("success");
                    setData(visualization);
                  }
                }
              }),
            ).catch(() => {
              setError({
                message: "Could not load object",
              });
              setIsLoaded(true);
            });
          }

          setIsLoaded(true);
        }
      })
      .catch(() => {
        setError({
          message: "Could not load object",
        });
        setIsLoaded(true);
      });

  useEffect(() => {
    mounted.current = true;
    if (app) {
      // pegando o id de um gráfico de barras como referência para mudança de filtros e atualizar o componente
      utils.createHyperCubeByQlikId(app, barchart, () => {
        getData();
      });
    }
  }, [app]);

  useEffect(() => {
    if (Object.keys(data).length > 0 && mounted.current) {
      const { properties } = data || {};
      const { markdown } = properties || {};
      setQlikContent({ content: markdown });
      setIsLoaded(true);
    }
  }, [data]);

  useEffect(
    () => () => {
      mounted.current = false;
      if (refsToClose.current.length > 0) {
        Promise.all(
          refsToClose.current.map((ref) => {
            if (ref) {
              return ref.close();
            }
          }),
        );
      }
    },
    [],
  );

  if (!isLoaded)
    return <ObjectLoader icon="kpi" width="inherit" height="inherit" />;

  return error ? (
    <ObjectError error={error} />
  ) : (
    <div className="selecaoWrapper">
      <div className="titleWrapper">
        <span className="selecaoTitle">{card.title}</span>
        {screenWidth < 400 ? (
          ""
        ) : (
          <TooltipInfo style={{ marginLeft: "10px" }} text={card.tooltip} />
        )}
      </div>
      <div className="selecaoContentWrapper">
        {icons[icon]}
        <div className="selecaoContent">
          <span>{qlikContent.content}</span>
        </div>
      </div>
    </div>
  );
}

SelecaoSkus.defaultProps = {
  config: {},
};

SelecaoSkus.propTypes = {
  app: PropTypes.object.isRequired,
  config: PropTypes.object,
};

export default SelecaoSkus;
