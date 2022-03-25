import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';

export const cartAtom = atom({});

export const cartCountAtom = selectAtom(cartAtom, (cart) => Object.keys(cart).length);
