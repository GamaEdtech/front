import { parseURL, getQuery } from "ufo";

export default defineEventHandler(async (event) => {
  const { req, res } = event.node;
  const url = req.url;

  // List of content types for sitemap
  const contentTypes = [
    "paper",
    "qa",
    "multimedia",
    "exam",
    "tutorial",
    "blog",
  ];

  if (url === "/sitemap" || url === "/sitemap.xml") {
    res.setHeader("Content-Type", "application/xml");
    const staticLinks = [
      "https://gamatrain.com/",
      "https://gamatrain.com/about-us",
      "https://gamatrain.com/services",
      "https://gamatrain.com/faq",
      "https://gamatrain.com/search?type=test",
      "https://gamatrain.com/search?type=learnfiles",
      "https://gamatrain.com/search?type=question",
      "https://gamatrain.com/search?type=azmoon",
      "https://gamatrain.com/search?type=dars",
      "https://gamatrain.com/blog",
      "https://gamatrain.com/school",
    ];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    for (const link of staticLinks) {
      xml += `\n  <url>\n    <loc>${link}</loc>\n  </url>`;
    }
    xml += "\n</urlset>";
    res.end(xml);
    return;
  } else if (url.startsWith("/sitemap")) {
    // Handle individual sitemaps
    const { pathname, search } = parseURL(url);
    const query = getQuery(search);
    const contentType = pathname.split("/")[2];

    if (contentTypes.includes(contentType)) {
      res.setHeader("Content-Type", "application/xml");
      const page = parseInt(query.page, 10) || 1;
      let xmlData = await fetchPaginatedData(contentType, page);
      xmlData = convertDataToXML(xmlData, contentType);
      res.end(xmlData);
    } else {
      // Pass to the next handler
      return;
    }
  } else if (url.startsWith("/sitemap")) {
    // Check if the request is for a sitemap index
    const contentTypeMatch = contentTypes.find((type) =>
      url.startsWith(`/sitemap/${type}-index`)
    );
    if (contentTypeMatch) {
      res.setHeader("Content-Type", "application/xml");

      const xmlData = await generateSitemapIndex(contentTypeMatch);
      res.end(xmlData);
    }
  }
});

// Generate the sitemap index for the given content type
async function generateSitemapIndex(contentType) {
  const totalPages = await getTotalPages(contentType);
  let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (let page = 1; page <= totalPages; page++) {
    const sitemapUrl = `https://gamatrain.com/sitemap/${contentType}-${page}`;
    indexXml += `<sitemap>
        <loc>${sitemapUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
    </sitemap>`;
  }

  indexXml += "\n</sitemapindex>";
  return indexXml;
}
// Fetch the total number of pages for a content type
async function getTotalPages(contentType) {
  const itemsPerPage = 50;
  const baseUrl = "https://core.gamatrain.com/api/v1/";
  let apiUrl;

  switch (contentType) {
    case "paper":
      apiUrl = `${baseUrl}search?type=test&page=1&perpage=${itemsPerPage}`;
      break;
    case "qa":
      apiUrl = `${baseUrl}search?type=question&page=1&perpage=${itemsPerPage}`;
      break;
    case "multimedia":
      apiUrl = `${baseUrl}search?type=learnfiles&page=1&perpage=${itemsPerPage}`;
      break;
    case "exam":
      apiUrl = `${baseUrl}search?type=azmoon&page=1&perpage=${itemsPerPage}`;
      break;
    case "tutorial":
      apiUrl = `${baseUrl}search?type=dars&page=1&perpage=${itemsPerPage}`;
      break;
    case "blog":
      apiUrl = `${baseUrl}blogs/search?page=1&perpage=${itemsPerPage}`;
      break;
    default:
      return 0;
  }

  const response = await $fetch(apiUrl);
  const totalItems = parseInt(response.data.num, 10);
  return Math.ceil(totalItems / itemsPerPage);
}

// Fetch paginated data for a content type
async function fetchPaginatedData(contentType, page) {
  const itemsPerPage = 50;
  const baseUrl = "https://core.gamatrain.com/api/v1/";
  let apiUrl;

  switch (contentType) {
    case "paper":
      apiUrl = `${baseUrl}search?type=test`;
      break;
    case "qa":
      apiUrl = `${baseUrl}search?type=question`;
      break;
    case "multimedia":
      apiUrl = `${baseUrl}search?type=learnfiles`;
      break;
    case "exam":
      apiUrl = `${baseUrl}search?type=azmoon`;
      break;
    case "tutorial":
      apiUrl = `${baseUrl}search?type=dars`;
      break;
    case "blog":
      apiUrl = `${baseUrl}blogs/search`;
      break;
    default:
      return [];
  }

  const finalUrl = `${apiUrl}&page=${page}&perpage=${itemsPerPage}`;
  const response = await $fetch(finalUrl);
  return response.data.list || [];
}

// Convert data to XML format for sitemaps
function convertDataToXML(data, contentType) {
  let title = "";
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  data.forEach((item) => {
    title = item.title_url;
    if (contentType === "blog") {
      title = item.title
        .trim()
        .replace(/ (?!$)/g, "-")
        .replace(/\//g, "-")
        .toLowerCase();
    }

    xml += `<url>
            <loc>https://gamatrain.com/${contentType}/${item.id}/${title}</loc>
            <lastmod>${formatDate(item.up_date)}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>`;
  });

  xml += "\n</urlset>";
  return xml;
}

// Format date to ISO 8601
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
