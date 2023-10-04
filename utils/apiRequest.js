import constants from "@/config/constants";

const apiRequest = async ({ baseUrl, method, queryParams, bodyData }) => {
  try {
    let url = new URL(baseUrl);

    if (queryParams) {
      const params = new URLSearchParams(queryParams);
      url.search = params.toString();
    }

    const options = {
      method,
      headers: {},
      next: {
        tags: [constants.collections.notes],
      },
    };

    if (bodyData) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(bodyData);
    }

    const response = await fetch(url, options);

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
};

export default apiRequest;
