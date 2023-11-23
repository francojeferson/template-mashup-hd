import PropTypes from "prop-types";
import {
  useBookMarkBar,
  useCreateBookMarkContainer,
} from "../../context/BookMarkContainer";
import BookMarkList from "./BookMarkList/BookMarkList";
import CreateBookMarkContainer from "./CreateBookMarkContainer/CreateBookMarkContainer";

function BookMarkMenu({ app }) {
  const { bookMarkBarOpened, setBookMarkBarOpened } = useBookMarkBar();
  const { openCreateBookmark, setOpenCreateBookmark } =
    useCreateBookMarkContainer(false);

  return (
    <div
      className={
        bookMarkBarOpened ? "bookMark-menu is-opened" : "bookMark-menu"
      }
    >
      <div className="bookMark-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            type="button"
            className="bookMark-closeButton"
            onClick={() => setBookMarkBarOpened(false)}
          >
            <i className="fal fa-times" />
          </button>
          <h1>Filtros favoritos</h1>
        </div>
        <button
          className="bookMark-createButton"
          onClick={() => setOpenCreateBookmark(true)}
          type="button"
        >
          <i className="fal fa-plus-circle" />
          Criar novo
        </button>
      </div>
      <BookMarkList app={app} />
      {openCreateBookmark && (
        <div>
          <CreateBookMarkContainer app={app} />
        </div>
      )}
    </div>
  );
}
BookMarkMenu.defaultProps = {
  app: null,
};

BookMarkMenu.propTypes = {
  app: PropTypes.object,
};

export default BookMarkMenu;
