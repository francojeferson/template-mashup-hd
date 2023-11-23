export interface Manufacturers {
  id?: number;
  name: string;
  codManufacturer?: number;
  codIntermediary?: number;
  yearTpr: number;
  monthTpr: number;
}

export interface ManufacturersFilter {
  yearTpr?: number;
  monthStart?: number;
  monthEnd?: number;
  yearStart?: number;
  yearEnd?: number;
  codManufacturer?: number;
  name?: string;
}

export interface ManufacturersVerify {
  yearTpr?: number;
  monthTpr?: number;
  codManufacturer?: number;
  name?: string;
}
