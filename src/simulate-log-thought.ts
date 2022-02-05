type Bit = boolean;

interface CircuitNode {
  name: string,

}

const group = (str: string) => {
  console.groupCollapsed(str)
}

const groupEnd = () => {
  console.groupEnd();
}

const log = <T extends boolean | boolean[]>(doLog: boolean, text: string, func: (doLog: boolean) => T) => {
  if (doLog) {
    const ret = func(false);
    if (typeof ret === 'boolean') {
      group(text + +ret)
    } else {
      group(text + ret.map(v => +v).join(', '));
    }
  };
  const ret = func(doLog);
  if (doLog) groupEnd();
  return ret;
}

const pa = (v: boolean[]) => v.map(v => +v).join(', ');

export const simulate = (addend1: number[], addend2: number[]) => {
  const input = addend1.concat(addend2).map(v => !!v);

  const NAND = (v1: Bit, v2: Bit, doLog = true): Bit => {
    const ret = !(v1 && v2);
    if (doLog) console.log(`NAND ${+v1}, ${+v2} = ${+ret}`);
    return ret;
  };

  const NOT = (v1: Bit, doLog = true) => log(doLog, `NOT ${+v1} = `, (log) => NAND(v1, v1, log));
  const AND = (v1: Bit, v2: Bit, doLog = true) => log(doLog, `AND ${+v1}, ${+v2} = `, (log) => NOT(NAND(v1, v2, log)));

  const OR = (v1: Bit, v2: Bit, doLog = true) => log(doLog, `OR ${+v1}, ${+v2} = `, (log) => NAND(NOT(v1, log), NOT(v2, log), log));

  const XOR = (v1: Bit, v2: Bit, doLog = true) => log(doLog, `XOR ${+v1}, ${+v2} = `, (log) => AND(OR(v1, v2, log), NAND(v1, v2, log), log));

  const halfAdder = (v1: Bit, v2: Bit, doLog = true) => log(doLog, `Half Adder ${+v1}, ${+v2} = `, (log) => [XOR(v1, v2, log), AND(v1, v2, log)]);

  const fullAdder = (v1: Bit, v2: Bit, v3: Bit, doLog = true) => log(
    doLog,
    `Full Adder ${+v1}, ${+v2}, ${+v3} = `,
    (log) => [XOR(XOR(v1, v2, log), v3, log), OR(OR(AND(v1, v2, log), AND(v2, v3, log), log), AND(v1, v3, log), log)]
  );


  const twoBitAdder = (v1: [Bit, Bit], v2: [Bit, Bit], doLog = true) => log(
    doLog,
    `Two Bit Adder ${pa(v1)}, ${pa(v2)} = `,
    (log) => [XOR(v1[0], v2[0], log), ...fullAdder(AND(v1[0], v2[0], log), v1[1], v2[1], log)]
  );
  const fourBitAdder = (v1: [Bit, Bit, Bit, Bit], v2: [Bit, Bit, Bit, Bit]) => {
    const [b1_1, b2_1, b4_1] = twoBitAdder([v1[0], v1[1]], [v2[0], v2[1]])
    const [b4_2, b8_1, b16_1] = twoBitAdder([v1[2], v1[3]], [v2[2], v2[3]])
    const [b4_3, b8_2] = halfAdder(b4_1, b4_2)
    const [b8_3, b16_2] = halfAdder(b8_1, b8_2)
    const [b16_3, b32_1] = halfAdder(b16_1, b16_2)
    return [b1_1, b2_1, b4_3, b8_3, b16_3]
  }

  const eightBitAdder = (v1: [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit], v2: [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit]) => {
    const [b1_1, b2_1, b4_1, b8_1, b16_1] = fourBitAdder([v1[0], v1[1], v1[2], v1[3]], [v2[0], v2[1], v2[2], v2[3]])
    const [b16_2, b32_1, b64_1, b128_1, b256_1] = fourBitAdder([v1[4], v1[5], v1[6], v1[7]], [v2[4], v2[5], v2[6], v2[7]])

    const [b16_3, b32_2] = halfAdder(b16_1, b16_2)
    const [b32_3, b64_2] = halfAdder(b32_1, b32_2)
    const [b64_3, b128_2] = halfAdder(b64_1, b64_2)
    const [b128_3, b256_2] = halfAdder(b128_1, b128_2)
    const [b256_3, b512_1] = halfAdder(b256_1, b256_2)

    return [b1_1, b2_1, b4_1, b8_1, b16_3, b32_3, b64_3, b128_3, b256_3];
  }

  const i = input

  return eightBitAdder([i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7]], [i[8], i[9], i[10], i[11], i[12], i[13], i[14], i[15]])
}
