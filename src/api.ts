import { MetricResponse } from "./types";

let requestCounter = 0;

export function fetchMetric(id: number): Promise<MetricResponse> {
  requestCounter += 1;
  const currentCount = requestCounter;
  console.log("Fetching metric", id, "request", currentCount);
  return new Promise(function (resolve) {
    const randomValue = Math.floor(Math.random() * 1000);
    const delay = 300 + Math.floor(Math.random() * 700);
    setTimeout(function () {
      resolve({ id: id, value: randomValue });
    }, delay);
  });
}
