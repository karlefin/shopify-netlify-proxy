// functions/products.js
import fetch from "node-fetch";

export async function handler(event, context) {
  //  Your distributor's Shopify store
  const shopDomain = "dold-industries.myshopify.com";

  //  Public storefront API token found in their HTML
  const storefrontToken = "6b1735c9e33e883434e758281ebcb888";

  //  GraphQL query to fetch products
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
    // Fetch products from Shopify Storefront API
    const response = await fetch(`https://${shopDomain}/api/2023-07/graphql.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Storefront-Access-Token": storefrontToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    //  Return JSON with proper CORS headers
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    };

  } catch (err) {
    //  Handle errors and return with CORS headers
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
