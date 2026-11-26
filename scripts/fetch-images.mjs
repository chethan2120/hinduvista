import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sources = JSON.parse(await readFile(path.join(root, "scripts", "image-sources.json"), "utf8"));
const userAgent = "HinduVistaDemo/1.0 (local travel website; licensing review for demonstration assets)";
const rejectTitle = /map\b|stamp|logo|icon|diagram|painting|drawing|\.svg|flag\b|coin\b|portrait|selfie|wedding|hotel|restaurant|food|poster|illustration|sketch|engraving|aerial map/i;

function stripHtml(value = "") {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function commonsSearch(query, attempt = 0) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", query);
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", "15");
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|size|mime|extmetadata");
  url.searchParams.set("iiurlwidth", "2000");

  const response = await fetch(url, { headers: { "User-Agent": userAgent } });
  if (response.status === 429 && attempt < 4) {
    await sleep(15000 * (attempt + 1));
    return commonsSearch(query, attempt + 1);
  }
  if (!response.ok) {
    throw new Error(`Commons search failed (${response.status}) for ${query}`);
  }
  const data = await response.json();
  const pages = Object.values(data.query?.pages || {});
  return pages
    .map((page) => {
      const info = page.imageinfo?.[0];
      if (!info) return null;
      const meta = info.extmetadata || {};
      return {
        title: page.title,
        width: info.width || 0,
        height: info.height || 0,
        mime: info.mime || "",
        thumb: info.thumburl || info.url,
        original: info.url,
        license: stripHtml(meta.LicenseShortName?.value || ""),
        licenseUrl: stripHtml(meta.LicenseUrl?.value || ""),
        author: stripHtml(meta.Artist?.value || ""),
      };
    })
    .filter(Boolean);
}

async function commonsFile(title, attempt = 0) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("titles", title.startsWith("File:") ? title : `File:${title}`);
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|size|mime|extmetadata");
  url.searchParams.set("iiurlwidth", "2000");
  const response = await fetch(url, { headers: { "User-Agent": userAgent } });
  if (response.status === 429 && attempt < 4) {
    await sleep(15000 * (attempt + 1));
    return commonsFile(title, attempt + 1);
  }
  if (!response.ok) throw new Error(`Commons file lookup failed (${response.status})`);
  const data = await response.json();
  const page = Object.values(data.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!page || page.missing !== undefined || !info) return null;
  const meta = info.extmetadata || {};
  return {
    title: page.title,
    width: info.width || 0,
    height: info.height || 0,
    mime: info.mime || "",
    thumb: info.thumburl || info.url,
    original: info.url,
    license: stripHtml(meta.LicenseShortName?.value || ""),
    licenseUrl: stripHtml(meta.LicenseUrl?.value || ""),
    author: stripHtml(meta.Artist?.value || ""),
  };
}

function acceptable(image, source) {
  if (!/^image\/(jpeg|png|webp)$/.test(image.mime)) return false;
  if (image.width < 1100) return false;
  if (rejectTitle.test(image.title)) return false;
  const title = image.title.toLowerCase();
  if ((source.reject || []).some((term) => title.includes(term.toLowerCase()))) return false;
  if (!/creative commons|cc by|cc0|public domain|gfdl/i.test(image.license)) return false;
  return source.must.some((term) => title.includes(term.toLowerCase()));
}

function score(image, source) {
  let value = image.width;
  if (image.width >= image.height) value += 800;
  const title = image.title.toLowerCase();
  for (const term of source.prefer || []) {
    if (title.includes(term.toLowerCase())) value += 2500;
  }
  return value;
}

