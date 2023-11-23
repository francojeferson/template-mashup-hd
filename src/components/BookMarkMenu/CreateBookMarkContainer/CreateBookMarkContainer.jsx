import PropTypes from "prop-types";
import { useState } from "react";
import { useCreateBookMarkContainer } from "../../../context/BookMarkContainer";

function CreateBookMarkContainer({ app }) {
  const [title, seTitle] = useState(false);
  const [description, setDescription] = useState(false);
  const { setOpenCreateBookmark } = useCreateBookMarkContainer(false);
  const [loader, setLoader] = useState(false);

  const createBookMark = () => {
    if (!title) return;
    setLoader(true);
    app.bookmark.create(title, description).then(() => {
      setOpenCreateBookmark(false);
      setLoader(false);
    });
  };

  const closeContainer = () => {
    setOpenCreateBookmark(false);
  };
  return (
    <div className="bookMark-createContainer">
      <form onSubmit={createBookMark}>
        <label name="title">
          Título
          <input
            onChange={(e) => seTitle(e.target.value)}
            placeholder="Dê um nome ao seu filtro favorito"
          />
        </label>
        <label name="description">
          Descrição (opcional)
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Insira uma descrição"
          />
        </label>
        <div className="bookMark-buttonHolder">
          <button className="bookMark-saveButton" type="submit">
            <i className="far fa-check" />
            Salvar
          </button>
          <button
            onClick={closeContainer}
            className="bookMark-cancelButton"
            type="button"
          >
            <i className="fal fa-times" />
            Cancelar
          </button>
        </div>
      </form>
      {loader ? <div className="bookMark-loader" /> : ""}
    </div>
  );
}
CreateBookMarkContainer.defaultProps = {
  app: null,
};

CreateBookMarkContainer.propTypes = {
  app: PropTypes.object,
};

export default CreateBookMarkContainer;
