const path = require("path");

module.exports = {
  materiels: [
    {
      alias: "IndexPage",
      hydration: true,
      dehydrated: true,
      source: path.resolve(process.cwd(), "./main/views/pages/IndexPage/index.tsx")
    },
    {
      alias: "DetailPage",
      hydration: true,
      dehydrated: true,
      source: path.resolve(process.cwd(), "./main/views/pages/DetailPage/index.tsx")
    },
    {
      alias: "SearchPage",
      hydration: true,
      dehydrated: true,
      source: path.resolve(process.cwd(), "./main/views/pages/SearchPage/index.tsx")
    },
    {
      alias: "UserPage",
      hydration: true,
      dehydrated: true,
      source: path.resolve(process.cwd(), "./main/views/pages/UserPage/index.tsx")
    }
  ]
};