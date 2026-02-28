import React, { useEffect, useState } from "react";
import { Metric, TimeRange } from "./types";
import { fetchMetric } from "./api";

const widgetIds: number[] = Array.from({ length: 60 }, function (_, index) {
  return index + 1;
});

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<number, Metric | undefined>>({});
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshIndex, setRefreshIndex] = useState<number>(0);

  useEffect(function () {
    setIsLoading(true);
    const newMetrics: Record<number, Metric> = {};
    let completed = 0;
    widgetIds.forEach(function (id) {
      fetchMetric(id).then(function (response) {
        const metric: Metric = {
          id: response.id,
          name: "Widget " + String(response.id) + " (" + timeRange + ")",
          value: response.value
        };
        newMetrics[id] = metric;
        completed += 1;
        if (completed === widgetIds.length) {
          setMetrics(newMetrics);
          setIsLoading(false);
        } else {
          setMetrics(function (previous) {
            return {
              ...previous,
              [id]: metric
            };
          });
        }
      });
    });
  }, [timeRange, refreshIndex]);

  const handleTimeRangeChange = function (event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as TimeRange;
    setTimeRange(value);
  };

  const handleRefreshClick = function () {
    setRefreshIndex(refreshIndex + 1);
  };

  return (
    <div style={{ padding: "16px", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif" }}>
      <h1 style={{ marginBottom: "4px" }}>Utkrusht Assessment Dashboard</h1>
      <p style={{ marginTop: "0", marginBottom: "12px", fontSize: "14px" }}>
        This dashboard shows widget metrics for assessments. Changing the time range reloads all widgets at once.
      </p>
      <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
        <label style={{ fontSize: "14px" }}>
          Time range:
          <select
            value={timeRange}
            onChange={handleTimeRangeChange}
            style={{ marginLeft: "8px", padding: "4px 6px", fontSize: "14px" }}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </label>
        <button
          onClick={handleRefreshClick}
          style={{ marginLeft: "12px", padding: "4px 10px", fontSize: "14px", cursor: "pointer" }}
        >
          Refresh all
        </button>
        {isLoading && (
          <span style={{ marginLeft: "12px", fontSize: "13px" }}>Loading metrics...</span>
        )}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "12px"
        }}
      >
        {widgetIds.map(function (id) {
          return (
            <WidgetCard
              key={id}
              metric={metrics[id]}
              timeRange={timeRange}
              onRefresh={function () {
                fetchMetric(id).then(function (response) {
                  const metric: Metric = {
                    id: response.id,
                    name: "Widget " + String(response.id) + " (" + timeRange + ")",
                    value: response.value
                  };
                  setMetrics(function (previous) {
                    return {
                      ...previous,
                      [id]: metric
                    };
                  });
                });
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

interface WidgetCardProps {
  metric: Metric | undefined;
  timeRange: TimeRange;
  onRefresh: () => void;
}

const WidgetCard: React.FC<WidgetCardProps> = function (props) {
  const metric = props.metric;
  const timeRange = props.timeRange;
  const onRefresh = props.onRefresh;

  const [localValue, setLocalValue] = useState<number | null>(null);

  useEffect(
    function () {
      if (metric) {
        const baseValue = metric.value;
        const values = Array.from({ length: 2000 }, function (_, index) {
          return index + baseValue;
        });
        const sum = values.reduce(function (accumulator, value) {
          return accumulator + value;
        }, 0);
        setLocalValue(sum);
      } else {
        setLocalValue(null);
      }
    },
    [metric, timeRange]
  );

  const handleClick = function () {
    onRefresh();
  };

  return (
    <div
      style={{
        border: "1px solid #dddddd",
        borderRadius: "4px",
        padding: "8px",
        fontSize: "12px",
        backgroundColor: "#fafafa"
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: "4px" }}>
        {metric ? metric.name : "Loading widget"}
      </div>
      <div style={{ marginBottom: "2px" }}>Time range: {timeRange}</div>
      <div style={{ marginBottom: "2px" }}>Raw value: {metric ? metric.value : "..."}</div>
      <div style={{ marginBottom: "4px" }}>
        Processed value: {localValue === null ? "..." : localValue}
      </div>
      <button
        onClick={handleClick}
        style={{
          marginTop: "4px",
          fontSize: "11px",
          padding: "4px 8px",
          cursor: "pointer"
        }}
      >
        Reload widget
      </button>
    </div>
  );
};

export default Dashboard;
