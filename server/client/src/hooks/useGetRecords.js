import { useEffect, useState } from "react";
import axios from "axios";

export default function useGetRecords(route) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000${route}/`)
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          // Verify lastModified data is available, if not, add arbitrary older date to place   those items at bottom of list
          if (!response.data[i].lastModified) {
            //Verify lastModified exists to be able to show all recipes in order of most recently created/modified
            response.data[i].lastModified = new Date(
              response.data[i].dateCreated
            );
          }
          // Verify catagegories data is available. If not add value: other
          if (!response.data[i].categories) {
            response.data[i].categories = [{ value: "other" }];
          } else if (response.data[i].categories.length === 0) {
            response.data[i].categories.push({ value: "other" });
          }
        }

        // Check and remove any duplicates (based on sourcrUrl).
        let sourceUrlHash = {};
        response.data.forEach((item, index) => {
          if (item.sourceUrl !== "") {
            if (sourceUrlHash[item.sourceUrl]) {
              response.data.splice(index, 1);
            } else {
              sourceUrlHash[item.sourceUrl] = 1;
            }
          }
        });

        //Order recipes for display with most recent data created first
        const ordered = [];

        while (response.data.length > 0) {
          const minValue = response.data.reduce((prev, cur) => {
            //Convert data into integer for comparison of minValue
            let prevInt = new Date(prev.lastModified).getTime();
            let curInt = new Date(cur.lastModified).getTime();

            if (prevInt > curInt) {
              return prev;
            } else {
              return cur;
            }
          });

          ordered.push(minValue);

          const minValueIndex = response.data.indexOf(minValue);
          response.data.splice(minValueIndex, 1);
        }

        setRecords(ordered);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return records;
}
