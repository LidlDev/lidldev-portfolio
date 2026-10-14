import { Helmet } from "react-helmet-async";
interface Props {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  keywords?: string;
  structuredData?: object;
}
export default function SEO({
  title = "LidlDev — Personal projects, built with intent",
  description = "The personal project portfolio of Harry. Mobile experiences, local-first tools and ideas brought to life.",
  url = "https://portfolio.lidldev.com",
  image = "/social-card.png",
  structuredData,
}: Props) {
  const fullImage = new URL(image, "https://portfolio.lidldev.com").href;
  return (
    <Helmet>
      <title>{title.includes("LidlDev") ? title : title + " | LidlDev"}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
