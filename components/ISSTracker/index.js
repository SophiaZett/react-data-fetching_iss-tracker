import { useEffect, useState } from "react";
import Controls from "../Controls/index";
import Map from "../Map/index";
import useSWR from "swr";

const URL = "https://api.wheretheiss.at/v1/satellites/25544";

// const fetcher = (...args) => fetch(...args).then((res) => res.json());

const fetcher = async (url) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default function ISSTracker() {
  const {
    data: position,
    error,
    isLoading,
    mutate: refresh,
  } = useSWR(URL, fetcher, { refreshInterval: 2000 });

  if (error) {
    // Überprüfen, ob das Fehlerobjekt zusätzliche Informationen enthält
    const errorMessage = error.info?.message || "failed to load";
    return <p>Error: {errorMessage}</p>;
  }
  if (isLoading) return <p>loading...</p>;

  return (
    <main>
      <Map longitude={position.longitude} latitude={position.latitude} />
      <Controls
        longitude={position.longitude}
        latitude={position.latitude}
        onRefresh={() => refresh()}
      />
    </main>
  );
}
