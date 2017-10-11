import { add } from './math';
import * as library from "./library";

alert(add(1, 2));
alert(library.reexportedMultiply(1, 2));
