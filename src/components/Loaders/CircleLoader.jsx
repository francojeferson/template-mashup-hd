import { styled } from "@mui/material";

const Loader = styled("div")({
  "-webkit-animation": "spin 1s linear infinite",
  border: "3px solid #f3f3f3",
  borderRadius: "17px",
  borderTop: "3px solid #475257",
  width: "17px",
  height: "17px",
  animation: "spin 1s linear infinite",
  "@-webkit-keyframes spin": {
    "0%": { "-webkit-transform": "rotate(0deg)" },
    "100%": { "-webkit-transform": "rotate(360deg)" },
  },
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": { transform: "rotate(360deg)" },
  },
});

const CircleLoader = () => <Loader />;

export default CircleLoader;
