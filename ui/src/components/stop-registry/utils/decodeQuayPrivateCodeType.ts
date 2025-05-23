type HSLCodeTypes = 'HSL/JORE-4' | 'HSL/JORE-3' | 'HSL/TEST';

const jore3CodeRegexp = /^[012345689]\d{6}$/;
const jore4CodeRegexp = /^7\d{6}$/;

export function decodeQuayPrivateCodeType(privateCode: null | undefined): null;
export function decodeQuayPrivateCodeType(privateCode: string): HSLCodeTypes;
export function decodeQuayPrivateCodeType(
  privateCode: string | null | undefined,
): HSLCodeTypes | null;
export function decodeQuayPrivateCodeType(
  privateCode: string | null | undefined,
): HSLCodeTypes | null {
  if (privateCode === null || privateCode === undefined) {
    return null;
  }

  if (privateCode.match(jore4CodeRegexp)) {
    return 'HSL/JORE-4';
  }

  if (privateCode.match(jore3CodeRegexp)) {
    return 'HSL/JORE-3';
  }

  return 'HSL/TEST';
}
