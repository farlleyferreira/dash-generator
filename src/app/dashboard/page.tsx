"use client";

import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

interface ChartConfig {
  data: any[];
  layout: any;
  cells: number; // Número de células que o gráfico ocupa
  order: number; // Ordem de exibição
}

interface DashboardConfig {
  layout: {
    type: string;
    cellsPerRow: number;
    cellsPerColumn: number;
  };
  charts: ChartConfig[];
  styles: {
    dashboardContainer: React.CSSProperties;
    chartWrapper: React.CSSProperties;
    rowContainer: React.CSSProperties;
    columnContainer: React.CSSProperties;
  };
}

const loadDashboard = async (): Promise<DashboardConfig> => {
  const res = await fetch('http://localhost:5001/data');
  if (!res.ok) {
    throw new Error('Failed to load dashboard configuration');
  }
  return res.json();
};

export default function DashboardPage() {
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadDashboard();
        setDashboardConfig(data);
      } catch (error) {
        console.error("Erro ao carregar o dashboard:", error);
      }
    };
    fetchData();
  }, []);

  if (!dashboardConfig) {
    return <p>Carregando dashboard...</p>;
  }

  const { layout, charts, styles } = dashboardConfig;

  // Ordenar os gráficos com base na propriedade 'order'
  const sortedCharts = charts.sort((a, b) => a.order - b.order);

  const renderChart = (chart: ChartConfig) => (
    <div key={chart.layout.title} style={{ gridColumn: `span ${chart.cells}`, gridRow: `span 1`, ...styles.chartWrapper }}>
      <Plot 
        data={chart.data} 
        layout={{ 
            ...chart.layout, 
            autosize: true,
            width: undefined,
            height: undefined,
        }}
        style={{ width: '100%' }}
      />
    </div>
  );

  // Renderização com base no layout especificado
  if (layout.type === "grid") {
    return (
      <div style={{ ...styles.dashboardContainer, gridTemplateColumns: `repeat(${layout.cellsPerRow}, 1fr)` }}>
        {sortedCharts.map(renderChart)}
      </div>
    );
  } else if (layout.type === "row") {
    return (
      <div style={styles.rowContainer}>
        {sortedCharts.map(renderChart)}
      </div>
    );
  } else if (layout.type === "column") {
    return (
      <div style={styles.columnContainer}>
        {sortedCharts.map(renderChart)}
      </div>
    );
  }
  return null;
}
