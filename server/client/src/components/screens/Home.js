import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import useGetRecords from "../../hooks/useGetRecords";

import RecipesSelected from "../RecipesSelected";
import RecipeGroup from "../recipeGroup";
import CategoryDropdown from "../categoryDropdown";

export default function Home({ loaderCallback }) {
  const records = useGetRecords("/record");
  const [showAll, setShowAll] = useState(true);
  const [categorizedRecords, setCategorizedRecords] = useState(null);

  useEffect(() => {
    loaderCallback(true);
    setTimeout(() => {
      loaderCallback(false);
    }, 1000);
  }, [categorizedRecords]);

  return (
    <div className="p-3 container disable-while-loading">
      <div>
        <CategoryDropdown
          setShowAll={setShowAll}
          setCategorizedRecords={setCategorizedRecords}
          records={records}
        ></CategoryDropdown>
      </div>

      {showAll ? (
        <div>
          <h1 className="mb-4">Recently Added</h1>
          <RecipesSelected showAll={showAll} recordArray={records} />
        </div>
      ) : categorizedRecords ? (
        <>
          {categorizedRecords.map((categoryRecords, index) => {
            return (
              <div key={uuidv4()}>
                <RecipeGroup
                  index={index}
                  showAll={showAll}
                  categoryRecords={categoryRecords}
                />
              </div>
            );
          })}
        </>
      ) : null}
    </div>
  );
}
