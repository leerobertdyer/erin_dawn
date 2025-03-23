export interface IBasePhoto {
    url: string;
}

export interface IGeneralPhoto extends IBasePhoto {
    title?: string;
    category?: string;
    order?: number;
    id?: string;
    tags?: string[];
    hidden?: boolean;
}