async function downloadWebp(url, destination, width) {
  const response = await fetch(url, { headers: { "User-Agent": userAgent }, redirect: "follow" });
  if (!response.ok) throw new Error(`Download failed ${response.status} ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const rendered = await sharp(buffer, { failOn: "none" })
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: width > 1200 ? 78 : 74 })
    .toFile(destination);
  return rendered;
}

const only = new Set(process.argv.slice(2));
const selected = only.size ? sources.filter((source) => only.has(source.key)) : sources;
const previous = await readFile(path.join(root, "data", "image-manifest.json"), "utf8").catch(() => "");
const manifest = previous ? JSON.parse(previous).assets : [];
const failures = [];

for (const source of selected) {
  process.stdout.write(`\nSearching ${source.key}… `);
  try {
    const results = source.exact ? [await commonsFile(source.exact)].filter(Boolean) : await commonsSearch(source.query);
    const choice = results
      .filter((image) => acceptable(image, source))
      .sort((a, b) => score(b, source) - score(a, source))[0];
    if (!choice) {
      failures.push(`${source.key}: no licensed photograph matched`);
      console.log("no match");
      await sleep(1200);
      continue;
    }
    const fullPath = path.join(root, "public", "images", source.file);
    const mediumRelative = source.file.replace(/\.webp$/, "-960.webp");
    const mediumPath = path.join(root, "public", "images", mediumRelative);
    await mkdir(path.dirname(fullPath), { recursive: true });
    const full = await downloadWebp(choice.thumb || choice.original, fullPath, 1920);
    await downloadWebp(choice.thumb || choice.original, mediumPath, 960);
    const fileTitle = choice.title.startsWith("File:") ? choice.title : `File:${choice.title}`;
    const entry = {
      key: source.key,
      file: source.file,
      medium: mediumRelative,
      filename: path.basename(source.file),
      alt: source.alt,
      category: source.category,
      destination: source.destination,
      usage: source.usage,
      source: "Wikimedia Commons",
      sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURI(fileTitle.replaceAll(" ", "_"))}`,
      commonsTitle: fileTitle,
      author: choice.author || "See the Commons file page",
      license: choice.license,
      licenseUrl: choice.licenseUrl,
      provenance: "verified_photograph",
      width: full.width,
      height: full.height,
    };
    const existing = manifest.findIndex((asset) => asset.key === source.key);
    if (existing >= 0) manifest[existing] = entry;
    else manifest.push(entry);
    console.log(fileTitle);
  } catch (error) {
    failures.push(`${source.key}: ${error.message}`);
    console.log(error.message);
  }
  await sleep(1300);
}

await mkdir(path.join(root, "data"), { recursive: true });
await mkdir(path.join(root, "docs"), { recursive: true });
await writeFile(path.join(root, "data", "image-manifest.json"), JSON.stringify({ assets: manifest }, null, 2));

const lines = [
  "# Hindu Vista image manifest",
  "",
  "Demonstration photographs are verified files from Wikimedia Commons, saved locally as WebP. They are not AI-generated interpretations of landmarks.",
  "",
  "Artificial image generation was not used for monuments. An invented rendering of the Taj Mahal, Hawa Mahal or a palace would misrepresent the building. Where a second photograph of the same place is reused, the manifest lists every usage.",
  "",
  "| File | Destination | Usage | Commons title | Creator | Licence | Provenance |",
  "| --- | --- | --- | --- | --- | --- | --- |",
  ...manifest.map((item) => {
    const author = item.author.replaceAll("|", "/").slice(0, 180);
    return `| \`public/images/${item.file}\` | ${item.destination} | ${item.usage} | ${item.commonsTitle.replaceAll("|", "/")} | ${author} | ${item.license} | Verified photograph |`;
  }),
  "",
  "Responsive copies at 960 pixels wide use the same filename with `-960` before the extension.",
  "",
  "Admin uploads made later are stored in `public/uploads` and recorded in the media library. They are not part of this curated manifest until a new export is made.",
  "",
];
if (failures.length) {
  lines.push("## Downloads that failed", "", ...failures.map((item) => `- ${item}`), "");
}
await writeFile(path.join(root, "docs", "image-manifest.md"), lines.join("\n"));

if (failures.length) {
  console.error(`\n${failures.length} image(s) failed.`);
  process.exit(1);
}
console.log(`\nSaved ${manifest.length} photographs.`);
