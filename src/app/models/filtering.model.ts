export interface FilterButton{
    type:Filter;
    label:string;
    isActive:false;
}

export enum Filter{
    All,
    Active,
    Completed
}