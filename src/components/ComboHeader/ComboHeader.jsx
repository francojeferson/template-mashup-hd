import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import utils from "../../QlikUtils";
import { ReactComponent as BarIcon } from "../../assets/icons/bar-icon.svg";
import { ReactComponent as LineIcon } from "../../assets/icons/line-icon.svg";
import Radio from "../Radio/Radio";
import TooltipInfo from "../TooltipInfo/TooltipInfo";

function ComboHeader({ app, reference, tooltip, legends, radio, classStyle }) {
  const [qlikTitle, setQlikTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");

  const visRef = useRef([]);
  const mounted = useRef();

  const { title, subtitle } = reference || {};

  const getTitleOrSubtitle = async (id) => {
    try {
      const { vis, error } = (await utils.getVisualization(app, id)) || {};
      if (error) {
        throw new Error(error.message);
      }
      visRef.current.push(vis);
      const { title } = vis.model.layout;
      return title;
    } catch (error) {
      console.error({ message: error.message, objectId: id });
      return null;
    }
  };

  useEffect(() => {
    mounted.current = true;

    return () => {
      setQlikTitle("");
      setSubTitle("");
      mounted.current = false;
    };
  }, []);

  useEffect(async () => {
    if (!reference) {
      console.error("props 'reference' is required");
      return;
    }

    if (app) {
      if (mounted.current) {
        if (title?.id) {
          const titleRes = await getTitleOrSubtitle(title.id);
          setQlikTitle(titleRes);
        }

        if (subtitle?.id) {
          const subtitleRes = await getTitleOrSubtitle(subtitle.id);
          setSubTitle(subtitleRes);
        }
      }
    }

    return () => {
      if (visRef.current?.length > 0) {
        Promise.all(visRef.current.map((ref) => ref?.close() || null));
      }
    };
  }, [app, mounted.current]);

  return (
    <div className="combo-header">
      <div className={classStyle}>
        <div className="headerWrapper">
          {(qlikTitle || title?.hard) && (
            <div className="titleWrapper">
              <span className="title">{qlikTitle || title?.hard}</span>
              {tooltip && <TooltipInfo text={tooltip} />}
            </div>
          )}
          {(subTitle || subtitle?.hard) && (
            <span className="subtitle">{subTitle || subtitle?.hard}</span>
          )}
        </div>

        {legends.length > 0 && (
          <div className="legend">
            <span>Legenda</span>
            <div
              style={{
                width: "100%",
                height: "100%",
                overflow: "auto hidden",
                display: "flex",
                alignItems: "center",
              }}
            >
              {legends.map((legend, index) => {
                let icon = <LineIcon stroke="#F98561" />;
                if (legend.type === "bar") {
                  icon = <BarIcon fill={legend.iconColor || "#55B6EB"} />;
                }
                return (
                  <div key={index} className="legend-item">
                    <div className="legend-item-icon">{icon}</div>
                    <span className="legend-item-name">{legend.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {radio && <Radio app={app} field={radio.field} />}
    </div>
  );
}

ComboHeader.defaultProps = {
  app: null,
  reference: {},
  tooltip: "",
  legends: [],
  radio: null,
  classStyle: null,
  field: {},
};

ComboHeader.propTypes = {
  app: PropTypes.object,
  reference: PropTypes.object,
  tooltip: PropTypes.string,
  legends: PropTypes.array,
  radio: PropTypes.object,
  classStyle: PropTypes.string,
  field: PropTypes.object,
};

export default ComboHeader;
