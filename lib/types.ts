export type CountryCode = "CA" | "JP" | "KR";

export type UsStatus =
  | "F1"
  | "F2"
  | "OPT"
  | "H1B"
  | "H4"
  | "J1"
  | "J2"
  | "M1"
  | "M2"
  | "L1"
  | "L2"
  | "B1B2";

export type GuideFrontmatter = {
  country: CountryCode;
  visaType: string;
  forStatus: UsStatus[];
  lastUpdated: string;
  officialFee: string;
  processingDays: number;
};

export type Country = {
  code: CountryCode;
  name: string;
  flag: string;
  embassyUrl: string;
};

export type Status = {
  code: UsStatus;
  name: string;
  note: string;
};
