import actions from "@/config/actions";
import constants from "@/config/constants";

const getGPTResponse = async (promptText, key) => {
  const endpoint = "https://api.openai.com/v1/chat/completions";
  const apiKey = constants.openai.key;

  // Map the key to a custom GPT prompt
  const promptMapping = actions.reduce((acc, action) => {
    acc[action.slug] = action.gptPrompt;
    return acc;
  }, {});

  const customPrompt = promptMapping[key] || actions[0].gptPrompt;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: customPrompt,
        },
        {
          role: "user",
          content: promptText,
        },
      ],
      max_tokens: 300,
      model: "gpt-3.5-turbo",
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

export default getGPTResponse;
