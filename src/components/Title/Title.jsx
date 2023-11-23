import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import utils from "../../QlikUtils";

const Title = ({ app, reference }) => {
  const [qlikTitle, setQlikTitle] = useState("");
  const visRef = useRef();
  const mounted = useRef();

  const getTitleOrSubtitle = async (id, isTitle) => {
    try {
      const { vis, error } = (await utils.getVisualization(app, id)) || {};
      if (error) {
        throw new Error(error.message);
      }
      visRef.current = vis;
      const { title } = vis.model.layout;
      if (isTitle) {
        return title;
      }
      const { subtitle } = vis.model.layout;
      return subtitle;
    } catch (error) {
      console.error({ message: error.message, objectId: id });
      return null;
    }
  };

  useEffect(async () => {
    mounted.current = true;
    if (app && mounted.current) {
      if (!reference.id) return;
      const res = await getTitleOrSubtitle(reference.id, true);
      setQlikTitle(res);
    }

    return () => {
      mounted.current = false;
      if (visRef.current) visRef.current.close();
    };
  }, [app]);

  return (
    <div title={qlikTitle || reference?.hardTitle}>
      {qlikTitle || reference.hardTitle}
    </div>
  );
};

Title.defaultProps = {
  app: null,
  reference: {},
};

Title.propTypes = {
  app: PropTypes.any,
  reference: PropTypes.object,
};

export default Title;
