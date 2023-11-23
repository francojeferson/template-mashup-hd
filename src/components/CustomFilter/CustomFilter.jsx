import PropTypes from "prop-types";
import { memo, useEffect, useState } from "react";
import CustomFilteritem from "./CustomFilterItem";

function CustomFilter({ app, filter, singleFilter }) {
  const [idList, setIdList] = useState("");
  const SF = singleFilter;
  useEffect(() => {
    if (!app) {
      return;
    }
    // detect if ID has more than 1 field in object;
    if (filter && filter.id) {
      app.visualization.get(filter.id).then((visModel) => {
        if (visModel.model.pureLayout.qChildList) {
          const Ids = visModel.model.pureLayout.qChildList.qItems.map(
            (item) => item.qInfo.qId,
          );
          setIdList(Ids);
        } else {
          setIdList([visModel.id]);
        }
      });
    }
  }, []);

  const generateFilterItems = () => {
    const f = idList;
    if (idList) {
      return f.map((id) => (
        <CustomFilteritem singleFilter={SF} app={app} id={id} key={id} />
      ));
    }
  };

  return <div style={{ display: "flex" }}>{generateFilterItems()}</div>;
}

CustomFilter.defaultProps = {
  app: null,
  filter: {},
  singleFilter: false,
};

CustomFilter.propTypes = {
  app: PropTypes.object,
  filter: PropTypes.object,
  singleFilter: PropTypes.bool,
};

export default memo(CustomFilter);
