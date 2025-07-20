import Head from 'next/head';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const defaultTitle = 'Power House Brasil';
const defaultDescription = 'Sua loja de ciclismo urbano, conteúdo e produtos exclusivos.';
const defaultImage = '/logo.png';
const defaultUrl = 'https://powerhousebrasil.com.br';

const Seo = ({
  title = defaultTitle,
  description = defaultDescription,
  image = defaultImage,
  url = defaultUrl,
}: SeoProps) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta
      property="og:image"
      content={image.startsWith('http') ? image : `${defaultUrl}${image}`}
    />
    <meta property="og:url" content={url} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta
      name="twitter:image"
      content={image.startsWith('http') ? image : `${defaultUrl}${image}`}
    />
    <link rel="canonical" href={url} />
  </Head>
);

export default Seo;
