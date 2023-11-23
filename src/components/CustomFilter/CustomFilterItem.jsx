import PropTypes from "prop-types";
import { Fragment, useEffect, useState } from "react";

function CustomFilterItem({ app, id, singleFilter }) {
  const [fieldSearchList, setFieldSearchList] = useState([]);
  const [fieldLength, setFieldLength] = useState(0);
  const [config, setConfig] = useState({});
  const [configFilterList, setConfigFilterList] = useState({});
  const [showList, setShowList] = useState(false);

  const changeValueField = (value, text, obj) => {
    app.field(config.fieldName).select([obj.qElemNumber], !singleFilter);
  };

  const getMoreList = (event) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop <=
      event.target.clientHeight;
    if (bottom && fieldSearchList.length === 0) {
      setFieldLength(fieldLength + 20);
    }
  };

  useEffect(() => {
    if (!configFilterList.id) return;
    app.visualization.get(configFilterList.id).then((vis) => {
      vis.model.getProperties().then((ans) => {
        const answer = ans;
        answer.qListObjectDef.qInitialDataFetch[0].qHeight = fieldLength + 20;
        vis.model.setProperties(answer);
      });
    });
  }, [fieldLength]);

  const getValueSearch = (event) => {
    if (event.target.value === "") {
      setFieldSearchList([]);
    }
    const field = config.fieldName;
    //  eslint-disable-next-line prefer-template
    app.visualization.get(configFilterList.id).then((vis) => {
      vis.model.getProperties().then((ans) => {
        const answer = ans;
        //  eslint-disable-next-line no-unused-expressions
        answer.qListObjectDef.qDef = {
          qFieldDefs: [
            //  eslint-disable-next-line prefer-template
            `=if(wildmatch(${field}, '${
              event.target.value + "*"
            }') > 0, ${field})`,
          ],
        };
        vis.model.setProperties(answer);
      });
    });
  };

  useEffect(() => {
    app.visualization.get(id).then((visualizationModel) => {
      visualizationModel.model.getProperties().then((res) => {
        const obj = {};
        if (res.qListObjectDef.qLibraryId) {
          app.getList("DimensionList", (ans) => {
            ans.qDimensionList.qItems.forEach((item) => {
              if (item.qInfo.qId === res.qListObjectDef.qLibraryId) {
                obj.fieldName = item.qData.info[0].qName;
                obj.fieldId = item.qInfo.qId;
                if (res.title) {
                  obj.title = res.title;
                } else {
                  obj.title =
                    res.qHyperCubeDef.qDimensions[0].qDef.qFieldDefs[0];
                }
                setConfig(obj);
              }
            });
          });
          return;
        }
        if (res.title) {
          obj.title = res.title;
        } else {
          obj.title = res.qHyperCubeDef.qDimensions[0].qDef.qFieldDefs[0];
        }

        // Verify if object is masterItem or isn't;
        if (res.qListObjectDef.qDef.qFieldDefs[0]) {
          obj.fieldName = res.qListObjectDef.qDef.qFieldDefs[0];
        }
        setConfig(obj);
      });
    });
  }, []);

  useEffect(() => {
    if (!config.fieldName && !config.fieldId) {
      return;
    }

    const qlikDef = {
      qInitialDataFetch: [
        {
          qTop: 0,
          qLeft: 0,
          qHeight: 20,
          qWidth: 1,
        },
      ],
    };

    if (config.fieldName) {
      qlikDef.qDef = {
        qFieldDefs: [config.fieldName],
      };
    }
    app.createList(qlikDef, (data) => {
      // app.destroySessionObject(data.qInfo.qId);
      const listFilter = data.qListObject.qDataPages[0].qMatrix.map(
        (item) => item[0],
      );
      setConfigFilterList({ list: listFilter, id: data.qInfo.qId });
    });
  }, [config]);

  const generateFilterList = () => {
    if (configFilterList.list && configFilterList.list.length > 0 && showList) {
      if (fieldSearchList.length === 0 && configFilterList.list.length > 0) {
        return configFilterList.list.map((field) => (
          <Fragment key={field.qElemNumber}>
            <button
              type="button"
              className={
                field.qState === "S"
                  ? "customFilterItem active"
                  : "customFilterItem"
              }
              onClick={() =>
                changeValueField(field.qElemNumber, field.qText, field)
              }
            >
              <div />
              <span>{field.qText}</span>
            </button>
          </Fragment>
        ));
      }
      return fieldSearchList.map((field) => (
        <Fragment key={field}>
          <button type="button" className="customFilterItem">
            <div />
            <span>{field}</span>
          </button>
        </Fragment>
      ));
    }
  };

  return (
    <div className="customFilterContainer">
      <p>{config.title}</p>
      <button
        type="button"
        className="customFilterButton"
        onClick={() => setShowList(!showList)}
      >
        <span>Escolha um segmento</span>
        <i className="fas fa-sort-down" />
      </button>
      <div
        className={showList ? "customFilterList show" : "customFilterList"}
        onScroll={(event) => getMoreList(event)}
      >
        <div>
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Pesquisar"
            onChange={getValueSearch}
          />
        </div>
        {generateFilterList()}
      </div>
    </div>
  );
}

CustomFilterItem.defaultProps = {
  app: null,
  id: "",
  singleFilter: false,
};

CustomFilterItem.propTypes = {
  app: PropTypes.object,
  id: PropTypes.string,
  singleFilter: PropTypes.bool,
};

export default CustomFilterItem;
