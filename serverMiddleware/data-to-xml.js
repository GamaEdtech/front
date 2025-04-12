import axios from "axios";
import { parse } from "url";

export default async (req, res, next) => {
  const { url } = req;

  // Check if the request is for a specific content type's sitemap index
  const contentTypes = [
    "paper",
    "qa",
    "multimedia",
    "exam",
    "tutorial",
    "blog",
    "school",
  ];

  const contentTypeMatch = contentTypes.find((type) =>
    url.startsWith(`/sitemap/${type}-index`)
  );
  const { pathname, query } = parse(url, true);

  if (contentTypeMatch) {
    // Generate sitemap index for the matched content type
    res.setHeader("Content-Type", "application/xml");

    const xmlData = await generateSitemapIndex(contentTypeMatch); // Pass content type to generate specific index
    res.end(xmlData);
  } else if (url.startsWith("/sitemap")) {
    const contentIdentity = pathname.split("/")[2]; // e.g., "paper" from "/sitemap/paper"

    if (!contentIdentity) {
      const xmlData = generateDefaultSitemap();
      res.end(xmlData);
    } else {
      const contentType = contentIdentity.split("-")[0];
      if (contentTypes.includes(contentType)) {
        const pageNum = contentIdentity.split("-")[1];
        res.setHeader("Content-Type", "application/xml");
        // const page = parseInt(query.page, 10) || 1; // Use query param for page number
        let xmlData = await fetchPaginatedData(contentType, pageNum); // Fetch and generate the correct sitemap
        xmlData = convertDataToXML(xmlData, contentType);
        res.end(xmlData);
      } else {
        next();
      }
    }
  } else {
    next();
  }
};

// Generate the sitemap index for the given content type
async function generateSitemapIndex(contentType) {
  let totalPages = await getTotalPages(contentType); // Fetch total pages for content type
  let indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Loop through each page for the content type
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

// Fetch the total number of pages for the given content type using `num` from API response
async function getTotalPages(contentType) {
  const itemsPerPage = 1000; // Adjust based on your pagination logic
  let baseUrl = "https://core.gamatrain.com/api/v1/";
  let apiUrl;

  // Define the API URL for each content type
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
    case "school":
      apiUrl = `https://api.gamaedtech.com/api/v1/schools?PagingDto.PageFilter.ReturnTotalRecordsCount=true&HasScore=true`;
      break;
    default:
      return 0; // Return 0 if the content type is unknown
  }

  const response = await axios.get(apiUrl);
  const totalItems =
    contentType == "school"
      ? parseInt(response.data.data.totalRecordsCount)
      : parseInt(response.data.data.num); // Get total count from the API response
  // Calculate total pages (rounding up)
  return Math.ceil(totalItems / itemsPerPage);
}

async function fetchPaginatedData(contentType, page) {
  const itemsPerPage = 1000; // Define items per page
  let apiUrl;

  // Determine the API URL based on the content type
  const oldBaseUrl = "https://core.gamatrain.com/api/v1/";
  const baseUrl = "https://api.gamaedtech.com/api/v1/";
  switch (contentType) {
    case "paper":
      apiUrl = `${oldBaseUrl}search?type=test`;
      break;
    case "qa":
      apiUrl = `${oldBaseUrl}search?type=question`;
      break;
    case "multimedia":
      apiUrl = `${oldBaseUrl}search?type=learnfiles`;
      break;
    case "exam":
      apiUrl = `${oldBaseUrl}search?type=azmoon`;
      break;
    case "tutorial":
      apiUrl = `${oldBaseUrl}search?type=dars`;
      break;
    case "blog":
      apiUrl = `${oldBaseUrl}blogs/search`;
      break;
    case "school":
      apiUrl = `${baseUrl}schools`;
      break;
    default:
      // Return an empty array for unknown content types
      return [];
  }

  // Fetch data for the specified page
  let finalUrl = `${apiUrl}&page=${page}&perpage=${itemsPerPage}&ineedmore=1`;

  if (contentType == "blog") {
    finalUrl = `${apiUrl}?page=${page}&perpage=${itemsPerPage}&ineedmore=1`;
  }

  let pageNum = page > 0 ? page - 1 : 0;
  if (contentType == "school")
    finalUrl = `${apiUrl}?PagingDto.PageFilter.Size=${itemsPerPage}&PagingDto.PageFilter.Skip=${
      pageNum * itemsPerPage
    }&PagingDto.PageFilter.ReturnTotalRecordsCount=true&HasScore=true`;

  const response = await axios.get(finalUrl);
  return response.data.data.list || [];
}

async function fetchPaginatedDataV2(contentType, page) {
  // const itemsPerPage = 1000; // Define items per page
  let apiUrl;

  apiUrl =
    "https://api.gamaedtech.com/api/v1/schools?PagingDto.PageFilter.Size=1000&PagingDto.PageFilter.ReturnTotalRecordsCount=true&HasScore=true";

  const response = await axios.get(apiUrl);

  return response.data.data.list || [];
}

function convertDataToXML(data, contentType) {
  let title = "";
  let modifyDate = "";
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  data.forEach((item) => {
    title = item.title_url;
    modifyDate = item.up_date;
    if (contentType === "blog") {
      title = item.title
        .trim()
        .replace(/ (?!$)/g, "-")
        .replace(/\//g, "-")
        .toLowerCase();
    } else if (contentType === "school") {
      title = item.slug;
      modifyDate = item.lastModifyDate;
    }
    xml += `<url>
            <loc>https://gamatrain.com/${contentType}/${item.id}/${title}</loc>
            <lastmod>${formatDate(modifyDate)}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>`;
  });
  xml += "\n</urlset>";
  return xml;
}

function generateDefaultSitemap() {
  const simpleUrls = [
    "https://gamatrain.com",
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
  simpleUrls.forEach((url) => {
    xml += `<url>
          <loc>${url}</loc>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
      </url>`;
  });

  xml += "\n</urlset>";
  return xml;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
