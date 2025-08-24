// functions/products.js

export async function handler(event, context) {
  const shopDomain = "dold-industries.myshopify.com";
  const storefrontToken = "6b1735c9e33e883434e758281ebcb888";

  const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            handle
            title
            descriptionHtml
            images(first: 1) {
              edges { node { url } }
            }
            variants(first: 1) {
              edges { node { price { amount currencyCode } } }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${shopDomain}/api/2023-07/graphql.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": storefrontToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
