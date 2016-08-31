declare namespace HandlebarsIntl {
  export function registerWith(Handlebars: any): void;
  export function __addLocalData(data: any): void;
}

declare module "handlebars-intl" {
  export = HandlebarsIntl;
}