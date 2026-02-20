import { useState, useEffect } from "react";
import API from "../services/api";

export default function useFetch(url) {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get(url).then(res => setData(res.data));
  }, [url]);

  return data;
}