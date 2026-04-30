export type CountryCode = "CA" | "JP" | "KR";

export type UsStatus = "F1" | "OPT" | "H1B" | "H4" | "J1" | "PR";

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
