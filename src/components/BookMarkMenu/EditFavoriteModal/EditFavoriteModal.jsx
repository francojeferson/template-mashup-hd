import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function EditFavoriteModal({ app, bookMark }) {
  const [editActive, setEditActive] = useState(false);
  const [modalDeleteBookMark, setModalDeleteBookMark] = useState(false);
  const [bookmarkHandle, setBookmarkHandle] = useState(null);
  const [title, seTitle] = useState(bookMark.qMeta.title);
  const [description, setDescription] = useState(bookMark.qMeta.description);

  const toggleEdit = () => {
    setEditActive(!editActive);
  };

  const toggleDeleteBookMark = () => {
    setModalDeleteBookMark(!modalDeleteBookMark);
  };

  const deleteBookMark = () => {
    if (!app.bookmark) {
      return;
    }
    app.bookmark.remove(bookMark.qInfo.qId).then(
      () => {
        setModalDeleteBookMark(false);
      },
      (err) => {
        console.log("Could not delete this bookmark", err);
      },
    );
  };

  const handleTitle = (evt) => {
    seTitle(evt.target.value);
  };

  const handleDescription = (evt) => {
    setDescription(evt.target.value);
  };

  const save = () => {
    bookmarkHandle.getProperties().then((res) => {
      res.qMetaDef.title = title;
      res.qMetaDef.description = description;
      bookmarkHandle.setProperties(res).then(
        () => {
          toggleEdit();
        },
        (err) => {
          console.log("Could not edit bookmark", err);
        },
      );
    });
  };

  useEffect(() => {
    app.model.enigmaModel.getBookmark(bookMark.qInfo.qId).then((res) => {
      setBookmarkHandle(res);
    });
  }, []);
  return (
    <>
      <div
        className={
          editActive ? "bookMark-editContainer" : "bookMark-infoContainer"
        }
      >
        {!editActive ? (
          <>
            <div className="bookMark-borderBottom">
              <span className="key">Title: </span>
              <span className="value">{bookMark.qMeta.title}</span>
            </div>
            <div>
              <span className="key">Description: </span>
              <span className="value">{bookMark.qMeta.description}</span>
            </div>
            <div className="bookMark-buttonsHolder">
              <button
                className="bookMark-editButton"
                onClick={toggleEdit}
                type="button"
              >
                <i className="fal fa-edit" />
                <span>Editar</span>
              </button>
              <button
                className="bookMark-deleteButton"
                onClick={toggleDeleteBookMark}
                type="button"
              >
                <i className="fal fa-times-circle" />
                <span>Excluir</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bookMark-borderBottom bookMark-inputHolder">
              <span>Título: </span>
              <input
                placeholder="Título"
                value={title}
                onChange={handleTitle}
              />
            </div>
            <div className="bookMark-inputHolder">
              <span>Descrição (opcional): </span>
              <input
                placeholder="Descrição"
                value={description}
                onChange={handleDescription}
              />
            </div>
            <div className="bookMark-buttonsHolder">
              <button
                className="bookMark-saveButton"
                onClick={save}
                type="button"
              >
                <i className="fal fa-check-circle" />
                <span>Salvar</span>
              </button>
              <button
                className="bookMark-deleteButton"
                onClick={toggleDeleteBookMark}
                type="button"
              >
                <i className="fal fa-times-circle" />
                <span>Deletar</span>
              </button>
            </div>
          </>
        )}
        {modalDeleteBookMark && (
          <>
            <div>
              <div>
                <span>Você tem certeza que gostaria de excluir: </span>
                <span>{bookMark.qMeta.title}</span>
              </div>
              <div className="bookMark-buttonsHolder">
                <button
                  className="bookMark-deleteButton"
                  onClick={deleteBookMark}
                  type="button"
                >
                  Excluir
                </button>
                <button
                  className="bookMark-saveButton"
                  onClick={toggleDeleteBookMark}
                  type="button"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
EditFavoriteModal.defaultProps = {
  app: null,
  bookMark: {},
};

EditFavoriteModal.propTypes = {
  app: PropTypes.object,
  bookMark: PropTypes.object,
};

export default EditFavoriteModal;
