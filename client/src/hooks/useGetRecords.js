import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useGetRecords() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/record/')
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          // Verify lastModified data is available, if not, add arbitrary older date to place   those items at bottom of list
          if (!response.data[i].lastModified) {
            response.data[i].lastModified = new Date('August 19, 1975 23:15:30');
          }
          // Verify catagegories data is available. If not add value: other
          if (!response.data[i].categories) {
            response.data[i].categories = [{ value: 'other' }];
          } else if (response.data[i].categories.length === 0) {
            response.data[i].categories.push({ value: 'other' });
          }
        }

        //Order recipes for display with most recent data created first
        const ordered = [];

        while (response.data.length > 0) {
          const minValue = response.data.reduce((prev, cur) => {
            if (prev.lastModified > cur.lastModified) {
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
