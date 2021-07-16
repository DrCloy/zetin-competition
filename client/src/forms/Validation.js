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

  static areValidationsValid(validations) {
    for (const val in validations) {
      if (validations[val].isInvalid) {
        return false;
      }
    }
    return true;
  }
}

export default Validation;
