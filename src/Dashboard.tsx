import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Metric, TimeRange } from "./types";
import { fetchMetric } from "./api";

const widgetIds: number[] = Array.from({ length: 60 }, function (_, index) {
  return index + 1;
});

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleTimeRangeChange = useCallback(function (event: React.ChangeEvent<HTMLSelectElement>) {
    setTimeRange(event.target.value as TimeRange);
  }, []);

  const handleRefreshAll = useCallback(function () {
    setRefreshTrigger(function (prev) { return prev + 1; });
  }, []);

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
          onClick={handleRefreshAll}
          style={{ marginLeft: "12px", padding: "4px 10px", fontSize: "14px", cursor: "pointer" }}
        >
          Refresh all
        </button>
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
              id={id}
              timeRange={timeRange}
              refreshTrigger={refreshTrigger}
            />
          );
        })}
      </div>
    </div>
  );
};

interface WidgetCardProps {
  id: number;
  timeRange: TimeRange;
  refreshTrigger: number;
}

const WidgetCard: React.FC<WidgetCardProps> = React.memo(function WidgetCard(props) {
  const id = props.id;
  const timeRange = props.timeRange;
  const refreshTrigger = props.refreshTrigger;

  const [metric, setMetric] = useState<Metric | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [localRefreshCount, setLocalRefreshCount] = useState<number>(0);

  useEffect(
    function () {
      let cancelled = false;
      setIsLoading(true);
      fetchMetric(id)
        .then(function (response) {
          if (cancelled) return;
          setMetric({
            id: response.id,
            name: "Widget " + String(response.id) + " (" + timeRange + ")",
            value: response.value
          });
          setIsLoading(false);
        })
        .catch(function () {
          if (cancelled) return;
          setIsLoading(false);
        });
      return function () { cancelled = true; };
    },
    [id, timeRange, refreshTrigger, localRefreshCount]
  );

  const localValue = useMemo(
    function () {
      if (metric === undefined) return null;
      const values = Array.from({ length: 2000 }, function (_, index) {
        return index + metric.value;
      });
      return values.reduce(function (accumulator, value) {
        return accumulator + value;
      }, 0);
    },
    [metric?.value]
  );

  const handleRefresh = useCallback(function () {
    setLocalRefreshCount(function (prev) { return prev + 1; });
  }, []);

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
        {isLoading ? "Loading widget" : metric ? metric.name : "Widget " + String(id)}
      </div>
      <div style={{ marginBottom: "2px" }}>Time range: {timeRange}</div>
      <div style={{ marginBottom: "2px" }}>Raw value: {isLoading ? "..." : metric ? metric.value : "—"}</div>
      <div style={{ marginBottom: "4px" }}>
        Processed value: {localValue === null ? "..." : localValue}
      </div>
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        style={{
          marginTop: "4px",
          fontSize: "11px",
          padding: "4px 8px",
          cursor: isLoading ? "not-allowed" : "pointer"
        }}
      >
        {isLoading ? "Loading..." : "Reload widget"}
      </button>
    </div>
  );
});

export default Dashboard;
