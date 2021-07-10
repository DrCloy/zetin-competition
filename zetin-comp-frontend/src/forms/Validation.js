class Validation {
  constructor() {
    this.isInvalid = false;
    this.message = '';
  }

  setInvalid(msg) {
    this.isInvalid = true;
    if (msg === undefined) {
      msg = '해당 입력란을 다시 확인해주세요.';
    }
    this.message = msg;
  }
}

export default Validation;