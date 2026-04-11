const path = require("path");

module.exports = {
  projectDirectoryPath: process.cwd(),
  assetsDirectoryName: "dist",
  materiels: [
    {
      alias: "IndexPage",
      hydrate: true,
      dehydrate: true,
      source: path.resolve(process.cwd(), "./main/views/pages/IndexPage/index.tsx")
    },
    {
      alias: "DetailPage",
      hydrate: true,
      dehydrated: true,
      source: path.resolve(process.cwd(), "./main/views/pages/DetailPage/index.tsx")
    },
    {
      alias: "SearchPage",
      hydrate: true,
      dehydrated: true,
      source: path.resolve(process.cwd(), "./main/views/pages/SearchPage/index.tsx")
    },
    {
      alias: "UserPage",
      hydrate: true,
      dehydrate: true,
      source: path.resolve(process.cwd(), "./main/views/pages/UserPage/index.tsx")
    }
  ]
};