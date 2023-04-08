type ProjectConfigType = {
    [key: string]: string | string[];
};
type ConfigType = {
    [key: string]: ProjectConfigType;
};
export declare const getAddLabels: (currentLabels: string[], project: string, column: string, config: ConfigType) => string[];
export declare const getRemoveLabels: (currentLabels: string[], project: string, column: string, config: ConfigType) => string[];
export {};
