import { styled } from "@mui/material";
import PropTypes from "prop-types";
import InputLabel from "./InputLabel";
import PosterHeader from "./PosterHeader";

const PosterContainer = styled("div")({
  maxWidth: "280px",
  borderRadius: "12px",
  padding: "16px",
  overflowX: "hidden",
  "@media(max-width: 1366px)": {
    minHeight: "unset",
  },
});

function PosterPanel({ app, reference }) {
  const { title, subtitle, tooltip, labels } = reference;

  return (
    <PosterContainer className="posterPanel">
      <PosterHeader
        app={app}
        reference={{
          title: title.id,
          hardTitle: title.hard,
          subtitle,
          tooltip,
        }}
      />
      {labels.map((label) => (
        <InputLabel
          app={app}
          key={`label ${label.label}`}
          reference={{
            id: label.label,
            hardLabel: label.hardLabel,
            input: label.input,
          }}
        />
      ))}
    </PosterContainer>
  );
}

PosterPanel.defaultProps = {
  reference: {},
};

PosterPanel.propTypes = {
  app: PropTypes.object.isRequired,
  reference: PropTypes.object,
};

export default PosterPanel;
