import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ConjuntosBasket from "../../pages/Overview/Modais/AnalisePDVs";
import Card from "../Cards/Card";
import Venn from "../Charts/Venn";
import ComboHeader from "../ComboHeader/ComboHeader";
import Modal from "../Modal/Modal";
import NativeObject from "../NativeObject/NativeObject";

const VennWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 2fr 3fr;
`;

const FilterWrapper = styled.div`
  height: 100%;
  max-height: 312px;
`;

const ConjuntoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 230px;
`;

const ButtonWrapper = styled.div`
  width: 90%;
  display: flex;

  flex-direction: column;
  margin: 8px 16px 8px 0px;

  justify-content: center;
  .primaryButton .pdv {
    width: 100%;
    align-items: center;
    justify-content: center;
  }
`;

const VennWithFilters = ({ app, config }) => {
  const { customRadio, venn } = config.basketMix.cards[1];
  const { options } = customRadio;
  const [selectedRadio, setSelectedRadio] = useState("Com Compras");
  const [vennId, setVennId] = useState(venn[selectedRadio]);

  const handleChange = (event) => {
    setSelectedRadio(event.target.value);
  };

  const [modalOpened, setModalOpened] = useState(false);
  const conjuntoModal = useRef(0);

  function showModal(index) {
    conjuntoModal.current = index;
    setModalOpened(true);
  }

  function closeModal() {
    setModalOpened(false);
  }

  useEffect(() => {
    setVennId(venn[selectedRadio]);
  }, [selectedRadio]);

  const ModalButton = ({ title, onClick, color }) => (
    <ButtonWrapper>
      <div className="primaryButton pdv" aria-hidden="true" onClick={onClick}>
        <button style={{ width: "100%" }} type="button">
          <div
            className="row"
            style={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <i style={{ color: color }} className="fas fa-filter" />
            <span>{title}</span>
          </div>
        </button>
      </div>
    </ButtonWrapper>
  );

  return (
    <>
      {modalOpened && (
        <Modal
          title="Conjuntos"
          show={modalOpened}
          setShow={() => closeModal()}
          closeButton
        >
          <ConjuntosBasket
            app={app}
            config={config}
            index={conjuntoModal.current}
          />
        </Modal>
      )}
      <VennWrapper>
        <Card
          style={{
            margin: "10px",
            padding: "8px",
            borderRadius: "0px",
            flex: 1,
            minWidth: "250px",
            height: "90vh",
          }}
          app={app}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              border: "1px solid #ccc",
              padding: "16px",
              background: "#f2f4fd",
              marginBottom: "16px",
            }}
          >
            <ComboHeader
              reference={{ title: { hard: "Diagrama de Ven" } }}
              tooltip="Filtros"
            />

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <ModalButton
                title="Conjunto A"
                onClick={() => showModal(0)}
                color="#d5e1f8"
              />
              <ModalButton
                title="Conjunto B"
                onClick={() => showModal(1)}
                color="#d0fbcf"
              />
              <ModalButton
                title="Conjunto C"
                onClick={() => showModal(2)}
                color="#fcd3e1"
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              border: "1px solid #ccc",
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                height: "50px",
              }}
            >
              <ComboHeader
                reference={{
                  title: {
                    hard: "Comportamento dos PDVs compradores",
                  },
                }}
                legends={[
                  {
                    type: "bar",
                    name: "Conjunto A",
                    iconColor: "#d5e1f8",
                  },
                  {
                    type: "bar",
                    name: "Conjunto B",
                    iconColor: "#d0fbcf",
                  },
                  {
                    type: "bar",
                    name: "Conjunto C",
                    iconColor: "#fcd3e1",
                  },
                ]}
                tooltip="Filtros"
                classStyle="headerWrapper"
              />
            </div>
            <Venn
              app={app}
              reference={{ id: "VsvSsP" }}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
              }}
            />
            <NativeObject
              app={app}
              reference={{ id: "BSGqmG" }}
              style={{
                width: "100%",
                height: "40%",
              }}
            />
          </div>
        </Card>
        <Card
          style={{
            margin: "10px",
            flex: 1,
            padding: "8px",
            borderRadius: "0px",
            minWidth: "300px",
            height: "90vh",
          }}
          app={app}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #ccc",
              padding: "16px",
              height: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                height: "40px",
              }}
            >
              <ComboHeader
                reference={{
                  title: {
                    hard: "Resultados",
                  },
                }}
                tooltip="Filtros"
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "16px",
                height: "100%",
              }}
            >
              <ConjuntoWrapper
                style={{
                  border: "1.09091px solid #F8F8F8",
                  boxShadow:
                    "0px 2.18182px 7.63636px rgba(194, 194, 194, 0.25)",
                  borderRadius: "4.36364px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "70px",
                    background: "#d5e1f8",
                    borderRadius: "5px 5px 0px 0px",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <span
                    style={{
                      justifyContent: "center",
                      color: "$neutral - 600",
                      fontFamily: "$font-family-secondary",
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "100%",
                      display: "flex",
                      marginRight: " 5px",
                      wordBreak: "break-word",
                    }}
                  >
                    Pré-requisito A
                  </span>
                </div>
                <NativeObject
                  app={app}
                  reference={{ id: "mCFFa" }}
                  style={{
                    width: "100%",
                    height: "350px",
                  }}
                  className="analisePDVs"
                  type="table"
                />
                <div
                  style={{
                    width: "100%",
                    height: "70px",
                    background: " #d5e1f8",
                    borderRadius: "5px 5px 0px 0px",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <span
                    style={{
                      justifyContent: "center",
                      color: "$neutral - 600",
                      fontFamily: "$font-family-secondary",
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "100%",
                      display: "flex",
                      marginRight: " 5px",
                      wordBreak: "break-word",
                    }}
                  >
                    Qtd. Un. Incremental
                  </span>
                </div>
                <NativeObject
                  app={app}
                  reference={{ id: "hJPvH" }}
                  style={{
                    width: "100%",
                    height: "70px",
                  }}
                />
                <NativeObject
                  app={app}
                  reference={{ id: "NYyAkB" }}
                  style={{
                    width: "100%",
                    height: "100px",
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    height: "70px",
                    marginTop: "16px",
                    background: " #d5e1f8",
                    borderRadius: "5px 5px 0px 0px",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <span
                    style={{
                      justifyContent: "center",
                      color: "$neutral - 600",
                      fontFamily: "$font-family-secondary",
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "100%",
                      display: "flex",
                      marginRight: " 5px",
                      wordBreak: "break-word",
                    }}
                  >
                    Resultado Simuladores
                  </span>
                </div>
                <NativeObject
                  app={app}
                  reference={{ id: "DkaVR" }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  className="analisePDVs"
                  type="table"
                />
              </ConjuntoWrapper>
              <ConjuntoWrapper
                style={{
                  border: "1.09091px solid #F8F8F8",
                  boxShadow:
                    "0px 2.18182px 7.63636px rgba(194, 194, 194, 0.25)",
                  borderRadius: "4.36364px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "70px",
                    background: "#d0fbcf",
                    borderRadius: "5px 5px 0px 0px",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <span
                    style={{
                      justifyContent: "center",
                      color: "$neutral - 600",
                      fontFamily: "$font-family-secondary",
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "100%",
                      display: "flex",
                      marginRight: " 5px",
                      wordBreak: "break-word",
                    }}
                  >
                    Pré-requisito B
                  </span>
                </div>
                <NativeObject
                  app={app}
                  reference={{ id: "mCFFa" }}
                  style={{
                    width: "100%",
                    height: "350px",
                  }}
                  className="analisePDVs"
                  type="table"
                />
                <div
                  style={{
                    width: "100%",
                    height: "70px",
                    background: "#d0fbcf",
                    borderRadius: "5px 5px 0px 0px",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <span
                    style={{
                      justifyContent: "center",
                      color: "$neutral - 600",
                      fontFamily: "$font-family-secondary",
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "100%",
                      display: "flex",
                      marginRight: " 5px",
                      wordBreak: "break-word",
                    }}
                  >
                    Qtd. Un. Incremental
                  </span>
                </div>
                <NativeObject
                  app={app}
                  reference={{ id: "KYKeTy" }}
                  style={{
                    width: "100%",
                    height: "70px",
                  }}
                />
                <NativeObject
                  app={app}
                  reference={{ id: "jzMAW" }}
                  style={{
                    width: "100%",
                    height: "100px",
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    height: "70px",
                    background: "#d0fbcf",
                    marginTop: "16px",
                    borderRadius: "5px 5px 0px 0px",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <span
                    style={{
                      justifyContent: "center",
                      color: "$neutral - 600",
                      fontFamily: "$font-family-secondary",
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "100%",
                      display: "flex",
                      marginRight: " 5px",
                      wordBreak: "break-word",
                    }}
                  >
                    Resultado Simuladores
                  </span>
                </div>
                <NativeObject
                  app={app}
                  reference={{ id: "TDpffyJ" }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  className="analisePDVs"
                  type="table"
                />
              </ConjuntoWrapper>
              <ConjuntoWrapper
                style={{
                  border: "1.09091px solid #F8F8F8",
                  boxShadow:
                    "0px 2.18182px 7.63636px rgba(194, 194, 194, 0.25)",
                  borderRadius: "4.36364px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "70px",
                    background: "#fcd3e1",
                    borderRadius: "5px 5px 0px 0px",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <span
                    style={{
                      justifyContent: "center",
                      color: "$neutral - 600",
                      fontFamily: "$font-family-secondary",
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "100%",
                      display: "flex",
                      marginRight: " 5px",
                      wordBreak: "break-word",
                    }}
                  >
                    Pré-requisito C
                  </span>
                </div>
                <NativeObject
                  app={app}
                  reference={{ id: "mCFFa" }}
                  style={{
                    width: "100%",
                    height: "350px",
                  }}
                  className="analisePDVs"
                  type="table"
                />
                <div
                  style={{
                    width: "100%",
                    height: "70px",
                    background: "#fcd3e1",
                    borderRadius: "5px 5px 0px 0px",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <span
                    style={{
                      justifyContent: "center",
                      color: "$neutral - 600",
                      fontFamily: "$font-family-secondary",
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "100%",
                      display: "flex",
                      marginRight: " 5px",
                      wordBreak: "break-word",
                    }}
                  >
                    Qtd. Un. Incremental
                  </span>
                </div>
                <NativeObject
                  app={app}
                  reference={{ id: "VZjb" }}
                  style={{
                    width: "100%",
                    height: "70px",
                  }}
                />
                <NativeObject
                  app={app}
                  reference={{ id: "aKbmV" }}
                  style={{
                    width: "100%",
                    height: "100px",
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    height: "70px",
                    background: "#fcd3e1",
                    borderRadius: "5px 5px 0px 0px",
                    alignItems: "center",
                    marginTop: "16px",
                    display: "flex",
                  }}
                >
                  <span
                    style={{
                      justifyContent: "center",
                      color: "$neutral - 600",
                      fontFamily: "$font-family-secondary",
                      fontSize: "20px",
                      fontWeight: "700",
                      width: "100%",
                      display: "flex",
                      marginRight: " 5px",
                      wordBreak: "break-word",
                    }}
                  >
                    Resultado Simuladores
                  </span>
                </div>
                <NativeObject
                  app={app}
                  reference={{ id: "wgmQyWj" }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  className="analisePDVs"
                  type="table"
                />
              </ConjuntoWrapper>
            </div>
          </div>
        </Card>
      </VennWrapper>
    </>
  );
};

VennWithFilters.defaultProps = {
  app: null,
  config: {},
};

VennWithFilters.propTypes = {
  app: PropTypes.object,
  config: PropTypes.object,
};

export default VennWithFilters;
