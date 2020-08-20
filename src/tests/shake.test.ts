import { SHAKE256 } from "../index";

const text = "password";
let sha3: SHAKE256;

beforeAll(() => {
    sha3 = new SHAKE256();
});

describe("SHAKE256", () => {
  test("encrypt()", () => {
    const encrypted = sha3.encrypt(text);
    expect(encrypted.length).toBe(44);
  });

  test("allow rainbow", () => {
    const e1 = sha3.encrypt(text);
    const e2 = sha3.encrypt(text);

    const isSame = e1 === e2;

    expect(isSame).toBe(true);
  });
});
