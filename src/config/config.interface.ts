/**
 * Configuration data for the app.
 */
export interface ConfigData {
  /** Database connection details. */
  mongo?: string;

  /** Delta radian = radius want to search * 1 meter(in radian) */
  deltaLatLngRadiusSearch: number;

  /** Database connection details. */
  smsAPIKey?: string;
}
