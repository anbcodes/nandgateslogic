type Bit = boolean;

interface CircuitNode {
  name: string,
}

let logging = true;

const log = <T extends Bit[] | Bit[][], V extends Bit | Bit[]>(name: string, func: (...args: T) => V) => (...args: T): V => {
  if (logging) {
    logging = false;
    const retV = func(...args);
    const ret = typeof retV === 'boolean' ? +retV : retV.map(v => +v).join(', ');
    if (typeof args[0] === 'boolean') {
      console.groupCollapsed(`${name}: ${args.map(v => +v).join(', ')} = ${ret}`)
    } else {
      console.groupCollapsed(`${name}: ${args.map(v => '[' + v.map(v => +v).join(', ') + ']').join(', ')} = ${ret}`)
    }
    logging = true;
  }

  const ret = func(...args);

  if (logging) {
    console.groupEnd();
  }

  return ret;
}

export const simulate = (addend1: number[], addend2: number[]) => {
  const input = addend1.concat(addend2).map(v => !!v);

  const NAND = log('NAND', (v1: Bit, v2: Bit): Bit => !(v1 && v2));

  const NOT = log('NOT', (v1: Bit) => NAND(v1, v1));

  const AND = log('AND', (v1: Bit, v2: Bit) => NOT(NAND(v1, v2)));

  const OR = log('OR', (v1: Bit, v2: Bit) => NAND(NOT(v1), NOT(v2)));
  const XOR = log('XOR', (v1: Bit, v2: Bit) => AND(OR(v1, v2), NAND(v1, v2)));

  const halfAdder_0 = log('Half Adder 0', (v1: Bit, v2: Bit) => XOR(v1, v2));
  const halfAdder_1 = log('Half Adder 1', (v1: Bit, v2: Bit) => AND(v1, v2));
  const halfAdder = log('Half Adder', (v1: Bit, v2: Bit) => [halfAdder_0(v1, v2), halfAdder_1(v1, v2)]);

  const fullAdder_0 = log('Full Adder 0', (v1: Bit, v2: Bit, v3: Bit) => XOR(XOR(v1, v2), v3))
  const fullAdder_1 = log('Full Adder 1', (v1: Bit, v2: Bit, v3: Bit) => OR(OR(AND(v1, v2), AND(v2, v3)), AND(v1, v3)))
  const fullAdder = log('Full Adder', (v1: Bit, v2: Bit, v3: Bit) => [fullAdder_0(v1, v2, v3), fullAdder_1(v1, v2, v3)]);

  const twoBitAdder = log('Two Bit Adder', (v1: [Bit, Bit], v2: [Bit, Bit]) => [XOR(v1[0], v2[0]), ...fullAdder(AND(v1[0], v2[0]), v1[1], v2[1])]);
  const fourBitAdder = log('Four Bit Adder', (v1: [Bit, Bit, Bit, Bit], v2: [Bit, Bit, Bit, Bit]) => {
    const [b1_1, b2_1, b4_1] = twoBitAdder([v1[0], v1[1]], [v2[0], v2[1]])
    const [b4_2, b8_1, b16_1] = twoBitAdder([v1[2], v1[3]], [v2[2], v2[3]])
    const [b4_3, b8_2] = halfAdder(b4_1, b4_2)
    const [b8_3, b16_2] = halfAdder(b8_1, b8_2)
    const [b16_3, b32_1] = halfAdder(b16_1, b16_2)
    return [b1_1, b2_1, b4_3, b8_3, b16_3]
  });

  const eightBitAdder = log('Eight Bit Adder', (v1: [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit], v2: [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit]) => {
    const [b1_1, b2_1, b4_1, b8_1, b16_1] = fourBitAdder([v1[0], v1[1], v1[2], v1[3]], [v2[0], v2[1], v2[2], v2[3]])
    const [b16_2, b32_1, b64_1, b128_1, b256_1] = fourBitAdder([v1[4], v1[5], v1[6], v1[7]], [v2[4], v2[5], v2[6], v2[7]])

    const [b16_3, b32_2] = halfAdder(b16_1, b16_2)
    const [b32_3, b64_2] = halfAdder(b32_1, b32_2)
    const [b64_3, b128_2] = halfAdder(b64_1, b64_2)
    const [b128_3, b256_2] = halfAdder(b128_1, b128_2)
    const [b256_3, b512_1] = halfAdder(b256_1, b256_2)

    return [b1_1, b2_1, b4_1, b8_1, b16_3, b32_3, b64_3, b128_3, b256_3];
  });

  const i = input

  return eightBitAdder([i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7]], [i[8], i[9], i[10], i[11], i[12], i[13], i[14], i[15]]);
}
