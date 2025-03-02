import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const PerformanceChart = ({ data, width = 500, height = 300, lineColor = "#8884d8" }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} width={width} height={height}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="value" stroke={lineColor} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;