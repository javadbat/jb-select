import { JBDictionary } from "jb-core/i18n";

export type JBListboxDictionary = {
  requiredMessage: (label: string | null) => string;
};

export const dictionary = new JBDictionary<JBListboxDictionary>({
  en: {
    requiredMessage: label => `${label || "Selection"} is required`,
  },
  fa: {
    requiredMessage: label => (label ? `انتخاب ${label} الزامی است` : "انتخاب یک گزینه الزامی است"),
  },
});
