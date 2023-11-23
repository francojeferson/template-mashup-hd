import { ReactElement, useCallback, useEffect, useState } from "react";
import { deleteState } from "../../store/local-storage";
import { ejectSessionHash } from "../../utils/xhr";

const { REACT_APP_OWNER } = process.env;

const Logout = (): ReactElement => {
  const [loop, setLoop] = useState(0);

  const porcentagem = 100;
  const timeMaxLoad = 0.066666667;

  document.querySelector("body")?.classList.add("bg-mtrix-dark");

  const destroySession = () => {
    ejectSessionHash();
    deleteState();
  };

  const motorzinho = useCallback(() => {
    if (loop < porcentagem) {
      setTimeout(() => {
        setLoop(loop + 1);
      }, timeMaxLoad);
    }
  }, [loop]);

  useEffect(() => destroySession(), []);

  useEffect(() => motorzinho(), [motorzinho]);

  useEffect(() => {
    if (loop === porcentagem) {
      setTimeout(() => {
        window.location.replace(`${REACT_APP_OWNER}/login`);
      }, 1000);
    }
  }, [loop]);

  return (
    <div className="progress">
      <div
        className="progress-bar progress-bar-striped progress-bar-animated"
        aria-valuenow={loop}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ width: `${loop}%` }}
      />
    </div>
  );
};

export default Logout;
