import axios from 'axios';

interface FailedGptResponse {
  success: false;
  finish_reason: string;
}

interface SuccessfulGptResponse {
  success: true;
  message: string;
}

type GptResponse = FailedGptResponse | SuccessfulGptResponse;

async function runGPTQuery(query: string): Promise<GptResponse> {
  const { data } = await axios.post(
    'https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: query,
      }],
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer <API Key from platform.openai.com>`,
      },
    });

  const result = data.choices[0];

  if (result.finish_reason !== 'stop') {
    return {
      success: false,
      finish_reason: result.finish_reason,
    };
  }

  return {
    success: true,
    message: result.message.content,
  };
}

(async () => {
  const gptResult = await runGPTQuery('Groovy name for an origami shop');
  if (gptResult.success === true) {
    console.log(`GPT response: ${gptResult.message}`);
  } else {
    console.log(`Failed with finish_reason: ${gptResult.finish_reason}`);
  }
})();
