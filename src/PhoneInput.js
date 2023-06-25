const nonDigitIdx = { 
  0: "(",
  4: ")",
  5: " ",
  9: "-",
};

const rawToFormatMap = {
  0: 1,
  1: 2,
  2: 3,
  3: 6,
  4: 7,
  5: 8,
  6: 10,
  7: 11,
  8: 12,
  9: 13,
};

class PhoneInput {
  constructor(inputElement) {
    this.inputElement = inputElement;
    this.digits = new Set("0123456789".split(""));
    this.rawToFormatMap = rawToFormatMap;
    this.inputArray = new Array(14)
      .fill()
      .map((_, i) => (nonDigitIdx[i] ? nonDigitIdx[i] : null));

    this.inputElement.addEventListener("beforeinput", (event) => {
      
      const { inputType } = event;
      const caretPosition = this.inputElement.selectionStart;
      const inputLength = this.inputElement.value.length;
      let delta = 0;

      if (inputType === "deleteContentBackward") {
        if (caretPosition === 11) delta = -2;
        else if (caretPosition === 7 && !event.target.value[8]) delta = -3;
        else if (caretPosition === 4 && inputLength === 7) delta = -2
        else delta = -1;
      } else if (inputType === "deleteContentForward") {
        if (caretPosition === 11 && inputLength === 12) delta = -1;
        else if (caretPosition <= 3 && caretPosition >= 1 && inputLength === 7)
          delta = -1;
      } else {
        if (inputLength >= 3 && caretPosition === 0) delta = 2;
        else if (inputLength === 3 && caretPosition === 3) delta = 4;
        else if (inputLength > 3 && caretPosition === 3) delta = 3;
        else if (caretPosition === 9) delta = 2;
        else delta = 1;
      }

      const nextPosition = caretPosition + delta;

      setTimeout(() => {
        this.inputElement.setSelectionRange(nextPosition, nextPosition);
      }, 0);
    });

    this.inputElement.addEventListener("input", (event) => {
      const newInputArray = this.inputArray.slice();
      const currentInput = event.target.value.split("").filter((char) => {
        return this.digits.has(char);
      });
      const length = currentInput.length;

      currentInput.forEach((digit, idx) => {
        const formatIdx = this.rawToFormatMap[idx];
        newInputArray[formatIdx] = digit;
      });

      let startIdx = length > 3 ? 0 : 1;
      let endIdx = length < 10 ? this.rawToFormatMap[length - 1] + 1 : 14;

      this.inputElement.value = newInputArray.slice(startIdx, endIdx).join("");
    });
  }

  get element() {
    return this.inputElement;
  }
}

module.exports = { PhoneInput };
