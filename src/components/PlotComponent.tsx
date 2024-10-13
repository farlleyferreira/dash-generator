"use client"; // Garante que esse componente seja renderizado apenas no cliente

import dynamic from "next/dynamic";
import { Layout, PlotData } from "plotly.js";

// Lazy load do Plotly para evitar SSR
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface PlotComponentProps {
  data: PlotData[];
  layout: Partial<Layout>;
}

const PlotComponent: React.FC<PlotComponentProps> = ({ data, layout }) => {
  return (
    <Plot 
      data={data} 
      layout={layout} 
      style={{ width: "100%", height: "100%" }} 
    />
  );
};

export default PlotComponent;
