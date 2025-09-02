import { IGeneralPhoto } from "./IPhotos";

export interface ISeries {
    id: string;
    name: string;
    photos: IGeneralPhoto[];
}