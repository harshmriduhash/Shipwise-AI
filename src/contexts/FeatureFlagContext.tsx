import { createContext, useContext, ReactNode } from "react";

interface FeatureFlags {
  githubIntegration: boolean;
  aiAnalysis: boolean;
  slackNotifications: boolean;
  teamManagement: boolean;
  billing: boolean;
  advancedAnalytics: boolean;
  darkMode: boolean;
  exportReports: boolean;
}

const defaultFlags: FeatureFlags = {
  githubIntegration: true,
  aiAnalysis: true,
  slackNotifications: false,
  teamManagement: false,
  billing: false,
  advancedAnalytics: false,
  darkMode: true,
  exportReports: false,
};

const FeatureFlagContext = createContext<FeatureFlags>(defaultFlags);

export const useFeatureFlag = (flag: keyof FeatureFlags): boolean => {
  const flags = useContext(FeatureFlagContext);
  return flags[flag];
};

export const useFeatureFlags = () => useContext(FeatureFlagContext);

export const FeatureFlagProvider = ({ children, overrides }: { children: ReactNode; overrides?: Partial<FeatureFlags> }) => {
  const flags = { ...defaultFlags, ...overrides };
  return (
    <FeatureFlagContext.Provider value={flags}>
      {children}
    </FeatureFlagContext.Provider>
  );
};
