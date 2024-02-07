const API_KEY = 'sk-uwQK5eRmFOnK8SDf9928B02aBa9242A883404a828bEa9a17';
const API_ENDPOINT = 'https://api.zhiyungpt.com/v1/models/gpt-4-32k';
 
async function generateText() {
  fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      prompt: 'What is the meaning of life?'
    })
  }).then(res => {
    const resJson = res.json();
    console.log(resJson.data.text);
  });;
}
 
generateText();
