export function enumValues(enm: any): string[] {
    let res = [];

    for (let key in enm) {

        let useValue = enm[key];

        if (!isNaN(key as any)) {
            useValue = +key;
        }

        if (res.indexOf(useValue) === -1 && res.indexOf(key) === -1) {
            res.push(useValue);
        }
    }

    return res;
}