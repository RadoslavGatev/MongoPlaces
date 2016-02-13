"use strict";

export class EnumExtenstion {
    static getValues(e:any) {
        return Object.keys(e).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    }

    static getNamesAndValues(e:any) {
        return EnumExtenstion.getValues(e).map(v => {
            return {name: e[v] as string, value: v};
        });
    }
}
