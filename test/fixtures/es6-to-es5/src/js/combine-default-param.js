export default function combineDefaultParam({
                                                bar = 'no',
                                                baz = 'works!'
                                            } = {}) {
    return (`${bar}, ${baz}`);
}
