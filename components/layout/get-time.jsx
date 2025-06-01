"use client";

import { format as timeFormat } from "date-fns";

const GetTime = ({ date, format = "hh:mm a" }) => {
  return <>{timeFormat(date, format)}</>;
};

export default GetTime;
