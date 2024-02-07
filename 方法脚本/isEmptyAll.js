const arr = [
  {
      "optionCover": "",
      "optionName": "0",
  },
  {
      "optionCover": "",
      "optionName": "1",
  },
  {
      "optionCover": "",
      "optionName": "2",
  },
  {
      "optionCover": "",
      "optionName": "3",
  }
]

const allEmpty = arr.every(item => item.optionCover === "");

console.info(allEmpty)