export type CountryCode = "CA" | "JP" | "KR";

export type UsStatus = "F1" | "OPT" | "H1B" | "H4" | "J1" | "PR";

export type ForStatus = UsStatus[] | "*";

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

export type Material = {
  id: string;
  name: string;
  note?: string;
  link?: string;
  forStatus: ForStatus;
};

export type StepLink = {
  label: string;
  url: string;
};

export type Step = {
  id: string;
  title: string;
  body?: string;
  links?: StepLink[];
  linkMaterials?: boolean;
};

export type Flow = {
  id: string;
  country: CountryCode;
  name: string;
  summary: string;
  supportedStatus: UsStatus[];
  officialFee: string;
  processingDays: string;
  lastUpdated: string;
  materials: Material[];
  steps: Step[];
};
