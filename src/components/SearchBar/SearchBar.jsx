import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

function SearchBar({ app }) {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [opened, setOpened] = useState(true);
  const [loading, setLoading] = useState(false);
  const inputEl = useRef(null);
  const hasEvent = useRef(false);
  const clickOnChildren = useRef(false);

  function getSuggestions() {
    return new Promise((resolve, reject) => {
      app.searchSuggest([query], {}, (reply) => {
        resolve(reply.qResult.qSuggestions);
      });
    });
  }

  function getData() {
    return new Promise((resolve, reject) => {
      setLoading(true);
      getSuggestions().then((results) => {
        setSuggestions(results);
        app.searchAssociations(
          [query],
          { qOffset: 0, qCount: 15, qMaxNbrFieldMatches: 5 },
          { qContext: "CurrentSelections" },
          (reply) => {
            const result = reply.qResults;
            resolve(result);
          },
        );
      });
    });
  }

  function handleOutClick() {
    if (!clickOnChildren.current) {
      setOpened(false);
    } else {
      clickOnChildren.current = false;
    }
  }

  useEffect(() => {
    if (!hasEvent.current) {
      hasEvent.current = true;
      inputEl.current.addEventListener("click", () => {
        clickOnChildren.current = true;
        setOpened(true);
      });
      document.body.addEventListener("click", handleOutClick);
    }

    return () => {
      document.body.removeEventListener("click", handleOutClick);
    };
  }, []);

  useEffect(() => {
    // _onToggle(opened);
  }, [opened]);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      getData().then((results) => {
        setData(results);
        setLoading(false);
      });
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [query]);

  return (
    <div
      className={opened ? "search-wrapper opened" : "search-wrapper"}
      ref={inputEl}
    >
      <div className="input-wrapper">
        <i className="fal fa-search" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for data"
        />
      </div>

      {opened ? (
        <i
          className="fal fa-times"
          onClick={() => {
            setOpened(false);
          }}
        />
      ) : (
        ""
      )}
      {opened ? (
        <div
          className="suggestions-wrapper"
          onMouseDown={() => {
            clickOnChildren.current = true;
          }}
        >
          <ul className="suggestion-list">
            {suggestions &&
              suggestions.map((item) => (
                <li className="suggestion-item">
                  <span
                    className="suggestion-text"
                    onClick={(evt) => {
                      setQuery(item.qValue);
                    }}
                  >
                    {item.qValue}
                  </span>
                </li>
              ))}
          </ul>
          <ul className="associations-list">
            {data && data.qFieldNames.length > 0
              ? data.qFieldNames.map((fieldName, index) => (
                  <li
                    className="association-item"
                    onClick={(evt) => {
                      const valuesToSelect = data.qFieldDictionaries[
                        index
                      ].qResult.map((item) => item.qElemNumber);
                      app
                        .field(`[${data.qFieldNames[index]}]`)
                        .select(valuesToSelect, false, false)
                        .then(() => {
                          getData().then((results) => {
                            setData(results);
                          });
                        });
                    }}
                  >
                    <span className="association-field"> {fieldName}</span>
                    {data.qFieldDictionaries[index].qResult.length > 0 ? (
                      <>
                        {data.qFieldDictionaries[index].qResult.map((item) => (
                          <span className="association-value">
                            {item.qText}
                          </span>
                        ))}
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                ))
              : ""}
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

SearchBar.defaultProps = {
  app: null,
};

SearchBar.propTypes = {
  app: PropTypes.object,
};

export default SearchBar;
