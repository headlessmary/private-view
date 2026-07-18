import ReactGA from "react-ga4";

const MEASUREMENT_ID = "G-PGBD53H7Y5";

export const initGA = () => {
  ReactGA.initialize(MEASUREMENT_ID);
};

export default ReactGA;