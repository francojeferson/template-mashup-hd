import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";

const BookMarkContext = createContext();

function BookMarkProvider({ children }) {
  const [bookMarkBarOpened, setBookMarkBarOpened] = useState(false);
  const [openCreateBookmark, setOpenCreateBookmark] = useState(false);

  return (
    <BookMarkContext.Provider
      value={{
        bookMarkBarOpened,
        setBookMarkBarOpened,
        openCreateBookmark,
        setOpenCreateBookmark,
      }}
    >
      {children}
    </BookMarkContext.Provider>
  );
}

function useBookMarkBar() {
  const context = useContext(BookMarkContext);

  if (!context)
    throw new Error(" useBookmarkBar should be used within a BookMarkProvider");

  return context;
}
function useCreateBookMarkContainer() {
  const context = useContext(BookMarkContext);

  if (!context)
    throw new Error(" useBookmarkBar should be used within a BookMarkProvider");

  return context;
}

BookMarkProvider.defaultProps = {
  children: {},
};

BookMarkProvider.propTypes = {
  children: PropTypes.object,
};

export { BookMarkProvider, useBookMarkBar, useCreateBookMarkContainer };
