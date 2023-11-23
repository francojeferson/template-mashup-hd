import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Utils from "../../../QlikUtils";
import EditFavoriteModal from "../EditFavoriteModal/EditFavoriteModal";

function BookMarkList({ app }) {
  const [config, setConfig] = useState({});
  const [bookMarkInfoOpened, setBookMarkInfoOpened] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [listToShow, setListToShow] = useState([]);

  function applyBookMark(id) {
    app.bookmark.apply(id);
  }

  useEffect(() => {
    app.getList("BookmarkList", (res) => {
      setConfig({
        list: res.qBookmarkList.qItems,
        listId: res.qInfo.qId,
      });
    });

    return config.listId
      ? () => {
          app.destroySessionObject(config.listId);
        }
      : "";
  }, [app, config.listId]);

  const handleChange = (evt) => {
    setSearchTerm(evt.target.value);
  };

  useEffect(() => {
    if (!config.list) return;
    let toFilterList = config.list.filter(
      (item) =>
        item.qMeta.title && item.qMeta.title.toLowerCase().includes(searchTerm),
    );
    if (!searchTerm) toFilterList = config.list;
    setListToShow(toFilterList);
  }, [searchTerm, config]);

  return (
    <div className="bookMark-list">
      <div>
        <input
          className="bookMark-search"
          type="text"
          placeholder="Pesquisar"
          onChange={handleChange}
        />
      </div>
      <div className="bookMark-topTitle">
        <span>Filtros pré-configurados</span>
        <div>{config.list && config.list.length}</div>
      </div>
      {listToShow &&
        listToShow.map((item, index) => {
          const html = (
            <div
              className="bookMark-itemList"
              key={`${item.qInfo.qId}-${index}`}
            >
              <div className="bookMark-itemTitle">
                <button
                  type="button"
                  className="bookMark-applyButton"
                  onClick={() => {
                    applyBookMark(item.qInfo.qId);
                  }}
                >
                  {item.qMeta.title}
                </button>
              </div>
              <div className="bookMark-infoContainerHolder">
                <span>{Utils.getDate(item.qData.creationDate)}</span>
                <button
                  className="bookMark-infoButton"
                  onClick={() => {
                    setBookMarkInfoOpened(
                      item.qInfo.qId === bookMarkInfoOpened
                        ? false
                        : item.qInfo.qId,
                    );
                  }}
                  type="button"
                >
                  <i className="far fa-info-circle" />
                </button>
                {bookMarkInfoOpened === item.qInfo.qId && (
                  <EditFavoriteModal bookMark={item} app={app} />
                )}
                {bookMarkInfoOpened === item.qInfo.qId && (
                  <button
                    type="button"
                    onClick={() => {
                      setBookMarkInfoOpened(false);
                    }}
                    className="closeEditMode"
                  >
                    0
                  </button>
                )}
              </div>
            </div>
          );
          return html;
        })}
    </div>
  );
}
BookMarkList.defaultProps = {
  app: null,
};

BookMarkList.propTypes = {
  app: PropTypes.object,
};

export default BookMarkList;
